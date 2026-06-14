/* eslint-disable no-console */
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL = process.env.SMOKE_URL ?? 'http://localhost:5199';
const IMAGE = resolve(import.meta.dirname, '../../imgstry/test/resources/rnm.jpg');

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};

// Build a minimal NEF-shaped container: 8-byte little-endian TIFF header,
// then the source JPEG bytes, then a trailing pad. The extractor scans for
// the JPEG SOI marker and lifts it out regardless of the surrounding IFD
// data, so a real IFD chain is not required for the smoke.
const jpeg = readFileSync(IMAGE);
const header = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00]);
const tail = Buffer.from([0x00, 0x00, 0x00, 0x00]);
const nef = Buffer.concat([header, jpeg, tail]);

const tmp = mkdtempSync(join(tmpdir(), 'imgstry-raw-'));
const nefPath = join(tmp, 'fixture.nef');
writeFileSync(nefPath, nef);

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

  await page.setInputFiles('input[type=file]', nefPath);
  await page.waitForSelector('canvas:not(.hidden)', { timeout: 10_000 });
  console.log('ok: RAW (.nef) container loaded via embedded JPEG');

  const filename = await page.locator('.filename').textContent();
  if (filename?.trim() !== 'fixture.nef') {
    fail(`expected filename "fixture.nef", got "${filename}"`);
  } else {
    console.log('ok: filename surfaced in top bar');
  }

  const dimensions = await page.evaluate(() => {
    const canvas = document.querySelector('.canvas-stage canvas');
    return { width: canvas.width, height: canvas.height };
  });

  if (dimensions.width === 0 || dimensions.height === 0) {
    fail(`canvas has zero dimensions: ${JSON.stringify(dimensions)}`);
  } else {
    console.log(`ok: canvas decoded to ${dimensions.width}x${dimensions.height}`);
  }

  await page.screenshot({ path: 'scripts/smoke-raw.png', fullPage: false });
  console.log('ok: screenshot saved');

  if (errors.length) {
    console.error('page errors:', errors);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
