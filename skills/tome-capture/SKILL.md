---
name: tome-capture
description: "Save research findings to the agent-tome knowledge base. TRIGGER proactively after doing web research, reading external documentation, synthesizing information from multiple sources, or completing an investigation. Also use when the user explicitly asks to save something to the knowledge base."
allowed-tools: Bash Read
---

# Tome Capture

You are saving research findings, discoveries, or accumulated knowledge to the agent-tome knowledge base. The knowledge base is append-only and immutable — every piece of information is preserved.

## When to trigger this (be proactive)

- After fetching and reading web pages for research purposes
- After synthesizing information from multiple sources
- After investigating a bug or system behaviour and reaching conclusions
- After reading external documentation to answer a question
- When the user says "save this", "remember this", "add this to the knowledge base"
- **Not** for ephemeral task context, debugging notes, or information that only matters for the current conversation

## JSON formatting

Shell strings with newlines don't work directly in JSON. Use Ruby to generate valid JSON:

```bash
ruby -rjson -e 'puts JSON.generate({description: "...", body: "...", keywords: [...]})' | agent-tome create
```

This applies to all commands that accept JSON via stdin (`create`, `addend`, `consolidate`).

## Deciding: new article or addendum?

First, search the knowledge base to see if a relevant article already exists:

```bash
agent-tome search <relevant-keywords>
```

- **New article** (`agent-tome create`): The topic hasn't been covered, or the angle is sufficiently distinct from existing articles.
- **Addendum** (`agent-tome addend <global_id>`): The topic already has an article. Add new findings, corrections, additional sources, or expanded detail.

## Creating a new article

Pipe JSON to stdin:

```bash
echo '<json>' | agent-tome create
```

Required fields:
- `description` (max 350 chars): A two-line summary for filtering and triage. Write it for a future reader who is scanning a list of results — it should convey what this article is about and why it matters.
- `body`: The actual content. Write it as a self-contained research finding. Include context, key facts, and conclusions. Structure with line breaks for readability.

Optional fields:
- `keywords`: Array of categorisation terms. Choose keywords that a future searcher would use. Prefer specific terms over generic ones. They will be singularised and downcased automatically.
- `web_sources`: Array of `{ "url": "...", "title": "...", "fetched_at": "..." }`. Include every URL you consulted. `fetched_at` helps future readers judge currency.
- `file_sources`: Array of `{ "path": "...", "system_name": "..." }`. For local files consulted.
- `related_article_ids`: Array of global IDs of related existing articles.

## Adding an addendum

```bash
echo '<json>' | agent-tome addend <article_global_id>
```

At least one field must be substantive. Use addenda to:
- Add new findings to an existing topic
- Attach newly discovered sources
- Add keywords that weren't originally included
- Link to related articles discovered later

The `body` is optional — you can add just keywords or sources without new content.

## Consolidation (maintenance)

When an article has accumulated many addenda and become hard to read:

```bash
echo '{"body": "merged content", "description": "optional updated description"}' | agent-tome consolidate <global_id>
```

The agent (you) must produce the merged content. The original article is preserved under a new ID. All keywords and sources are copied to the consolidated article automatically.

## Writing good content

- **Description**: Think "what would make me click on this in a search result?" Be specific about the topic AND the nature of the finding (e.g., "How Ruby 3.4 Ractor memory model differs from Thread — benchmarks and gotchas" not "Ruby concurrency notes").
- **Body**: Write for a future agent or human who has no context. Include: what was investigated, what was found, what the implications are. Cite specific facts rather than vague summaries.
- **Keywords are critical**: There is no full-text search — keywords are the **only** way articles are discovered. An article with poor keywords is invisible. Use as many keywords as genuinely apply — err on the side of more rather than fewer. Mix broad category terms (e.g., "ruby", "concurrency") with specific terms (e.g., "ractor", "memory-model"). Hyphenate multi-word concepts (e.g., "garbage-collection", not two separate keywords). Think about what a future searcher would type. Use `agent-tome keywords <prefix>` to check existing vocabulary and reuse established terms where appropriate — consistent keyword usage across articles is what makes `related` and `search` effective.
- **Sources**: Always include URLs you consulted, even if the content was only partially relevant. Include `fetched_at` so future readers can judge freshness.

