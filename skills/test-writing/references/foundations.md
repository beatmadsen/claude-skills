# Foundations of Unit Tests

Distilled from ideas in *The Art of Unit Testing*, 3rd edition, by Roy Osherove with Vladimir Khorikov (Manning), chapters 1 and 2. Paraphrased; read the book for the full treatment.

## Repository owner's view

This skill builds on the book with an explicit stance on why we write unit tests. They exist to check that production code really behaves the way we think it does. Catching regressions later is a useful side effect, not the main goal. For every exit point, including side effects such as log lines or messages sent to a bus, ask whether we have evidence the code does that thing, not whether a user would complain if it stopped. Behavior we assume but never assert in a test is still an unverified belief.

## What a unit test is for

A unit test is automated code that drives the system under test through a public entry point and checks one observable outcome at an exit point. It should be cheap to write and run, and its result should be something a developer can act on. When it fails, the report should make the expected outcome and the mismatch obvious enough to start fixing production code. The test harness and assertion library exist so structure and failure output stay familiar across the team. Writing tests well is a separate skill from test-first workflow or from good object design; all three help, yet none replaces the others.

## Scoping the unit of work

Decide scope from behaviour, not from file or class boundaries. A unit of work is everything that happens from the moment a caller invokes an entry point until a result you can notice at an exit point. That chain might stay inside one function or cross several collaborators; the span is defined by entry and exit, not by how the code is packaged.

Entry points are the public surfaces tests use to start work. Exit points are where you can observe an effect: a returned value, a durable change in state you can read back through the public API, or an outbound call to something outside the unit (logging, persistence, messaging, and similar). Each distinct exit point under a given scenario usually deserves its own test, because the techniques and doubles differ. Return-value checks are the simplest; state checks need a follow-up read; outbound calls often need a test double and interaction assertions.

Do not let private methods dictate scope. Callers care about public contracts. If you feel forced to test internals, that often means the unit of work is poorly exposed or doing too much in one place.

## What makes a unit test "good"

Good automated tests in general are easy to read, easy to run, deterministic when nothing relevant changed, and informative when they fail. Any teammate should be able to run them locally or in CI with a single command and see the same pass or fail as everyone else. Unit tests add stricter expectations: they finish quickly, run in memory without real networks or disks, do not depend on execution order or shared ambient state, and stay isolated from other tests. Deleting or changing one test should not ripple through unrelated tests.

Tests that lean on real time, randomness, threads, remote services, another team's components, or a database are still automated checks, yet they behave like integration tests. Integration tests are valuable; they are slower, flakier, and harder to debug because failure can come from many layers. The split is about control and environment, not about pride in the label.

Three qualities keep a suite usable over years. Readability means names and layout show intent without archaeology. Maintainability means tests change when requirements change, not when you refactor internals. Trustworthiness means a red test means something broke in the product or the test itself, and green means you are willing to ship; if people ignore failures, the suite stops paying for itself.

Fast and isolated tests can run on every save or every commit. Slow or order-dependent tests tend to get skipped, which erodes the evidence unit tests are meant to provide. Treat a test that only passes on one machine or after manual steps as a signal to redesign or reclassify it.

## Structuring and naming so failure tells the story

Use a consistent three-part layout: prepare inputs and collaborators, invoke the entry point once, assert on a single behavioural outcome. Keep each test self-contained. Shared setup hidden in hooks forces readers to jump around and hides data flow; small factory helpers at the top of the file often read better because the test body shows what is special about that case.

Name the test with three ideas woven together: which unit or behavior, which situation or inputs, and which outcome you expect at the exit point. When a test fails, the name plus the assertion message should narrow the search in production code without opening the test first. Prefer assertions that pin the meaningful part of a string or error, not every comma of formatting, when the exact text is not the requirement.

When several cases share obvious context, nest descriptions so reports read like short sentences. Avoid stuffing unrelated assertions into one test; one primary outcome per test keeps failures unambiguous. After writing a new test, confirm it fails for the reason you expect before the code is right and passes once it is, so you know the assertion actually guards the behavior.

## What counts as a dependency

A dependency is anything you cannot fully steer during a unit test, or anything that would make the test painful or slow if you tried to use the real thing. Typical examples include clocks, random sources, the filesystem, network clients, databases, log sinks, and code owned elsewhere. Replacing such a dependency with a stub keeps the test at unit level. A working in-memory implementation is a fake, and fakes belong in integration and acceptance tests.

If you can control it easily, it runs in process, and it is fast, treat it as part of the unit under test rather than an external dependency. Mock sparingly, and keep unit tests focused on logic you own while stubs and mocks stand in for the outside world. Choosing stub versus mock versus dummy for each collaborator is covered in the skill steps; the decision always starts from whether you are asserting on data coming in or on an outbound call at an exit point.

## Applying this when designing or reviewing

Start from entry and exit points, not from "test the class." List exits for the scenario you care about and ask whether each one is verified or merely assumed, using the repository owner's question about evidence rather than user impact. Check speed, isolation, and consistency: would this test fail for another team's outage or a slow CI disk? Read the name and body as a colleague would on a failed build. If setup dominates the test, or you need many doubles to observe one behavior, treat that as design feedback and say so before adding more cases. For reviews, flag tests that look green while leaving exit points unchecked, and flag suites that mix unit and integration concerns without labeling either intent.

Pair this reference with the skill workflow when you need concrete test names, scenario lists, and double choices. Use this file when you need the reasoning behind those steps or when judging whether an existing test belongs in the unit layer at all. Read it before proposing a test plan or before critiquing a pull request that adds or changes unit tests.
