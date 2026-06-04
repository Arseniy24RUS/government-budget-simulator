const fs = require('fs/promises');
const path = require('path');
const { expect, test } = require('@playwright/test');

const screenshotDir = path.join(process.cwd(), 'qa-screenshots', 'government-budget-simulator');

function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  return errors;
}

async function loadFresh(page) {
  await page.addInitScript(() => {
    window.localStorage.removeItem('lang');
    Math.random = () => 0;
  });
  await page.goto('/index.html');
  await page.waitForFunction(() => window.AppI18n && window.AppI18n.ready);
  await page.evaluate(() => window.AppI18n.ready);
}

async function startGame(page) {
  await page.getByLabel('Full name').fill('QA Student');
  await page.getByLabel('Group number').fill('QA-01');
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await expect(page.getByText('Budget and Economic Strategy')).toBeVisible();
  await expect(page.getByText('Event of the Year')).toBeVisible();
}

test.describe('ru-RU defaults', () => {
  test.use({ locale: 'ru-RU' });

  test('defaults to Russian and toggles to English', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await loadFresh(page);

    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.getByRole('heading', { name: 'Перед началом симуляции' })).toBeVisible();
    await expect(page.getByTestId('language-toggle')).toHaveText('EN');

    await page.getByTestId('language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Before the Simulation' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start simulation' })).toBeVisible();
    await expect(page.getByTestId('language-toggle')).toHaveText('RU');

    expect(consoleErrors).toEqual([]);
  });
});

test.describe('en-US defaults and screenshots', () => {
  test.use({ locale: 'en-US', viewport: { width: 1366, height: 900 } });

  test('defaults to English, toggles both ways, and captures clean desktop/mobile views', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await fs.mkdir(screenshotDir, { recursive: true });
    await loadFresh(page);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Before the Simulation' })).toBeVisible();
    await expect(page.getByTestId('language-toggle')).toHaveText('RU');

    await startGame(page);
    await expect(page.getByText('Meteorite Impact')).toBeVisible();
    await expect(page.getByText('Allocate 1 bln RUB for recovery')).toBeVisible();
    await expect(page.getByText('Fully compensate residents and municipalities for the damage.')).toBeVisible();
    await expect(page.getByText('The simulation runs from', { exact: false })).toBeVisible();
    await expect(page.getByText('Performance Index')).toBeVisible();
    await expect(page.getByText('Population Groups and Public Support')).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, 'desktop-en.png'), fullPage: true });

    await page.getByTestId('language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.getByText('Бюджет и экономическая стратегия')).toBeVisible();
    await expect(page.getByText('Падение метеорита')).toBeVisible();
    await expect(page.getByText('Полностью компенсировать ущерб жильцам и муниципалитетам.')).toBeVisible();
    await expect(page.getByText('Симуляция идёт с', { exact: false })).toBeVisible();
    await expect(page.getByTestId('language-toggle')).toHaveText('EN');
    await page.screenshot({ path: path.join(screenshotDir, 'desktop-ru.png'), fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByTestId('language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByText('Budget and Economic Strategy')).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, 'mobile-en.png'), fullPage: true });

    await page.getByTestId('language-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.getByText('Бюджет и экономическая стратегия')).toBeVisible();
    await page.screenshot({ path: path.join(screenshotDir, 'mobile-ru.png'), fullPage: true });

    expect(consoleErrors).toEqual([]);
  });
});
