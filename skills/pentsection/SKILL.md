---
name: pentsection
description: "Settle a matter of taste by building five candidates at once, rendering them, and letting the human keep one or two per round until the question is answered. For decisions judged by looking rather than by passing a test: visual and interaction design, vocabulary and API shape, layout, naming and prose, the readable shape of an implementation. TRIGGER when the user asks to explore options, compare approaches, see alternatives, iterate on a design, says they will know it when they see it, asks for variations to choose from, or gives a direction (\"more colour\", \"make it obvious what to click\") without saying what it should look like. For text-only idea fan-out with nothing built, use ideation-mob instead."
allowed-tools: Read Write Edit Bash Glob Grep
---

# Pentsection

Deciding by building and looking, five at a time, round after round.

One proposal iterated is a random walk. Each step starts from wherever the last one
landed, and the person judging can only say yes or no to a whole. Five candidates
rendered side by side make the judgement attributable: they differ in known ways, so
the pick carries a reason with it.

Rendering is not optional and it is not a screenshot of your intentions. You need a
way to produce the artefact and perceive it, which usually means driving a real tool
from Bash (a headless browser for a page, the typesetter for a document, the compiler
and the suite for code) and then reading the result back. Where the artefact is text,
as it is for code, the text together with what it does is the artefact and reading it
is legitimate; what is never legitimate is judging your own account of a candidate. If
you cannot render the thing, this method does not apply to it yet, so build the
rendering first.

## When this fits

The question is a matter of judgement, the human will recognise the answer on sight,
and neither of you can specify it in advance.

A direction is not a specification. "Glyphs should play a role", "make it obvious what
to click", "channel management belongs on the left" are all steers, and each one is a
reason to run a round asking *how*, not a reason to skip the round. What disqualifies
the method is a decided answer, a test that settles it, or constraints that already
determine the outcome. Building five of something already specified is theatre.

## Before round one: the rig

Two parties have to see the candidates and both need serving.

- **One address.** The round under judgement lives at a fixed, stable location the
  human can return to without being handed a new path. The current round is at that
  fixed path; each superseded round keeps a path carrying its number, and the current
  one links to them. That is not politeness, it frees all five slots: last round's
  anchors are one click away instead of costing two of the five.
- **Stable numbering, visible in the artefact.** The candidate labelled 3 in your
  report must be labelled 3 on the page. The human's whole reply is often "3 and 4".
- **A base every candidate composes through.** Shared content, shared data, one
  statement of every decision already made. Never a fork per candidate.
- **A renderer you can re-run in one command,** and which derives what it captures
  from what actually rendered rather than from a parallel list you have to maintain.
- **Equal fidelity, chosen as the lowest that can decide this round's question.**
  Unequal fidelity measures polish instead of the variable.

`references/media.md` covers what rendering and driving mean per medium.
`references/worked-round.md` is one complete round, end to end, if you want the shape
before you build one.

## The round

1. **State the round's question in one sentence.** Not "improve the card" but "which of
   these words is the reader meant to touch". A round with no question produces five
   variations of nothing.
2. **Decide what state the question lives in, and build the shot for it.** A question
   about undoing cannot be judged on an artefact where nothing has been done. Expect to
   extend the renderer most rounds.
3. **Choose five and write each one's claim before building it.** One sentence: what it
   bets and what it costs. A candidate with no claim is a tweak.
4. **Build all five over the base.**
5. **Render, and drive.** Most candidates hide half of themselves at rest.
   `references/media.md` says what both mean for the medium you are in.
6. **Verify the variable is actually on screen,** by the rule "Confirm the variable
   rendered" below. This is the step that gets skipped and the one that invalidates
   rounds.
7. **Fix what you find, re-render, then judge.**
8. **Report:** what each candidate did, your own read, and the findings the round
   produced. Then ask for picks, and for a steer.
9. **Fold the picks into the base, re-render, and check the result is what the round
   said it chose.** Folding is a measurement, not bookkeeping.
10. **Record the findings and commit the round** with its question in the message.

Step 8 is the one place in a round where you wait, and waiting there is the procedure
rather than a stall, so it needs no apology. It is not licence to stop: while the answer
is outstanding, carry on with anything that does not depend on it. Nor does it extend to
the rest of the round. The round's question, the fidelity, and a steer you have restated
are all yours to settle and act on without confirmation, and pausing at any of them is
the deferral this exemption is not.

Building the next round speculatively on the likely outcome is allowed but is not
independent work, because it bets on the answer. The bet has a price. The fold at step 9
changes the base, so speculative candidates have to be rebuilt over the folded base
before they can be judged, and one discarded before the pick was never committed, so
nothing keeps it.

On an unattended run, pick, say plainly that you picked and on what evidence, and mark
the fold provisional so that one message can reverse it. Unattended means there is no
user for this session at all, such as a scheduled run or a subagent working alone. A
user who is merely slow to answer is not unattended, and you wait for them however long
it takes, because picking on the human's behalf is the one act in this method that can
corrupt a search without anyone noticing.

## Choosing the five

- **One is the control.** The current state, rendered in the same run, never
  remembered. Its job is to keep "better than what" out of memory.
