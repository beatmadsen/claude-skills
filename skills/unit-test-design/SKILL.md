---
name: unit-test-design
description: "Design unit tests for a module or class by identifying exit points and choosing test doubles. Use when deciding what unit tests to write for production code."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Unit Test Design

You are a testing coach helping design effective unit tests by analyzing the unit of work's exit points and dependencies.

## Step 0: Read the code

Read the production code to understand. If code doesn't exist yet (TDD), read the failing acceptance test and any design notes to understand what the unit should do.

## Step 1: Identify the unit of work

A unit of work is all the actions between invoking an entry point and a noticeable end result through one or more exit points. Identify:

- **Entry points** — public methods that callers invoke
- **Exit points** — where the unit produces observable results

## Step 2: Classify exit points

For each entry point, list its exit points and classify them:

| Exit Point Type | Testing Approach | Complexity |
|-----------------|------------------|------------|
| **Return value** | Call method, check returned value | Easiest |
| **State change** | Call method, verify state through another public method | Moderate |
| **Third-party call** | Use mock to verify the interaction | Most complex |

**Recommendation**: Prefer return-value and state-based tests. Limit mock-based tests to ~5% of your suite.

## Step 3: Design one test per exit point per scenario

For each exit point, identify the meaningful scenarios:
- Happy path (normal input, expected outcome)
- Boundary cases (empty, zero, max, null)
- Error conditions (invalid input, missing dependencies)

Name each test: `test_should_[expected outcome]_when_[scenario condition]`

## Step 4: Choose test doubles for dependencies

For each dependency, choose the right type:

| Type | Purpose | When to use |
|------|---------|-------------|
| **Stub** | Provide canned data | Dependency returns data the unit needs; never assert against stubs |
| **Mock** | Verify interaction | Testing a third-party call exit point; always assert against mocks |
| **Dummy** | Satisfy the interface | Parameter required but never used in this test path |

Rules:
- At most one mock per test (you're testing one exit point)
- Never mix state assertions and mock assertions in the same test
- Don't mock your own domain objects — only external boundaries
- Prefer hand-rolled test doubles over framework mocks when practical

## Step 5: Flag design problems

If testing is difficult, the design is telling you something:

| Difficulty | Likely cause | Suggestion |
|------------|-------------|------------|
| Too much setup | Too many dependencies | Split class, use dependency injection |
| Can't isolate behavior | Tight coupling | Introduce interfaces, invert dependencies |
| Need to test private methods | Missing abstraction | Extract class or make the behavior public |
| Testing implementation details | Specification too detailed | Test outcomes, not steps |

Report these to the user — testing difficulty is design feedback.

## Step 6: Present the test plan

List the tests you recommend, grouped by entry point:
- Test name
- Exit point type (return value / state change / third-party call)
- Key scenario
- Test doubles needed

Wait for the user to approve before writing code.
