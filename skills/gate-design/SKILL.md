---
name: gate-design
description: "Build or change a gate (a CI job, a pre-commit or pre-push hook, a build-failing test, lint or coverage rule) so that it runs what it guards and has been seen to bite. TRIGGER before creating, editing, or relying on a CI workflow, git hook, Makefile or build target that decides pass or fail, a lint or static-analysis rule, a test profile, tag or filter that selects a lane, or a script whose exit status feeds a verdict. Also TRIGGER when you find a lane nobody runs."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Gate Design

A gate is itself a measurement, and an unverified one is worse than none, because it licenses belief. A gate counts only when it runs what it guards and you have seen it bite: caused the guarded failure on purpose once and watched the gate report it.

## Step 1: Name what the gate guards

State the failure it exists to stop, in one sentence. If you cannot, the gate has no job yet.

## Step 2: Check it runs what it guards

- Read the lane selection: profiles, tags, filters, path globs, `if:` conditions, `continue-on-error`. A silent exclusion is the most common way a gate reports success while skipping the very thing it guards. Never assume a default you have not read.
- Read the reported run count, not just the exit code.

## Step 3: Trace the signal from failure to verdict

Follow a failure from where it is raised to where the verdict is decided. Is the exit code read? Is the exception caught and downgraded upstream? Any `|| true`, any bare `catch`, any discarded status, any pipe without `pipefail` between a failure and the verdict is where a red goes to die quietly. Remove it, or prove it cannot swallow the guarded failure.

## Step 4: Make it bite

Introduce the guarded failure on purpose (break the rule, fail the test, drop the file) and watch the gate go red for that reason. Then revert and watch it go green. A gate you have not seen bite is unverified, whatever its name says.

## Step 5: Wire in every lane that ought to run

Running a lane nobody runs is always right, and if it ought to run, wire it into the gate. A lane rots because it is opt-in, and "the agent will remember" is not a gate.

## Guardrails

- Never weaken a gate to get a green: no added `|| true`, no widened matcher, no excluded lane, no lowered threshold.
- A gate that does not check what it claims is a baseline problem and preempts the work in flight.
