---
name: issue-investigation
description: "Structure an investigation as a chain of reasoning from the evidence: what were the facts, what do they mean, what must we do. Works the same on a single stdout dump as on data spread across production logs, a warehouse and data stores: read the report and the code that produced the evidence, state competing hypotheses with what would disprove each, gather and cross-check facts with commands that reproduce them, test the hypotheses against the facts, size the harm, then record the chain and act on it, fixing now by default or handing over when the setting calls for it. TRIGGER when asked to investigate a reported problem, establish what actually happened, make sense of a log or an output, decide whether a bug still happens or how many users it affects, or pick up an investigation or spike. Not for live outages, where restoring service comes first."
---

# Issue Investigation

An investigation is a chain of reasoning: what were the facts, what do they mean, what must we do. This skill keeps the three apart and keeps each link backed by the one before it, whether the evidence is one stdout dump or data spread across a dozen systems. The report's own explanation is a hypothesis, not a fact. In practice the trigger it names, the classes it blames and the scope it claims are often out of date by the time anyone looks.

The global CLAUDE.md's Grounding, Empiricism and "Distrust of the green" rules apply throughout. This skill is the order to apply them in.

Read [recording.md](recording.md) before writing up, together with the `external-writing` skill for anything that leaves the conversation. When the evidence is spread across production logs, a warehouse or a data store, read [sources.md](sources.md) before the first query.

An organisation-specific skill can layer on top of this one. It names the concrete sources, roles and conventions, and says what happens to findings there; this skill supplies the method.

## The chain

- **Facts:** what was observed, each with its source and the command or query that reproduces it.
- **Analysis:** what the facts mean. Every claim points at the facts it rests on. Hypotheses live here, and so does what the code implies about the run you are explaining.
- **Conclusion:** what must be done, and by whom. Every item points at the analysis that requires it.

A claim that cannot point back down the chain is either a fact still to fetch or a guess to label as one. Label every statement, in chat and in every record, as measured, read in code, or inferred, so a reader can check each link without redoing the investigation. What the committed code does is a fact, but it reads best quoted where the analysis uses it, labelled as read in code.

## Workflow

```
- [ ] 1. Read the report and its context
- [ ] 2. Write competing hypotheses, each with what would disprove it
- [ ] 3. Facts: gather the evidence
- [ ] 4. Facts: cross-check the sources
- [ ] 5. Analysis: test the hypotheses, trace the mechanism, size the harm
- [ ] 6. Back up the evidence
- [ ] 7. Record the chain
- [ ] 8. Act on the conclusion: fix now, or hand over
```

Hypotheses come before the facts because they decide which facts are worth gathering and what would rule each one out. They are judged only in step 5, and only against facts.

### 1. Read the report and its context

- The report, anything it links, and the discussion on it. Use `ticket-briefing`, where available, when the domain is unfamiliar.
- The document that states expected behaviour. Keep the exact quote: it is a fact, and the record will need it.
- The code **at the version that produced the evidence**, not your branch. Check that the classes the report names still exist, and read `git log` for fixes made since it was filed.
- Earlier work on the same mechanism (tracker, git history, `tome-lookup`). Earlier cleanups often fixed the data without fixing the cause, and remediation work gets marked done without the run happening.

### 2. Hypotheses

Write the report's claim plus at least one rival. For each, note the mechanism (code path), the observable signature (output line, row shape, audit action), the source that can show it, and **the observation that would disprove it**. A check that both readings predict the same way confirms nothing.

### 3. Gather the facts

The facts have to answer four separate questions. In a small case one output can answer several; in a distributed one each usually has its own source:

| Question | Where the facts are |
| --- | --- |
| Mechanism: can it happen? | Code at the version that produced the evidence |
| Occurrence: does it happen, how often, since when, on which path? | Output and logs (recent), warehouse (history) |
| State: is the bad data there now? | Whatever stores it |
| Harm: did a user or partner receive something wrong? | Audit events, outbound messages, user records |

Rules for gathering:

