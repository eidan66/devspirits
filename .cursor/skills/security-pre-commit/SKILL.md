---
name: security-pre-commit
description: Run security checks before committing code. Use when preparing to commit, pushing changes, or when the user asks to verify security. Triggers on "security check", "pre-commit", "before push", "verify security", or "run security tests".
---

# Security Pre-Commit Check

Use this skill before committing or pushing code to catch security issues early.

## Quick Commands

```bash
# Static pattern check (fast)
yarn security:static

# Unit tests (security utilities)
yarn test:unit

# Full E2E security tests (requires build)
yarn test:e2e
```

## Pre-Commit Checklist

1. **Static check**: `yarn security:static` — must pass
2. **Unit tests**: `yarn test:unit` — must pass
3. **Lint**: `yarn lint` — must pass
4. **Type check**: `yarn tsc --noEmit` — must pass

## What the Static Check Catches

- `eval`, `new Function`, `Function` — code execution
- `dangerouslySetInnerHTML` without sanitization
- `innerHTML` assignment
- `postMessage(..., "*")`
- `javascript:` URLs
- `target="_blank"` without `rel="noopener noreferrer"`
- Auth tokens in localStorage
- `setTimeout`/`setInterval` with string args

## When to Run Full E2E

Run `yarn test:e2e` before opening a PR or when changing:
- Security headers (next.config)
- Form handling, redirects, or URL params
- External links or iframes

## Security Agents (Reference)

For deeper review, use these Cursor agents when relevant:
- **dom-xss-browser-hardening**: innerHTML, dangerouslySetInnerHTML, URL handling, postMessage
- **session-auth-csrf-specialist**: auth, cookies, CSRF, redirects
- **supply-chain-build-specialist**: dependencies, build config, env vars
