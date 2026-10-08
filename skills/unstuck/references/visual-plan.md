# Visual plan

A reference for the wiki produced by `unstuck`. The wiki itself is a live plan and
work queue; this file contains only its durable design and behaviour requirements.

## Borrow the useful parts of the 3D board

The inspiration is the `3d-experiments` board: `docs/board.md` and
`tools/board/web/` in that repository. If it is accessible, inspect its current
design before borrowing it. This skill does not require that checkout or its
server, database, models, or image-generation tools.

Carry these patterns across:

- Concept imagery beside the concrete item it explains.
- One focused task with guidance, alongside the work queue.
- Distinct work for the user and work for the agent.
- A visible sequence of completed, current and later steps.
- Task details that say where to act, what to do, what to inspect, and when to stop.
- References and deeper context one click away.

The reference board uses charcoal panels, warm gold selection, serif headings,
plain interface text and spacious imagery. Borrow that character when there is no
existing visual language to preserve. Do not reproduce its asset pipeline or turn
wiki-building into a second hobby project.

## First view

Use an existing graphical wiki or project frontend as the home for this view.
Extend its routes, components and storage instead of creating a competing app.
Use the bundled [template app](../template/README.md) only when that home is absent;
otherwise borrow its behaviour and adapt it to the host's architecture.

Show a short project heading, the recommended route in one sentence, and a visible
"Awaiting your go-ahead" state. Then show the three numbered experiment cards.

Each card's face contains:

| Element | What the user sees |
|---|---|
| Image | A relevant current screenshot, annotated detail, concept or diagram |
| Try | The concrete action and its owner |
| Learn | The question this action can answer |
| Unlock | The next move its result makes possible |
| State | Awaiting go-ahead, waiting on a dependency, in progress, awaiting your judgment, or concluded |

Use text labels as well as colour. Keep the first step visually distinct without
making the others unreadable. On a narrow screen, preserve order in a single
column. Selecting a card reveals its full scope, evidence criteria, stopping
boundary and result-dependent next actions.

Include a compact visual connection to the product: what is already usable, what
this experiment touches, and what could become possible. Do not use percentage
progress or an implied finish line unless a measured scope supports it. Three
cards are the next batch, not a measurement of all remaining work.

Put the wider plan behind a clearly named link or disclosure. It holds the
destination, the current setback and evidence, preserved capabilities, assumptions,
the proposed trade-off, alternatives, and later work. Avoid a wall of backlog on
the landing page.

## Images have a job

Choose assets by the decision: annotated screenshots for a visual mismatch, a
device-and-state diagram for a hardware interaction, readable caller examples and
a flow diagram for an API choice. Concept art can show the desired experience,
but must be labelled "Proposed" rather than presented as something already built.

Use existing project assets first. Make local SVG illustrations or rendered
diagrams when image generation is unavailable; do not leave broken placeholders.
Use external generation only through an available, permitted tool within an
authorised budget, with no private material sent to an unapproved service.
Keep asset provenance and useful alt text.

## Persistent queue and approval

Use the existing project queue if it can hold the experiment details and approval
state without starting workers. Record the actual IDs and link cards to them.
Creating these records must not trigger automatic execution.

Otherwise create a small project-local plan directory, by default
`docs/unstuck/`, using the template's `data/plan.json`, frontend entry point and
local assets.
Use another location if the repository defines one. Do not put changing task
status in `AGENTS.md`, `CLAUDE.md`, this skill, or a general reference document.

The plan record contains the goal, recommended route, evidence and assumptions,
approval state and scope, and the three next task IDs. Task records contain the
fields required by the skill, their dependency IDs, execution state, outcome,
evidence links, and result-dependent next actions. Keep approval separate from
outcome: an experiment can conclude usefully by refuting a hypothesis.

Render the cards from that stored queue, rather than maintaining an independent
hardcoded list. A generated static view is fine if its rebuild command reads the
queue and is run whenever the plan changes. Preserve past results when the next
batch replaces the current three cards. Reinvoking the skill resumes or revises
the existing plan instead of creating duplicate tasks.

Keep the UI read-only unless the project already has a reliable write mechanism.
Do not add a pretend "Start" button or browser-only status persistence. A copyable
instruction such as "Begin step U1 from this plan" is useful; copying it must not
execute anything. Chat remains the approval channel unless the user explicitly
chooses another.

## Delivery checks

Before handing over the wiki:

- Open the actual rendered page and inspect it at wide and narrow sizes.
- Check that exactly the three queued next steps appear with matching IDs,
  owners, order, dependency information and approval state.
- Open each card and the wider plan. Verify images and evidence links.
- Check keyboard navigation, focus indication, legible text, and image alt text.
- Reopen or reload from disk and confirm the queue survives the session.
- Confirm page load, card selection and copying an instruction do not run tasks.
- If serving locally, bind to loopback, verify the actual address responds, and
  provide its start command. Never claim a stopped preview is still live.

Follow existing frontend tests and tooling. Keep generated output inside the
chosen plan directory and do not overwrite an existing wiki, route or queue.
