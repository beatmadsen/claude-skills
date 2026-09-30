# Legacy Code: Where to Test and How to Protect Changes

Distilled from ideas in *The Art of Unit Testing*, 3rd edition, by Roy Osherove with Vladimir Khorikov (Manning), chapter 12. Paraphrased; read the book for the full treatment.

Michael Feathers defines legacy code as code without tests. Age is irrelevant. Untested code resists change because you cannot tell whether an edit fixed a bug or created one. Your job as an agent is to add safety incrementally, not to "test the whole system" in one pass.

## Map before you pick a target

Before writing tests, inventory components you might touch. For each one, estimate three things qualitatively: how much branching and decision logic it contains, how many collaborators must be stubbed or replaced to run it in isolation, and how important it is to the product or the change at hand.

High logic with few collaborators is usually the sweet spot for early unit-level work. High logic buried behind many dependencies is expensive but often where the real defects hide. Simple data holders or thin wrappers may deserve little or no direct test effort unless a bug already lives there.

Common blockers include missing injection points, tight coupling, no time in the plan for cleanup, team habit, weak tooling, and sheer overwhelm. Naming the blocker for the component you chose helps you pick the next move instead of forcing a pattern that does not fit.

## Easy first versus hard first

Two portfolio strategies both have a case.

Starting with easier, high-value pieces builds momentum, spreads testing skill across the team, and shows progress early. The risk is that the gnarliest modules stay untested until schedule pressure peaks, and they may never get attention.

Starting with harder, dependency-heavy areas front-loads the painful refactors. Fixing shared dependencies once can unlock several components later, and effort per new test often drops as seams appear. The tradeoff is slow initial wins and a long path to the first green test, which suits teams that already test confidently.

Choose based on team experience and deadline shape. Revisit the choice as the codebase opens up.

## When unit tests are not feasible yet

If the design fights isolation, write broad tests at the outer boundary first. Exercise public entry points with realistic inputs and record what the system actually does today. Those characterization or approval-style tests are scaffolding: they lock in current behavior while you learn the code and while you reshape internals.

Prefer observable outcomes over internal structure. Integration-style tests that hit real files, databases, or HTTP may be slower and flakier, but they need less surgery up front and survive refactors better than tests tied to private fields. Accept environment cost where it buys a baseline of "still works."

Only after that net exists should you carve out smaller units. Tight unit tests written against a tangled design often cement the tangled design.

## Seams and the smallest safe change

Feathers' notion of a seam is any place behavior can vary without editing every call site: constructor parameters, method arguments, setters, extracted methods overridden in tests, or a narrow interface in front of a concrete type.

Your decision rule is minimal invasiveness. Introduce the thinnest seam that lets you substitute test doubles for I/O, time, or remote services. Avoid wholesale rewrites unless the change request truly requires them. Each seam should be justified by a test you are about to write or already need for the feature.

## Refactor first or test first?

If you can add a protective outer test quickly, test first: establish behavior, then refactor in small steps with that test green after each step.

If outer tests are blocked by environment or opaque wiring, you may need a tiny refactor purely to expose an entry point or inject a dependency, then immediately add the protective test before further edits. Never refactor wide areas without some executable check; the check can be coarse at first.

Work only on code paths related to the user's change. Let testability spread through normal maintenance rather than a big-bang cleanup.

## New code beside old code

While legacy remains, treat new modules as the standard you want tomorrow: test-driven or test-accompanied, clear seams, no copy-paste extension of untestable patterns. Route new behavior through new types when you can use a strangler-style split: parallel implementation, gradual traffic shift, delete dead paths when coverage proves they are unused.

Do not let fresh code inherit static globals, hidden singletons, or untestable constructors just because the neighbor class does.

## When the user asks you to add tests to legacy code

Align with the skill workflow, using this reference for strategy calls: map and prioritize the component under change; pick easy-first or hard-first for the wider effort if scope spills beyond one class; add outer characterization tests before deep refactors; open seams with the smallest edit that enables doubles; add focused tests for the behavior being changed; keep running the protective suite after every step.

Expect months of gradual improvement on a large estate. One new test on code that used to have none is a real win. Point the human to Feathers' *Working Effectively with Legacy Code* when they need exhaustive refactoring patterns beyond what a single change ticket requires.
