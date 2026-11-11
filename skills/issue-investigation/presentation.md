# Presenting the investigation

All prose here is external. Apply the `external-writing` skill.

## In chat, while working

- Lead with what you found, in a sentence or two.
- Give the junior-engineer explanation of each bug in a few bullets: what is stored, what should happen, what actually happens, and the result.
- Say which parts are measured, which are read in code and which are inferred, and what is still open.

## Splitting into tickets

One ticket per fix, not per finding. A typical split:

- **Root cause:** the code defect that creates the bad data.
- **Tooling:** a defect in the repair or admin endpoint that the bad data breaks.
- **Customer repair:** the one-off run that fixes harmed customers. It is blocked by the tooling ticket.
- **Latent defect:** a real path with no production hits yet.

Check whether an open ticket already covers each one. Link to it instead of duplicating.

## Ticket fields

Type, summary prefix, parent and labels follow the team's conventions, which the organisation-specific skill names. Two rules hold everywhere:

- Make the summary state the defect, not the symptom.
- Propose a priority with a reason. Highest for harm happening to paying customers now, or for whatever blocks that repair. Next for growing damage that is not harming customers directly. Lowest for latent defects.

## Description template (about one page)

```markdown
## Summary

<Two to four sentences a manager who missed the investigation can follow:
what goes wrong, for whom, how often, and what it has already caused.>

Proposed priority <level>. <One sentence justifying it.>

## Hypothesis

<The mechanism in two or three sentences, and the fix direction.>

Expected behaviour, from the [<doc>](<url>) (<section>): "<exact quote>".

## Evidence

Code, `main` at [<short sha>](<commit url>). [<File> lines a to b](<permalink>) <does what>:

<code block with the real lines, not a paraphrase>

<Example rows: a table of three real cases joining the sources, with IDs but
no user IDs.>

<One or two sentences with the population numbers.>

Queries and the full breakdown are in the comments.

## Done when

* <Behaviour pinned by a test that fails on today's code.>
* <Data or customer repair verified by a named check.>
```

Put everything else in comments: the queries (with links to the tables), method notes, full breakdowns, caveats and lower bounds, open questions, and any option you rejected with the reason.

## Evidence rules

- Code: quote the actual lines, leaving out log statements if you need the space. Link to a permalink pinned to the commit, so the line numbers stay correct after `main` moves, and check that the commit exists on the remote (on GitHub, `gh api repos/<owner>/<repo>/commits/<sha>`).
- Data: example rows, not only counts.
- Cross-source claims: a table of example correlations (for example the log time, the business ID, the old and new parent record, each record's status).
- Tables: link warehouse tables to their page in the data catalog.
- Ticket keys: make every mention a browse link.
- Jira drops the link from link text that is in code format. Use plain link text such as `[OrderProcessor.kt lines 53 to 62](...)`.
- Re-read each claim against the code before posting. A rejected option needs the reason that is actually true in code, not the first plausible one.

## Tracker mechanics

- Write descriptions in markdown where the tracker's API accepts it. Edit a comment in place rather than adding a correction.
- Formal links, not only mentions: "split" from the original, "blocks" from tooling to the repair, "causes" from the root cause to the tooling, "relates" for the prior tickets mentioned in the text. Create one link, check which way it reads on the issue, then create the rest.
- Setting a list field such as labels usually replaces the whole list, so send every value.
- Fetch each ticket after editing and check the links, labels and rendered links.

## Closing the original

Transition it to done with a comment that lists the successor tickets, one line each, and names any loose end no ticket tracks.

## Cross-team write-up

When the fix belongs to another team, write one markdown document for them in the investigation folder:

1. Opening: what was reported, by whom, and the example customer.
2. A short list that defines each system and ID type used, once.
3. Facts: the reported case as a timeline table, then further recent cases with every ID the other team needs to look them up (trace IDs in full, their user IDs, any partner's IDs), then the volume table.
4. Analysis: where the flow stops, what the other team's committed code shows (see "Another team's code" in SKILL.md), and why your own service behaves as it does.
5. Conclusion: whose remit it is and why, then numbered suggestions for that team.
6. Open questions, sources, and the main query.

Rules for this document:

- It is internal and for debugging, so include the user IDs the other team needs. Mark it as containing personal data in the folder's `MANIFEST.txt`.
- Name systems and teams. No "we", "us" or "our": write your team's or service's name.
- Leave out open questions about your own service that do not bear on the root cause. Keep the facts themselves in the document.

## Support handover

For the support person who raises the request, write about four plain sentences in the first person ("I"): what was found, in non-technical words, the scale, and which team to contact on which channel, with the write-up attached.

## Chat channels

Slack and similar tools cannot display markdown tables. Post a bullet list: the linked key, the priority, and one sentence each.
