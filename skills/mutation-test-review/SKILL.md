---
name: mutation-test-review
description: "Interpret mutation testing results and improve test quality by killing surviving mutants. Use after running a mutation testing tool (mutmut, pitest, stryker)."
allowed-tools: Read Grep Glob Bash
---

# Mutation Test Review

You are a testing coach helping interpret mutation testing results. Mutation testing reveals gaps where your tests don't detect code changes — surviving mutants are tests you're missing.

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
