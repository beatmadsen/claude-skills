---
name: defect-fix
description: "Fix a defect the way a feature is built: reproduce it under the reporter's conditions, find the real mechanism, pin it in a test watched going red for the defect's reason, then fix and see it gone. TRIGGER before explaining, diagnosing or fixing any failure: a bug report, a red test, gate or CI run, an error in a log, something wrong on a screen or a rig, a regression you tripped over, or a user saying something is broken. Also TRIGGER when you catch yourself about to call a failure flaky, a race, timing, a cold cache, or pre-existing."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Defect Fix

A defect is fixed under the same discipline as a feature, whatever turned it up: a manual run, a screenshot, a rig session, a report from the user, a regression you tripped over. Two things have to be proven, and only a committed test proves either: that the fault reproduces, and that your change is what removed it. "I checked and it works now" is the claim this skill exists to refuse, because the next person inherits your word for it instead of a check.

For an intermittent failure, also read the `flaky-test-fix` skill for its catalogue of mechanisms. For the shape of the regression test, read `test-writing`.

## Step 1: See it happen, under the reporter's conditions

- A reported failure is fixed only when you have seen it happen and then seen it gone, under the reporter's own conditions. A divergence from spec, a plausible mechanism, or a real bug found nearby is a finding, not the failure you were asked about. Fix it, but do not let it close the report.
- Capture the real system's own account first (a log, one instrumented run) and let it pick the hypothesis. A reproduction built from your hypothesis proves the mechanism *can* happen, not that it *did*.
- The variable that matters is often the starting state, and fixtures default to the comfortable one.
- Reproduce in the context that failed. An isolated re-run can hide a full-suite failure.

## Step 2: Find the mechanism, not a story

The global CLAUDE.md's Empiricism rules apply throughout: measure rather than argue, and treat an inference as a hypothesis until a direct measurement backs it.

- Never reach for "flaky", "timing", "a race", "cold cache" as a cause. That is the cosmic radiation class of explanation, and it is a recognisable shape rather than an answer.
- A cause that contradicts a known capability is self-refuting. Discard it.
- A reproducible failure is findable, so find it rather than narrating it away. A plausible story is where the search starts, not where it ends.
- Concluding from what you do not know is the tell. When you catch yourself, design the measurement instead.

## Step 3: Pin it in a failing test

- The failing test comes first. Watch it fail for the reason the defect names, and only then edit production code.
- Finding it by hand is reconnaissance, not the red step. A scratch script, a one-off probe, an instrumented run, a screenshot: those tell you what to assert. The assertion still has to land in a test you watched go red and then green, in the suite, committed with the fix.
- Pin the behaviour at the level that decides it rather than the level you happened to notice it at. A fault seen on a screen or on the rig is usually a unit's fault, and the high-level sighting is how you found it, not where the standing proof belongs. Where the fault really is in the wiring, that is where the test goes.
- A regression test is not exempt from test design. It states one behaviour, it is named for that behaviour, and it must be able to fail again for the same reason later.

## Step 4: Fix the cause, then see it gone

- Root cause over symptom. Fix it, or fix the infrastructure. Never silence it: a disabled test, a removed assertion, and a widened matcher are not tools for making a suite green.
- Re-run under the reporter's conditions and in the full suite, cold, and read the run count.
- A fix that does not change the failure rate refutes its diagnosis. Do not stack a second patch on the same theory; go back to Step 2 and instrument the mechanism directly.

## Guardrails

- A fix shipped without its test is unproven twice over: nothing shows the fault was real as described, and nothing stops it coming back.
- "It is pre-existing", "it is not my regression", "it predates this branch" are reasons the fix is safe, never reasons to skip it.
- A diagnosis you did not act on is a deferral. Diagnosis is the first half of the work.
