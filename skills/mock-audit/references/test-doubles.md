# Test Doubles: Choosing and Using Them

Distilled from ideas in *The Art of Unit Testing*, 3rd edition, by Roy Osherove with Vladimir Khorikov (Manning), chapters 3 to 5. Paraphrased; read the book for the full treatment.

## Start with direction of dependency

A unit test usually proves something through a return value, a visible state change, or an outbound call to something outside the unit. The first two paths rarely need interaction verification. The third path appears when the unit hands work to a collaborator you do not own and cannot inspect from the outside.

When the unit needs data or behavior from outside before it can run, that flow is incoming. Use a stub to supply canned answers so the test controls the scenario. When the unit sends commands or events outward as part of its job, that flow is outgoing. If the test must prove that outreach happened correctly, use a mock and assert on the interaction. Mixing these roles in one object or one assertion strategy confuses readers and weakens tests. Prefer the umbrella term test double until the direction is clear.

## Pick an injection seam

Production code needs a seam where a test can substitute the real collaborator without rewriting the unit.

Parameter and constructor injection keep dependencies visible at the call site. They work well for simple values, for small objects, and for typed ports in object oriented code. The cost is wider public surfaces; resist adding parameters only for tests when a factory or a dedicated builder in test code can assemble the unit instead.

Function injection passes a callable when the dependency is really "how do I obtain a value or side effect" rather than a fixed value. That helps simulate errors, alternating responses, or lazy evaluation without binding the unit to a clock or random source.

Factories and partial application let you fix several collaborators once, then exercise the returned function or object in the act step. That pattern scales when arrange would otherwise repeat the same wiring in every test.

Module or file level registries help when legacy code hard codes imports. Tests swap entries in the registry, then must reset after each example so execution order does not leak state. This seam is powerful and easy to abuse; without reset hooks, suites become order dependent.

Monkey patching entire modules or vendor packages couples tests to foreign APIs. Prefer a narrow interface your application defines, implemented in production by a thin wrapper around the vendor. Tests then double your interface, so upstream library changes touch one adapter, not every spec file.

Handwritten doubles and doubles from an isolation framework both work. A framework double declared and stubbed in the test body is usually the shortest option and keeps the arrangement visible. A double that needs many stubbed methods points to a missing abstraction, however it was made.

## Stubs are inputs, not evidence

A stub shapes the world the unit sees. Asserting that a stub returned what you configured only validates arrange, not production logic. Checking that a stub method was invoked treats input setup as output proof and should be avoided.

Several stubs in one test are fine when multiple incoming sources define one scenario. Readers should still see at a glance which objects feed data and which objects, if any, carry outbound expectations.

## Mocks encode one outbound requirement

A mock represents a single delegated exit, usually at a system boundary. It encodes a requirement such as "notify billing with this payload" or "persist this record." Each additional mock in the same test adds another requirement. When an early assertion fails, later ones may not run, so one failure masks others. Split examples so each mock verifies one outbound contract.

Interaction assertions should be uncommon across the suite. Most examples should still check returned values or observable state on objects you control. Reach for a mock when the meaningful outcome is that an external gateway was invoked correctly and that fact cannot be inferred from return data alone.

Keep mock implementations tiny: only the methods the unit calls. For bloated vendor types, introduce a smaller port in your code and mock the port. Name recording doubles so reviewers know an assertion will follow; name input doubles so reviewers know they will not.

Avoid overspecifying calls. Proving the essential argument or message is enough. Exact call order, counts on unused methods, and negative assertions on every sibling method make tests brittle without adding confidence.

## What belongs on either side of the boundary

Stub incoming infrastructure the unit cannot control: clocks, networks, disks, databases, randomness, queues, and remote services. Mock only true exit points where the unit delegates to those externals.

Do not mock types from your own domain model to test a sibling class. Use real instances or stubs of data providers instead. Mocking internal helpers ties tests to class layout and often signals the unit is doing too much.

Partial doubles that subclass or wrap a real object and override one method can unblock legacy code. They mix real and substituted behavior, so they break easily when the real side pulls in slow or flaky resources. Treat them as temporary, not as the standard approach.

## Isolation frameworks

Isolation frameworks create and configure doubles at runtime and offer a shared vocabulary for call verification. Dynamic, duck typed tools fit functional code and module heavy JavaScript. Typed substitute tools fit class hierarchies and interface driven code where the compiler should catch mismatches.

They help when many tests repeat the same module substitution or when recording call arguments by hand would clutter every file. They hurt when teams mock every import because the API makes it easy, or when tests accumulate long configuration chains that obscure the behavior under test.

Always clear recorded calls between examples when the framework keeps global state. Verify outbound exit points, not private methods or internal steps you happen to intercept. Never replace a third party module in tests when production could depend on your own wrapper instead.

## When mocking dominates, look at design

Warning signs include arrange blocks longer than act and assert, many doubles in a single example, suites that mostly assert call history, and repeated patching of the same module file. Often the unit orchestrates too many concrete types, or dependencies are read from globals instead of being injected.

Return value and state based tests may be underused while interaction tests multiply. Shrinking units, pushing side effects to the edges, and introducing explicit ports usually reduces mock count more effectively than adopting richer mocking APIs.

Environmental flakiness is a related signal. If the same test passes on one machine and fails on another because of time, network, or disk, an incoming dependency still needs a stub seam rather than a mock.

## Using this reference with design and audit work

When designing a new double, state which dependency direction you are breaking and which exit point the example protects. Pick the smallest injection change that keeps production code honest. Prefer abstractions you own at boundaries you do not control.

When auditing existing doubles, label each object as input or outbound recorder based on whether assertions reference it. Treat an outbound recorder with no assertion as a silent gap. Treat asserted stubs as false confidence. Treat multiple outbound recorders in one example as a split waiting to happen. Recommend seams and refactors that align with one outbound requirement per test and with ports instead of vendor types.
