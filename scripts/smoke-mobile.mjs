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

// tab bar visible
const tabBarVisible = await page.locator('nav.tabbar').isVisible();
if (!tabBarVisible) {
  fail('mobile tab bar not visible');
} else {
  console.log('ok: mobile tab bar visible');
}

// open adjust sheet
await page.locator('nav.tabbar button', { hasText: 'Adjust' }).click();
await page.waitForSelector('.sheet', { timeout: 5_000 });
console.log('ok: adjust sheet opens');

// adjust exposure inside sheet
const exposure = page.locator('.sheet label.slider', { hasText: 'Exposure' }).locator('input').first();
await exposure.fill('1');
await exposure.dispatchEvent('input');
await page.waitForTimeout(900);
console.log('ok: exposure adjusted inside sheet');

// close sheet
await page.locator('.sheet-close').click();
await page.waitForTimeout(400);

// presets sheet
await page.locator('nav.tabbar button', { hasText: 'Presets' }).click();
await page.locator('.sheet button.preset').first().waitFor({ timeout: 5_000 });
console.log('ok: presets sheet opens');

// apply preset
await page.locator('.sheet button.preset', { hasText: 'Vibrant' }).first().click();
await page.waitForTimeout(700);
console.log('ok: preset applied from mobile sheet');

// curve sheet
await page.locator('.sheet-close').click();
await page.waitForTimeout(300);
await page.locator('nav.tabbar button', { hasText: 'Curve' }).click();
await page.locator('.sheet svg').first().waitFor({ timeout: 5_000 });
console.log('ok: tone curve sheet opens');

await page.screenshot({ path: 'scripts/smoke-mobile.png' });
console.log('ok: screenshot saved');

if (errors.length) {
  console.error('errors:', errors);
  process.exitCode = 1;
}

await browser.close();
