---
name: pr-review
description: Review a colleague's pull request the way Erik does. Builds context from related Jira tickets, epics and Confluence pages, looks for bugs, finds structural improvements against Erik's coding and test standards, checks claims made in the code against their sources, and reports to Erik in a form that makes the review quick. Then judges how much confidence the tests give (probing them with deliberate mutations in an isolated worktree) and reports that as a follow-up. Then drafts inline comments in a polite, evidence-based voice, shows each draft for approval, and posts only approved comments to GitHub. Use when the user asks to review a PR, look at a pull request, give feedback on a colleague's changes, or draft, post or edit PR comments.
---

# PR Review

Two phases with a hard gate between them. Phase 1 is analysis for Erik, in conversation. Phase 2 is comments for the author, on GitHub. Nothing reaches GitHub without Erik approving that exact text.

## Stance

- The author owns the change and usually knows the domain better than we do. Erik's standards describe his ideal, and he accepts differences in the author's style. Use the standards to find the few improvements that count, not to grade conformance.
- Candid with Erik, courteous with the author. In conversation, lead with the verdict and say the uncomfortable thing. In comments, state the same facts as a peer would.
- Every claim needs evidence: a line, a test run, a quoted source. Without evidence it becomes a question, or it is dropped.
- Help the change succeed on its own terms. Don't defend the code it replaces.

## Phase 1: Analysis

Commands, MCP tools and repo quirks are in [tooling.md](tooling.md). All code reading happens in an isolated worktree of the PR branch. Mutations run in a second worktree, so the reading worktree never contains mutated code. Both are removed at the end.

```
- [ ] 1. Context
- [ ] 2. Functional soundness
- [ ] 3. Structure
- [ ] 4. Claims against sources
- [ ] 5. Report to Erik
- [ ] 6. Test coverage (follow-up report)
```

Mutation runs can take a long time, so test coverage comes last. Erik reads the report while it runs, and gets the coverage findings as a follow-up. Go straight on to step 6 after the report, without waiting for a reply.

1. **Context.** Help Erik understand what we're changing, why, and what we're hoping to achieve. Sources: the PR (description, commits, checks, existing comments), linked tickets with their epics, related tickets and comments, linked and related Confluence pages, and earlier PRs on the same ticket. Note what's missing as well as what's there. What this step finds is what "intended" means in the steps that follow. Consult `ticket-briefing`, where available, for following evidence outwards from a ticket, and `intent-record` (read side) when the repo keeps intent records.

2. **Functional soundness.** Does the code look like it works as intended, or are there obvious or subtle bugs? Read whole files, not hunks. Follow inputs and outputs to their callers and consumers, including anything persisted or published, and look at edge cases, error paths and concurrency. Where the change says it leaves something untouched, check that as well. Map the blast radius: for each significant change to a public interface or shared contract (API, message or event, persisted schema, shared library type), find who depends on it outside the PR, in this repo and in other repos across the organisation. Skip this for internal edits. Consult `spring-jvm` for JVM and Spring semantics, and `contract-test` when the change crosses a boundary between services.

3. **Structure.** Can the code be structured differently to make it easier to change over time, while still doing what we want it to do? Measure with `coding-standards` and `spring-jvm`, citing counts, and look beyond the counts at responsibilities, coupling, cohesion and naming. Keep the five improvements with the largest payoff, drop matters of taste, prefer suggestions that work with the direction of the change, and work out a concrete sketch for each. Note where suggestions depend on each other.

4. **Claims against sources.** Where code comments, the PR description or commit messages explain a constraint or a decision, is the claim substantiated? Check it against tickets, documents, the code itself, or the documentation of the library or service involved. Apply the same bar to what we intend to say: an unsourced statement about intent or plans becomes a question.

5. **Report to Erik.** Erik reviews a lot of work, so the report should make reviewing this PR quick. Leave out anything that doesn't change what he'd do. In this order:
   - Nature and background, in three to five plain sentences: what's changing, why, what it hopes to achieve, with links to sources, and any context that was missing.
   - Verdict, in one or two sentences: can it go in as it is, and if not, what stands in the way.
   - Blast radius: the modules and services outside the PR that depend on what changed, or "none significant".
   - What needs his attention, ranked, each with file, line and evidence: bugs and risks, and unsubstantiated claims.
   - Up to five structural improvements, ranked, each citing the standard and count it breaks.
   - What was checked and found fine, in a line or two, so he can skip it.
   - That test coverage follows, with the behaviours about to be probed.

6. **Test coverage.** Can we be confident about this change, and are there good, easy ways to get more confidence? Judge confidence by evidence, not by reading the tests: for the behaviours that count, deliberate small mutations against the narrowest test selection show whether the tests would notice a break. Read the tests to choose the mutations, then run them one at a time so each result is attributable. Coverage gate results add to the picture. Look for cheap ways to raise confidence: a missing case, a test at a better level, a contract or property test. Consult `review-test-quality` and the skills it routes to, `mutation-test-review` before running mutations, `test-strategy` for test levels, and `property-test` or `contract-test` where they fit. Report as a short follow-up:
   - Which mutations survived, which were killed, and which didn't compile (those prove nothing; say so rather than counting them as killed).
   - Gaps in confidence, ranked, each with the surviving mutation that shows it and a cheap way to close it.
   - Whether this changes the verdict.

   Then remove both worktrees.

## Phase 2: Comments

Raise categories in this order, each as its own round with Erik: bugs and unsubstantiated claims, then test coverage, then structure.

1. Before the first draft, read `external-writing` (PR comments are external writing) and [comment-voice.md](comment-voice.md).
2. For each category, propose the plan first: which comments, on which lines, saying what.
3. Draft one comment at a time. Show the exact text that would be posted, the target file and lines, and short notes on choices Erik may want to change.
4. Post only after explicit approval of that comment ("post it", "go ahead", "good to go"). Approving one comment never approves the next.
5. Post and edit following [posting.md](posting.md), verifying the head SHA and the target line content first.
6. When Erik adds a rule mid-review, apply it to the remaining drafts and check the comments already posted for the same problem. Propose edits; apply them on approval.

After the last comment, list everything posted with links, say what was deliberately not raised, and remind Erik that his review state stays blank until he submits a review himself.

## Never

- Post, edit, approve, request changes or submit a review without Erik's explicit go-ahead.
- Write to Jira or Confluence. Stakeholder systems are read-only in this skill.
- Use the AskQuestion tool. State assumptions and proceed.
- Pile on. Past roughly seven comments, drop the weakest.
- Modify Erik's working tree or leave either worktree behind.
