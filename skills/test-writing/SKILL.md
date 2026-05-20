---
name: test-writing
description: "Gateway skill for writing any test. TRIGGER proactively whenever you are about to write, create, or add a test — unit test, integration test, acceptance test, or any test code. Ensures the right kind of test is written well. Read this BEFORE writing test code."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Test Writing Gateway

Read this skill BEFORE writing any test code. It ensures you pick the right test level and write it correctly.

## Step 1: Determine the test level

Classify what you're testing:

| Component type | Primary test level | Delegate to |
|---|---|---|
| Pure logic (no deps, transforms input→output) | Unit test | `unit-test-design` skill |
| Stateful logic (manages internal state) | Unit test | `unit-test-design` skill |
| Orchestrator (coordinates others, little own logic) | Acceptance/integration test | `acceptance-test-design` skill |
| I/O boundary (DB, API, file system) | Integration test with fakes | `acceptance-test-design` skill |
| Cross-component workflow | Acceptance test | `acceptance-test-design` skill |
| Thin wrapper (trivial delegation) | Likely doesn't need its own test | Skip or cover at higher level |

If unsure, read the `test-strategy` skill for a full analysis.

## Step 2: Hard rules (never violate)

### One behavior per test
- If your test name needs "and" → split into two tests
- Each test has ONE reason to fail
- Never assert unrelated outcomes in the same test

### No Thread.sleep / timing hacks
- Never use `Thread.sleep`, `delay()`, or busy-wait loops in tests
- For async code: use `Awaitility`, `CountDownLatch`, `CompletableFuture.get()`, `runTest`, or make the code under test synchronous in the test
- For timeouts: inject a clock or use a test scheduler

### No logic in tests
- No `if`, `for`, `when`, or calculations in test code
- Tests are straight-line: arrange, act, assert
- If you need a loop to assert, you likely need multiple tests or a parameterized test

### Deterministic tests
- Tests must pass 100% of the time regardless of execution order
- No shared mutable state between tests
- No dependency on system time, network, or file system state

### Test names describe behavior
- Pattern: `should [expected outcome] when [condition]`
- Name the rule, not the example

## Step 3: Write the test

After determining the level and reviewing the rules above, read the appropriate skill:

- **Unit tests** → read `unit-test-design` for exit-point analysis and test double selection
- **Acceptance/integration tests** → read `acceptance-test-design` for scenario design
- **Need test doubles** → read `test-double-design` for stub vs mock vs fake decision
- **Legacy code with no tests** → read `legacy-test` for safe characterization-first approach
- **TDD workflow** → read `tdd-red` to write the failing test properly

## Step 4: Self-check before committing

Before finishing, verify:
- [ ] Each test has exactly one reason to fail
- [ ] No `Thread.sleep` or timing-dependent assertions
- [ ] No logic (conditionals/loops) in test code
- [ ] Test name describes the behavior being specified
- [ ] Given-When-Then structure is clear (even without comments)
- [ ] Mocks are only used for third-party call exit points (not for stubs returning data)
