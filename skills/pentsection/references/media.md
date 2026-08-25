# Rendering and driving, by medium

Rendering means producing the artefact and perceiving it. Driving means exercising it
into the state a hand puts it in. Neither is reading the source, and neither is reading
your own description of the candidate.

**An honest caveat about this file.** Only the interface row below has actually been
practised at length. The rest is extrapolation from the same principles and should be
treated as a starting point to be corrected by the first round you run in that medium.
If a row turns out to be wrong, fix it here.

## Interface, page, screen (earned)

Render by serving the real thing and screenshotting it in a headless browser. Drive it:
hover, focus, open, type into it, put it into the state the round's question lives in,
and shoot again. Add a close-up pass at 2x or 3x cropped to one component, because a
full-page view cannot decide a hairline and a downscaled screenshot lies about weight.
Shoot at more than one width, including the narrowest the thing must survive.

Expect to extend the shooter most rounds. A question about editing needs a shot with a
caret in a field; a question about undoing needs a shot where something has been undone.

Three faults recur in this medium and each one cost a round in the search this came
from.

**Measure a hairline, do not look at it.** When the variable is a one-pixel rule or a
few percent of alpha, a page screenshot cannot settle it. Read the computed value, shoot
a close-up at 3x, probe the pixel. A field underline that never rendered at all survived
ten rounds of judgement because everyone was looking at whole pages.

**Scope a mechanism's styling by the class names it defines, never by the column that
introduced it.** A rule written `.v-mark .take` loses the mark's size the moment a later
round adopts that mechanism as its base, and the loss is silent: the page still renders,
just wrongly. The base's own name shares that namespace, so naming a column after the
sheets it loads can collide with the classes those sheets define. A base named `span`
put the class `span` on every column, and the sheet drawing a 62px field laid out every
column as a 62px box.

**A glyph that works in one setting is not evidence it works in this one.** A mark's
floor is the size below which it stops reading as what it is, and that floor is set by
its surroundings as much as by its dimensions. Icons drawn for a 24px interface row read
as a filled block at 17px beside serif text. Redraw with fewer strokes rather than
scaling.

## Naming, vocabulary, wording (close to earned)

Render by setting the candidate in the place it will actually be read: in the sentence,
in the error message, in the signature, at its real length. A name judged in a list of
names is judged in a context it will never appear in.

Drive it by using it: write the three call sites, the two awkward cases, the sentence
where it reads worst. For prose, vary one opening or one passage across the five rather
than writing five whole drafts, which is an order of magnitude of work for a decision
about one paragraph.

## The readable shape of an implementation

The artefact is the code, so reading it is legitimate rendering; what is forbidden is
judging from a description of it. Render by writing out the call sites as they read
under each variant, five versions of the same caller in one file where they can be
compared without switching context.

Drive it by adding the change the design was supposed to make easy, and by running the
suite. Do not put each candidate on its own branch: five branches is five addresses,
which breaks the one-address rule, and it fights a trunk-based history. One file, five
sections, or five directories under one throwaway parent.

## Algorithms and data structures

Only the taste-shaped part belongs here. Speed and correctness are settled by
measurement and tests, and if that is the whole question this method does not apply.
What it can decide is how an implementation reads, what it makes easy to change, and
what shape its failures have.

Render as the section above does, by writing the callers out side by side, because how
it reads and what it makes easy to change are the two parts taste decides. Do not render
by showing the outputs together: five correct implementations of one algorithm agree on
good input, so that comparison shows nothing.

Drive with the degenerate and adversarial cases, empty and one and enormous and hostile.
The finding is in how differently the five behave at the edges, and in what each one
would cost to fix when it breaks there.

## Documents, reports, forms, filings

Render by producing the finished page, not the template. Drive by filling it with the
extremes of the data it must hold: the longest name, the missing field, the year with
thirteen entries, the number that needs a footnote. A layout that only works on the
sample data is the standard failure.

## Data models and interfaces

Render by writing out the calls and the stored shape. Drive by encoding the case that
broke the last design, and by writing the migration or the adapter each candidate would
need. A model is judged by what it makes impossible to say wrong.
