# Test level strategy

Distilled from ideas in *The Art of Unit Testing*, 3rd edition, by Roy Osherove with Vladimir Khorikov (Manning), chapter 10. Paraphrased; read the book for the full treatment.

Agents choose test levels by trading speed, confidence, maintenance effort, and how precisely a failure points to a cause. Higher levels exercise more of the real system; lower levels isolate smaller slices. Neither extreme is a complete answer on its own.

## What each level is for

**Unit and in-process component tests** run quickly, fail for reasons close to the code under test, and are cheap to change when internals refactor. They rarely prove that wiring, configuration, or external systems behave correctly.

**Integration tests** (shared database, message bus, filesystem, in-memory service host) raise confidence that real dependencies cooperate. They are slower, need more setup, and failures can come from environment or ordering as well as application bugs.

**Out-of-process API or service tests** hit deployed or containerized endpoints over the network. They validate contracts and deployment-shaped behavior but add flakiness from timing, ports, and shared environments.

**UI and full-stack end-to-end tests** mimic user journeys through browsers or thick clients against live stacks. They give the strongest "it works for a user" signal and the weakest failure localization: a red test might mean UI selectors, async timing, data, or any layer below.

Think of the test pyramid as guidance toward many fast checks near the base and fewer expensive checks near the top.

## Failure patterns when the suite is lopsided

If almost everything is UI or full-stack, feedback loops stretch, unrelated flakes block merges, and teams spend time babysitting suites instead of fixing product defects. Adding another top-level test often costs as much to keep green as the first one, while teaching less about new code paths.

If almost everything is unit-level, green builds can still hide broken integrations, wrong SQL, misconfigured HTTP clients, and features that never connect in production. Manual exploration returns because automation never exercised the seams.

If developers own fast tests and another group owns slow tests without shared planning, the same scenario often appears twice at different heights. Pipelines disagree, duplicates drift apart, and neither layer tells a coherent story when something breaks.

## One check, one primary level

Before adding a test, ask whether an existing test already proves the same outcome. If yes, extend or adjust that test instead of cloning the scenario upstairs or downstairs.

For each new behavior, pick the **lowest** level that can falsify the claim you care about. Push upward only when lower levels cannot access the risk: real transaction boundaries, wire formats across services, browser rendering, or operational configuration you deliberately do not fake.

Happy paths for critical features may warrant a single thin slice at the highest necessary level; variations, edge cases, and error branches usually belong lower where iteration stays cheap.

## Ownership and cost

Who maintains a test counts as much as what it asserts. Fast unit tests fit daily developer workflow; sprawling UI suites often land with QA or a platform team and rot when product teams move on. Prefer levels the feature owner can run locally before push.

Flaky tests are a tax on every level but hurt most at the top. Expensive tests belong in pipelines that match their purpose: gates that must pass to ship versus informational runs that open tickets without blocking release.

## When recommending strategy for a feature

Start from user-visible scenarios and integration risks, not from file layout. List outcomes that would embarrass you if wrong, then assign each outcome exactly one home level using the lowest-feasible rule. Note dependencies to fake versus run for real, aligned with project conventions.

State what would make you trust the feature after a green run. If that bar is not met, add targeted coverage rather than duplicating a scenario at a second level. If the bar is met, resist extra tests that only repeat prior proof.

Present the plan as a small scenario-to-level map for approval before anyone writes code, and revise it when implementation reveals new seams or retired risks.
