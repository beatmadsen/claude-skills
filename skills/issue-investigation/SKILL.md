---
name: issue-investigation
description: "Investigate a reported defect or data problem in a running service: read the report, docs and deployed code, state competing hypotheses with what would disprove each, measure mechanism, occurrence, current state and user harm in the source that answers each, cross-check sources record by record, size the harm, back up the evidence, and record the findings where the next person will find them. Then act on them: fix now while the context is fresh, or hand over as tickets or a write-up when the setting calls for it. TRIGGER when picking up an investigation or spike, when asked whether a reported bug still happens, how many users it affects, or what the ground truth is in production data. Not for live outages, where restoring service comes first."
---

# Issue Investigation

Turn a reported problem into measured findings, record them, and act on them. The report's own explanation is a hypothesis, not a fact. In practice the trigger it names, the classes it blames and the scope it claims are often out of date by the time anyone looks.

The global CLAUDE.md's Grounding, Empiricism and "Distrust of the green" rules apply throughout. This skill is how they play out when the evidence sits in production logs, a data warehouse and a primary data store rather than in a test suite. It pays off where there is a running system with data; for a defect with no production evidence to gather, `defect-fix` alone covers it.

Read [sources.md](sources.md) before the first query. Read [recording.md](recording.md) before writing up findings, together with the `external-writing` skill for anything that leaves the conversation.

An organisation-specific skill can layer on top of this one. It names the concrete log indexes, tables, roles, and whether findings become tickets for a team; this skill supplies the method.

## Workflow

```
- [ ] 1. Read before measuring
- [ ] 2. Write competing hypotheses, each with what would disprove it
- [ ] 3. Measure: mechanism, occurrence, state, harm
- [ ] 4. Cross-check sources record by record
- [ ] 5. Size severity and harm
- [ ] 6. Back up the evidence
- [ ] 7. Record the findings
- [ ] 8. Act on them: fix now, or hand over
```

### 1. Read before measuring

- The report, anything it links, and the discussion on it. Use `ticket-briefing`, where available, when the domain is unfamiliar.
- The document that states expected behaviour. Keep the exact quote: it becomes the "expected behaviour" line in the findings.
- The code **at the version running in production**, not your branch. Check that the classes the report names still exist, and read `git log` for fixes made since it was filed.
- Look for earlier work on the same mechanism (tracker, git history, `tome-lookup`) before calling anything new. Earlier cleanups often fixed the data without fixing the cause, and remediation work gets marked done without the run happening.

### 2. Hypotheses

Write the report's claim plus at least one rival. For each, note the mechanism (code path), the observable signature (log line, row shape, audit action), the source that can measure it, and **the observation that would disprove it**. A check that both readings predict the same way confirms nothing.

Keep these four questions separate. Each has its own source:

| Question | Typical source |
| --- | --- |
| Mechanism: can it happen? | Code at the production version |
| Occurrence: does it happen, how often, on which flow? | Logs (recent days), warehouse (history) |
| State: is the bad data there now? | The primary data store |
| Harm: did a user or partner receive something wrong? | Audit events, outbound messages, user records |

### 3. Measure

Rules that apply to every source:

- Read only. Ask the user before starting any production login or browser auth flow, and say which role and why.
- Services along one flow often log by different identifiers. When you start from one ID (a user) and a service logs another (a subscription, an order), translate it in the warehouse first, then search the logs by the translated IDs and by trace ID across every index on the flow.
- Start from aggregates and full counts. Never treat a sample as the total.
- Compute derived figures (rates, shares, sums) in the query, not by eye.
- An absence counts only beside a positive control. Before writing "service X never received it", run the same search on a successful case and show X appears there. Every absence claim also names its search scope (which repositories, indexes, window).
- Check that each match really is the signature you meant: read a few raw hits before trusting a count.
- Label every claim in chat as measured, read in code, or inferred.
- When a number moves under you, find out why before you go on. If an earlier figure was a query artefact, say so plainly and replace it.

#### Another team's code

When the failure sits in another team's service, read its code at a pinned commit; other teams' repositories are often readable inside the organisation. A short time box is enough to confirm the mechanism behind the log lines.

- State what the committed code does as fact, with permalinks.
- State how it behaves in production as your reading, for that team to confirm. Name what the code cannot show: deployed versions, production config, other writers of the same records, manual or scheduled repairs, the contract with any external partner.
- Offer a fix direction as an option, with the reason it might be unsafe.

### 4. Cross-check

Join sources by a shared ID, not by matching daily totals. Before trusting a warehouse signature for history, check it against the logs for the overlapping days. Explain every row that is missing on either side. That is how ingest gaps and retention limits surface.

### 5. Severity and harm

- How often, starting when, and growing or not.
- Who is harmed now, how badly, and for how long. A paying user who has lost access outranks a large but inert data backlog.
- A path with zero production hits is still a defect if its outcome is severe. Say so rather than inflating it.
- State lower bounds and why they are lower bounds (single region, retention window, data gap).
- Follow the harm to the repair tooling: a bug that breaks the remediation endpoint has to be fixed before the remediation can run.

### 6. Back up the evidence

Logs are often kept for only days, and large scans are worth not repeating. Copy queries, scripts and exports to a folder per investigation, outside any git repository and readable only by you (`chmod 700`), with a `MANIFEST.txt` that says where each file came from, when, and which files contain personal data. Rerun the analysis from the backup once to prove it works.

### 7. Record the findings

Lead the chat summary with the finding, then follow [recording.md](recording.md): the finding, the evidence, what is measured versus inferred, what is still open, and one entry per fix needed (not per observation).

Where the record goes depends on what happens next, never into a findings document in the repository (see `document-hygiene`):

- Fixed now: the regression test is the standing proof, and the commit message and intent record carry the mechanism and the evidence.
- Handed to your own team: tickets, one per fix.
- Handed to another team: a cross-team write-up.

In every case, run `tome-capture`, where available, with the mechanism, the measured numbers and the source pitfalls you hit. A new trap that will recur also goes into the source notes: its general form into this skill's [sources.md](sources.md), the concrete table, index or field into the organisation-specific skill. If the investigation started from a ticket, close it pointing to where the findings went, naming any loose end nothing tracks.

### 8. Act on them

The default is to fix now, while you still hold the context: each fix in code you own goes through `defect-fix`. The investigation has already done that skill's first two steps against the real system, so it starts from the failing test.

Hand over instead when:

- the team grooms work before scheduling it (the organisation-specific skill says so),
- the fix belongs to another team, or
- the request asked for findings only.

Repairing data that is already wrong is a write to production. It is never done under this skill; it needs its own plan and the owner's approval.

## Safety

- Never write to production data stores. Use only their read operations (describe, query, get, and a rate-limited scan).
- Use the warehouse's read-only query path where it has one. Never put the raw request or response payloads of audit events in shared output: they carry personal data and sometimes credentials.
- Keep user IDs out of tickets, commits, chat and knowledge bases by default. Business IDs (order, subscription, fulfillment) are fine. Log exports contain real user IDs: they stay local. An internal write-up handed to another team for debugging includes the user IDs it needs, marked as internal (see [recording.md](recording.md)).
- Never print cookies, tokens or auth headers.
