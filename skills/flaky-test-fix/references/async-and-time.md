# Async and Time in Unit Tests

Distilled from ideas in *The Art of Unit Testing*, 3rd edition, by Roy Osherove with Vladimir Khorikov (Manning), chapter 6. Paraphrased; read the book for the full treatment.

## When the agent should treat async as a design problem

Synchronous tests finish when the call stack returns. Async code finishes later, on another turn of the event loop, in a worker thread, or after I/O. If a unit test sleeps, polls, or hits a real network clock, runtime grows and outcomes depend on load. Failures become intermittent and hard to attribute to product code versus the environment. The goal is to keep unit tests fast, deterministic, and focused on logic the team owns.

Integration heavy async suites also tend to exercise code paths unrelated to the behavior under review, which widens failure analysis. Error branches that depend on timeouts or remote faults are painful to trigger without seams. Teams start ignoring red builds because nobody knows whether the product regressed or the lab was slow.

## Decision: can you test the logic without waiting?

Trace where async begins. Often the interesting rules live after data arrives: parsing, validation, branching, mapping errors to responses. Pull that work into ordinary functions that take plain inputs and return plain outputs. Leave a thin outer function that only schedules I/O and delegates. Unit tests target the inner functions with tables of inputs. One or two higher level tests can still exercise the wiring if the team accepts slower checks.

When extracting, preserve the public API consumers rely on. The outer entry point stays the integration hook; the new functions become the main target for scenario coverage. This split is often the most valuable refactor for async modules that grew one long chain of then blocks or await calls.

## Decision: must the test cross an async boundary?

When the unit under test must call something asynchronous, hide that dependency behind a small seam: an object interface, a module boundary, or a function parameter with a production default. In tests, supply a double that resolves immediately with canned data or errors. The test may still use async syntax, but it no longer waits on the outside world. Pick the seam style that matches the codebase (class based, functional injection, or module replacement).

Stubs should be boring. Return fixed strings, throw chosen exceptions, or echo inputs. Avoid partial fakes that reintroduce threading unless you are explicitly testing concurrency policy elsewhere.

## Clocks and timers

Production code that reads the current instant or schedules delayed work ties tests to wall clock time and to timer queues. Inject a clock or time source in application code so tests advance or freeze time explicitly. Where the language test runner supports fake timers, enable them in setup, advance time by the needed interval, run pending callbacks, then restore real timers in teardown so later tests are isolated. Alternatively pass the scheduling function as a parameter and use an immediate executor in unit tests. Never multiply suite time by sleeping through real delays.

Calendar edge cases (month rollovers, daylight saving shifts, time zones) show up when code calls system clocks directly. An injected clock lets you set an instant once and assert behavior without running the test at midnight in production CI.

Document which timer mode each test file expects. Leaking fake timers into a neighbor test is a common source of order dependent flakes.

## Callbacks, promises, and events

Callback style tests need a clear signal that async work finished; otherwise the runner times out while assertions never run. Prefer promise or async test APIs when the production API allows, so failures surface as normal assertion errors. For event driven code, register a listener, perform the action, then assert on observable state or return values. Asserting that an event fired, with no check on downstream effect, tends to be brittle and adds little confidence.

Parallel async assertions need care. If multiple operations complete out of order, assert on structured results keyed by id rather than assuming the last callback wins. UI oriented tests should assert user visible outcomes after simulated interaction instead of internal dispatch details.

## Decision: unit test or integration test?

Keep most coverage at the unit layer on extracted logic and controlled doubles. Reserve integration style async tests for orchestration you truly need to see end to end: real timer interaction you cannot fake safely, framework lifecycle hooks, or a single smoke path through composition. Too many full stack async tests inflate CI time, flake under load, and force you to debug infrastructure when business rules break.

A practical ratio is many fast tests on pure decision code and a handful of slower tests that prove the async shell still calls the right collaborators. If removing a unit test would not reduce confidence in a business rule, it probably belonged at the wrong level.

## Using this reference while fixing a flaky test

If a test fails randomly and the production path uses timers, promises, threads, or external I/O, read this file after the skill's reproduction steps. Ask whether the test is accidentally an integration test running in the unit suite. Look for real delays, real clocks, or unstubbed dependencies. Prefer restructuring (extract logic, inject time and async ports, fake timers) over longer timeouts or retries. Re-run the test and nearby tests many times after changes that touch timer globals or shared async fixtures.

When the flake correlates with suite order, inspect teardown for timer restoration, open handles, and shared stub registries. When it correlates with machine load, suspect polling loops and unbounded waits rather than assertion typos.
