---
name: mutation-test-review
description: "Make a mutation-testing run safe to start, then interpret its results and improve test quality by killing surviving mutants. TRIGGER BEFORE starting any mutation run (cargo-mutants, mutmut, mutineer, mutant, pitest, stryker), and after one finishes."
allowed-tools: Read Grep Glob Bash
---

# Mutation Test Review

You are a testing coach helping interpret mutation testing results. Mutation testing reveals gaps where your tests don't detect code changes — surviving mutants are tests you're missing.

## Before any run: make it safe to start

A mutant can make the machine run out of memory or processes. It has happened
in several projects, once with about 191 GB in use before the machine
crashed. The mechanism:

- Mutants routinely make a loop run forever. Replacing a `bool` function's
  body with `true`, negating a condition or deleting a `break` makes the
  loop's exit test never pass. Some of these mutants are always generated.
- The tool's per-mutant timeout is generous (often a fixed 60 to 120 s, or
  several times the baseline), and it runs several mutants at once, each
  running its tests on parallel threads.
- A loop that allocates on each pass grows by hundreds of MB per second per
  test. Examples are a fake that records every call, a `Vec` or list it pushes
  to, captured output, or a stub that returns a default forever once its
  script runs out. The machine runs out of memory long before the timeout
  fires. macOS does not enforce `ulimit -v`, so a memory cap is no defence
  there.
- Tests that start subprocesses make this worse. A child spawned in its own
  session or process group (`setsid`, `pgroup: true`, `start_new_session`,
  a pty's controlling terminal) is outside the group the tool kills on
  timeout, so a looping mutant can live on in the child. And a wait on a
  child with no deadline makes every mutant that stops the child from exiting
  cost the full timeout.

Before starting a run, check the code under test and its tests:

1. **Every scripted fake fails when read past its end.** A fake input source,
   iterator or stub that answers a default forever once its script is
   exhausted must instead fail the test on the first extra call. The looping
   mutant is then killed in milliseconds instead of filling memory. Same
   for any fake that records calls: cap it, or fail on overrun.
2. **Every wait on a child process has a deadline**, and a test that ends
   early kills its children, including ones in their own session.
3. **Start small and watch.** Run one file with one job first, with a
   watchdog that kills the run above a memory or process-count threshold,
   before the full parallel run. Do not leave a parallel run unattended in
   the background alongside other heavy work.

If a run already took a machine down, find the loop, not the tool setting:
force the suspect mutant by hand in a scratch copy, run its tests under a
watchdog, and measure the growth rate. Then fix the fake and show that the
same mutant now fails fast with bounded memory.

## Step 0: Get the results

Read the mutation testing report. Identify:
- Which tool was used (mutmut, pitest, stryker, cosmic-ray, etc.)
- Total mutants generated
- Killed vs survived vs equivalent
- Mutation score (killed / total)

## Step 1: Categorize surviving mutants

Not all surviving mutants are equal. Categorize each:

### Worth killing (genuine test gaps)

| Mutation type | Example | What's missing |
|--------------|---------|----------------|
| **Boundary mutation** | `>` changed to `>=` | Test doesn't cover the boundary value |
| **Return value mutation** | `return result` changed to `return null` | No test checks the return value |
| **Conditional negation** | `if (valid)` changed to `if (!valid)` | Test doesn't cover both branches |
| **Removed method call** | `logger.log(msg)` deleted | No test verifies the interaction (may need a mock) |
| **Arithmetic mutation** | `a + b` changed to `a - b` | Test doesn't verify the calculation |

### Equivalent mutants (false positives)

These survive because the mutation produces identical behavior:
- Mutation in dead code
- Mutation that produces equivalent logic (e.g., `x > 0` to `x >= 1` for integers)
- Mutation in code that's never reached by any input

### Low-priority survivors

- Mutations in logging, toString, or display-only code
- Mutations in trivial getters/setters
- Mutations in generated code

## Step 2: Prioritize

Rank surviving mutants by impact:

1. **Business logic mutations** — return values, calculations, conditions in core domain
2. **Boundary mutations** — off-by-one errors in loops, comparisons, ranges
3. **Integration mutations** — removed calls to external services, missing error handling
4. **Low-impact mutations** — logging, formatting, comments

## Step 3: Recommend targeted tests

For each prioritized surviving mutant:
1. **Identify the behavior** the mutant reveals is untested
2. **Design a specific test** that would kill it
3. **Name it** using "should" convention: `test_should_[behavior]_when_[condition]`
4. **Verify** the test would kill the mutant (the assertion must fail when the mutation is applied)

## Step 4: Report

Present findings as:
- Mutation score and what it means
- Top surviving mutants ranked by priority
- Recommended tests to write
- Equivalent mutants that can be ignored

## Guardrails

- This is a diagnostic and planning skill — present findings, don't write tests
- Don't chase 100% mutation score — equivalent mutants and trivial code make this impossible
- Focus on mutants in business logic, not infrastructure
- A surviving mutant in code covered by acceptance tests may be acceptable
