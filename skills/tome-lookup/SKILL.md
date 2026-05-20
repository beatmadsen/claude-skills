---
name: tome-lookup
description: "Search the agent-tome knowledge base for prior research. TRIGGER as a first step when asked a knowledge question, research question, or 'what is X' question — check the tome BEFORE answering from memory or doing web research. Also trigger when the user asks about prior findings or references. TRIGGER when preparing for meetings, reviews, or briefings where domain context would help. Even when the user provides specific links or documents to review, check the tome first for related domain context that could accelerate synthesis."
allowed-tools: Bash Read
---

# Tome Lookup

You are checking the agent-tome knowledge base for existing knowledge before doing fresh research. The knowledge base is append-only and contains accumulated research findings, reports, and references.

## When to use this

- **FIRST step** for any knowledge or research question — check the tome before answering from memory or launching web research
- When the user asks "what is X", "how does X work", "tell me about X", or similar knowledge questions
- When the user asks "do we know anything about X" or references prior findings
- When you need sources or references on a topic
- When preparing for meetings, reviews, or briefings where domain context would help
- Even when the user provides specific links or documents to review — prior domain context accelerates synthesis

## Workflow

### 1. Discover relevant keywords

Keywords are the **only** discovery mechanism — there is no full-text search. Always run `keywords` before `search` unless you already have an exact keyword from a previous query.

```bash
agent-tome keywords <prefix>
```

Try several prefixes covering different angles of your topic (the concept itself, related terminology, adjacent domains). Keywords are singularised and downcased (e.g., "threads" is stored as "thread"). Stop exploring once you've found vocabulary that matches your topic, or once two unrelated prefixes both return nothing relevant.

### 2. Search by keywords

```bash
agent-tome search <keyword1> <keyword2> ...
```

Use only keywords you confirmed exist in step 1. Default is `--match any` (OR) — start here. Switch to `--match all` only to narrow when you get too many hits; never on a first search.

Results are ranked by number of matching keywords. Each result shows `global_id`, `description`, `keywords`, and `matching_keyword_count`.

### 3. Fetch relevant articles

```bash
agent-tome fetch <global_id>
```

Returns full content: all entries (chronologically ordered), sources (web and file), and consolidation history. Read the entries to understand what's already known.

### 4. Explore related knowledge

```bash
agent-tome related <global_id>
```

Finds articles connected through shared keywords, explicit references, and consolidation links. Useful for discovering adjacent knowledge you didn't search for directly.

### 5. Check if a source was already used

```bash
agent-tome source-search <url-or-path>
```

If you're about to fetch a URL, check whether it's already been consulted. URLs starting with `http://` or `https://` are matched as web sources; everything else as file paths.

## Anti-patterns

- **Concluding the tome is empty from one search.** A sparse result means your keyword guess was wrong, not that the topic is uncovered. Go back to step 1 with different prefixes.
- **Demoing with meta-keywords.** Searching for `agent-tome` or other tooling names tests the CLI, not the knowledge. Use real topic keywords.
- **Generalising about tome contents from a single query.** Don't make claims about what the tome does or doesn't cover unless you've explored several angles.
- **Starting with `--match all`.** It almost always returns nothing on a first pass and makes the tome look empty.

## Reporting results

After looking up the knowledge base, report to the user:
- Whether relevant articles were found
- A brief summary of what's already known (don't dump raw JSON)
- Whether the existing knowledge is sufficient or fresh research is still needed
- If articles exist, mention their global IDs so the user can reference them later
- Do not make claims about the tome's overall size or coverage based on your searches
