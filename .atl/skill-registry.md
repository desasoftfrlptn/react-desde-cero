# Skill Registry — react_desde_0

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Go tests, Bubbletea TUI testing | go-testing | file:///home/ema/.config/opencode/skills/go-testing/SKILL.md |
| "judgment day", "doble review", "juzgar", "que lo juzguen" | judgment-day | file:///home/ema/.config/opencode/skills/judgment-day/SKILL.md |
| Create a new skill, add agent instructions | skill-creator | file:///home/ema/.config/opencode/skills/skill-creator/SKILL.md |
| Creating a GitHub issue, bug report | issue-creation | file:///home/ema/.config/opencode/skills/issue-creation/SKILL.md |
| Creating a PR, preparing changes for review | branch-pr | file:///home/ema/.config/opencode/skills/branch-pr/SKILL.md |

## Compact Rules

### go-testing
- Use `teatest` for Bubbletea TUI integration tests
- Prefer table-driven tests with `t.Run()` subtests
- Mock external dependencies via interfaces, not monkey-patching
- Assert on stdout/stderr output for TUI tests

### judgment-day
- Launches TWO independent blind judges simultaneously for adversarial review
- Each judge reviews independently, findings are synthesized
- After fixes, re-judges until BOTH pass OR 2 iterations max
- Escalates to human if 2 iterations fail

### skill-creator
- Use `Write` to create SKILL.md following Agent Skills spec
- Include frontmatter: name, description, trigger, allowed-tools
- Store in `.config/opencode/skills/{skill-name}/` or `.claude/skills/{skill-name}/`
- Description MUST list explicit triggers for auto-loading

### issue-creation
- Issue-first enforcement: create issue before any implementation
- Include: reproduction steps (bugs), acceptance criteria (features), affected scope
- Use GitHub issue templates when available

### branch-pr
- Issue-first: branch MUST reference an existing issue
- Use conventional commits: `feat:`, `fix:`, `chore:`, etc.
- PR body MUST include: what, why, testing notes
- Never add "Co-Authored-By" or AI attribution

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | /home/ema/.config/opencode/AGENTS.md | OpenCode agent configuration |
| Skill registry | /home/ema/Documentos/desa_soft_2026/react_desde_0/.atl/skill-registry.md | This file |

Read the convention files listed above for project-specific patterns and rules.

## SDD Skills (Managed by sdd-init)

These SDD workflow skills are available but auto-loaded by the orchestrator — not for direct use by sub-agents:

| Skill | Path |
|-------|------|
| sdd-init | file:///home/ema/.config/opencode/skills/sdd-init/SKILL.md |
| sdd-explore | file:///home/ema/.claude/skills/sdd-explore/SKILL.md |
| sdd-propose | file:///home/ema/.config/opencode/skills/sdd-propose/SKILL.md |
| sdd-spec | file:///home/ema/.config/opencode/skills/sdd-spec/SKILL.md |
| sdd-design | file:///home/ema/.config/opencode/skills/sdd-design/SKILL.md |
| sdd-tasks | file:///home/ema/.config/opencode/skills/sdd-tasks/SKILL.md |
| sdd-apply | file:///home/ema/.claude/skills/sdd-apply/SKILL.md |
| sdd-verify | file:///home/ema/.claude/skills/sdd-verify/SKILL.md |
| sdd-archive | file:///home/ema/.config/opencode/skills/sdd-archive/SKILL.md |
| sdd-onboard | file:///home/ema/.config/opencode/skills/sdd-onboard/SKILL.md |
