---
name: ralphify
description: Background knowledge about Ralphify (ralph), an autonomous AI coding loop tool. Activate when the user mentions ralph, ralphify, RALPH.md, ralph run, or autonomous coding loops.
user-invocable: false
---

# Ralphify (ralph)

Ralphify is a CLI tool that runs an AI coding agent in an autonomous
`while True` loop. Each iteration: run commands, assemble a prompt
with command outputs, pipe it to the agent, wait for completion, repeat.

Install: `uv tool install ralphify`
Docs: https://computerlovetech.github.io/ralphify/

## Configuration: RALPH.md

A ralph lives in a directory with a single `RALPH.md` file. The file has
YAML frontmatter (commands, agent config) and a markdown prompt body.

```markdown
---
agent: claude -p --dangerously-skip-permissions
commands:
  - name: tests
    run: cargo test 2>&1 | tail -20
    timeout: 120
  - name: lint
    run: cargo clippy 2>&1 | tail -10
    timeout: 60
---

Prompt body here. {{ commands.tests }} injects test output.
{{ commands.lint }} injects lint output.
```

## Key Concepts

- **agent**: The CLI command to run (parsed once at startup)
- **commands**: Shell commands that run every iteration. Output is captured
  and injected into the prompt via `{{ commands.name }}` placeholders.
  Only referenced commands appear in the assembled prompt (but all execute).
- **Prompt body**: Re-read from disk every iteration (live-editable).
  The user can steer the agent by editing the prompt while it runs.
- **Iteration**: Each loop cycle starts a fresh agent with no memory.
  State persists only through git commits and files on disk.
- **`{{ ralph.iteration }}`**: Current iteration number (placeholder)
- **`{{ ralph.name }}`**: Name of the ralph directory

## Running

```bash
ralph run <directory>          # Run indefinitely
ralph run <directory> -n 10    # Run 10 iterations
ralph run <directory> --stop-on-error  # Stop if agent exits non-zero
```

The ralph directory name is the argument (e.g., `ralph run bridge`
runs from `bridge/RALPH.md`).

## Common Patterns

### Checks as Commands

In the old v0.1.x format, checks could block iterations. In v0.3.0,
checks are just commands whose output is injected. Enforcement happens
through prompt rules ("fix failures before doing new work") and
escalation scripts that track violation streaks.

### Phase Discovery

Rather than separate prompt files per phase, the agent discovers which
phase to work on by reading an approach doc (via a command) and checking
test status. Phases are sequential; all tests in phase N must pass
before starting phase N+1.

### ATDD Discipline

Common pattern: commands run test-first and pacing check scripts.
The scripts track consecutive violations and escalate warnings.
The prompt body tells the agent to treat check failures as blockers.

### Directory Structure

```
my-ralph/
├── RALPH.md              # Main config (required)
├── check-test-first.sh   # Optional discipline scripts
├── check-pacing.sh
└── check-swift.sh
```

Supporting files (approach docs, lessons, references) typically live
at the project root, read via commands (`cat approach.md`).

## Guardrails — Preventing Runaway Loops

Ralph runs indefinitely by default. The agent **cannot signal ralph to
stop** — even if the agent detects "nothing to do" and exits cleanly,
ralph treats exit code 0 as success and spawns the next iteration.
Without guardrails, a completed project will burn tokens forever.

### Mandatory: always set `-n` (max iterations)

Never run `ralph run <dir>` without `-n`. Estimate how many iterations
the task should take, then add a buffer (e.g., 2×). There is no
downside — you can always run again.

```bash
# Good
ralph run bridge -n 20

# Dangerous — runs until Ctrl+C or heat death
ralph run bridge
```

When helping a user write a `ralph run` command, **always include `-n`**.
If they don't specify a count, ask or suggest a reasonable default.

### Recommended: always set `-t` (per-iteration timeout)

Prevents a single stuck iteration from blocking the loop forever.
Typical value: 300–600 seconds (5–10 min) depending on task complexity.

```bash
ralph run bridge -n 20 -t 300
```

### Recommended: use `-s` (stop on error)

Stops the loop if the agent exits non-zero or times out. Use this
unless the task is expected to have intermittent failures.

```bash
ralph run bridge -n 20 -t 300 -s
```

### Recommended: use `-d` (delay between iterations)

Adds a cooldown between iterations. Even a short delay (5–10s) gives
you time to notice and Ctrl+C a runaway loop, and prevents hammering
the API.

