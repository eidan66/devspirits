# security-full-review

Run a full security review using available security subagents.

**Context:** DevSpirits – Next.js 16 landing/SEO/geo page. React 19, TypeScript strict, Tailwind v4.

**Instructions:**

1. Invoke each security subagent independently:
   - DOM XSS & Browser Hardening Specialist
   - Session Auth & CSRF Specialist
   - Supply Chain & Build Specialist

2. Each subagent must:
   - Identify tainted sources and exploitable sinks
   - Simulate realistic attacker abuse paths
   - Flag CRITICAL / HIGH / MEDIUM issues
   - Recommend concrete, secure fixes

3. After all subagents complete:
   - Merge findings
   - Deduplicate overlaps
   - Escalate the highest-risk issues

**Output format:**

- Unified Security Findings table: Severity | Category | Location | Exploit Scenario | Recommended Fix
- "Must Fix Before Merge" list
- Optional hardening suggestions
- Final verdict: APPROVE / BLOCK / APPROVE WITH CHANGES

**Constraints:** Do NOT weaken security for convenience. Do NOT suggest insecure workarounds.
