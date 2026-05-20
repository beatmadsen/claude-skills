---
name: review-test-quality
description: "Gateway skill for reviewing the quality of existing tests in a git diff and suggesting improvements. Read this BEFORE answering any request to evaluate, review, audit, or critique test quality. TRIGGER phrases include: 'how good are these tests', 'review my tests', 'are these tests good', 'can the tests be improved', 'evaluate test quality', 'review test quality', 'audit my tests', 'check my tests', 'are my tests well written'. Scope: tests in the current local git diff against a base branch. For PR-scoped review use pr-review-tests instead. For writing new tests use test-writing instead."
allowed-tools: Read Grep Glob Bash
---

# Review Test Quality Gateway

Read this skill BEFORE producing any test-quality review. It coordinates dispatch to specialized skills so the review is grounded, not freeform pattern-matching.

## When to use

Use when the user asks for an opinion on the quality of *existing* tests in their local git diff — typically before a PR exists, while iterating on a branch.

Do **not** use when:
- The user is writing new tests → use `test-writing`
- The tests are in an open PR and the question is about coverage gaps or duplicates → use `pr-review-tests`
- The user wants a PR-wide review briefing → use `pr-review-prep`

## Step 1: Determine the diff scope

Identify which tests to review.

1. Detect the default base branch:
   ```bash
   git symbolic-ref refs/remotes/origin/HEAD --short 2>/dev/null
   ```
   This returns something like `origin/main`. Strip the `origin/` prefix.

2. If detection fails or returns nothing, ask the user which base branch to compare against (offer `main` and `master` as common defaults).

3. List changed test files:
   ```bash
   git diff <base>...HEAD --name-only
   ```
   Filter to test files matching: `*Test.*`, `*Tests.*`, `*Spec.*`, `*.test.*`, `*.spec.*`, or under `src/test/`, `__tests__/`, `test/`, `tests/`.

If there are no test files in the diff, tell the user and stop. Don't invent a review.

## Step 2: Quick analysis pass

Before loading any sub-skill, do a fast pre-scan of the changed test files to identify which specialized skills are relevant. This avoids loading every skill upfront.

Read each changed test file once. Note the presence of these signals:

| Signal observed | Sub-skill to load later |
|---|---|
| Any test file present | `test-smell` (always) |
| `mock`, `mockk`, `Mockito`, `jest.mock`, `MagicMock`, `@MockBean`, `every {`, `when(...)` | `mock-audit` (always when present) |
| `Thread.sleep`, `delay(`, `setTimeout`, `await new Promise`, retry/poll loops, time-dependent assertions, `@Flaky` | `flaky-test-fix` |
| Only one test level present (e.g. only unit tests for a clearly cross-component change), or production code clearly missing integration tests | `test-strategy` |
| User's request explicitly mentions "improve", "improvement", "refactor", "cleaner", "better", "rewrite" | `test-refactor` |
| User explicitly mentions "flaky", "intermittent", "timing" | `flaky-test-fix` |
| User explicitly mentions "right level of test", "test pyramid", "should this be unit or integration" | `test-strategy` |

## Step 3: Load the relevant sub-skills

Read the SKILL.md files identified in Step 2, in this order:

1. `test-smell` (always)
2. `mock-audit` (if mocks present)
3. `flaky-test-fix` (if flakiness signals or explicit mention)
4. `test-strategy` (if test-level concerns or explicit mention)
5. `test-refactor` (if user asked about improvement)

These live in `~/.claude/skills/<name>/SKILL.md`.

Do not duplicate their content into your review — apply their guidance to the actual files.

## Step 4: Apply the skills to the files

For each changed test file:
1. Read the full file (not just the diff) so you can judge naming, structure, and duplication in context.
2. Read the production code under test (the corresponding non-test file) so you can judge whether the test exercises the right behaviour at the right level.
3. Apply the loaded skills' diagnostics. Be specific — cite line numbers and quote test names.

## Step 5: Produce the review

Output **freeform prose**, not a fixed-template report. Tailor the structure to what you actually found. Some reviews will have one major issue worth a paragraph; others will have a list of small smells. Don't pad with empty sections.

What every review should include:

- **An honest verdict.** Lead with whether the tests are good, mixed, or weak. The user's rule is "tell me something I need to know even if I don't want to hear it" — don't soften the assessment.
- **Specific evidence.** Cite test names and line numbers using code references. No vague claims like "the mocking could be improved" — say *which* test, *which* mock, and *why*.
- **Prioritized recommendations.** If there are multiple issues, rank them. Distinguish "this is broken/risky" from "this is stylistic preference."
- **What's good.** If something is genuinely well done (clean naming, good fakes over mocks, parameterized over duplicated, etc.), say so. The user is calibrating skills, not just collecting criticism.

What to avoid:

- Restating the diff back to the user.
- Generic test-smell taxonomy lectures — apply the skills, don't quote them.
- Long preamble before the verdict.
- Pretending coverage analysis (gaps/duplicates against existing tests) is in scope. That's `pr-review-tests`. If a coverage gap is glaringly obvious, mention it briefly and note that `pr-review-tests` is the right tool for a thorough gap analysis.

## Step 6: Self-check before responding

- [ ] Did I read the actual test files (not just the diff)?
- [ ] Did I read the production code each test covers?
- [ ] Did I load `test-smell` at minimum?
- [ ] Did I load `mock-audit` if there are mocks?
- [ ] Are my critiques tied to specific test names / line numbers?
- [ ] Did I lead with a verdict, not preamble?
- [ ] Did I acknowledge what's good, not only what's wrong?
