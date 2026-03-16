/**
 * E2E Security Tests for DevSpirits
 * Verifies: security headers, no XSS, no data leaks, no external exposure of secrets
 */
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Security Headers', () => {
  test('should send X-Content-Type-Options: nosniff', async ({ request }) => {
    const res = await request.get(BASE_URL);
    expect(res.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('should send X-Frame-Options: DENY', async ({ request }) => {
    const res = await request.get(BASE_URL);
    expect(res.headers()['x-frame-options']).toBe('DENY');
  });

  test('should send Referrer-Policy', async ({ request }) => {
    const res = await request.get(BASE_URL);
    const referrer = res.headers()['referrer-policy'];
    expect(referrer).toBeTruthy();
    expect(
      referrer?.includes('strict-origin') || referrer?.includes('no-referrer'),
    ).toBeTruthy();
  });

  test('should send Strict-Transport-Security when HTTPS', async ({ request }) => {
    const res = await request.get(BASE_URL);
    const hsts = res.headers()['strict-transport-security'];
    if (hsts) {
      expect(hsts).toContain('max-age');
    }
  });

  test('should send Permissions-Policy', async ({ request }) => {
    const res = await request.get(BASE_URL);
    const perm = res.headers()['permissions-policy'];
    expect(perm).toBeTruthy();
  });
});

test.describe('No Data Leaks', () => {
  test('page HTML should not contain API keys or secrets', async ({ page }) => {
    await page.goto(BASE_URL);
    const html = await page.content();

    const forbidden = [
      'sk_live_',
      'sk_test_',
      'api_key=',
      'apikey=',
      'password=',
      'secret=',
      'token=',
      'Bearer ',
    ];

    for (const pattern of forbidden) {
      expect(html.toLowerCase()).not.toContain(pattern.toLowerCase());
    }
  });

  test('page should not expose __NEXT_DATA__ with sensitive fields', async ({ page }) => {
    await page.goto(BASE_URL);
    const nextData = await page.evaluate(() => {
      const el = document.getElementById('__NEXT_DATA__');
      return el ? el.textContent : null;
    });

    if (nextData) {
      const parsed = JSON.parse(nextData);
      const str = JSON.stringify(parsed);
      expect(str).not.toMatch(/password|secret|api[_-]?key|token/i);
    }
  });
});

test.describe('XSS Resistance', () => {
  test('XSS probe in URL should render as text, not execute', async ({ page }) => {
    const probe = '><img src=x onerror=alert(1)>';
    await page.goto(`${BASE_URL}/?q=${encodeURIComponent(probe)}`);

    const alerts: string[] = [];
    page.on('dialog', (dialog) => {
      alerts.push(dialog.message());
      dialog.dismiss();
    });

    await page.waitForLoadState('networkidle');
    expect(alerts).toHaveLength(0);
  });

  test('page should load without script errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });
});

test.describe('External Links', () => {
  test('external links should have rel=noopener noreferrer', async ({ page }) => {
    await page.goto(BASE_URL);

    const externalLinks = await page.$$eval(
      'a[href^="http"]:not([href*="localhost"])',
      (links) =>
        links.map((a) => ({
          href: (a as HTMLAnchorElement).href,
          rel: (a as HTMLAnchorElement).rel,
          target: (a as HTMLAnchorElement).target,
        })),
    );

    for (const link of externalLinks) {
      if (link.target === '_blank') {
        expect(link.rel).toMatch(/noopener/);
        expect(link.rel).toMatch(/noreferrer/);
      }
    }
  });
});