- **Two vary one thing between them.** A pair differing in a single dimension, a line
  against a ground, a step against a chooser, is what makes a preference attributable.
  Five candidates that each change everything produce a winner and no reason.
- **One or two are outliers on an axis nobody has tested.** The record argues for them
  better than fairness does: labelled noise wins often enough to pay for itself, and an
  outlier that loses badly maps an edge you can then stop wondering about. A
  search that only interpolates between winners converges on whatever was nearest the
  first guess.
- **Label the noise as noise** in the candidate's own claim, so the human can tell a
  probe from a serious offer.
- **Ship four when the fifth will not build.** The outlier is the likeliest to turn out
  infeasible. Say which one is missing and why, and do not quietly substitute a safe
  candidate in its place, because the set was chosen for its spread.

Keep including outliers as the search narrows, rather than dropping them once it feels
settled. The last round is exactly where you are most likely to be polishing the wrong
thing.

## The steer

The picks are half of what the human gives you. The other half is a sentence of
direction, and it shapes the search more than any pick does.

- Ask for one every round, and always when you cannot name the next round's
  question from the picks alone.
- A steer names the next round's variable, and everything else holds still. If the
  steer is colour, hold the layout and move the colour. Applying a steer to all five
  candidates at once is normal and correct.
- A steer can be several constraints at once, all of which must hold while one thing
  varies. Restate them in your next message so the human can catch a misreading, and
  keep building; restating is not a question and does not wait for an answer.
- A steer can be a re-description rather than a choice, revealing that the request was
  misnamed rather than choosing within it. Do not build another round on the old
  reading, and do not stop to ask which reading was meant either. Say in your report
  that the request has changed shape, name the reading you are now working from, and
  make the competing readings the next round. Five built candidates are a better
  question than a sentence asking one, and naming the new reading gives the human the
  same chance to correct you that asking would have.
- When one word turns out to name several questions, split it. Give each reading
  its own candidate rather than averaging them into one.
- A steer that contradicts a decision already folded in cannot simply be applied,
  because applying it means unfolding. Say so, re-open that axis as the round's variable, and
  do not quietly carry both the old decision and the new direction.

## From one round to the next

- **A double pick whose members differ in more than one way forces an isolation
  round.** Liking both says nothing about which difference did the work, so the next
  round changes exactly one of them per candidate.
- **The human picking nothing means the question was wrong or the spread too narrow.**
  Re-ask the question. Five more of the same is the failure mode.
- **The human picking all five means the axis did not matter.** Fold nothing, drop the
  axis, move on.
- **A pick against your recommendation is the most valuable result the method
  produces.** Do not re-argue it. Fold it, then design the next round to find out what
  you were wrong about, because your model of the human's taste has just been corrected.

## The rules the record actually taught

- Confirm the variable rendered before judging. A candidate judged against a defect
  invalidates the round, which is worse than the candidate losing unfairly, and when
  the thing under test is subtle you have to measure rather than look. In the search
  this came from, a card's one signal that a value was editable never rendered at all,
  and ten rounds of judgement happened without it.
- The stage can lie about the candidate. When a harness will not let a design be
  itself, the candidate loses for the wrong reason, so change the harness mid-search
  rather than marking the candidate down. Judge at more than one size, because the
  disagreement between the sizes is the finding.
- A candidate that needs the base to change is a signal, not a cost. Extend the base
  with a seam that states a fact, and let each candidate decide what the fact means.
  Never fork the base to accommodate one candidate.
- Scope shared machinery by the names the mechanism itself defines, never by the
  candidate that introduced it, or it silently loses its behaviour the first time a
  later round adopts it.
- Check the fault is not upstream of what you are fixing. Four candidate ways of
  undoing a mistake were built before a render showed that the mistake was made by the
  action being undone, which no undo design could have improved.

## Recording

Two records, never mixed.

Each round is a commit whose message says what it was testing and why each candidate
was in it. That is where losing candidates live once they are off disk, which is why
deleting them later costs nothing.

Separately, a findings file, and it is the thing that outlives the search. Write what
the renders decided as rules that will still be true when these candidates are
forgotten, not as a record of what was picked. Findings compound across rounds;
candidates do not. Findings often arrive as defects, so when something renders wrong,
ask what general fact made it wrong before fixing it.

## Ending

A search ends when it runs out of questions, or when the human stops it. Do not expect
convergence, and do not read agreement into it: in the search this came from, every
round's pick went against the agent's recommendation at least once.

When it ends, fold the last decision in, delete the rig, and keep the findings. Leaving
five competing statements of a question that now has an answer is worse than leaving
none, and the history holds them if anyone wants to look.

## What goes wrong

- Five variations of one idea. No spread, so the pick means nothing.
- Judging from your own account of a candidate, or from a diff you never built and ran.
- Judging a candidate whose variable never made it onto the screen.
- Asking the human an open question instead of showing them five answers. If you catch
  yourself writing "would you prefer A or B", build A, B and three others.
- Reporting only your recommendation, or arguing with the pick that contradicts it.
- Converging early because two candidates were good.
