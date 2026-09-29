# 🎯 F2G CMAS Hub — Agent Orchestration System

## Overview

Ce projet utilise une architecture multi-agent orchestrée pour garantir la qualité, la stabilité et l'excellence UI/UX.

## Agent Catalog

### 🏗️ Architecture & Planning

| Agent | Model | Role | File |
|-------|-------|------|------|
| `planner` | Opus | Creates work plans via interview | `.kiro/agents/planner.md` |
| `architect` | Opus | Architecture & debugging (READ-ONLY) | `.kiro/agents/architect.md` |
| `analyst` | Sonnet | Requirements gathering | `.kiro/agents/analyst.md` |

### 💻 Implementation

| Agent | Model | Role | File |
|-------|-------|------|------|
| `executor` | Sonnet | Code implementation | `.kiro/agents/executor.md` |
| `debugger` | Sonnet | Bug fixing | `.kiro/agents/debugger.md` |
| `designer` | Sonnet | UI/UX design | `.kiro/agents/designer.md` |

### ✅ Quality Assurance

| Agent | Model | Role | File |
|-------|-------|------|------|
| `critic` | Opus | Final quality gate (READ-ONLY) | `.kiro/agents/critic.md` |
| `code-reviewer` | Sonnet | Code review | `.kiro/agents/code-reviewer.md` |
| `security-reviewer` | Sonnet | Security audit | `.kiro/agents/security-reviewer.md` |
| `qa-tester` | Sonnet | Testing | `.kiro/agents/qa-tester.md` |
| `test-engineer` | Sonnet | Test writing | `.kiro/agents/test-engineer.md` |
| `verifier` | Sonnet | Verification | `.kiro/agents/verifier.md` |

### 📚 Support

| Agent | Model | Role | File |
|-------|-------|------|------|
| `explore` | Haiku | Codebase exploration | `.kiro/agents/explore.md` |
| `document-specialist` | Sonnet | Documentation | `.kiro/agents/document-specialist.md` |
| `git-master` | Sonnet | Git operations | `.kiro/agents/git-master.md` |
| `writer` | Sonnet | Content writing | `.kiro/agents/writer.md` |
| `scientist` | Sonnet | Research | `.kiro/agents/scientist.md` |
| `tracer` | Sonnet | Execution tracing | `.kiro/agents/tracer.md` |
| `code-simplifier` | Sonnet | Refactoring | `.kiro/agents/code-simplifier.md` |

---

## SDD Skills (Spec-Driven Development)

| Skill | Trigger | Path |
|-------|---------|------|
| `sdd-init` | Initialize SDD in project | `.kiro/skills/sdd-init/SKILL.md` |
| `sdd-explore` | Investigate codebase | `.kiro/skills/sdd-explore/SKILL.md` |
| `sdd-propose` | Create change proposal | `.kiro/skills/sdd-propose/SKILL.md` |
| `sdd-spec` | Write specifications | `.kiro/skills/sdd-spec/SKILL.md` |
| `sdd-design` | Technical design | `.kiro/skills/sdd-design/SKILL.md` |
| `sdd-tasks` | Task checklist | `.kiro/skills/sdd-tasks/SKILL.md` |
| `sdd-apply` | Implement code | `.kiro/skills/sdd-apply/SKILL.md` |
| `sdd-verify` | Validate implementation | `.kiro/skills/sdd-verify/SKILL.md` |
| `sdd-archive` | Archive completed changes | `.kiro/skills/sdd-archive/SKILL.md` |

---

## Conductor Skills

| Skill | Purpose | Path |
|-------|---------|------|
| `conductor-setup` | Initialize Conductor | `.kiro/skills/conductor-setup/` |
| `conductor-new-track` | Plan new feature | `.kiro/skills/conductor-new-track/` |
| `conductor-implement` | Implement track | `.kiro/skills/conductor-implement/` |
| `conductor-review` | Review implementation | `.kiro/skills/conductor-review/` |
| `conductor-status` | Check status | `.kiro/skills/conductor-status/` |

---

## Workflow Pipelines

### Pipeline 1: Feature Development (Full SDD)
```
planner → analyst → sdd-explore → sdd-propose → sdd-spec → sdd-design → 
sdd-tasks → executor → sdd-verify → critic → sdd-archive
```

### Pipeline 2: Bug Fix (Quick)
```
analyst → debugger → executor → qa-tester → verifier
```

### Pipeline 3: UI/UX Enhancement
```
designer → executor → code-reviewer → qa-tester → verifier
```

### Pipeline 4: Security Audit
```
security-reviewer → architect → code-reviewer → critic
```

### Pipeline 5: Code Quality
```
code-reviewer → code-simplifier → test-engineer → qa-tester → critic
```

---

## How to Use

### 1. Load an Agent
```bash
# Read the agent file to understand its role and constraints
cat .kiro/agents/executor.md
```

### 2. Delegate a Task
```
You are now the EXECUTOR agent. Read and follow the instructions in .kiro/agents/executor.md

Your task: [describe the task]
```

### 3. Run a Pipeline
```
Execute Pipeline 1 (Feature Development) for: [feature description]

Start with planner, then progress through each agent in sequence.
```

---

## Quality Gates

Every change must pass through these gates:

1. **Planner** → Work plan approved
2. **Executor** → Code implemented
3. **Code Reviewer** → Code quality verified
4. **QA Tester** → Tests pass
5. **Critic** → Final quality gate

---

## Operating Principles

From oh-my-claudecode:

1. Delegate specialized work to the appropriate agent
2. Keep users informed with concise progress updates
3. Prefer clear evidence over assumptions
4. Choose the lightest-weight path that preserves quality
5. Use context files and concrete outputs
6. Consult documentation before implementing
7. Write a cleanup plan before modifying code
8. Prefer deletion over addition
9. Reuse existing utilities and patterns
10. No new dependencies without explicit request
11. Keep diffs small and reversible
12. Run lint, typecheck, tests after changes

---

*Integrated: oh-my-claudecode (19 agents), agent-teams-lite (16 skills), conductor (6 skills), gsd-orchestrator*
