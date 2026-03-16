# DevSpirits Security

Security CI/CD, tooling, and preventive measures for the DevSpirits landing page.

## CI/CD Pipeline

The **CI** workflow (`.github/workflows/ci.yml`) runs on every push and PR:

| Job | What it does |
|-----|--------------|
| **lint-and-typecheck** | Static security check, npm audit, ESLint, TypeScript |
| **snyk-sca** | Snyk dependency scan (requires `SNYK_TOKEN` secret) |
| **snyk-code** | Snyk SAST (requires `SNYK_TOKEN` secret) |
| **unit-tests** | Vitest — `lib/security` utilities |
| **build** | Next.js production build |
| **e2e-security** | Playwright — headers, XSS probes, data leaks, external links |

## Local Commands

```bash
yarn security:static   # Static pattern check
yarn test:unit        # Unit tests
yarn test:e2e         # Playwright security E2E
yarn test             # Unit + E2E
```

## Security Headers

Configured in `next.config.ts`:

- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

## Skills & Agents

- **security-pre-commit**: Run before committing — `yarn security:static` + `yarn test:unit`
- **security-ci-review**: When CI security jobs fail — interpret and fix
- **dom-xss-browser-hardening**: Proactive when touching innerHTML, URLs, postMessage
- **session-auth-csrf-specialist**: Auth, cookies, CSRF, redirects
- **supply-chain-build-specialist**: Dependencies, build, env vars

## Snyk Setup

1. Create a Snyk account at https://snyk.io
2. Get your API token from Account Settings
3. Add `SNYK_TOKEN` as a GitHub repository secret

Without the token, Snyk jobs run with `continue-on-error: true` and won't block the pipeline.
