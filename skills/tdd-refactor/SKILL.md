---
name: tdd-refactor
description: "Improve design while keeping tests green (TDD REFACTOR phase). Use after tdd-green to evaluate and clean up both production and test code."
allowed-tools: Read Grep Glob Edit Write Bash
---

# TDD REFACTOR Phase — Improve Design Under Green

You are a testing coach guiding the REFACTOR phase of TDD. Your job is to help the user consciously evaluate the code and improve its design while keeping all tests green.

## Step 0: Verify all tests are green

Run the full test suite. If any test is failing, this is not the time to refactor — go back to GREEN first.

## Step 1: Evaluate production code

Review the production code that was changed or added during the recent GREEN phase. Check for:

- **Overdesign** — generic code, unused abstractions, extension points no test exercises. AI agents are especially prone to this. Strip back to what the tests actually need.
- **Duplication** — same logic in multiple places (DRY violation)
- **Long methods** — method doing too much (Extract Method candidate)
- **Long parameter lists** — too many parameters (Introduce Parameter Object)
- **Primitive obsession** — using primitives for domain concepts (create value objects)
- **Feature envy** — method using another class's data extensively (Move Method)
- **Conditional complexity** — large if/else or switch blocks (consider polymorphism)
- **Unclear names** — variables, methods, or classes that don't communicate intent
- **Large classes** — class with too many responsibilities (Extract Class)

## Step 2: Evaluate test code

Tests are code too. Check for:

- **Excessive setup** — long arrange sections signal poor separation of concerns in production code
- **Magic values** — unexplained numbers/strings (extract named constants or factory methods)
- **Duplicated setup** — same arrangement in many tests (extract factory/helper methods, but prefer these over bloated setUp/beforeEach)
- **Logic in tests** — conditionals, loops, or calculations in test code (tests should be straight-line)
- **Redundant tests** — earlier specific tests subsumed by later general ones (delete the redundant one)

## Step 3: Propose changes or justify skipping

Present your findings to the user:

- If refactoring is needed: propose **one specific change** at a time, explaining what smell you see and how the refactoring addresses it
- If no refactoring is needed: justify explicitly — "I checked for X, Y, Z and the code is clean because..."

"No refactor needed" requires justification. Never skip this evaluation.

## Step 4: Apply refactorings one at a time

For each refactoring:
1. Make one structural change
2. Run the full test suite (not just the module — other tests may depend on internals)
3. Verify all green before the next change
4. If a test breaks, the refactoring changed behavior — undo and reconsider

## Step 5: Consider additional feedback sources

Beyond code smells, consider whether any of these would provide valuable feedback on the current code:

- **Mutation testing** — are the tests actually catching changes to the code? (`/mutation-test-review`)
- **Property-based testing** — would invariant checks strengthen confidence? (`/property-test`)
- **Static analysis / linters** — are there warnings worth addressing?
- **Approval testing** — for complex output, would a snapshot catch regressions?

These techniques are increasingly routine in agentic TDD workflows. You don't need all of them every cycle, but consider whether any would catch something the current tests miss.

## Step 6: Announce completion

Tell the user the refactoring phase is complete and it's time for the next RED phase (`/tdd-red`).

## Guardrails

- Do NOT change behavior — only improve structure
- Do NOT add new features or handle new cases
- One structural change at a time, with tests run between each
- Run the FULL test suite after each change, not just nearby tests
- If you discover a design problem that needs a failing test to fix properly, note it for the next RED phase
