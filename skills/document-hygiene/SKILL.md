---
name: document-hygiene
description: "Keep repository documents single-purpose, durable and consolidated: what belongs in a rulebook (CLAUDE.md, AGENTS.md, a SKILL.md) versus the tracker, git history, an ADR, a runbook or a test, the six-month test for every new line, and folding or retiring working notes. TRIGGER before adding to, editing, creating or deleting CLAUDE.md, AGENTS.md, a SKILL.md, an agent definition, a README, an ADR, a plan, a status note or any other working document in a repository, and before ending a session that created working notes."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Document Hygiene

## One purpose per document

A document is a rulebook, a reference, a plan, or a status tracker, never two. Status decays and guidance does not, and mixing them makes the guidance untrustworthy while burying the status where nobody looks. State what a document is in its first lines, and honour that.

## Rulebooks carry no status

A rulebook (the global CLAUDE.md, a repository's `AGENTS.md` or `CLAUDE.md`, a skill) carries durable guidance only: rules, posture, practices, pointers. It carries no project management and no status, because status is stale the moment it is written and is then read into every session, in every repository, forever after.

| Never put here | It belongs in |
|---|---|
| what is done, underway, or next; sprint state | the issue tracker (Jira, Linear, GitHub Issues) |
| what a session found or fixed; counts of bugs | git history, where `git log` is the record of what happened |
| test counts, coverage figures | the command that produces them |
| a decision and the reasoning behind it | an ADR, if the repo keeps one |
| how to answer an alert, deploy, or roll back | that repo's runbooks |
| how a behaviour works and how that is proven | its test |

**The six-month test.** Before adding a line, ask whether it will still be true and useful in six months, to someone who does not know what happened today. A rule, a practice, an invariant, a pointer, yes. A finding, a count, a date, a "that is fixed now", no.

**Global versus repository.** A repository's own `AGENTS.md` or `CLAUDE.md` follows the same discipline for facts specific to that repository (its stack, its architecture, its invariants) and may add rules that apply only there. The global CLAUDE.md holds what applies everywhere. Neither restates the other, and a skill does not restate either: where a rule already has a home, point to it.

**What you may change.** The global CLAUDE.md's "Agency and ownership" section limits what you may change in a rulebook without a human landing it. Read it before editing one.

## Consolidate as you go

- Fold working notes into a permanent home, retire superseded documents, delete duplicates.
- Verify before deleting anything you did not write, and on real doubt surface it rather than remove it.
- Cleanup is part of done, not a separate task, so it happens even in the last minutes. It never preempts an open failure, though: a lane that goes red near the end of a session is fixed first and tidied afterwards.
