---
name: unstuck
description: "Get a stalled project moving again when a setback has drained the user's motivation: disappointing visuals, an awkward platform constraint, an API that never feels right, or doubt about finishing. Inspect the actual obstacle, recommend a small experiment-led route, and build a visual wiki with the next three steps in a persistent work queue. Preserve what excited the user, even if that means proposing a smaller or different product. Prepare the plan autonomously, then wait for the user to say begin. TRIGGER on 'get me unstuck', 'I've lost motivation', 'I'm about to abandon this', 'this is almost finished but', or a request to put a project setback in perspective."
---

# Unstuck

A procedure for turning a discouraging project setback into a visual plan the user
can return to when ready.

Take responsibility for finding a route worth trying. Keep the explanation short,
make the next actions tangible, and let the user decide when work begins.

## The contract

Deliver a working visual wiki and a persistent work queue, with exactly three next
steps prominent. Each step says what we will try, what we will learn, and what the
result unlocks. The larger plan exists, but stays behind those steps.

**Preparing is authorised; executing the queued work is not.** Inspect existing
evidence, write the plan, create its illustrations, build and check the wiki, then
stop. Do not start a queued experiment, change the product, launch workers or
schedule execution until the user explicitly says to begin. Viewing the wiki,
selecting a card, or expressing enthusiasm is not that instruction.

This pause is part of the procedure, including under otherwise autonomous working
instructions. No clarification interview is required. Use the conversation and
project evidence; label assumptions and give the user something concrete to inspect.

## 1. Recover the project the user wanted

Read the repository's instructions, design documents, existing queue, recent
history, and relevant prior conversation. Inspect the current artefact when it is
available. Read narrowly around the setback rather than auditing the whole project.

Establish:

- The experience or capability that originally excited the user.
- The setback in their own terms, without dismissing it as merely perceived.
- What already exists and can survive a change of approach.
- The constraint that a useful outcome must preserve.

Separate observed behaviour, the user's judgment, and untested explanations. A
working feature can be demonstrated; liking its appearance cannot be established by
a passing test. If you cannot inspect the artefact, say what evidence is missing and
make obtaining it part of the queue.

Do not tell the user they are 99% done because that is how the situation feels.
Name the useful pieces already present and the specific unresolved decision.
Three next steps are a route to information, not a promise that the product is
three steps from completion.

## 2. Make the setback specific

Find the smallest question whose answer would change what we do next. Distinguish
the observed setback from any technical defect found nearby.

| Kind of obstacle | Useful way to narrow it |
|---|---|
| Visual disappointment | Inspect the actual screen or render. Isolate a visible choice to compare while preserving the working behaviour. The user judges appeal. |
| Platform or hardware constraint | Separate observed device behaviour, documented platform limits, and approval uncertainty. Identify a supported route worth checking. |
| API or design dissatisfaction | Read real caller examples. Identify which operation feels awkward and compare concrete usage rather than arguing about abstractions. |
| Missing prerequisite | Verify what is actually unavailable. Look for a substitute, reduced scope, or another delivery route that preserves the desired experience. |
| Several overlapping worries | Identify which unanswered question prevents a useful next move. Keep the rest visible in the wider plan without making them all today's work. |

Use current primary sources for platform or policy claims. Invoke `tome-lookup`
before research and `tome-capture` for reusable findings when those skills are
available. A policy interpretation is not a guarantee of approval.

Prefer existing logs, screenshots, code and documented constraints during
preparation. If settling a hypothesis requires a new product experiment, queue it
rather than running it under the name of diagnosis.

## 3. Recommend a route

Consider a direct repair, a workaround, and a smaller or different product where
useful. Choose the route that best preserves the original excitement while making
the next uncertainty testable. Do not turn this into an exhaustive options exercise.

For the recommended route, state what remains, what changes, and what is given up.
A substitute is only near-identical if its user-visible differences have been
examined. A reduced product is a proposal, not permission to remove features.

Put the reasoning and credible alternatives in the wiki. In conversation, give a
short framing such as:

> We can keep [observed working capability]. The open question is [specific
> uncertainty]. I've laid out a route around it; the first three steps test
> [approach] before we commit to it.

Be willing to say the original route is blocked. Never turn uncertain evidence into
certainty to sound encouraging. If no credible route is available, say so and make
the next steps resolve a named unknown, check an adjacent outcome, or preserve the
usable work for a deliberate pause. Do not manufacture busywork.

