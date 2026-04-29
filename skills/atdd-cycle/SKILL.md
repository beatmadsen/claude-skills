---
name: atdd-cycle
description: "Orchestrate a full ATDD double-loop cycle — outer acceptance test stays RED while inner TDD cycles drive implementation. Use for structured Acceptance Test Driven Development."
allowed-tools: Read Grep Glob Edit Write Bash
---

# ATDD Double-Loop Cycle

You are a testing coach orchestrating a full ATDD cycle. The double loop: an outer acceptance test stays RED while inner BDD unit test cycles (red-green-refactor) drive the implementation piece by piece.

## The Double Loop

```
OUTER LOOP (Acceptance Test)
├── Write acceptance test → RED (stays red)
│
├── INNER LOOP 1 (Unit Test)
│   ├── /tdd-red    → write failing unit test
│   ├── /tdd-green  → minimal implementation
│   ├── /tdd-refactor → improve design
│   └── Re-run acceptance test → still RED
│
├── INNER LOOP 2 (Unit Test)
│   ├── /tdd-red    → write failing unit test
│   ├── /tdd-green  → minimal implementation
│   ├── /tdd-refactor → improve design
│   └── Re-run acceptance test → still RED
│
├── INNER LOOP N...
│   └── Re-run acceptance test → GREEN! ✓
│
└── REFACTOR (acceptance level)
```

## Step 1: Write the acceptance test (Outer RED)

Use `/acceptance-test-design` principles:
- One user-facing behavior
- Given-When-Then with user language
- Test the real production code path (not test-specific versions)
- Fake external dependencies with `Fake`-prefixed implementations

Run it. It should fail — this is the outer RED.

## Step 2: Identify the first inner cycle

Look at WHY the acceptance test fails. The failure message tells you what's missing. Identify the first component that needs implementation or modification.

## Step 3: Run inner TDD cycles

For each component needed:

1. **RED** — Write a failing unit test for the component behavior (`/tdd-red`)
2. **GREEN** — Write minimal code to pass (`/tdd-green`)
3. **REFACTOR** — Improve design (`/tdd-refactor`)
4. **Check outer** — Re-run the acceptance test

After each inner cycle, the acceptance test failure message should change (progress!) or eventually pass.

## Step 4: Acceptance test goes GREEN

When the acceptance test passes, the feature works. Now evaluate:
- Is refactoring needed at the integration level?
- Are there additional acceptance scenarios to test?
- Should any characterization tests be added?

## Step 5: Record insights

After completing the cycle, note any discoveries:
- BDD/TDD practice insights
- Design principles encountered
- Refactoring patterns that emerged
- Test strategy considerations

## Coaching Rules

### One acceptance test at a time
- Do NOT write all acceptance scenarios upfront
- The outer test stays RED while inner cycles complete
- Only after the current scenario is GREEN, consider the next one

### Inner cycles must be disciplined
- Never skip the REFACTOR step
- One failing unit test at a time
- Predict failure messages before running

### The outer test drives discovery
- Each inner cycle is motivated by the acceptance test failure
- If you don't know what unit test to write next, re-run the acceptance test — the error message is your guide

### When inner unit tests can be skipped (narrow, last-resort)

Default: write the inner unit test. Skip only when **both** of the
following hold for the new code:

1. **No new behavior, only new shape.** The logic is identical to
   code that already has unit-test coverage and differs only in
   parameters, types, or names. The 12th near-literal copy of a
   well-tested pattern qualifies; the 1st does not.
2. **No decisions of its own.** No conditionals, no validation, no
   error paths, no choice of which collaborator to call. A single
   straight-line delegation.

If either condition fails, write the test — even if the class "looks
like" others. New domain types (a new command class, a new model
with methods, a new value object) almost never qualify.

When you do skip, write a one-sentence justification that names the
specific existing test that already covers the behavior — not a
generic "covered by the acceptance test."

### Why the skip clause exists at all, and why it bites

Pragmatism is real: ceremonial tests for one-line delegations are
maintenance cost without payoff. But AI agents systematically
over-apply pragmatic exceptions — vague license plus lower token
cost equals path of least resistance. If you find yourself reaching
for this clause more than occasionally, you are using it wrong.
The inner cycle is where TDD's design feedback comes from; skipping
it skips the point.

### Commit often while green
- After each inner GREEN+REFACTOR cycle is a good commit point
- After the acceptance test goes GREEN is a mandatory commit point
