# quality-fix-and-verify

Run a full quality verification and auto-fix pass for this repo.

**Context:** Next.js 16, React 19, TypeScript, Tailwind v4.

**Steps (in order):**

1. Next.js build: `yarn build` or `npm run build`
2. TypeScript: `npx tsc --noEmit`
3. ESLint: `yarn lint` or `npm run lint`
4. Prettier: `npx prettier --check .` (or `--write` to fix)

For each step:

- Identify all errors and warnings
- Fix them directly in the code
- Prefer minimal, safe, idiomatic fixes
- Preserve behavior unless explicitly unsafe

**Constraints:**

- Do NOT weaken TypeScript types to silence errors
- Do NOT disable ESLint rules unless strongly justified
- Do NOT use `any`, `@ts-ignore`, or `eslint-disable` unless unavoidable
- Ensure fixes comply with frontend security rules

**Output:** Summary table (Check | Status | Files Changed | Notes) and confirmation that build, typecheck, lint, and format all pass.
