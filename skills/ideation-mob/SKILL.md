---
name: ideation-mob
description: "Spin up an ideation mob with four divergent-thinking agents communicating via agent-chat, then a clustering pair, to produce a clustered list of ideas for a problem statement. Best suited for open-ended, abstract problems where the solution space is wide and unconstrained (new product directions, process redesigns, naming, strategy pivots). NOT suited for concrete engineering design problems with known technology stacks and tight constraints — those benefit more from focused design skills like craftsman or direct conversation. Use when the user mentions ideation mob, brainstorming session, idea generation, divergent thinking, or wants to generate and cluster ideas with multiple perspectives."
allowed-tools: Bash Task TeamCreate TeamDelete SendMessage Read Write Monitor TaskStop TaskCreate TaskUpdate TaskList
---

# Ideation Mob

Run a divergent ideation session, then a clustering session, and deliver a Markdown document of clusters → ideas to the user.

The session has two phases, each in its own agent-chat room **and its own team**:

- **Diverge** — four ideators (team `ideate`) fan out ideas around a problem statement.
- **Cluster** — two clusterers (team `cluster`) walk the harvested ideas and agree on clusters.

A **team-lead invariant** constrains the structure: as orchestrator you can only lead one team at a time, so the ideate team must be fully torn down (Step 9.5) before you can spawn the cluster team. This is a hard ordering constraint, not advice.

## Step 0: Verify agent-chat is installed

Run `which agent-chat`. If it is not found, tell the user it is required and offer to install it with `gem install agent-chat`. Stop and wait for confirmation before proceeding.

## Step 1: Sharpen the problem statement

Ask the user for a problem statement if they have not provided one. Then interview them to sharpen it — ask clarifying questions until the statement is concrete enough to ideate against (constraints, audience, success criteria, non-goals). After each round of clarification, summarize the current statement back to the user and ask: **"Ready to start ideating, or sharpen further?"**

Do not impose a fixed question count — keep going as long as the user wants to sharpen, stop as soon as they say to proceed. Use your judgment on when the statement is clear enough to suggest moving on.

**Fitness check:** Before proceeding, evaluate whether the sharpened problem is a good fit for divergent ideation. The ideation mob works best when the solution space is genuinely wide — many valid directions, no dominant technology constraint, value in exploring unusual angles. If the problem is a **concrete engineering design question** (specific technology stack, known integration points, tight architectural constraints, "how should we structure this code?"), tell the user honestly that a focused design conversation or the craftsman skill would likely produce more actionable output than a 50-100 idea fan-out where most ideas will be impracticable. Offer to proceed anyway if they want to, but make the trade-off explicit.

Store the final statement as PROBLEM for use in the rest of the skill.

## Step 2: Generate a fresh room name

Run `openssl rand -hex 2` to get a 4-character hex string. The diverge room is `ideate-<hex>` (store as IDEATE_ROOM). Keep the hex around — you'll reuse it for the cluster room (`cluster-<hex>`) and the output file.

## Step 3: Create the ideation team

Use `TeamCreate` with team_name `ideate`.

## Step 4: Spawn the first wave (random + obvious) — IN PARALLEL

Spawn ideators 1 and 2 in **a single assistant message containing two Agent tool calls**. "In parallel" here means concurrent dispatch — both Agent calls in one message — *not* sequential. Spawning them across two messages is a common mistake; if you do this, the second agent comes in late and may be missed entirely.

Each Agent call MUST use:
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

## Step 5: Verify spawn, then post the ground rules

**Verify before continuing.** Member count must be 3 (lead + 2 ideators):

```
jq -r '.members | length' ~/.claude/teams/ideate/config.json
```

If less than 3, you missed a spawn — fix before proceeding. Then post the ground rules:

```
echo "PROBLEM: <PROBLEM>" | agent-chat send --room {ROOM} --author orchestrator
echo "GROUND RULES: (1) Reserve judgment — every idea is valid, no filtering. (2) Pursue novelty. (3) Go for quantity — this is a fan-out exercise. (4) Read others' ideas for inspiration but do NOT wait your turn — post as soon as you have an idea. (5) Tag every idea with 'IDEA:' on its own line. Multi-line ideas are fine; a blank line ends the idea. Use plain chat (no IDEA: tag) for meta only." | agent-chat send --room {ROOM} --author orchestrator
```

