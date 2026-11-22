---
name: agent-chat
description: "How an agent talks to other agents through the agent-chat CLI: always --json, reply to specific messages with --reply-to, look up answered messages with show, watch a room with stream under Monitor, and read refusals and warnings. TRIGGER before the first agent-chat command in a session, whenever a skill, prompt or teammate tells you to communicate through an agent-chat room, and when an agent-chat command prints a warning or a refusal you need to act on."
allowed-tools: Bash Read Monitor
---

# Talking through agent-chat

`agent-chat` (2.0 or later) is a shared chat room on the local machine: every participant names the same `--room`, and the room needs no setup. Check `agent-chat --version` once; on 1.x, `--json`, `--reply-to`, `show` and `--all` do not exist.

## Always pass --json

Text output is for people. With `--json` every command prints structured lines, and that is the only form to parse.

| Command | Prints on success |
|---|---|
| `echo "..." \| agent-chat send --json --room R --author ME` | `{"status":"accepted","assigned_id":"7xKqR2m"}` |
| `agent-chat receive --json --room R --consumer ME` | one line per unread message, nothing when there is nothing new |
| `agent-chat show --json --room R ID [ID...]` | one line per message asked for, in that order |
| `agent-chat stream --json --room R --consumer ME` | like receive, but keeps running |

A message line is `{"id":"3fGhJ9k","author":"Bob","timestamp":"2026-11-22T13:31:12Z","content":"...","reply_to":["7xKqR2m"]}`. `reply_to` is always present, empty when the message answers nothing.

- Keep the `assigned_id` that `send` prints: it is how others will reply to you and how you will recognise your own messages.
- `send` adds `"room_created":true` when your message created the room. If you expected others to be there already, check the room name: a `similar_rooms` list names an existing room one edit away.
- Use your own name for both `--author` and `--consumer`, and never share a consumer name with another participant: two readers on one consumer name split the messages between them.

## Replying

Answer specific messages with `--reply-to`, as many as the message answers:

```bash
echo "Agreed, and the second test covers the empty case." \
  | agent-chat send --json --room R --author ME --reply-to 7xKqR2m,3fGhJ9k
```

The ids must exist in the room. One unknown id refuses the whole message and saves nothing, so copy ids from what you received; never construct them.

When a message replies to one you have not seen (you joined late, or it scrolled out of what you kept), fetch it instead of guessing what it said:

```bash
agent-chat show --json --room R 7xKqR2m
```

`receive --json --room R --all` prints the whole history without moving anyone's read position; use it to catch up or to collect a transcript. It needs no `--consumer`.

## Waiting for messages

Do not write `sleep N && agent-chat receive ...`: the harness blocks leading sleeps. Either poll with a plain `receive` between pieces of work (it returns at once), or run `stream` under the Monitor tool, which turns each line into a notification:

```
Monitor(description: "messages in room R", timeout_ms: 1800000,
        command: "agent-chat stream --json --room R --consumer ME")
```

Re-arm it when it expires; the read position is kept, so nothing is missed in between.

Never test for new messages with `receive ... | grep -q .` and then call `receive` again: the first call already consumed the messages and the second gets none of them. Capture the output once and use it.

## Refusals, warnings and notes

A refused command prints an envelope on stdout and exits non-zero:

```json
{"status":"rejected","error":{"code":"unknown_reply_to","message":"No message with id zzzzzzz in room R","ids":["zzzzzzz"]}}
```

- Exit 2 means the command line could not be read (`unknown_flag`, `missing_value`, `missing_flag`, `unknown_command` ...). Fix the command; `error.suggestions` may name what you meant.
- Exit 1 means the request was understood and refused (`unknown_reply_to`, `unknown_id`, `empty_content`, `invalid_room` ...). Fix the input; nothing was written.

A flag or command one edit from a known name is accepted and read as that name, with a warning saying so. For `send` warnings arrive in a `warnings` list in the envelope; for `receive`, `stream` and `show` they arrive on stderr as `{"warning":{...}}` lines, next to `{"info":{...}}` notes such as `room_created`. Read them and correct the command you will run next time.

A `room_reset` warning means the room was made by an older agent-chat and was moved to the `backup_path` it names; the room now starts empty.

## Room names

Use a fresh room per session (`mob-$(openssl rand -hex 2)`), so nobody receives stale history. Room names are plain folder names: no `/`, `\`, `.` or `..`.
