import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../../screenshots');
const BASE = process.env.BASE_URL || 'http://localhost:5173';
const ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL || 'admin@maisongourmet.com';
const ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || 'Admin123!';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name, fullPage = true) {
  await wait(700);
  await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage });
  console.log('captured', name);
}

(async () => {
  const browser = await chromium.launch();
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();

  // Public pages
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await shot(page, '01-public-home');
  await page.goto(BASE + '/about', { waitUntil: 'networkidle' });
  await shot(page, '02-public-about');
  await page.goto(BASE + '/services', { waitUntil: 'networkidle' });
  await shot(page, '03-public-services');
  await page.goto(BASE + '/menu', { waitUntil: 'networkidle' });
  await shot(page, '04-public-menu');
  await page.goto(BASE + '/blog', { waitUntil: 'networkidle' });
  await shot(page, '05-public-blog');

  // Blog detail: click first article
  const firstLink = page.locator('a[href^="/blog/"]').first();
  if (await firstLink.count()) {
    await firstLink.click();
    await page.waitForLoadState('networkidle');
    await shot(page, '06-public-blog-detail');
  }
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle' });
  await shot(page, '07-public-contact');

  // Admin login
  await page.goto(BASE + '/admin/login', { waitUntil: 'networkidle' });
  await shot(page, '08-admin-login', false);
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/admin', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  await shot(page, '09-admin-dashboard');

  const adminPages = [
    ['homepage', '10-admin-homepage-editor'],
    ['services', '11-admin-services'],
    ['blog', '12-admin-blog'],
    ['blog/new', '13-admin-blog-editor'],
    ['menu', '14-admin-menu'],
    ['media', '15-admin-media'],
    ['settings', '16-admin-settings']
  ];
  for (const [route, name] of adminPages) {
    await page.goto(BASE + '/admin/' + route, { waitUntil: 'networkidle' });
    await shot(page, name);
  }

  await browser.close();
  console.log('DONE: screenshots saved to', OUT);
})().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
