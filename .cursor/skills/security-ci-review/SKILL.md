---
name: security-ci-review
description: Interpret CI security workflow failures and suggest fixes. Use when CI fails on security jobs, Snyk reports issues, static security check fails, or Playwright security tests fail.
---

# Security CI Review

When CI security jobs fail, use this skill to diagnose and fix.

## Workflow Jobs

| Job | Purpose | Common Failures |
|-----|---------|-----------------|
| `lint-and-typecheck` | Static security + lint + tsc | `yarn security:static` — fix or document exception |
| `snyk-sca` | Dependency vulnerabilities | `yarn npm audit` or upgrade deps |
| `snyk-code` | SAST (code vulnerabilities) | Fix reported issues or add .snykignore with justification |
| `unit-tests` | Vitest security unit tests | Fix failing assertions in lib/security |
| `e2e-security` | Playwright headers, XSS, leaks | Fix headers in next.config or fix component behavior |

## Static Check Failures

If `security:static` fails, the script shows file:line and pattern. Options:

1. **Fix**: Remove or replace the dangerous pattern
2. **Sanitize**: Use DOMPurify for HTML, validate URLs with `lib/security`
3. **Exception**: If justified, add path to `scripts/security-check.mjs` IGNORE (with comment)

## Snyk Failures

- **SCA**: Run `yarn npm audit` locally; upgrade or patch dependencies
- **Code**: Run `snyk code test` locally; fix or document in .snyk

## E2E Security Test Failures

- **Headers**: Ensure `next.config.ts` headers match expected values
- **Data leaks**: Remove any secrets/PII from HTML, __NEXT_DATA__, or data-* attributes
- **External links**: Add `rel="noopener noreferrer"` to `target="_blank"` links
