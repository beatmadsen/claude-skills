---
name: hotspots
description: Identify risky hotspots in the codebase by combining churn (how often files change) and complexity using churn_vs_complexity
allowed-tools: Bash Glob Read
---

# Hotspots Analysis

Analyse the current project to find high-risk files — those that change frequently AND are complex.

## Step 0: Verify churn_vs_complexity is installed

Run `which churn_vs_complexity`. If it is not found, tell the user it is required and offer to install it with `gem install churn_vs_complexity`. Stop and wait for confirmation before proceeding.

## Step 1: Verify this is a git repository

Run `git rev-parse --show-toplevel` from the current working directory. If this fails, tell the user hotspot analysis requires a git repository (churn is measured from git history). Stop.

Store the repository root as REPO_ROOT.

## Step 2: Detect the project language

Count source files by extension in the repository to decide which `--<language>` flag to use. Use Glob to check for each supported language:

| Language flag | Glob patterns |
|---------------|---------------|
| `--java` | `**/*.java` |
| `--ruby` | `**/*.rb` |
| `--js` | `**/*.js`, `**/*.ts`, `**/*.jsx`, `**/*.tsx` |
| `--python` | `**/*.py` |
| `--go` | `**/*.go` |

Pick the language with the most source files. If the repository contains significant code in multiple languages, mention this to the user and explain which one you chose and why.

If zero supported files are found, tell the user which languages are supported and stop.

## Step 3: Run hotspot analysis

Run the tool from the repository root:

```
churn_vs_complexity --hotspots --<language> --quarter --json REPO_ROOT
```

Using `--quarter` gives a focused view of recent churn. Using `--json` makes the output easy to parse.

If the result is empty or the tool errors, retry with `--year` for a wider window. If that also fails, try without a time modifier.

### Bundler interference

If `churn_vs_complexity` fails with a `LoadError` (e.g. `cannot load such file -- churn_vs_complexity`), Bundler in the project is restricting gem loading. Work around this by running the command from a temporary directory outside the project while still passing the REPO_ROOT as an argument:

```
cd /tmp && churn_vs_complexity --hotspots --<language> --quarter --json REPO_ROOT
```

This avoids Bundler's environment while still analysing the correct repository.

## Step 4: Present the results

Parse the JSON output. Present a summary to the user:

1. **Top hotspots** — list the highest-risk files (highest gamma scores) in a markdown table with columns: file, complexity, churn, gamma (risk score).
2. **Interpretation** — briefly explain what the scores mean:
   - High gamma = high churn + high complexity = most likely to harbour bugs
   - Suggest which files would benefit most from refactoring or increased test coverage
3. **Optional next steps** — offer to:
   - Run `--graph` mode to generate an interactive HTML visualisation
   - Run `--triage` on specific files for deeper analysis
   - Run `--diff` to compare against a branch or tag
