# Unstuck board template

Reference and operating instructions for a local, read-only experiment board.

## Choose the home first

If the project already has a graphical wiki, board or project frontend, extend
that application. Borrow the experiment cards, focused task details, wider-plan
view and approval boundary from this template, adapting them to the host's
components, navigation and persistent queue. Do not create a second application
or parallel backlog. In `3d-experiments`, this means extending its existing board.

Only copy this template when the project has no graphical home. Copy into a new
project-local directory such as `docs/unstuck/`, excluding `node_modules/`,
`test-results/` and `playwright-report/`. Never overwrite an existing directory.
The installed skill's template remains an example; project-specific work belongs
in the project.

## Open

From the copied directory:

```sh
python3 -m http.server 7791 --bind 127.0.0.1
```

Open `http://127.0.0.1:7791`. Choose an unused port if necessary. Serve only this
directory, not the repository root. Python 3 serves static files; it cannot
execute the queued tasks. No package installation or build is needed to view
the app. Opening `index.html` as a file cannot load the JSON via browser fetch.

## Make it specific

Edit `data/plan.json`, then reload the page. It is read on each load without a
cached plan response. The example describes a visual-design setback; replace
every assumption, claim, step and image before handing it to the user.

| Field | Purpose |
|---|---|
| `example` | Keep true until the example content is replaced; shows a visible banner |
| `project`, `title`, `route` | Project identity, heading and recommended approach |
| `approval`, `approvalScope` | Visible permission state and the exact authorised scope |
| `goal`, `obstacle` | Original experience and the concrete setback |
| `preserved`, `assumptions`, `alternatives` | Arrays of short statements, grounded in the actual project |
| `evidence` | Links with `label` and `href`; prefer project-local evidence |
| `next` | Exactly three distinct task IDs, in display order |
| `tasks` | Current and previous experiment records, with unique stable IDs |

Each task has `title`, `owner`, `state`, `try`, `learn`, `unlock`, `dependsOn`,
`image`, `details`, `outcomes`, `result` and `evidence`. Use simple identifiers
such as `U1`; `focus` and `wider-plan` are reserved navigation IDs. Dependencies
refer to task IDs. `details` and `outcomes` are arrays of `{label, text}` records.
Include deliverable, evidence criteria, stopping boundary and undo in details;
include supported, refuted and inconclusive branches in outcomes.

An image has `src`, `alt`, and a visible `label` identifying concept vs current
artefact. The bundled SVGs are original schematic illustrations of the example
experiments, not screenshots or evidence of progress. Replace them with relevant
local imagery, diagrams or concepts, recording provenance in the evidence links.

Keep task records when they leave `next`; their results appear under previous
experiments. Update state, result and evidence after an authorised experiment.
Approval is separate from task completion. Viewing a card, changing a URL hash
or selecting the handoff text grants no permission and writes nothing to disk.
The agent edits the saved JSON; there is no browser-only queue state.

Adapt the app as well as its content when the problem calls for it. For a hardware
constraint, replace screen-comparison art with a device-state diagram. For an API
decision, make room for readable caller examples. Change the composition, palette
or task detail layout to serve the concrete project, keeping three next moves
prominent and the larger plan secondary.

## Files to iterate on

- `app/board.js`, `app/layout/` and `app/views/`: page composition and task views.
- `app/styles/`: colour, typography, card layout and responsive detail views.
- `app/selection.js`: task deep links and wider-plan navigation.
- `app/lib/`: escaped text, safe links and queue integrity checks.
- `assets/`: local illustrations and other project media.
- `data/plan.json`: persistent plan and work queue.

If integrating into an existing application, use its queue as the persistent
record instead. Adapt these views to that record; do not maintain a second JSON
copy by hand. Use the host's tests and build process.

## Check changes

For a standalone copy, use Node.js 22 or later, Python 3 and Chromium:

```sh
npm ci
npx playwright install chromium
npm test
```

The default command runs both unit checks and real-browser tests. Browser tests
start their own loopback server on port 7792 and stop it afterwards. They never
reuse an existing server. Preview the page at wide and narrow sizes after visual
changes, and check the actual images, details, evidence links and permission state.
When replacing the example scenario, update its expected titles and task IDs in
the tests too. Preserve the tests of persistence, data loading, permission
boundaries and navigation rather than removing them to accommodate new content.
