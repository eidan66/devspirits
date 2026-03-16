#!/usr/bin/env node
/**
 * Static security pattern check for DevSpirits
 * Scans source code for dangerous patterns per frontend-security-react rules.
 * Exits with 1 if any CRITICAL pattern is found.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

const CRITICAL_PATTERNS = [
  {
    id: 'EVAL',
    pattern: /\beval\s*\(/,
    exclude: /\$\$?eval|\.eval\s*\(/, // exclude Playwright/Puppeteer safe APIs
    message: 'eval() is forbidden — code execution vector',
  },
  {
    id: 'NEW_FUNCTION',
    pattern: /\bnew\s+Function\s*\(/,
    message: 'new Function() is forbidden — code execution vector',
  },
  {
    id: 'DANGEROUSLY_SET_INNER_HTML',
    pattern: /dangerouslySetInnerHTML/,
    message:
      'dangerouslySetInnerHTML requires sanitization — verify DOMPurify or allowlist',
  },
  {
    id: 'INNER_HTML',
    pattern: /\.innerHTML\s*=/,
    message: 'innerHTML assignment is a DOM XSS sink — prefer textContent',
  },
  {
    id: 'DOCUMENT_WRITE',
    pattern: /document\.write\s*\(/,
    message: 'document.write is forbidden — DOM XSS sink',
  },
  {
    id: 'POSTMESSAGE_WILDCARD',
    pattern: /postMessage\s*\([^)]*,\s*["']\*["']\s*\)/,
    message: "postMessage(..., '*') is forbidden — always specify target origin",
  },
  {
    id: 'JAVASCRIPT_URL',
    pattern: /href\s*=\s*["']?\s*javascript\s*:/i,
    message: 'javascript: URLs are forbidden — protocol injection',
  },
  {
    id: 'TARGET_BLANK_NO_REL',
    pattern: /target\s*=\s*["']_blank["']/,
    exclude: /noopener|noreferrer/,
    fileLevel: true, // only flag if file has target=_blank but no noopener anywhere
    message: "target='_blank' requires rel='noopener noreferrer' — tabnabbing risk",
  },
  {
    id: 'LOCALSTORAGE_TOKEN',
    pattern:
      /localStorage\.(setItem|getItem)\s*\(\s*["']?(token|auth|secret|password|key)["']?/i,
    message: 'Auth tokens in localStorage — prefer HttpOnly cookies',
  },
  {
    id: 'SETTIMEOUT_STRING',
    pattern: /setTimeout\s*\(\s*["']/,
    message: 'setTimeout with string arg is eval — use function',
  },
  {
    id: 'SETINTERVAL_STRING',
    pattern: /setInterval\s*\(\s*["']/,
    message: 'setInterval with string arg is eval — use function',
  },
];

const IGNORE_DIRS = new Set([
  'node_modules',
  '.next',
  'out',
  'build',
  '.git',
  '.yarn',
  'dist',
  'coverage',
  'playwright-report',
  'test-results',
  '.cursor',
  'e2e',
]);

const IGNORE_FILES = new Set(['security-check.mjs', 'yarn-*.cjs', '*.min.js']);

function shouldIgnore(dirOrFile) {
  if (IGNORE_DIRS.has(dirOrFile)) return true;
  if (dirOrFile.startsWith('.') && dirOrFile !== '.cursor') return true;
  return false;
}

function* walk(dir, base = '') {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = join(base, e.name);
    if (e.isDirectory()) {
      if (shouldIgnore(e.name)) continue;
      yield* walk(join(dir, e.name), rel);
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(e.name) && !IGNORE_FILES.has(e.name)) {
      yield join(dir, e.name);
    }
  }
}

function checkFile(filePath) {
  const rel = relative(ROOT, filePath);
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];

  const fileContent = content;

  for (const rule of CRITICAL_PATTERNS) {
    const { id, pattern, message, exclude, fileLevel } = rule;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!pattern.test(line)) continue;
      if (exclude && exclude.test(line)) continue;
      if (fileLevel && exclude && exclude.test(fileContent)) continue;
      findings.push({
        id,
        file: rel,
        line: i + 1,
        message,
        snippet: line.trim().slice(0, 80),
      });
    }
  }

  return findings;
}

function main() {
  const appDir = join(ROOT, 'app');
  const componentsDir = join(ROOT, 'components');
  const libDir = join(ROOT, 'lib');
  const scriptsDir = join(ROOT, 'scripts');

  const dirsToScan = [ROOT].filter((d) => {
    try {
      return statSync(d).isDirectory();
    } catch {
      return false;
    }
  });

  let allFindings = [];
  for (const dir of dirsToScan) {
    for (const file of walk(dir)) {
      if (
        file.includes('node_modules') ||
        file.includes('.next') ||
        file.includes('.yarn')
      )
        continue;
      allFindings = allFindings.concat(checkFile(file));
    }
  }

  if (allFindings.length === 0) {
    console.log('✅ Static security check passed — no critical patterns found.');
    process.exit(0);
    return;
  }

  console.error('\n❌ Static security check FAILED\n');
  for (const f of allFindings) {
    console.error(`  [${f.id}] ${f.file}:${f.line}`);
    console.error(`    ${f.message}`);
    console.error(`    → ${f.snippet}${f.snippet.length >= 80 ? '…' : ''}\n`);
  }
  console.error(`Total: ${allFindings.length} finding(s)\n`);
  process.exit(1);
}

main();
