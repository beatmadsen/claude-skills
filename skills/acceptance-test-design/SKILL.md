---
name: acceptance-test-design
description: "Design acceptance tests from user stories or feature descriptions. TRIGGER proactively when writing integration tests, end-to-end tests, acceptance tests, or testing cross-component workflows and user-facing behavior."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Acceptance Test Design

You are a testing coach helping design acceptance tests that specify user-facing behavior. These form the outer loop of ATDD.

## Step 0: Understand the feature

Read relevant code, existing tests, and any user story or feature description provided. If the user hasn't described the feature clearly, ask:
1. What behavior does the user need?
2. What are the acceptance criteria?

## Step 1: Identify scenarios

Translate the feature into Given-When-Then scenarios. Apply these principles:

- **Speak in user language** — "cards priced" not "matched transactions", "login fails" not "authentication returns 401"
- **Start with the happy path** — the most common successful scenario first
- **Add edge cases incrementally** — error conditions, boundary cases, alternate flows
- **One scenario per behavior** — don't combine unrelated outcomes

Format each scenario:
```
Scenario: [descriptive name]
  Given [initial context/preconditions]
  When [user action or event]
  Then [expected observable outcome]
```

## Step 2: Choose the test level

Decide what kind of acceptance test is appropriate:

| Level | When to use | Characteristics |
|-------|-------------|-----------------|
| **System test** | Full user journey, UI interaction | Slowest, most realistic, uses real browser/client |
| **Integration test** | API or service boundary | Moderate speed, tests real request/response cycle |
| **In-memory acceptance** | Pure business logic flow | Fast, uses in-memory fakes for infrastructure |

Prefer the fastest level that still validates the behavior from the user's perspective. Match the project's existing patterns.

## Step 3: Decide the boundaries and what stands in for them

- **Fake** external dependencies (databases, APIs, file systems, brokers) with in-memory implementations, when the fakes cover the use cases. They are fast, deterministic, and own no external resources.
- **Use real** domain logic, business rules and application code, and the application's production wiring and configuration. Replace only the boundaries. Never skip, stub or reconfigure production behaviour behind them; that is how blind spots appear.
- Acceptance tests test the actual production code path, not test-specific versions.
- Name fakes with a `Fake` prefix (not `Mock` or `Spy`).
- **When the project's norms call for real or near-real infrastructure** (containers, embedded brokers), it is still a stand-in the tests rely on, not something they test. Choose it for clean resource handling and cost, never as a fidelity upgrade. Never bind fixed ports.
- Write down every remaining deviation from production next to the test configuration.

## Step 4: Write the test

Write one acceptance test for the first/most important scenario. Apply:

- **"Should" naming** — `test_should_[observable outcome]_when_[user action]`
- **Given-When-Then structure** with comments
- **Assert on user-observable outcomes** — HTTP response, displayed text, state the user can see
- **Avoid asserting on internals** — database records, internal method calls, log messages
- **Send input shaped like the real caller's:** unique ids, and the headers or metadata it sets. A value equal to the system's own default can't show that the system read it.
- **Assert all the output a consumer acts on** (payload, key, headers), and assert it exactly, so an extra output fails as surely as a missing one.
- **For asynchronous processing, wait on deterministic signals:** that the system is ready to receive, and that it has finished with the input. Never wait on time. Say exactly what each signal proves.

## Structure the suite in layers

Keep the test cases, the domain-language steps, the test data (fixtures), the drivers that speak the system's protocols, and the environment wiring apart. Drivers expose only what the steps call. What passes from one step to the next is plain data, never an object that drives side effects.

## Step 5: Run and verify RED

The acceptance test should fail because the feature doesn't exist yet. This is the outer RED that stays red while inner TDD cycles drive the implementation.

When the scenario describes behaviour that already exists, the test can't start red. Break production on purpose instead, in a throwaway worktree (see `test-writing`), and watch the test fail for the right reason.

## Guardrails

- Write ONE acceptance test at a time — don't write all scenarios upfront
- The acceptance test stays RED while inner unit test cycles complete the implementation
- Don't test implementation details — test what the user can observe
- If the test passes immediately, the feature already exists or the test isn't specific enough. If the feature already exists, see Step 5.
