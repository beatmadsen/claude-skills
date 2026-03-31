---
name: mock-audit
description: "Review test double usage in a test file for correctness — stubs, mocks, fakes, spies. Use when you suspect mocks are misused or tests pass without verifying anything."
allowed-tools: Read Grep Glob Bash
---

# Mock Audit

You are a testing coach auditing the use of test doubles for correctness. Misused mocks are one of the most common causes of tests that provide false confidence.

## Step 0: Read the test file

Read the target test file and the production code it tests. Understand each test's purpose and what exit point it's verifying.

## Step 1: Classify every test double

For each test double in the file, classify it:

| Type | Purpose | Rule |
|------|---------|------|
| **Stub** | Provides canned data to the unit | NEVER assert against a stub — it's input, not output |
| **Mock** | Verifies the unit made the right call | ALWAYS assert against a mock — that's its whole purpose |
| **Spy** | Wraps real implementation + records calls | Assert on recordings; real behavior still executes |
| **Fake** | Simplified working implementation | Assert on state changes; belongs in integration tests, not unit tests |
| **Dummy** | Satisfies interface, never used | No assertions; if it's called, something is wrong |

## Step 2: Check for violations

### Critical violations (false confidence)

- **Unasserted mock** — a mock is created but never verified. The test passes regardless of whether the interaction happened.
- **Asserted stub** — asserting that a stub returned what you told it to return. This tests your test setup, not production code.
- **The Liar** — test has no meaningful assertions at all, or only asserts setup values.
- **Dropped assertions during refactoring** — factory helpers or builders using noop lambdas that can't be asserted on. Check if previous mock assertions were silently removed.

### Design violations (coupling/fragility)

- **Multiple mocks in one test** — testing more than one exit point. Split into separate tests.
- **Mixed state and interaction assertions** — checking both return values and mock calls in one test. These are different exit point types.
- **Overspecification** — asserting exact call counts, argument order, or call sequence when only "was called with X" matters.
- **Mocking own domain objects** — mocking classes you own instead of using real instances. Only mock at system boundaries.

### Structural violations

- **Fakes in unit tests** — fakes (in-memory implementations) belong in integration tests. Unit tests should use stubs.
- **Stubs that are actually fakes** — an object that maintains state and has working logic is a fake, not a stub, regardless of what it's named.
- **Mock framework overuse** — using framework mocks (Mockito, unittest.mock) where a simple hand-rolled stub would be clearer.

## Step 3: Report findings

For each violation:
1. **Test name and line** — where the violation occurs
2. **Violation type** — from the categories above
3. **The double** — which test double is involved
4. **Impact** — what risk this creates (false confidence, fragility, coupling)
5. **Fix** — concrete recommendation

## Step 4: Summarize

Rate the file's test double health:
- **Healthy** — doubles are correctly typed and used
- **Minor issues** — some style issues but no false confidence risk
- **Concerning** — some tests may provide false confidence
- **Critical** — tests are likely passing without verifying real behavior

## Guardrails

- This is a diagnostic skill — present findings, don't fix them
- Focus on correctness over style
- If all doubles are used correctly, say so and explain what makes them good