## Step 6: Wait for seed ideas, then spawn the second wave

Wait for ~5-8 IDEA posts before spawning the second wave. They need prior material to react to — that's why they come in late.

**Use Monitor, not a sleep loop** — the Bash tool blocks `sleep N && cmd` patterns. Concrete recipe:

```
Monitor with persistent=false, timeout_ms=180000, command:
  i=0
  while [ $i -lt 24 ]; do
    ideas=$(agent-chat receive --room {ROOM} --consumer seedmon-$i --all 2>/dev/null | grep -c '^IDEA:')
    echo "ideas=$ideas"
    if [ "$ideas" -ge 6 ]; then echo "READY"; exit 0; fi
    i=$((i+1)); sleep 8
  done
  echo "TIMEOUT"
```

Once Monitor reports READY, spawn ideators 3 and 4 in **a single assistant message containing two Agent tool calls** (same parallel-spawn rule as Step 4 — easy to forget here because you're context-switching out of monitor mode).

| Agent | name | Prompt template |
|-------|------|-----------------|
| Contrarian (max-different) | `ideator-contrarian` | [references/ideator-contrarian.md](references/ideator-contrarian.md) |
| Combiner (synthesis) | `ideator-combiner` | [references/ideator-combiner.md](references/ideator-combiner.md) |

Verify member count is now 5 (lead + 4 ideators):
```
jq -r '.members | length' ~/.claude/teams/ideate/config.json
```

After spawning, post a short note to the room so existing agents see the new arrivals:

```
echo "ideator-contrarian and ideator-combiner have joined. Same rules apply." | agent-chat send --room {ROOM} --author orchestrator
```

## Step 7: Orchestrator monitor loop

Mostly stay silent — you are facilitator, not participant. Use Monitor to watch idea count and stop when it crosses a threshold or stalls. Concrete recipe:

```
Monitor with persistent=false, timeout_ms=420000, command:
  i=0
  prev=0
  stall=0
  while [ $i -lt 28 ]; do
    ideas=$(agent-chat receive --room {ROOM} --consumer mainmon-$i --all 2>/dev/null | grep -c '^IDEA:')
    echo "ideas=$ideas"
    if [ "$ideas" = "$prev" ]; then stall=$((stall+1)); else stall=0; fi
    prev=$ideas
    if [ "$ideas" -ge 75 ]; then echo "REACHED_TARGET"; exit 0; fi
    if [ "$stall" -ge 3 ]; then echo "STALLED"; exit 0; fi
    i=$((i+1)); sleep 15
  done
  echo "TIME_CAP"
```

Adjust the 75 target as you like (50-100 is the sensible range). Stall detection (3 consecutive polls with no growth) handles the convergence case.

If an agent goes quiet for a long stretch you may privately nudge it via `SendMessage` to ask if it's stuck — but don't over-nudge; silence can just mean thinking.

**Do not use `sleep N && cmd` directly in Bash.** The harness blocks it. Use Monitor (for stream events) or `run_in_background: true` (for one-shot waits).

## Step 8: Stop the diverge phase

Shutting down ideators is the single most fragile step in the skill — budget time for it and follow this sequence carefully.

1. Post the wrap-up to the room first. The reference prompts include a step that checks for this:
   ```
   echo "Exercise complete. Thank you all. Go ahead and shut down." | agent-chat send --room {ROOM} --author orchestrator
   ```

2. Send a `shutdown_request` via SendMessage to each of the four ideators (in parallel — single message, four tool calls).

3. Watch for **`teammate_terminated`** notifications, *not* idle notifications. An idle agent is not a terminated agent — it has gone to sleep with the shutdown request unprocessed. Use Monitor:
   ```
   Monitor with persistent=false, timeout_ms=120000, command:
     i=0
     while [ $i -lt 15 ]; do
       n=$(jq -r '.members | length' ~/.claude/teams/ideate/config.json 2>/dev/null)
       echo "members=$n"
       if [ "$n" = "1" ]; then echo "ALL_DOWN"; exit 0; fi
       i=$((i+1)); sleep 8
     done
     echo "TIMEOUT"
   ```

4. **If any ideator hasn't terminated after ~30s**, send a plain-text SendMessage with the explicit shutdown_response payload they should call (not another shutdown_request — they've already received that and ignored it):
   ```
   to: <ideator-name>
   summary: manual shutdown approval
   message: "Please immediately call SendMessage with: {\"to\": \"team-lead\", \"message\": {\"type\": \"shutdown_response\", \"request_id\": \"<the request_id from your last shutdown_request>\", \"approve\": true}}"
   ```
   The reference prompts now include this protocol, but old idle agents may still need this nudge as a backup.

