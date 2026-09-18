---
name: intent-record
description: "Record the intent behind a code change in the local intent-record store, linked to the commit hash and to stakeholder systems (Jira, Confluence, Linear, GitHub issues...). TRIGGER immediately after every git commit you make, after amending or rebasing a commit that already has an intent, and when the user asks why a commit was made or what was built for a ticket."
allowed-tools: Bash Read
---

# Intent Record

You are recording *why* a change was made, so that a later agent or person reading `git blame` can find the reasoning, the ticket that asked for it, and the earlier changes it builds on. The commit message says what changed; the intent record says why, and what was ruled out.

## When to trigger

- Right after `git commit` succeeds, before starting the next piece of work. One record per commit unless the commit is a pure mechanical step (formatting, version bump, generated files), which gets a one-line record.
- After `git commit --amend`, a rebase or a squash: the hash changed, so `attach` the new hash to the existing record instead of writing a new one.
- When the user asks "why was this done", "what did we build for ACME-42", or similar: use the reading commands below before answering from memory.

If `intent-record` is not installed (`command -v intent-record` fails), say so once in your summary and carry on. Do not install it unasked.

## CLI shape

JSON in on stdin, JSON out on stdout, exit 1 with `{"error": "..."}` on failure. Shell strings with newlines break JSON, so build the payload with Ruby:

```bash
ruby -rjson -e 'puts JSON.generate({
  summary: "Retry flaky fetches with backoff",
  body: "CI failed on transient DNS errors three times this week.\nRetry 3x with exponential backoff rather than failing the build.\nConsidered raising the timeout instead; rejected because it hides the failures.",
  author: "claude",
  commits: [`git rev-parse HEAD`.strip],
  stakeholder_references: [
    { system: "jira", uri: "https://acme.atlassian.net/browse/ACME-42", title: "Flaky fetch in CI" }
  ],
  related_intent_ids: []
})' | intent-record record
```

Fields:

- `summary` (required, max 350 chars, one line): what the change is for, written for someone scanning a list.
- `body` (required): the reasoning. What problem, what was chosen, what was considered and rejected, what constraint forced the shape. Not a restatement of the diff.
- `author`: your model name, or the user's name if they dictated the change.
- `commits`: full 40 or 64 hex git hashes. `git rev-parse HEAD` gives the one you just made. Short hashes are rejected.
- `asset_versions`: `[{vcs, external_id}]` for non-git systems.
- `stakeholder_references`: `[{system, uri, title?}]`. `system` is a lowercase name such as `jira`, `confluence`, `linear`, `github-issues`, `github-pull-requests`, `notion`, `slack`, `adr`. `intent-record systems` lists the known names; unknown ones are accepted.
- `related_intent_ids`: ids of earlier intents this change builds on or reverses.

## Finding stakeholder references

Look for them before writing the record:

- Ticket URLs or keys the user pasted or mentioned in the conversation.
- Ticket keys in the branch name or commit message (`ACME-42`, `ENG-1234`).
- PR or issue URLs from `gh pr view` / `gh issue view` when the work came from one.
- Design docs, ADRs, or wiki pages you read while making the change.

Use the canonical URL for `uri`. A bare key such as `ACME-42` is fine only when no URL is known.

## Finding related intents

Before recording, check whether this change continues earlier recorded work:

```bash
intent-record search <two or three words from the summary>
intent-record lookup <hash of the commit you are modifying>   # from git blame / git log
```

Put matching ids in `related_intent_ids`. This is what lets a reader walk a chain of changes.

## Amend, rebase, squash

The record is keyed by intent id, not by hash. When the hash changes:

```bash
echo '{"commits": ["<new full hash>"]}' | intent-record attach <intent_id>
```

The old hash stays attached, which is correct: it existed. Use `attach` also to add a ticket you learn about later.

## Reading

```bash
intent-record lookup <hash or unique prefix>       # everything recorded against a commit
intent-record by-source ACME-42 --contains         # every intent and commit for a ticket
intent-record search retry backoff --match all     # summary, body, ticket URLs and titles
intent-record show <intent_id>
intent-record serve                                # web GUI on http://127.0.0.1:4791
```

## Writing a good body

- Write for someone with no context in six months. Name the problem, the chosen approach, and the alternatives rejected with the reason.
- Include the constraint that shaped the change ("the API has no batch endpoint", "must stay on Ruby 3.2").
- State what is deliberately not done and why, when that is the kind of thing a reader would otherwise "fix".
- Do not paste the diff or repeat the commit message.
