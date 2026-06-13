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
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

const errors = [];
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') {
    errors.push(`console: ${message.text()}`);
  }
});

await page.goto(URL);
await page.waitForSelector('text=Drop an image to begin');
console.log('ok: develop module shell rendered');

await page.setInputFiles('input[type=file]', IMAGE);
await page.waitForSelector('canvas:not(.hidden)', { timeout: 10_000 });
console.log('ok: image loaded');

const before = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

// adjust exposure
const exposure = page.locator('label.slider', { hasText: 'Exposure' }).locator('input');
await exposure.fill('1');
await exposure.dispatchEvent('input');
await page.waitForTimeout(900);

const afterExposure = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

if (before === afterExposure) {
  fail('exposure adjustment did not change canvas');
} else {
  console.log('ok: exposure changes the image');
}

// adjust temperature
const temp = page.locator('label.slider', { hasText: 'Temp' }).locator('input');
await temp.fill('60');
await temp.dispatchEvent('input');
await page.waitForTimeout(900);

const afterTemp = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

if (afterTemp === afterExposure) {
  fail('temperature adjustment did not change canvas');
} else {
  console.log('ok: temperature changes the image');
}

// preset
await page.locator('button.preset', { hasText: 'Teal & Orange' }).click();
await page.waitForTimeout(900);

const afterPreset = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

if (afterPreset === afterTemp) {
  fail('preset did not change canvas');
} else {
  console.log('ok: preset applies');
}

// open tone curve panel
await page.locator('section.panel button', { hasText: 'Tone Curve' }).click();
await page.waitForSelector('svg', { timeout: 5_000 });
console.log('ok: tone curve panel opens');

// add a curve point via background click
const svg = page.locator('section.panel svg').first();
const box = await svg.boundingBox();
await page.mouse.click(box.x + box.width * .25, box.y + box.height * .75);
await page.waitForTimeout(900);

const afterCurve = await page.evaluate(() => {
  const canvas = document.querySelector('.canvas-stage canvas');
  return canvas.toDataURL();
});

if (afterCurve === afterPreset) {
  fail('tone curve edit did not change canvas');
} else {
  console.log('ok: tone curve edits propagate');
}

// history restore
const historyEntries = await page.locator('button.history').count();
if (historyEntries < 2) {
  fail(`expected history entries to grow, got ${historyEntries}`);
} else {
  console.log(`ok: history records ${historyEntries} entries`);
}

await page.screenshot({ path: 'scripts/smoke-develop.png', fullPage: false });
console.log('ok: screenshot saved');

if (errors.length) {
  console.error('page errors:', errors);
  process.exitCode = 1;
}

await browser.close();
