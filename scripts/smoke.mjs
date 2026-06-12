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
await page.waitForSelector('text=Drop an image here');
console.log('ok: app shell rendered');

await page.setInputFiles('input[type=file]', IMAGE);
await page.waitForSelector('canvas:not(.hidden)', { timeout: 10_000 });
console.log('ok: image loaded into viewport');

const before = await page.evaluate(() => {
  const canvas = document.querySelector('section canvas');
  return canvas.toDataURL();
});

const exposure = page.locator('label.slider', { hasText: 'Exposure' }).locator('input');
await exposure.fill('60');
await exposure.dispatchEvent('input');

await page.waitForFunction(
  () => !document.querySelector('.rendering'),
  null,
  { timeout: 10_000 },
);
// give the worker roundtrip a beat past the debounce
await page.waitForTimeout(600);

const after = await page.evaluate(() => {
  const canvas = document.querySelector('section canvas');
  return canvas.toDataURL();
});

if (before === after) {
  fail('canvas unchanged after exposure adjustment');
} else {
  console.log('ok: exposure adjustment re-rendered the canvas');
}

const histogramDrawn = await page.evaluate(() => {
  const canvas = document.querySelector('.histogram canvas');
  const context = canvas.getContext('2d');
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  return data.some((value) => value !== 0);
});

if (!histogramDrawn) {
  fail('histogram canvas is empty');
} else {
  console.log('ok: histogram rendered');
}

await page.locator('button', { hasText: 'Compare' }).dispatchEvent('pointerdown');
await page.waitForTimeout(150);
const original = await page.evaluate(() => {
  const canvas = document.querySelector('section canvas');
  return canvas.toDataURL();
});

if (original !== before) {
  fail('compare did not restore the original image');
} else {
  console.log('ok: compare shows the original image');
}

await page.locator('button', { hasText: 'Original' }).dispatchEvent('pointerup');
await page.waitForTimeout(800);
const restored = await page.evaluate(() => {
  const canvas = document.querySelector('section canvas');
  return canvas.toDataURL();
});

if (restored === original) {
  fail('releasing compare did not re-apply adjustments');
} else {
  console.log('ok: releasing compare re-applied adjustments');
}

await page.screenshot({ path: 'scripts/smoke.png' });
console.log('ok: screenshot saved to scripts/smoke.png');

if (errors.length) {
  console.error('page errors:', errors);
  process.exitCode = 1;
}

await browser.close();
