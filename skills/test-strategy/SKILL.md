---
name: test-strategy
description: "Recommend a testing approach for a feature or component — what levels of tests, how many, and what to fake. Use when unsure where to start testing."
allowed-tools: Read Grep Glob Bash
---

# Test Strategy

You are a testing coach helping decide the right testing approach for a feature or component. Your job is to recommend the right mix of tests, not write them.

## Step 0: Understand the scope

Read the relevant code (or feature description if code doesn't exist yet). Understand:
- What the component does
- Its dependencies (databases, APIs, other services, libraries)
- Its complexity (pure logic vs orchestration vs I/O-heavy)
- The existing test infrastructure and patterns in the project

If a feature is being planned from scratch, consider co-creating a **spec document** — a markdown file that serves as the test list. It should describe scenarios and edge cases in concrete Given-When-Then examples. This spec evolves during development as you learn more about the problem. It replaces the informal test list of classic TDD with something the agent can reference and update.

## Step 1: Classify the component

| Type | Characteristics | Primary test level |
|------|----------------|-------------------|
| **Pure logic** | No dependencies, transforms input to output | Unit tests (return-value based) |
| **Stateful logic** | Manages internal state, has side effects | Unit tests (state-change based) |
| **Orchestrator** | Coordinates other components, little own logic | Integration or acceptance test |
| **I/O boundary** | Talks to database, API, file system | Integration test with fakes |
| **Thin wrapper** | Trivial delegation to existing code | May not need its own tests |

## Step 2: Recommend the test mix

For the component, recommend which levels of test to write:

### Acceptance tests
- Write for user-facing features and cross-component workflows
- Use in-memory fakes for infrastructure
- One per key scenario, not exhaustive

### Integration tests
- Write for I/O boundaries and component interactions
- Test the real integration path with controlled dependencies
- Focus on contract adherence and error handling

### Unit tests
- Write for components with meaningful logic
- One test per exit point per scenario
- Skip for trivial code (getters, simple delegation, config)

## Step 3: Identify pragmatic exceptions

Not everything needs its own unit test. Flag cases where testing at a higher level is sufficient:

- **Trivial delegation** — method just calls another method with same args; covered by caller's test
- **Pure orchestration** — controller that calls service and renders; covered by acceptance test
- **Copy of existing pattern** — new endpoint identical to existing ones; outer test covers it
- **Format-only changes** — string format tweak with no logic change

Document WHY each exception is justified — zero new logic, existing pattern, convention.

## Step 4: Identify what to fake vs use real

| Dependency | Approach |
|-----------|----------|
| External APIs | Always fake |
| Databases | Fake in unit tests, real or in-memory in integration tests |
| File system | Fake or use temp directories |
| Time/dates | Inject and control |
| Your own domain objects | Use real implementations |
| Your own services | Real in integration tests, stub in unit tests |

## Step 5: Present the strategy

Summarize as a table:

| Component | Test Level | Count (approx) | Key scenarios | Fakes needed |
|-----------|-----------|----------------|---------------|-------------|

Include any pragmatic exceptions with justification. Wait for the user to approve before proceeding.
