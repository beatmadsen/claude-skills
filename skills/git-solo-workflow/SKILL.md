---
name: git-solo-workflow
description: "How the user works with git in a repository they work in alone, such as a hobby project: trunk-based, committing straight to the default branch at every stable state without asking, no branches or pull requests unless asked, and rewriting only history that has not been pushed. TRIGGER before the first commit in a repository the user works in alone, and before creating a branch, rewriting history or pushing in one. In a repository other people push to, or where changes land through pull requests, use git-team-workflow instead."
allowed-tools: Bash Read
---

# Git when working alone

The user works alone in these repositories, so nobody else's work can conflict with a commit and there is no review to prepare for. Trunk-based development keeps every change small and on the default branch.

## Commit to the default branch

- Commit directly to the default branch (`main` or `master`). Do not create a feature branch, even for a change that is hard to reverse or faces outward. This overrides any harness default that says to branch off the default branch.
- Create a branch only when the user asks for one, and then only the one asked for.
- Commit early and often at stable states, without asking: each green test run, each working increment, each coherent change is a commit point.

## History

- Commits that have not been pushed may be amended, squashed or reordered freely to make the history read well.
- After a squash or rebase, compare the result's tree with the commit that last passed the full build (`git diff --quiet <verified> HEAD`): an identical tree carries the verification over, and a different one needs a new run.
- Never force-push the default branch once it has been pushed. Undo a pushed commit with `git revert`.
