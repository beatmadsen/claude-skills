---
name: ideation-mob
description: Spin up an ideation mob with four divergent-thinking agents communicating via agent-chat, then a clustering pair, to produce a clustered list of ideas for a problem statement.
allowed-tools: Bash Task TeamCreate SendMessage Read Write TaskCreate TaskUpdate TaskList TaskStop
---

# Ideation Mob

Run a divergent ideation session, then a clustering session, and deliver a Markdown document of clusters → ideas to the user.

The session has two phases, each in its own agent-chat room:

- **Diverge** — four ideators fan out ideas around a problem statement.
- **Cluster** — two clusterers (lumper + splitter) walk the harvested ideas and agree on clusters.

## Step 0: Verify agent-chat is installed

Run `which agent-chat`. If it is not found, tell the user it is required and offer to install it with `gem install agent-chat`. Stop and wait for confirmation before proceeding.

## Step 1: Sharpen the problem statement

Ask the user for a problem statement if they have not provided one. Then interview them to sharpen it — ask clarifying questions until the statement is concrete enough to ideate against (constraints, audience, success criteria, non-goals). After each round of clarification, summarize the current statement back to the user and ask: **"Ready to start ideating, or sharpen further?"**

Do not impose a fixed question count — keep going as long as the user wants to sharpen, stop as soon as they say to proceed. Use your judgment on when the statement is clear enough to suggest moving on.

Store the final statement as PROBLEM for use in the rest of the skill.

## Step 2: Generate a fresh room name

Run `openssl rand -hex 2` to get a 4-character hex string. The diverge room is `ideate-<hex>` (store as IDEATE_ROOM). Keep the hex around — you'll reuse it for the cluster room (`cluster-<hex>`) and the output file.

## Step 3: Create the ideation team

Use `TeamCreate` with team_name `ideate`.

## Step 4: Spawn the first wave (random + obvious)

Spawn ideators 1 and 2 in parallel using the Task tool. Each agent MUST use:
- `team_name: "ideate"`
- `mode: "bypassPermissions"`
- `run_in_background: true`
- `subagent_type: "general-purpose"`
- `name`: the agent's name — required for SendMessage routing

Replace `{ROOM}` with `IDEATE_ROOM` and `{PROBLEM}` with the sharpened problem statement in each prompt.

| Agent | name | Prompt template |
|-------|------|-----------------|
| Random associator | `ideator-random` | [references/ideator-random.md](references/ideator-random.md) |
| Obvious-ideas generator | `ideator-obvious` | [references/ideator-obvious.md](references/ideator-obvious.md) |

## Step 5: Post the ground rules

Once both agents are spawned, post to the room:

```
echo "PROBLEM: <PROBLEM>" | agent-chat send --room {ROOM} --author orchestrator
echo "GROUND RULES: (1) Reserve judgment — every idea is valid, no filtering. (2) Pursue novelty. (3) Go for quantity — this is a fan-out exercise. (4) Read others' ideas for inspiration but do NOT wait your turn — post as soon as you have an idea. (5) Tag every idea with 'IDEA:' on its own line. Multi-line ideas are fine; a blank line ends the idea. Use plain chat (no IDEA: tag) for meta only." | agent-chat send --room {ROOM} --author orchestrator
```

## Step 6: Wait for seed ideas, then spawn the second wave

Poll the room every 3-4 seconds. Once you have observed roughly 5-8 `IDEA:` posts, spawn ideators 3 and 4 in parallel. They need prior material to react to — that's why they come in late.

| Agent | name | Prompt template |
|-------|------|-----------------|
| Contrarian (max-different) | `ideator-contrarian` | [references/ideator-contrarian.md](references/ideator-contrarian.md) |
| Combiner (synthesis) | `ideator-combiner` | [references/ideator-combiner.md](references/ideator-combiner.md) |

After spawning, post a short note to the room so existing agents see the new arrivals:

```
echo "ideator-contrarian and ideator-combiner have joined. Same rules apply." | agent-chat send --room {ROOM} --author orchestrator
```

## Step 7: Orchestrator monitor loop

Poll the room every 3-4 seconds: `agent-chat receive --room {ROOM} --consumer orchestrator`.

Mostly stay silent — you are facilitator, not participant. Track:

- **Idea count** — running count of distinct `IDEA:` posts.
- **Time elapsed** — note when Step 5 finished.
- **Idea velocity** — how many ideas in the last ~30s of polling.
- **Repetition** — are new ideas paraphrasing prior ones?

Stop the exercise when **any** of these is true (use your judgment — these are heuristics, not strict thresholds):

