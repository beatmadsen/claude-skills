# Tooling for the analysis

If `local.md` exists next to this file, read it first. It holds organisation-specific IDs, test commands and repo quirks that are kept out of version control.

## Pull request data

```bash
gh pr view <n> --repo <owner>/<repo> --json title,body,author,baseRefName,headRefName,headRefOid,files,commits
gh pr diff <n> --repo <owner>/<repo>
gh pr checks <n> --repo <owner>/<repo>
gh api repos/<owner>/<repo>/pulls/<n>/comments
gh search prs <KEY> --repo <owner>/<repo>
```

Quality gate details (for example SonarQube) are in the check-run summary:

```bash
gh api repos/<owner>/<repo>/commits/<sha>/check-runs --jq '.check_runs[] | select(.name|test("Sonar")) | .output.summary'
```

## Jira and Confluence

Through the Atlassian MCP server (namespace and cloudId in `local.md`, or from `getAccessibleAtlassianResources`). Read-only tools:

- `getJiraIssue`, with `fields` such as `description`, `comment`, `parent`, `issuelinks`, and `responseContentFormat: "markdown"`
- `searchJiraIssuesUsingJql`, for example `parent = <EPIC>` to list an epic's other tickets
- `getJiraIssueRemoteIssueLinks`, to find linked Confluence pages
- `getConfluencePage`, in markdown
- `searchConfluenceUsingCql`, for example `text ~ "<KEY>"`

Ticket keys match `[A-Z]+-\d+` in the PR title, branch, description or commit messages.

## Isolated checkouts

```bash
git fetch origin pull/<n>/head:pr-<n>
git worktree add /tmp/pr<n> pr-<n>                    # reading only, never mutated
git worktree add --detach /tmp/pr<n>-mutants pr-<n>   # mutations only
# ... at the very end:
git worktree remove --force /tmp/pr<n>
git worktree remove --force /tmp/pr<n>-mutants
git branch -D pr-<n>
```

## Background mutation run

Write each mutation as a patch against the PR head (make the edit in the mutants worktree, `git diff > /tmp/pr<n>-mutations/<nn>-<what>.patch`, then `git checkout -- .`). Keep each mutation type-correct so it compiles. Then start the run with the Shell tool set to `block_until_ms: 0`, so it runs in the background:

```bash
cd /tmp/pr<n>-mutants
for p in /tmp/pr<n>-mutations/*.patch; do
  git apply "$p"
  if <targeted test command> > "${p%.patch}.log" 2>&1; then
    echo "SURVIVED $(basename "$p")"
  else
    echo "KILLED   $(basename "$p")"
  fi
  git checkout -- .
done | tee /tmp/pr<n>-mutations/results.txt
```

Poll with `AwaitShell` while reading the tests for cheap additions. For each `KILLED`, check its log to tell a test failure from a compile error.

## Blast radius

In the worktree, for a changed public type, function or field:

```bash
rg -l "<Symbol>" --type <lang>
```

Across the organisation, for shared contracts such as protobuf messages, event payloads and client libraries:

```bash
gh search code "<Symbol>" --owner <org> --limit 50
```

Code search covers default branches only, so treat it as a lower bound on consumers.

## Running targeted tests

Use the narrowest selection the build tool allows: one module, one test class or pattern, offline where possible. Repo-specific commands are in `local.md`. Run the command once on the unmutated code first and confirm it passes, so a broken build isn't mistaken for killed mutations.