5. Continue until member count drops to 1 (lead only). Don't proceed to harvest until all four are confirmed terminated.

## Step 9: Harvest ideas

Read the full diverge transcript and extract IDEA blocks with this awk recipe (handles multi-line ideas, dedups exact duplicates, numbers the result):

```
agent-chat receive --room {ROOM} --consumer orchestrator-harvest --all > /tmp/harvest.txt

awk '
  /^IDEA:/{ if (acc) print acc; acc=substr($0, 7); sub(/^[[:space:]]+/, "", acc); next }
  /^$/{ if (acc) { print acc; acc="" } }
  acc { acc = acc " " $0 }
  END{ if (acc) print acc }
' /tmp/harvest.txt | awk '!seen[$0]++' | awk '{print NR". "$0}' > /tmp/ideas-numbered.txt
```

The result is IDEA_LIST: lines like `1. <idea text>`, `2. <idea text>`, ….

Note: do NOT use `grep '^IDEA:'` for this — some shell-tool wrappers truncate grep output. Awk is robust.

## Step 9.5: Tear down the ideate team

The cluster team cannot be created until the ideate team is gone (team-lead invariant). Once Step 8's monitor reports member count is 1:

```
TeamDelete (with no args — uses current team context)
```

Verify: `ls ~/.claude/teams/ideate/` should fail with "no such file or directory."

If `TeamDelete` fails with "still has active members," return to Step 8 — at least one ideator is still alive.

## Step 10: Spawn the clustering pair — IN PARALLEL

Generate the cluster room name: `cluster-<same-hex-as-ideate-room>` (store as CLUSTER_ROOM). Use `TeamCreate` with team_name `cluster`.

Spawn both clusterers in **a single assistant message containing two Agent tool calls** (same parallel-spawn rule). Same Task parameters as before (`bypassPermissions`, `run_in_background: true`, `subagent_type: "general-purpose"`).

| Agent | name | Prompt template |
|-------|------|-----------------|
| Lumper (merge bias) | `clusterer-lumper` | [references/clusterer-lumper.md](references/clusterer-lumper.md) |
| Splitter (split bias) | `clusterer-splitter` | [references/clusterer-splitter.md](references/clusterer-splitter.md) |

Verify member count is 3 (lead + 2 clusterers):
```
jq -r '.members | length' ~/.claude/teams/cluster/config.json
```

The clusterer reference prompts include peer-wake instructions — each clusterer SendMessages the other after every room post, because idle agents do not poll the room. Without this, the discussion stalls.

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

Stay silent unless intervention is needed. Use Monitor with an **author-aware filter** — the `FINAL CLUSTERS:` string appears literally in your own task instructions from Step 11, so a naive grep will false-positive immediately.

```
Monitor with persistent=false, timeout_ms=900000, command:
  i=0
  while [ $i -lt 60 ]; do
    transcript=$(agent-chat receive --room {ROOM} --consumer clmon-$i --all 2>/dev/null)
    cl_msgs=$(echo "$transcript" | grep -cE '^<<< clusterer-')
    final=$(echo "$transcript" | awk '
      /^<<< clusterer-/{a=1; next}
      /^<<< /{a=0; next}
      a && /^FINAL CLUSTERS:/{print "FOUND"; exit}
    ')
    echo "cl_msgs=$cl_msgs final=$final"
    if [ "$final" = "FOUND" ]; then echo "FINAL_FOUND"; exit 0; fi
    i=$((i+1)); sleep 20
  done
  echo "TIMEOUT"
```

The awk turns the author tag into a state machine — only count FINAL CLUSTERS posts that appear under a `<<< clusterer-...` header.

If 10 minutes pass without a FINAL block, post `"Time's up — please post your best current FINAL CLUSTERS: now, even if imperfect."` to the room and run the monitor for one more cycle.

