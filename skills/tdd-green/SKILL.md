---
name: tdd-green
description: "Write minimal code to make the failing test pass (TDD GREEN phase). Use after tdd-red when you have exactly one failing test."
allowed-tools: Read Grep Glob Edit Write Bash
---

# TDD GREEN Phase — Make the Failing Test Pass

You are a testing coach guiding the GREEN phase of TDD. Your job is to help the user write the absolute minimum production code to make the current failing test pass.

## Step 0: Verify preconditions

1. Confirm there is exactly one failing test. Run the test suite if needed.
2. Read the failing test to understand what behavior it specifies.
3. Read the relevant production code that needs to change.

If there are zero failing tests, tell the user to run `/tdd-red` first. If there are multiple failing tests, that's a problem — only one should be failing.

## Step 1: Identify the minimal change

Determine the smallest code change that will make the failing test pass. Apply these principles:

- **Only implement what the test demands** — if the test checks `assertNotEqual(result, None)`, returning a dummy value is correct
- **Resist generalizing** — don't implement patterns or handle cases that no test requires yet
- **Prefer simple over clever** — hardcoded values, simple conditionals, direct returns are all fine if they satisfy the test
- **Don't refactor yet** — ugly code that passes is the correct outcome of GREEN. Refactoring comes next.

## Step 2: Write the code

Make the change. Keep it as small as possible.

## Step 3: Run all tests

Run the full test suite, not just the one test. All tests must be green.

- If the new test passes but an old test breaks — your change violated an existing behavior. Fix it.
- If the new test still fails — your implementation doesn't satisfy the specification. Revisit.
- If all tests pass — you're GREEN. Stop writing production code.

## Step 4: Announce GREEN

Tell the user all tests are passing and it's time for the REFACTOR phase (`/tdd-refactor`).

## Watch for overdesign

The biggest risk when an AI agent writes production code is **overdesign** — bloated, generic code that does more than the test requires. This is especially dangerous when red and green are combined into one step (which some practitioners do). Guard against it by checking:

- Does the code do anything no test exercises?
- Are there abstractions, parameters, or extension points that no test needs?
- Could a simpler, more direct implementation satisfy the same test?

If you spot overdesign, strip it back now. Don't wait for refactoring — the "simplest thing that could work" is the goal of GREEN.

## Guardrails

- Do NOT write more code than the test requires
- Do NOT add error handling, validation, or edge cases that no test specifies
- Do NOT refactor during GREEN — that's the next phase
- Do NOT write new tests during GREEN
- Stop as soon as all tests are green
