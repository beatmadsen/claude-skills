---
name: test-writing
description: "Gateway skill for writing any test. TRIGGER proactively whenever you are about to write, create, or add a test — unit test, integration test, acceptance test, or any test code, and whenever you add or change a fixture, migration or config value a test reads. Ensures the right kind of test is written well. Read this BEFORE writing test code."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Test Writing Gateway

Read this skill BEFORE writing any test code. It ensures you pick the right test level and write it correctly.

A unit test exists to verify that the code actually has the behaviour we believe it has. Regression protection is a by-product. For every exit point, including side effects such as log lines or published messages, ask whether we know the code does this; an exit point no test checks is an unverified belief.

Before Step 1, read [references/foundations.md](references/foundations.md) in this skill's folder for the reasoning behind the rules below. It is distilled from Osherove and Khorikov's *The Art of Unit Testing*.

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

### Placement rules

- Classify a test by what it exercises, not by the directory or suffix it carries. A "unit test" that stands up a full application context is mislabelled.
- Watch the shape of the pyramid as you build. A top-heavy suite has one of two causes and both are defects: the edge cases are missing, or they are pinned at too high a layer. Neither is fixed by adding more tests at the top.
- A duplicated decision belongs to its owner. When a high-level test re-asserts what a collaborator already decides, delete it there and pin it at the collaborator.
- Needing a database to test something is usually a missing seam. Inject the repository interface rather than reaching for a real one.

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

### New inputs are proven, not assumed
A green test proves the decisions matched. It says nothing about whether the input it consumed was the right one, and a wrong value that flips no assertion is invisible to every check you own. When you add or change an input a test reads (a fixture, a migration, a config property), the green is worth nothing until you have separately shown two things:
- That the input is actually loaded: remove it and watch something go red. If nothing changes, nothing was reading it.
- That it is the right one, identified by a value that could not match by coincidence.

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
- [ ] Every exit point of the behaviour is verified by some test, side effects included
- [ ] Each test sits at the level that decides the behaviour, and no higher test re-asserts it
- [ ] Every new or changed fixture, migration or config input was shown to be loaded and to be the right one
