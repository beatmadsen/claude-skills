---
name: atdd-mob
description: Spin up an ATDD mob programming team with testing coaches and a craftsman communicating via agent-chat
allowed-tools: Bash Task TeamCreate SendMessage Read TaskCreate TaskUpdate TaskList TaskStop
---

# Mob Programming Team

Bootstrap a 3-agent mob programming team and orchestrate their work.

## Step 0: Verify agent-chat is installed

Run `which agent-chat`. If it is not found, tell the user it is required and offer to install it with `gem install agent-chat`. Stop and wait for confirmation before proceeding.

## Step 1: Generate a fresh room name

Run `openssl rand -hex 2` to get a 4-character hex string. The room name is `mob-<hex>` (e.g. `mob-a3f7`). Store this as ROOM for all subsequent commands.

## Step 2: Create the team

Use `TeamCreate` with team_name `mob`.

## Step 3: Detect available agent types

Check if custom agent types `testing-coach` and `craftsman` are available by looking for `.claude/agents/testing-coach.md` and `.claude/agents/craftsman.md` (in both `~/.claude/agents/` and the project's `.claude/agents/`). If either is not found, fall back to `general-purpose` for that role. The prompt templates work with any agent type — the specialized types just add extra coaching behavior.

## Step 4: Spawn agents

Spawn all 3 agents in parallel using the Task tool. Each agent MUST use:
- `team_name: "mob"`
- `mode: "bypassPermissions"`
- `run_in_background: true`
- `name`: the agent's name (e.g. `"atdd-coach"`) — required for SendMessage routing

Replace `{ROOM}` with the generated room name and `{CWD}` with the user's current working directory in each prompt.

Read the prompt template for each agent and use it as the agent's `prompt` parameter:

| Agent | subagent_type | Prompt template |
|-------|--------------|-----------------|
| atdd-coach | `testing-coach` or `general-purpose` (see Step 3) | [references/atdd-coach.md](references/atdd-coach.md) |
| tdd-coach | `testing-coach` or `general-purpose` (see Step 3) | [references/tdd-coach.md](references/tdd-coach.md) |
| craftsman | `craftsman` or `general-purpose` (see Step 3) | [references/craftsman.md](references/craftsman.md) |

## Step 5: Post the task

After all agents have been spawned, post the user's task to the mob room:

```
echo "TASK: <user's task description here>" | agent-chat send --room {ROOM} --author orchestrator
```

Then assign initial roles:

```
echo "Roles: atdd-coach is DRIVER, tdd-coach is NAVIGATOR. craftsman reviews after each GREEN. Rotate driver/navigator after each sub-task." | agent-chat send --room {ROOM} --author orchestrator
```

## Step 6: Orchestrator loop

You are the orchestrator. Your job:

1. **Monitor** the mob room every 15-20 seconds:
   `agent-chat receive --room {ROOM} --consumer orchestrator`

2. **Nudge** any agent that hasn't posted in the mob room for a while. Use `SendMessage` to privately ask them if they're stuck.

3. **Rotate roles** after each sub-task completes. Post rotation announcements to the mob room.

4. **Post new sub-tasks** as the team completes work.

5. **Answer questions** from the team by relaying to the user or deciding yourself.

## Guardrails (from experience)

- **Fresh room per session** — never reuse a room name. Agents would receive stale history.
- **"Introduce yourself FIRST"** must be explicit and prominent. Without it, agents do internal analysis before posting.
- **sleep 3-4** between polls is the sweet spot. Shorter burns turns too fast, longer feels unresponsive.
- **Shutdown via chat room first** — before sending `SendMessage` shutdown requests, post `"Your work is done. Go ahead and shut down."` to the mob room. Agents that are polling the room will see this and self-terminate, avoiding the stuck-agent problem. Follow up with `SendMessage` shutdown requests for any agents that remain.
- **Agents need repeated shutdown requests** — they tend to go idle rather than approve on first ask. Send multiple shutdown requests when wrapping up.
- **Specialized agents add real value** — testing-coach and craftsman genuinely improve discipline over generic agents.
- **All agents can drive** — with no dedicated devs, every agent can be driver or navigator. Rotate freely.