```bash
ralph run bridge -n 20 -t 300 -s -d 5
```

### The "done" pattern is not a guardrail

A common pattern is a `done_check` command + prompt instruction:

```markdown
{{ commands.done_check }}
**If ALL_DONE, do nothing and exit.**
```

This is useful for **skipping work** in an iteration, but it does NOT
stop the loop. Ralph will keep running the next iteration. The `-n`
flag is the only hard stop.

### Standard recommended invocation

```bash
ralph run <dir> -n <count> -t 300 -s -d 5
```

## Supervised Runs — Monitor, Evaluate, Extend

Rather than guessing the right `-n` upfront, start conservative and
use a supervision loop: run a small batch, check progress, extend if
needed. This prevents both runaway burns (too many iterations) and
premature stops (too few).

### The pattern

1. **Start small.** Launch ralph with a low `-n` (5–10) and `-l` for
   logs.
2. **Monitor.** Check progress at tapering intervals.
3. **Evaluate.** Decide: extend, stop, or intervene.
4. **Extend.** If more work remains, launch another batch.

```bash
# Initial batch — conservative
ralph run <dir> -n 5 -t 300 -s -d 5 -l /tmp/ralph-logs

# After review — extend if meaningful progress is being made
ralph run <dir> -n 10 -t 300 -s -d 5 -l /tmp/ralph-logs
```

### What to monitor

Check these signals to decide whether to extend or stop:

| Signal | How to check | Meaning |
|--------|-------------|---------|
| **Recent commits** | `git log --oneline -10` | Are new commits appearing? What do they describe? |
| **Diff size** | `git diff HEAD~1 --stat` | Is each iteration producing meaningful changes? |
| **Iteration duration** | Log files or timestamps on commits | Very short (<30s) suggests no-op/done loop |
| **Test health** | Run the test command from RALPH.md | Are tests green? Count increasing? |
| **Done condition** | Run the done_check command | Has the task completed? |
| **Progress file** | `cat ralph/progress.md` or equivalent | How many items checked off vs remaining? |
| **Thrashing** | `git log --oneline -10` + `git diff HEAD~2 HEAD` | Same files bouncing back and forth? |
| **Drift** | Read last few commit messages | Is the agent still on-task? |

### Degenerate patterns to watch for

- **No-op loop**: Iterations complete in <30s with no git diff.
  The agent is hitting a done/skip condition but ralph keeps going.
  → Stop immediately.
- **Thrashing**: The same files change, revert, change again across
  consecutive commits. The agent is fighting itself.
  → Stop and fix the prompt or constraints before resuming.
- **Regression**: Tests that were green go red. Commit count rises
  but quality drops.
  → Stop, revert to last green commit, adjust prompt.
- **Drift**: Agent starts doing work outside the task scope (adding
  docs, refactoring unrelated code, "improving" things).
  → Stop, tighten the prompt, resume.
- **Stall**: An iteration hangs near the timeout limit producing
  little output. Agent may be stuck in a loop or waiting on input.
  → The `-t` flag handles this, but watch for repeated stalls.

### Monitoring frequency — taper as stability builds

- **Iterations 1–3**: Check after each. This is where bootstrap
  failures, bad prompts, and wrong assumptions surface.
- **Iterations 4–10**: Check every 2–3 iterations. If commits look
  healthy and tests are green, the loop is stable.
- **After 10+ stable iterations**: Check every 5–10. At this point
  you're mainly watching for completion or drift.

If any degenerate pattern appears, reset to high-frequency monitoring
after fixing the issue.

### Using Claude Code to supervise

You can use `/loop` in a separate Claude Code session to automate
monitoring:

```
/loop 5m Check the ralph run in <project-dir>: look at git log,
test status, and progress file. Report whether it's making
meaningful progress, is stuck, or is done.
```

Taper by increasing the interval once the run looks stable.

### When helping a user set up a ralph run

1. Always suggest starting with a small `-n` (5–10).
2. Suggest monitoring the first few iterations closely.
3. After the batch completes, review together and decide on the next
   batch size — or stop if done.
4. Prefer multiple small batches over one large one.

## What Ralph Is NOT

- Not a runtime event loop or REPL
- Not a build system
- Not a test runner (though it runs tests as commands)
- It's a development automation tool that drives an AI agent through
  iterative coding sessions with structured feedback
