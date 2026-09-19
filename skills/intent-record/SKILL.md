---
name: intent-record
description: "Record the intent behind a code change in the local intent-record store, linked to the commit hash and to stakeholder systems (Jira, Confluence, Linear, GitHub issues...). TRIGGER immediately after every git commit you make, after amending or rebasing a commit that already has an intent, when the user asks why a commit was made or what was built for a ticket, and when adopting the tool on a repository whose history predates it."
allowed-tools: Bash Read
---

# Intent Record

You are recording *why* a change was made, so that a later agent or person reading `git blame` can find the reasoning, the ticket that asked for it, and the earlier changes it builds on. The commit message says what changed; the intent record says why, and what was ruled out.

## When to trigger

- Right after `git commit` succeeds, before starting the next piece of work. One record per commit unless the commit is a pure mechanical step (formatting, version bump, generated files), which gets a one-line record.
- After `git commit --amend`, a rebase or a squash: the hash changed, so `attach` the new hash to the existing record instead of writing a new one.
- When the user asks "why was this done", "what did we build for ACME-42", or similar: use the reading commands below before answering from memory.
- When the tool is new to a repository that already has history, or `lookup` answers nothing for commits older than the store: run `backfill` once, as described below.

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

## Backfilling history

`lookup` and `by-source` answer nothing for commits made before the store existed. `backfill` (intent-record 1.1.0 or later) reads the ticket keys already in the commit messages and writes the records `record` would have written at the time. Run it once when adopting on a repository with history, then once more for each further convention that history uses.

It recovers the links, not the reasoning. Every record it writes opens with a fixed line saying the reasoning behind the change was not recorded. When you later work on a commit whose record carries that line and you learn why the change was made, `attach` the reasoning to that record rather than leaving the line standing.

Look at a sample of subject lines before choosing a pattern, and build the payload from git:

```bash
git log --format='%H%x00%an%x00%B%x01' | ruby -rjson -e '
  commits = $stdin.read.split("\x01").map(&:strip).reject(&:empty?).map do |entry|
    hash, author, message = entry.split("\x00", 3)
    { "commit" => hash, "author" => author, "message" => message.to_s.strip }
  end
  puts JSON.generate({ "commits" => commits })
' > history.json

intent-record backfill --system jira --pattern 'ACME-\d+' \
  --uri-prefix https://acme.atlassian.net/browse/ --dry-run < history.json
```

Always dry run first. It reports the sources it would create and up to twenty commit subjects nothing matched, and that list is how you find the second convention the history uses. Show the user the counts and the unmatched subjects before writing, because a wrong pattern writes thousands of wrong links. Then drop `--dry-run`, and run again with a different `--system` and `--pattern` for each further convention. A commit already recorded gains the new references rather than being skipped, and repeating a pass writes nothing.

Anchor a loose pattern. `(?<![A-Za-z])#(\d+)` finds `#42` without also taking the `77` from an Azure `AB#77`. Where a team puts the ticket key in the branch name and not the message, add each commit's branch as `ref` in the payload and it is scanned too. The default `--order` matches what `git log` prints, so only a `git log --reverse` needs `--order oldest-first`.

## Writing a good body

- Write for someone with no context in six months. Name the problem, the chosen approach, and the alternatives rejected with the reason.
- Include the constraint that shaped the change ("the API has no batch endpoint", "must stay on Ruby 3.2").
- State what is deliberately not done and why, when that is the kind of thing a reader would otherwise "fix".
- Do not paste the diff or repeat the commit message.
