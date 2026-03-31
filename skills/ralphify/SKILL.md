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

## What Ralph Is NOT

- Not a runtime event loop or REPL
- Not a build system
- Not a test runner (though it runs tests as commands)
- It's a development automation tool that drives an AI agent through
  iterative coding sessions with structured feedback
