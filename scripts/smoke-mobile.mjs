/* eslint-disable no-console */
import { chromium, devices } from 'playwright';
import { resolve } from 'node:path';

const URL = process.env.SMOKE_URL ?? 'http://localhost:5199';
const IMAGE = resolve(import.meta.dirname, '../../imgstry/test/resources/rnm.jpg');

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['iPhone 14 Pro'] });
const page = await context.newPage();

const errors = [];
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') {
    errors.push(`console: ${message.text()}`);
  }
});

await page.goto(URL);
await page.waitForSelector('text=Drop an image to begin');
console.log('ok: mobile shell rendered');

await page.setInputFiles('input[type=file]', IMAGE);
await page.waitForSelector('.canvas-stage canvas:not(.hidden)', { timeout: 10_000 });
console.log('ok: image loaded on mobile');

// adjust strip + tab bar both visible by default (no sheet)
const stripVisible = await page.locator('.mobile-strip section.strip').isVisible();
const tabBarVisible = await page.locator('nav.tabbar').isVisible();
if (!stripVisible || !tabBarVisible) {
  fail(`expected inline strip + tab bar; strip=${stripVisible} tabbar=${tabBarVisible}`);
} else {
  console.log('ok: inline adjust strip + tab bar visible');
}

const overlay = await page.locator('.sheet-overlay').count();
if (overlay !== 0) {
  fail(`expected no sheet overlay in adjust mode, saw ${overlay}`);
} else {
  console.log('ok: image not covered by sheet in adjust mode');
}

// chip + inline slider edits image
const baseline = await page.evaluate(() => document.querySelector('.canvas-stage canvas').toDataURL());
await page.locator('.chip', { hasText: 'Contrast' }).click();
const slider = page.locator('.mobile-strip input[type=range]');
await slider.fill('60');
await slider.dispatchEvent('input');
await page.waitForTimeout(900);

const afterContrast = await page.evaluate(() => document.querySelector('.canvas-stage canvas').toDataURL());
if (baseline === afterContrast) {
  fail('contrast chip did not change canvas');
} else {
  console.log('ok: contrast chip + inline slider edits the image');
}

// Tools tab opens sheet
await page.locator('nav.tabbar button', { hasText: 'Tools' }).click();
await page.waitForSelector('.sheet');
console.log('ok: tools sheet opens');
await page.locator('.tool-card', { hasText: 'Vibrant' }).click();
await page.waitForTimeout(800);
const afterPreset = await page.evaluate(() => document.querySelector('.canvas-stage canvas').toDataURL());
if (afterPreset === afterContrast) {
  fail('preset did not change canvas');
} else {
  console.log('ok: preset applies and sheet auto-closes');
}

// curve tab
await page.locator('nav.tabbar button', { hasText: 'Curve' }).click();
await page.waitForSelector('.sheet svg');
console.log('ok: tone curve sheet opens');
await page.locator('.sheet-close').click();
await page.waitForTimeout(400);

// history tab
await page.locator('nav.tabbar button', { hasText: 'History' }).click();
await page.waitForSelector('.sheet button.entry');
console.log('ok: history sheet opens');

await page.screenshot({ path: 'scripts/smoke-mobile.png' });
console.log('ok: screenshot saved');

if (errors.length) {
  console.error('errors:', errors);
  process.exitCode = 1;
}

await browser.close();
