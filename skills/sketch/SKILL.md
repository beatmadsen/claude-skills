---
name: sketch
description: "Explain a feature, a flow, an architecture or a change by drawing it the way a colleague would with pen and paper: wobbly boxes and arrows, simple symbols for people, databases and documents, phone screens, and the data moving between steps as small documents. The drawing is a thinking aid, not a design, so it does not invite pixel feedback. TRIGGER when the user asks to sketch, draw, diagram or picture how something works or what a change does; when explaining which service decides what, how data travels through a pipeline, or what a user sees before and after a change; and when a few boxes and arrows would explain faster than prose. Not for charts of data, polished diagrams for publication, or mockups to be judged on looks."
---

# Sketch

Draw like a colleague explaining something at a desk with pen and paper. The sketch exists to make one thing clear to the reader in a minute; it is read in a chat column, so it is small, and everything in it is either true or labelled as illustrative.

## Before drawing

- Draw from the source, not from memory. Service names, field names, budgets, exit codes and outcomes in a sketch are claims: read each one in the code, the design or the document first. In a repository, read the main branch, not a stale working copy.
- Words you make up, such as screen copy or example ids, are illustrative. Say so in the description and in the text beside the sketch.
- Choose the sections the question needs from the list below, usually two or three, each with a title and a one-line subtitle.

## What to draw

- **A user flow**: the screens the user sees, in order, and what they tap. Use a phone frame unless the feature lives on TV or the web, and then a wider frame drawn the same way. A backend-only change gets boxes and arrows, no screens.
- **A change**: before and after in one frame. The before row, then the after row under it, with the screens or steps in the same order, so the difference is all that stands out. Mark what goes away in red in the before row and leave it out of the after row. Draw what is new in blue in the after row. Leave out what stays the same unless the flow needs it.
- **An architecture**: the actors, services and stores a request passes through, left to right, then what each reader does with the result.
- **Who decides**: a row of boxes from the actor to the service that decides, the deciding service with a thicker border. Under it, the decision as a tree of dashed question boxes down to the rule applied, each leaf tagged with what it means ("same as today", "new", "exit 0").
- **Data moving along an arrow**: a small sheet with a folded corner sitting on the arrow, smaller than the boxes on either side. The type's name heads it above a thin rule, and under it the few fields that matter, named as the code names them, nested at most two deep, lists marked `[ ]`. A field a step adds is blue and marked "new". After a step that decides without changing the data, the sheet says only "unchanged". Data going both ways gets two arrows, each with its own sheet.

Then:

- At most three screens or large boxes in a row. Three phones with two arrows take about 590px of a 736px chat column, and a fourth overflows it. Merge or drop, or continue on a second row.
- Draw a thing as its simple symbol when it has one, not as a labelled box: a person as a stick figure, a database as stacked cylinders, a log or an append-only record as a ledger, a report, list or file as a sheet with a folded corner, a message as an envelope, a display as a screen on a stand. Name the symbol under it. Boxes are for services, steps and questions.
- Number the steps in the captions ("1 partner app", "2 confirmation"). Keep labels short. A scrawled note may say why something is there ("many drop off here"), in six words or fewer.
- No sentences or legends inside the drawing.

## Ink

- One ink for everything. Red only for what goes away or is a problem. Blue only for what is new. Grey for secondary text. Nothing else gets a colour.
- A new element on a screen, such as a button or a note, is drawn in blue on paper: blue outline and blue text, never a filled shape.
- Pair every colour with words ("new", "goes", "problem: ..."), so the sketch also reads in black and white.

## Build it

Copy the `<style>` block and the markup patterns from one of the examples and rename the root id:

- [examples/architecture-agent-tome.html](examples/architecture-agent-tome.html): stick figure, data both ways on one link, database, ledgers, a nested who-decides tree.
- [examples/architecture-fun-ci.html](examples/architecture-fun-ci.html): a frame around parallel steps, data sheets on two arrows, a branching tree of readers, screen symbol, a who-decides tree whose red leaf is a problem.

Both carry the same style block, which also holds the classes for phone screens, buttons, new notes and envelopes that neither example uses. Their content is drawn from the two gems' code and is not a source for anything else. [references/construction.md](references/construction.md) has the measurements, the markup for each element, and the narrow-width and encoding rules.

Start the fragment with one `vis-sr-only` paragraph that describes the whole sketch in plain sentences, including what is illustrative. It is what a screen reader reads, and what shows as text when the file is opened outside the chat.

## Check it

Render it before anyone sees it, and look at every render yourself:

```bash
uv run --with playwright python <skill>/scripts/render.py sketch.html sketch.png
uv run --with playwright python <skill>/scripts/render.py sketch.html sketch-narrow.png --width 360
uv run --with playwright python <skill>/scripts/render.py sketch.html sketch-dark.png --dark
```

The script exits 1 when the sketch is wider than the width. Check that nothing overlaps, that arrows meet what they point at, that the narrow layout stacks in reading order, and that every claim in the drawing matches what you read. Save each re-render under a new file name before viewing it, because an image viewer can show a stale copy of a file overwritten in place.

## Show it

- Where the host renders HTML fragments inline, as Cursor does through its built-in `visualize` skill, publish the fragment that way; the sketch counts as a mockup there, which is what allows its own palette, font and sizes.
- Elsewhere, show the PNG at 736px as an image, and keep the HTML beside it.
- Beside the sketch, write "In short" in three or four lines (before, after, who decides, the rule, as the sketch needs), then what is solid and what is not: invented wording, inferred placements, what was checked in code and what comes only from a document, each cited.

A drawing kept for sharing need not fit a chat column. Lay a pipeline or a long flow out in one row, as wide as it needs, rather than wrapping it into a tall drawing: give its root `width:max-content` and no container queries, render it at that width, and show the PNG. To check a very wide image with a fresh reader, hand over slices about 1400px wide; given one image several thousand pixels wide, a reader invents labels.
