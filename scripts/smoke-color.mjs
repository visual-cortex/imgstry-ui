/* eslint-disable no-console */
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const URL = process.env.SMOKE_URL ?? 'http://localhost:5199';
const IMAGE = resolve(import.meta.dirname, '../../imgstry/test/resources/rnm.jpg');

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') {
    errors.push(`console: ${message.text()}`);
  }
});

await page.goto(URL);
await page.waitForSelector('text=Drop an image to begin');

await page.setInputFiles('input[type=file]', IMAGE);
await page.waitForSelector('.canvas-stage canvas:not(.hidden)', { timeout: 10_000 });
console.log('ok: image loaded');

// open Color panel
await page.locator('.panel .header', { hasText: 'Color' }).first().click();
await page.locator('.panel .mode-tab').first().waitFor();

// switch through every mode
for (const mode of ['HEX', 'RGB', 'HSV', 'CMYK']) {
  await page.locator('.mode-tab', { hasText: mode }).first().click();
  const active = await page.locator('.mode-tab[data-state="active"]').first().textContent();
  if (active?.trim() !== mode) {
    fail(`mode switch did not activate ${mode} (got ${active})`);
  } else {
    console.log(`ok: switched to ${mode} mode`);
  }
}

// HSV slider drives a hue tint
await page.locator('.mode-tab', { hasText: 'HSV' }).first().click();
const hueSlider = page.locator('.panel .channel', { hasText: 'H' }).first().locator('input[type=range]');
await hueSlider.fill('200');
await hueSlider.dispatchEvent('input');
await page.waitForTimeout(900);

const tinted = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

// remove tint
await page.locator('.panel .clear').first().click();
await page.waitForTimeout(900);
const untinted = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

if (tinted === untinted) {
  fail('removing tint did not revert the canvas');
} else {
  console.log('ok: clear button removed the tint');
}

await page.locator('.mode-tab', { hasText: 'CMYK' }).first().click();
const cyan = page.locator('.panel .channel', { hasText: 'C' }).first().locator('input[type=range]');
await cyan.fill('60');
await cyan.dispatchEvent('input');
await page.waitForTimeout(900);
const retinted = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

if (retinted === untinted) {
  fail('CMYK tint did not re-tint the canvas');
} else {
  console.log('ok: CMYK tint re-applied');
}

await page.locator('.mode-tab', { hasText: 'HEX' }).first().click();
await page.locator('.panel .hex-input').first().fill('#FF00FF');
await page.locator('.panel .hex-input').first().dispatchEvent('change');
await page.waitForTimeout(900);
const magenta = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

if (magenta === retinted) {
  fail('hex entry did not retint');
} else {
  console.log('ok: hex text entry tints');
}

await page.screenshot({ path: 'scripts/smoke-color.png' });
console.log('ok: screenshot saved');

if (errors.length) {
  console.error('page errors:', errors);
  process.exitCode = 1;
}

await browser.close();
