# One round, worked

A real round from the search this method came from, compressed. The subject was a card
listing what a MIDI instrument does with each of its sixteen channels. Three rounds had
already settled how a value is chosen and how it is named.

## The question

"Which of these words is the reader meant to touch, and which are only there to read?"

It came from a steer. The human had said the card was "so subtle it is not clear what to
click", which named the variable: the mark that separates a control from writing.
Everything else held still.

## The rig

One stylesheet per candidate plus a shared base, a page that loads all five side by side
from a list of candidate definitions, and one command that serves the directory and
drives a headless browser over it. The current round is at `forms/index.html`; earlier
rounds keep `?set=1` through `?set=7` and are linked from the head of the page, which
names the round in that round's own words. Each column carries its number where the
human can see it, so a reply of "3 and 5" is unambiguous.

## The five, with their claims

1. **As it stands.** The control. A hairline under what you set, a dashed line under
   what you click. Costs nothing and teaches nothing: both are marks you have to know
   about already.
2. **Ink and wash.** No mark at all: the underlines come off and contrast does the work.
   What you can act on keeps the ink and the grammar washes back. Costs the reader the
   grammar, which goes faint enough to be hard to read at a glance.
3. **The blanks of a form.** Every value sits in a tinted inlay, the word that cycles
   gets the inlay's edge instead of its fill, and the computed range-end gets nothing.
   Costs the page its calm: seven boxes to a line.
4. **A mark on every handle.** The writing is untouched and each control gets a small
   drawing hung off it. The opposite trade from the wash, nothing dimmed and something
   added, and it costs one mark per value on a line that holds five.
5. **Reading, and writing.** *Noise, and labelled as such in the report.* At rest not
   one mark anywhere, and a nib on the header turns every control on at once. Costs a
   mode, which is a thing to discover and a thing to forget you are in.

Note the shape: one control, two that differ in a single dimension (2 and 3 mark the
same fact, one by contrast and one by ground), one that inverts the trade, one probe.

## The state the question lives in

Resting shots could not settle it, because two of the five show nothing until a hand is
near. The renderer gained a pass that hovers a row, puts a caret in a field, and shoots
again, plus a 3x close-up of a single row, because the difference between candidates 1
and 2 is a hairline that a full-page screenshot cannot resolve.

## What the render caught before judging

Three faults, all fixed and re-rendered first: the wash was stealing a colour that
carried meaning, a value's mark sat outside the inlay so that "# 86" read as two things,
and one candidate's base sheet was never linked, so it had been rendering without the
naming decided two rounds earlier.

## The findings

Written as rules, not as a result.

- Contrast says "this matters", not "this can be touched". Prominence and operability
  are different facts and the second one needs its own mark.
- A per-value mark multiplies. A line holds five values, so a mark on each is five
  marks, where the same fact said once per line costs one.
- The computed end of a range is the test case for every scheme: two identical-looking
  halves that behave differently, and whether a candidate's marking caught that is how
  you tell marking-for-meaning from marking-for-decoration.

## The report

Sent as a message, not a file. Shortened here, but this is its shape.

> Round three is up, refresh the page. Choosing rather than typing is settled and folded
> in, so the variable is how the card separates what you act on from what you only read.
>
> **1 As it stands** is the control and still needs you to know the marks are there.
> **2 Ink and wash** is the best-looking card in the set and it taught me something
> against itself: contrast says "this matters", not "this can be touched". **3 The
> blanks of a form** is the only one that is unambiguous about the computed range-end,
> and it is seven boxes to a line. **4 A mark on every handle** lost, and confirmed a
> round-two finding with a second shape: a per-value mark multiplies. **5 Reading, and
> writing** was in the set as noise. It is the clearest of the five, because a mode can
> afford heavy marking, and it costs a state you have to find and can forget you are in.
>
> Three faults were fixed before judging: [list]. Shots are at [paths]; look at
> `zoom-3-inkwash.png` next to `forms-3-working-working.png`, which is the real choice.
>
> Which go into round four, and is there a direction you want it to take?

Note what the report does. It gives a read on every candidate including a verdict on the
agent's own recommendation, it names the findings rather than only the winner, it points
at the two shots that carry the decision instead of all seventeen, and it asks for both
the picks and a steer.

## The pick

The human replied "5", choosing the labelled noise over the agent's recommendation. The
mode was folded into the base, and the next round asked what a mode has to get right,
which is a question that did not exist before the pick.