- ~100 IDEA posts collected.
- ~5 minutes elapsed since Step 5.
- 3 consecutive polls (~10s) with no new IDEA posts.
- Visible convergence: most new ideas are near-duplicates of prior ones.

If an agent goes quiet for a long stretch, you may privately nudge it via `SendMessage` to ask if it's stuck — but don't over-nudge; silence can just mean thinking.

## Step 8: Stop the diverge phase

Post the wrap-up to the room first (this is how agents in atdd-mob actually shut down cleanly):

```
echo "Exercise complete. Thank you all. Go ahead and shut down." | agent-chat send --room {ROOM} --author orchestrator
```

Then send `SendMessage` shutdown requests to each ideator. Repeat as needed — agents tend to go idle rather than approve on the first ask.

## Step 9: Harvest ideas

Read the full diverge transcript:

```
agent-chat receive --room {ROOM} --consumer orchestrator-harvest --all
```

Extract every `IDEA:` block. An idea starts at a line beginning `IDEA:` and continues until a blank line or end of message. Strip the `IDEA:` prefix, trim whitespace, and dedupe exact duplicates only (leave near-duplicates — clustering will handle them).

Number the resulting list `1.`, `2.`, … as IDEA_LIST.

## Step 10: Spawn the clustering pair

Generate the cluster room name: `cluster-<same-hex-as-ideate-room>` (store as CLUSTER_ROOM). Use `TeamCreate` with team_name `cluster`.

Spawn both clusterers in parallel. Same Task parameters as before (`bypassPermissions`, `run_in_background: true`, `subagent_type: "general-purpose"`).

| Agent | name | Prompt template |
|-------|------|-----------------|
| Lumper (merge bias) | `clusterer-lumper` | [references/clusterer-lumper.md](references/clusterer-lumper.md) |
| Splitter (split bias) | `clusterer-splitter` | [references/clusterer-splitter.md](references/clusterer-splitter.md) |

## Step 11: Seed the clustering room

Post the problem statement and the numbered idea list:

```
echo "PROBLEM: <PROBLEM>" | agent-chat send --room {ROOM} --author orchestrator
echo "IDEAS:
1. <idea 1>
2. <idea 2>
...
N. <idea N>" | agent-chat send --room {ROOM} --author orchestrator
echo "TASK: Discuss and agree on clusters covering every idea. Lumper biases toward fewer/bigger themes; splitter biases toward preserving distinctions. Discussion is what produces good clusters — debate, don't rubber-stamp. When you both agree you are done, post a single message containing exactly the line 'FINAL CLUSTERS:' followed by Markdown:

## Cluster name
- idea text
- idea text

## Cluster name
- ...

Every idea must appear in exactly one cluster." | agent-chat send --room {ROOM} --author orchestrator
```

## Step 12: Monitor clustering

Poll the cluster room every 3-4 seconds. Stay silent unless intervention is needed.

Stop when **either**:

- A message containing `FINAL CLUSTERS:` followed by the Markdown block has been posted and the other agent has acknowledged agreement.
- ~10 minutes have elapsed (cap to prevent runaway debate). If the cap hits without a FINAL block, post `"Time's up — please post your best current FINAL CLUSTERS: now, even if imperfect."` and wait one more polling round.

Then shut the clusterers down the same way as Step 8 (room post first, then `SendMessage`).

## Step 13: Deliver

Parse the `FINAL CLUSTERS:` Markdown block from the cluster room transcript. Write it to `./ideation-<hex>.md` in the user's working directory with this structure:

```markdown
# Ideation results

**Problem:** <PROBLEM>

<FINAL CLUSTERS markdown — the ## Cluster headings and bullets, verbatim>
```

Tell the user the file path and give a one-line summary (e.g. "87 ideas across 6 clusters").

## Guardrails (carried over from atdd-mob, adapted)

- **Fresh room per session** — never reuse a room name. Stale history will pollute the run.
- **"Introduce yourself FIRST"** must be explicit and prominent in every reference prompt — without it, agents do internal analysis before posting.
- **sleep 3-4 between polls** — same sweet spot as atdd-mob.
- **Shutdown via chat room first**, then `SendMessage` — agents polling the room self-terminate cleanly.
- **Repeat shutdown requests** — agents tend to go idle rather than approve on the first ask.
- **Don't over-orchestrate** — in this skill the orchestrator is mostly a facilitator. Resist the urge to participate in ideation or clustering.
- **Trust the IDEA: convention** — don't try to extract ideas from free-form chat. If it's not tagged, it's not an idea.