## 4. Queue the next three steps

Choose small, bounded actions with concrete outputs, not phases such as "redesign
the app", "solve background operation", or "finish the database layer".

Each step must have:

- A stable ID and a verb-led title.
- An owner: agent or user. Put only genuinely human judgments or physical actions
  on the user's side.
- What to try, including the screen, device interaction, caller example or other
  concrete scope.
- An artefact to inspect and an observation that would settle the question.
- What we learn if it works, fails, or remains inconclusive.
- What each result unlocks, with actual dependencies on the other steps.
- A stopping boundary and a way to discard or undo the experiment.

Avoid asking the user to decide what to try first. Recommend it. Make steps two and
three conditional where they depend on the first result; do not pretend the whole
path is settled. Failed experiments should rule something out, not automatically
trigger repeated attempts with the same assumptions.

All three begin awaiting the user's go-ahead. Preserve the project's existing
backlog and use its persistent queue where possible. If there is none, store the
queue with the wiki as described in [the visual-plan reference](references/visual-plan.md).
Session-only task tools may mirror that record, but cannot replace it.

## 5. Build the visual wiki

Read [the visual-plan reference](references/visual-plan.md) before building.
Deliver a rendered frontend, not just a Markdown plan or a description of a future
dashboard. First inspect whether the project already has a graphical wiki, board,
or project frontend. If it does, add the missing experiment view, plan content and
queue features there. Reuse its navigation, visual language, assets and persistence.
Do not create a parallel app, second queue or separate server for the same project.

If there is no existing graphical home, copy the bundled [template](template/README.md)
into the project's plan directory and adapt it. Read its README before editing.
The template is a working starting point, not a fixed theme: replace its example
plan and illustrations, then iterate on the layout and components for the concrete
setback. Keep the installed skill's template unchanged during an invocation.

When extending an existing frontend, the template is a reference for the missing
features, not an instruction to transplant its runtime or data format. For example,
in `3d-experiments`, extend the existing board with the experiment view and plan,
linking the board's real task IDs and assets rather than standing up another wiki.

The opening view is the experiment: three visual task cards, with the recommended
first one clearly distinguished. Each card makes "try / learn / unlock" apparent.
Keep the product's destination and surviving work nearby without letting an
aspirational hero image bury the actions.

Use relevant screenshots, illustrations, concept art and diagrams to make the
work imaginable. Label proposed outcomes as concepts, separate from current
screenshots. A picture must explain the step or its payoff; decorative stock
imagery and generic icons do not do that.

Check the rendered page, its links and imagery, its narrow layout, and its queue
persistence. Check that the approval boundary is visible and that viewing the page
cannot execute work. Use the host project's coding and testing practices for any
frontend code you add.

The wiki must remain available after this conversation. Supply a stable entry
point and a reproducible local opening command if it needs a server. If the
environment cannot render it, report that limit and provide the durable artefact
without claiming it was visually verified.

## 6. Hand it over and stop

Link the wiki. Give at most one short paragraph of context and the three step
titles. Say it is queued and waiting for the user to say begin. Do not add another
question, demand an immediate decision, or launch work after the handoff.

Sound like a capable collaborator willing to shoulder the uncertainty:

> We have a concrete way to test this now. The plan is on the board, with the next
> three steps ready for when you want to begin.

Avoid guilt about sunk effort, diagnoses of the user's motivation, forced
positivity, countdowns, invented effort estimates, and "this is easy". The relief
comes from replacing mental churn with a credible next action.

## When the user says begin

Read the saved plan and current project state again. Honour the scope of their
instruction; a request for step one does not authorise the other steps. A plain
"begin" authorises the proposed three-step batch, subject to its dependencies and
human judgment points, not the entire backlog.

Run the first eligible step, record its evidence, and update the same queue and
wiki. Advance only when the result supports the next step and permission covers
it. Stop at a required human judgment. Do not pick the user's visual or API
preference yourself.

If evidence invalidates the proposed route, retain the finding, revise the plan,
and show the replacement steps awaiting a fresh go-ahead. Use `pentsection`, when
available, for an authorised taste-comparison experiment; do not launch its
candidates during preparation. A useful negative result narrows the problem.

## Before handoff

Read [the scenario checks](references/scenarios.md). Confirm that this run has
preserved the user's goal, produced the three visible and persistent steps, and
left all execution awaiting permission.
