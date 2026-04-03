---
name: tome-lookup
description: "Search the agent-tome knowledge base before researching a topic. Use when encountering a topic that may already have been researched, when the user asks about prior findings, or before doing web research on a subject."
allowed-tools: Bash Read
---

# Tome Lookup

You are checking the agent-tome knowledge base for existing knowledge before doing fresh research. The knowledge base is append-only and contains accumulated research findings, reports, and references.

## When to use this

- Before researching a topic that might already be covered
- When the user asks "do we know anything about X"
- When you encounter a domain concept that sounds like it could have been previously investigated
- When you need sources or references on a topic

## Workflow

### 1. Discover relevant keywords

Keywords are the **only** discovery mechanism — there is no full-text search. Start with a keyword prefix search to understand the vocabulary:

```bash
agent-tome keywords <prefix>
```

Try a few prefixes related to your topic. Keywords are singularised and downcased (e.g., "threads" is stored as "thread").

### 2. Search by keywords

```bash
agent-tome search <keyword1> <keyword2> ...
```

Default is `--match any` (OR). Use `--match all` to narrow results when you get too many hits.

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

## Reporting results

After looking up the knowledge base, report to the user:
- Whether relevant articles were found
- A brief summary of what's already known (don't dump raw JSON)
- Whether the existing knowledge is sufficient or fresh research is still needed
- If articles exist, mention their global IDs so the user can reference them later
