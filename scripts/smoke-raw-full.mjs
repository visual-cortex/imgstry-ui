/* eslint-disable no-console */
import { chromium } from 'playwright';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL = process.env.SMOKE_URL ?? 'http://localhost:5199';

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};

const WIDTH = 32;
const HEIGHT = 32;

// Build a synthetic uncompressed DNG: TIFF header + one IFD describing a
// 16-bit RGGB Bayer plane + the strip data. The numbers below are the
// minimal set our extractor inspects; everything else is left as default.
const buildDng = () => {
  const ifdEntries = 13;
  const headerSize = 8;
  const ifdSize = 2 + ifdEntries * 12 + 4;
  // AsShotNeutral (3 rationals = 24 bytes) is the only out-of-line value.
  const asShotNeutralOffset = headerSize + ifdSize;
  const stripOffset = asShotNeutralOffset + 24;
  const stripBytes = WIDTH * HEIGHT * 2;
  const totalSize = stripOffset + stripBytes;

  const out = new Uint8Array(totalSize);
  const dv = new DataView(out.buffer);

  // Header: II, 42, IFD offset = 8
  out[0] = 0x49; out[1] = 0x49;
  dv.setUint16(2, 42, true);
  dv.setUint32(4, 8, true);

  // IFD entry count
  dv.setUint16(8, ifdEntries, true);

  const writeEntry = (slot, tag, type, count, valueOrOffset) => {
    const off = 10 + slot * 12;
    dv.setUint16(off, tag, true);
    dv.setUint16(off + 2, type, true);
    dv.setUint32(off + 4, count, true);
    dv.setUint32(off + 8, valueOrOffset, true);
  };

  const writeEntryInline = (slot, tag, type, count, bytes) => {
    const off = 10 + slot * 12;
    dv.setUint16(off, tag, true);
    dv.setUint16(off + 2, type, true);
    dv.setUint32(off + 4, count, true);
    for (let i = 0; i < 4; i++) {
      out[off + 8 + i] = bytes[i] ?? 0;
    }
  };

  // Tags. LONG = 4 bytes, fits inline.
  writeEntry(0, 0x00FE, 4, 1, 0);                 // NewSubFileType = 0
  writeEntry(1, 0x0100, 4, 1, WIDTH);             // ImageWidth
  writeEntry(2, 0x0101, 4, 1, HEIGHT);            // ImageLength
  writeEntry(3, 0x0102, 3, 1, 16);                // BitsPerSample = 16 (SHORT, inline)
  writeEntry(4, 0x0103, 3, 1, 1);                 // Compression = 1 (uncompressed)
  writeEntry(5, 0x0106, 3, 1, 32803);             // Photometric = CFA
  writeEntry(6, 0x0111, 4, 1, stripOffset);       // StripOffsets
  writeEntry(7, 0x0116, 4, 1, HEIGHT);            // RowsPerStrip
  writeEntry(8, 0x0117, 4, 1, stripBytes);        // StripByteCounts
  // CFA pattern (RGGB) fits inline in both encodings: 4 bytes <= slot.
  writeEntryInline(9,  0x828E, 7, 4, [0, 1, 1, 2]); // CFAPattern (UNDEFINED)
  writeEntryInline(10, 0xC616, 1, 4, [0, 1, 1, 2]); // CFAPattern DNG variant (BYTE)
  writeEntry(11, 0xC61D, 4, 1, 65535);            // WhiteLevel
  writeEntry(12, 0xC628, 5, 3, asShotNeutralOffset); // AsShotNeutral (3 rationals)

  // Next IFD offset = 0
  dv.setUint32(10 + ifdEntries * 12, 0, true);

  // AsShotNeutral: 1/2, 1, 1/2 -> WB will lift R and B 2x relative to G
  dv.setUint32(asShotNeutralOffset, 1, true);      dv.setUint32(asShotNeutralOffset + 4, 2, true);
  dv.setUint32(asShotNeutralOffset + 8, 1, true);  dv.setUint32(asShotNeutralOffset + 12, 1, true);
  dv.setUint32(asShotNeutralOffset + 16, 1, true); dv.setUint32(asShotNeutralOffset + 20, 2, true);

  // 32x32 16-bit Bayer plane: diagonal gradient.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const value = Math.round((x + y) / (WIDTH + HEIGHT - 2) * 50000) + 5000;
      dv.setUint16(stripOffset + (y * WIDTH + x) * 2, value, true);
    }
  }

  return out;
};

const dng = buildDng();
const tmp = mkdtempSync(join(tmpdir(), 'imgstry-raw-full-'));
const dngPath = join(tmp, 'fixture.dng');
writeFileSync(dngPath, dng);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

const errors = [];
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') {
    errors.push(`console: ${message.text()}`);
  }
});

try {
  await page.goto(URL);
  await page.waitForSelector('text=Drop an image to begin');
  console.log('ok: develop module shell rendered');

  await page.setInputFiles('input[type=file]', dngPath);
  await page.waitForSelector('canvas:not(.hidden)', { timeout: 10_000 });
  console.log('ok: synthetic DNG opened');

  // Wait until the editor has finished its first render so the rebake
  // path has run and the canvas reflects the decoded dimensions.
  await page.waitForFunction(() => {
    const canvas = document.querySelector('.canvas-stage canvas');
    return canvas && canvas.width !== 300;
  }, { timeout: 5_000 });

  const dimensions = await page.evaluate(() => {
    const canvas = document.querySelector('.canvas-stage canvas');
    return { width: canvas.width, height: canvas.height };
  });

  if (dimensions.width !== WIDTH || dimensions.height !== HEIGHT) {
    fail(`canvas dimensions mismatch: ${JSON.stringify(dimensions)}`);
  } else {
    console.log(`ok: canvas decoded to ${dimensions.width}x${dimensions.height}`);
  }

  // Capture canvas at exposure 0 (default).
  const baseline = await page.evaluate(() => {
    const canvas = document.querySelector('.canvas-stage canvas');
    return canvas.toDataURL();
  });

  // Pull exposure -3 stops.
  const exposure = page.locator('aside.right label.slider', { hasText: 'Exposure' }).locator('input');
  await exposure.fill('-3');
  await exposure.dispatchEvent('input');
  await page.waitForTimeout(900);

  const afterPullDown = await page.evaluate(() => {
    const canvas = document.querySelector('.canvas-stage canvas');
    return canvas.toDataURL();
  });

  if (baseline === afterPullDown) {
    fail('exposure -3 did not change canvas');
  } else {
    console.log('ok: exposure -3 rebakes the 16-bit source');
  }

  // Push exposure +2 stops; this exercises headroom that an 8-bit
  // preview path would have clipped.
  await exposure.fill('2');
  await exposure.dispatchEvent('input');
  await page.waitForTimeout(900);

  const afterPushUp = await page.evaluate(() => {
    const canvas = document.querySelector('.canvas-stage canvas');
    return canvas.toDataURL();
  });

  if (afterPushUp === afterPullDown) {
    fail('exposure +2 did not change canvas (no rebake fired)');
  } else {
    console.log('ok: exposure +2 rebakes from sensor data');
  }

  await page.screenshot({ path: 'scripts/smoke-raw-full.png', fullPage: false });
  console.log('ok: screenshot saved');

  if (errors.length) {
    console.error('page errors:', errors);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