- Know what produced the evidence: version, config, input, environment and time window. Evidence from another build or environment than the one reported is a different case.
- Read only. Ask the user before starting any production login or browser auth flow, and say which role and why.
- Start from the whole: full counts and aggregates, the full output rather than its tail. Never treat a sample as the total.
- Compute derived figures (rates, shares, sums) in a query or script, not by eye.
- Read raw entries before trusting a count, to check each match is the signature you meant.
- In a cascade, find the earliest anomaly. Later errors are often consequences of the first.
- An absence counts only beside a positive control. Before writing "X never happened", run the same search on a case where X did happen and show it appears. Every absence claim also names its search scope (which files, indexes, repositories, window).
- Services along one flow often log by different identifiers. Translate the ID you start from into the ones each service logs, and follow trace IDs across every source on the flow.
- Keep the command or query next to each fact, so it can be rerun.
- When a number moves under you, find out why before you go on. If an earlier figure was an artefact of the query, say so plainly and replace it.

### 4. Cross-check the sources

With several sources, join them by a shared ID, not by matching totals, and explain every record that is missing on either side; that is how ingest gaps and retention limits surface. With a single output, check it against the code: the lines the code would emit on the path you claim should all be there, in order.

### 5. Analysis

- Take each hypothesis to its disproving observation and say which facts ruled it out. A hypothesis survives only when a fact that could have killed it did not.
- Trace the surviving mechanism through the code, citing lines at the version that produced the evidence.
- Severity and harm: how often, starting when, growing or not; who is harmed now, how badly and for how long. A paying user who has lost access outranks a large but inert data backlog. A path with zero hits is still a defect if its outcome is severe; say so rather than inflating it.
- State lower bounds and why they are lower bounds (one region, a retention window, a data gap).
- Follow the harm to the repair tooling: a bug that breaks the remediation path has to be fixed before the remediation can run.
- Say what is still open, and which fact would close it.

#### Another team's code

When the failure sits in another team's service, read its code at a pinned commit; other teams' repositories are often readable inside the organisation. A short time box is enough to confirm the mechanism behind the output.

- What the committed code does is a fact; state it with permalinks.
- How it behaves in production is analysis; state it as your reading, for that team to confirm. Name what the code cannot show: deployed versions, production config, other writers of the same records, manual or scheduled repairs, the contract with any external partner.
- Offer a fix direction as an option, with the reason it might be unsafe.

### 6. Back up the evidence

Evidence that will not come back (logs past retention, a one-off run, a scan you do not want to repeat) gets saved outside any git repository, beside the commands that produced it. Scale this to the evidence: a saved output file and a note of the command can be enough. Production exports go in a folder per investigation readable only by you (`chmod 700`), with a `MANIFEST.txt` that says where each file came from, when, and which files contain personal data. Rerun the analysis from the backup once to prove it works.

### 7. Record the chain

Lead the chat summary with the finding, then follow [recording.md](recording.md): facts, analysis and conclusion, one entry per fix needed (not per observation).

Where the record goes depends on what happens next, never into a findings document in the repository (see `document-hygiene`):

- Fixed now: the regression test is the standing proof, and the commit message and intent record carry the chain.
- Handed to your own team: tickets, one per fix.
- Handed to another team: a write-up.

In every case, run `tome-capture`, where available, with the mechanism, the measured numbers and the source pitfalls you hit. A new trap that will recur also goes into the source notes: its general form into this skill's [sources.md](sources.md), the concrete table, index or field into the organisation-specific skill. If the investigation started from a ticket, close it pointing to where the findings went, naming any loose end nothing tracks.

### 8. Act on the conclusion

The default is to fix now, while you still hold the context: each fix in code you own goes through `defect-fix`. The investigation has already done that skill's first two steps, so it starts from the failing test.

Hand over instead when:

- the team grooms work before scheduling it (the organisation-specific skill says so),
- the fix belongs to another team, or
- the request asked for findings only.

Repairing data that is already wrong is a write to production. It is never done under this skill; it needs its own plan and the owner's approval.

## Safety

- Never write to production data stores. Use only their read operations (describe, query, get, and a rate-limited scan).
- Use the warehouse's read-only query path where it has one. Never put the raw request or response payloads of audit events in shared output: they carry personal data and sometimes credentials.
- Keep user IDs out of tickets, commits, chat and knowledge bases by default. Business IDs (order, subscription, fulfillment) are fine. Exports from production contain real user IDs: they stay local. An internal write-up handed to another team for debugging includes the user IDs it needs, marked as internal (see [recording.md](recording.md)).
- Never print cookies, tokens or auth headers.
