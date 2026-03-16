/**
 * Unit tests for security utilities
 */
import { describe, it, expect } from 'vitest';
import { isAllowedUrl, isSafeSameOriginRedirect, CANARY_STRINGS } from './index';

describe('isAllowedUrl', () => {
  it('allows same-origin paths', () => {
    expect(isAllowedUrl('/')).toBe(true);
    expect(isAllowedUrl('/about')).toBe(true);
    expect(isAllowedUrl('#section')).toBe(true);
  });

  it('allows https URLs', () => {
    expect(isAllowedUrl('https://example.com')).toBe(true);
    expect(isAllowedUrl('https://devspirits.com')).toBe(true);
  });

  it('allows http URLs', () => {
    expect(isAllowedUrl('http://localhost:3000')).toBe(true);
  });

  it('rejects javascript: URLs', () => {
    expect(isAllowedUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedUrl('javascript:void(0)')).toBe(false);
  });

  it('rejects data: URLs', () => {
    expect(isAllowedUrl('data:text/html,<h1>x</h1>')).toBe(false);
  });

  it('rejects vbscript:', () => {
    expect(isAllowedUrl('vbscript:msgbox(1)')).toBe(false);
  });

  it('allows mailto when allowMailto is true', () => {
    expect(isAllowedUrl('mailto:test@example.com', { allowMailto: true })).toBe(true);
  });

  it('rejects mailto when allowMailto is false', () => {
    expect(isAllowedUrl('mailto:test@example.com')).toBe(false);
  });

  it('rejects invalid URLs', () => {
    expect(isAllowedUrl('not-a-url')).toBe(false);
  });
});

describe('isSafeSameOriginRedirect', () => {
  it('allows same-origin paths', () => {
    expect(isSafeSameOriginRedirect('/')).toBe(true);
    expect(isSafeSameOriginRedirect('/contact')).toBe(true);
  });

  it('rejects external origins', () => {
    expect(isSafeSameOriginRedirect('https://evil.com')).toBe(false);
    expect(isSafeSameOriginRedirect('//evil.example/path')).toBe(false);
  });

  it('rejects redirect probe', () => {
    expect(isSafeSameOriginRedirect(CANARY_STRINGS.redirectProbe)).toBe(false);
  });
});

describe('CANARY_STRINGS', () => {
  it('defines all expected probes', () => {
    expect(CANARY_STRINGS.xssProbe).toContain('onerror');
    expect(CANARY_STRINGS.svgProbe).toContain('onload');
    expect(CANARY_STRINGS.scriptProbe).toContain('script');
    expect(CANARY_STRINGS.javascriptUrl).toMatch(/^javascript:/);
    expect(CANARY_STRINGS.prototypeProbe).toContain('__proto__');
  });
});
