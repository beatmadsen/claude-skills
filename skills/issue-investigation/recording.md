# Recording the findings

What a finding contains, how to show the evidence, and how to write it for each place it can go. Anything that leaves the conversation is external writing: apply the `external-writing` skill.

## In chat, while working

- Lead with what you found, in a sentence or two.
- Give the junior-engineer explanation of each bug in a few bullets: what is stored, what should happen, what actually happens, and the result.
- Say which parts are measured, which are read in code and which are inferred, and what is still open.

## One entry per fix

Group findings by the fix each needs, not by what you observed. A typical split:

- **Root cause:** the code defect that creates the bad data.
- **Tooling:** a defect in the repair or admin endpoint that the bad data breaks.
- **Data repair:** the one-off run that fixes harmed users. It waits for the tooling fix.
- **Latent defect:** a real path with no production hits yet.

## The record

Whatever the destination, each entry carries the same parts. Scale them to it: a commit body gets a few lines of each, a ticket about a page.

```markdown
## Summary

<Two to four sentences someone who missed the investigation can follow:
what goes wrong, for whom, how often, and what it has already caused.>

## Mechanism

<The mechanism in two or three sentences, and the fix direction.>

Expected behaviour, from the [<doc>](<url>) (<section>): "<exact quote>".

## Evidence

Code, `main` at [<short sha>](<commit url>). [<File> lines a to b](<permalink>) <does what>:

<code block with the real lines, not a paraphrase>

<Example rows: a table of three real cases joining the sources, with IDs but
no user IDs.>

<One or two sentences with the population numbers, and which are lower bounds.>

## Done when

* <Behaviour pinned by a test that fails on today's code.>
* <Data repair verified by a named check.>
```

Keep the queries, method notes, full breakdowns, caveats and rejected options next to the record but out of its body: in ticket comments, in the evidence backup, or in the tome capture.

## Evidence rules

- Code: quote the actual lines, leaving out log statements if you need the space. Link to a permalink pinned to the commit, so the line numbers stay correct after `main` moves, and check that the commit exists on the remote (on GitHub, `gh api repos/<owner>/<repo>/commits/<sha>`).
- Data: example rows, not only counts.
- Cross-source claims: a table of example correlations (for example the log time, the business ID, the old and new parent record, each record's status).
- Tables: link warehouse tables to their page in the data catalog.
- Re-read each claim against the code before recording it. A rejected option needs the reason that is actually true in code, not the first plausible one.

## When you fix it now

The record splits across the places that outlive the session:

- The regression test pins the mechanism (see `defect-fix`).
- The commit message says what changed. The intent record carries the summary, mechanism, expected behaviour, the evidence in brief, and what was ruled out.
- Data repair and latent defects you do not fix in the same session still need a home that someone will see: the tracker, if the project has one.

## As tickets for your own team

- One ticket per fix. Check whether an open ticket already covers each one, and link to it instead of duplicating.
- Make the summary state the defect, not the symptom.
- Propose a priority with a reason, in the summary section. Highest for harm happening to paying users now, or for whatever blocks that repair. Next for growing damage that is not harming users directly. Lowest for latent defects.
- Formal links between the tickets, not only mentions: from the original to its successors, from the tooling fix to the repair it blocks, from the root cause to the tooling it breaks, and to prior tickets mentioned in the text.
- Fetch each ticket after editing and check that links, labels and rendering came out as intended.

Type, labels, parent and link names follow the team's conventions, which the organisation-specific skill names.

## As a write-up for another team

When the fix belongs to another team, write one markdown document for them in the evidence folder:

1. Opening: what was reported, by whom, and the example user.
2. A short list that defines each system and ID type used, once.
3. Facts: the reported case as a timeline table, then further recent cases with every ID the other team needs to look them up (trace IDs in full, their user IDs, any partner's IDs), then the volume table.
4. Analysis: where the flow stops, what the other team's committed code shows (see "Another team's code" in SKILL.md), and why your own service behaves as it does.
5. Conclusion: whose remit it is and why, then numbered suggestions for that team.
6. Open questions, sources, and the main query.

Rules for this document:

- It is internal and for debugging, so include the user IDs the other team needs. Mark it as containing personal data in the folder's `MANIFEST.txt`.
- Name systems and teams. No "we", "us" or "our": write your team's or service's name.
- Leave out open questions about your own service that do not bear on the root cause. Keep the facts themselves in the document.

For the support person who raises the request with that team, write about four plain sentences in the first person ("I"): what was found, in non-technical words, the scale, and which team to contact on which channel, with the write-up attached.

## Chat channels

Slack and similar tools cannot display markdown tables. Post a bullet list: the link, the priority, and one sentence each.