If the discussion appears to stall (no clusterer messages for 2+ ticks), one of them is likely idle without seeing the partner's last post. Nudge by SendMessaging both clusterers with "your turn — check the room". The peer-wake protocol should prevent this, but rescue nudges are still useful.

Then shut the clusterers down using the same procedure as Step 8 — room post + shutdown_request, watch for `teammate_terminated`, send the explicit shutdown_response payload as backup if needed. After both terminate:

```
TeamDelete (cleans up the cluster team)
```

## Step 13: Deliver

Parse the `FINAL CLUSTERS:` Markdown block from the cluster room transcript. Write it to `./ideation-<hex>.md` in the user's working directory with this structure:

```markdown
# Ideation results

**Problem:** <PROBLEM>

<FINAL CLUSTERS markdown — the ## Cluster headings and bullets, verbatim>
```

Tell the user the file path and give a one-line summary (e.g. "87 ideas across 6 clusters").

## Guardrails

### Spawning
- **Fresh room per session** — never reuse a room name. Stale history will pollute the run.
- **"In parallel" means a single message with multiple Agent tool calls.** It does not mean "around the same time" or "soon after each other." Spawning across messages is a common mistake — the second agent comes in late and may be missed entirely.
- **Verify member count after every spawn** with `jq -r '.members | length' ~/.claude/teams/{TEAM}/config.json`. A short count means you missed a spawn.
- **"Introduce yourself FIRST"** must be explicit and prominent in every reference prompt — without it, agents do internal analysis before posting.

### Polling
- **Do not use `sleep N && cmd` patterns.** The Bash tool blocks them. Use Monitor with an until-loop for stream events, or `run_in_background: true` for one-shot waits.
- Inside a Monitor command, plain `sleep N` between polls works fine — it's only the leading `sleep N && cmd` pattern that's blocked.

### Idle agents and the wake problem
- **Agents do not poll while idle.** Their main loop only runs during an active turn — between turns, they go idle and stop reading the room. The only way to wake an idle agent is `SendMessage`.
- **Peer-to-peer agent-chat alone will stall.** If clusterer A posts and goes idle, clusterer B does not see the post. The reference prompts now include a peer-wake step (SendMessage after every room post) — keep this in any future variant of this skill.
- **Idle ≠ shut down.** An agent that has gone idle may have an unprocessed shutdown_request sitting in its inbox. Phase transitions must wait for `teammate_terminated`, not idle notifications.

### Shutdown
- **Shutdown is the most fragile step.** Shutdown_request alone is unreliable — agents acknowledge but stay alive. The reference prompts now include the explicit shutdown_response protocol, but expect to need a plain-text SendMessage backup nudge ("call SendMessage with: {to: team-lead, message: {type: shutdown_response, request_id: ..., approve: true}}") for stragglers.
- **Room wrap-up first, then SendMessage shutdown_request, then plain-text backup if needed.** All three layers because each fails differently.
- **Watch for `teammate_terminated` notifications**, not idle. Use a member-count Monitor to confirm.

### Team-lead invariant
- **One team at a time.** The orchestrator can lead exactly one team. Step 9.5 (TeamDelete the ideate team) is mandatory before Step 10 (TeamCreate cluster).
- If `TeamCreate` fails with "Already leading team X," go back and finish tearing down team X.

### Extraction and parsing
- **Trust the IDEA: convention** — don't try to extract ideas from free-form chat. If it's not tagged, it's not an idea.
- **Use awk, not grep, for IDEA extraction.** Some shell-tool wrappers truncate grep output for display, breaking pipelines. Awk is robust.
- **`FINAL CLUSTERS:` collides with the task instructions.** Step 11's task post contains the literal sentinel. Any monitor must filter by author (`<<< clusterer-...`) to avoid false positives on the orchestrator's own message.

### Orchestration
- **Don't over-orchestrate the content** — in this skill the orchestrator is mostly a facilitator for the agents' content. Resist the urge to participate in ideation or clustering.
- **But: do orchestrate the plumbing aggressively.** Verifying spawn counts, choosing Monitor recipes, parsing transcripts, and chasing stragglers through shutdown is real work. The "stay silent" framing applies to the *idea content*, not the *process*.
