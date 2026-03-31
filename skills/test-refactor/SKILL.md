---
name: test-refactor
description: "Refactor tests for readability and maintainability — duplicated setup, magic values, logic in tests. Use when test files have accumulated technical debt."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Test Refactoring

You are a testing coach helping clean up test code that has accumulated technical debt. Tests are code — they deserve the same care as production code.

## Step 0: Verify all tests are green

Run the test suite first. Never refactor failing tests — fix them first.

## Step 1: Read the test file

Read the target test file and the production code it tests. Understand the purpose of each test.

## Step 2: Identify refactoring opportunities

### Setup problems
- **setUp/beforeEach bloat** — shared setup contains things only some tests need. Fix: extract factory/helper methods, keep setUp minimal.
- **Duplicated arrangement** — same setup code copy-pasted across tests. Fix: extract a builder or factory method.
- **Complex object construction** — tests build elaborate object graphs inline. Fix: extract a builder with sensible defaults.

### Readability problems
- **Magic values** — unexplained numbers, strings, dates. Fix: use named constants or descriptive variable names.
- **Logic in tests** — conditionals, loops, calculations in test code. Fix: tests should be straight-line code; precompute values.
- **Unclear test names** — names don't describe the behavior. Fix: rename to `test_should_[outcome]_when_[condition]`.
- **Missing Given-When-Then** — test phases are interleaved. Fix: reorganize with comments marking each phase.

### Structural problems
- **Redundant tests** — an earlier specific test is subsumed by a later general one. Fix: delete the redundant test.
- **Test-per-method** — tests mirror production class structure instead of behaviors. Fix: reorganize around behaviors.
- **Shared mutable state** — tests modify shared fixtures. Fix: make each test create its own state.

### Assertion problems
- **Multiple unrelated assertions** — testing multiple behaviors in one test. Fix: split into focused tests.
- **Partial string matching** — asserting exact output when only part matters. Fix: use `assertIn`, `contains`, or regex.
- **Weak assertions** — `assertNotNone` when a specific value is expected. Fix: assert the actual expected value.

## Step 3: Apply refactorings one at a time

For each refactoring:
1. Describe the change and why
2. Make the change
3. Run the full test suite
4. Verify all green before the next change

**Critical**: After removing mocks or reorganizing test doubles, verify that no assertions were silently dropped. Check that every test still asserts something meaningful.

## Step 4: Verify no behavioral assertions were lost

After all refactorings, compare the before and after:
- Same number of test methods (or fewer if redundant ones were deleted)
- No assertions removed without justification
- All test names still describe behaviors

## Guardrails

- One refactoring at a time with tests run between each
- Run the FULL test suite, not just the file being refactored
- Never change what the tests verify — only how they're structured
- Deleting a redundant test requires justification (show it's subsumed by another)
