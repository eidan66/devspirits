/**
 * Security utilities for DevSpirits
 * Per frontend-security-react rules: safe URL handling, redirect validation
 */

const ALLOWED_PROTOCOLS = new Set(['https:', 'http:']);
const ALLOWED_PROTOCOLS_WITH_MAILTO = new Set([...ALLOWED_PROTOCOLS, 'mailto:']);

/**
 * Validates that a URL uses an allowed protocol (https, http, optionally mailto).
 * Rejects javascript:, data:, vbscript:, etc.
 */
export function isAllowedUrl(href: string, options?: { allowMailto?: boolean }): boolean {
  if (href.startsWith('/') || href.startsWith('#')) return true;

  try {
    const url = new URL(href);
    const allowed = options?.allowMailto
      ? ALLOWED_PROTOCOLS_WITH_MAILTO
      : ALLOWED_PROTOCOLS;
    return allowed.has(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Validates that a redirect target is same-origin.
 * Use for ?next=, ?redirect=, etc.
 */
export function isSafeSameOriginRedirect(target: string): boolean {
  try {
    const url = new URL(target, 'https://devspirits.com');
    return url.origin === 'https://devspirits.com';
  } catch {
    return false;
  }
}

/**
 * Safe canary strings for testing XSS/redirect resistance.
 * Use in tests only; never log alongside real user data.
 */
export const CANARY_STRINGS = {
  xssProbe: '"><img src=x onerror=alert(1)>',
  svgProbe: '<svg onload=alert(1)></svg>',
  scriptProbe: '<script>alert(1)</script>',
  javascriptUrl: 'javascript:alert(1)',
  dataUrl: 'data:text/html,<h1>test</h1>',
  prototypeProbe: '{"__proto__":{"polluted":true}}',
  redirectProbe: '//evil.example/path',
} as const;
