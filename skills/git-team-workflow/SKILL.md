---
name: git-team-workflow
description: "How the user works with git in a team repository where changes land through pull requests: one branch and one pull request per piece of work, never another branch or pull request for part of it unless asked, the preparatory refactoring in its own commit ahead of the behaviour change, review fixes as separate commits folded before merge, force-pushing only with a lease and never past an approval without warning, undoing pushed work with a revert, and keeping the pull request description current. TRIGGER before the first commit in a repository other people push to or where changes land through pull requests, and before creating a branch or pull request, folding or squashing commits, force-pushing, or moving a pull request out of draft there. In a repository the user works in alone, use git-solo-workflow instead."
allowed-tools: Bash Read
---

# Git in a team repository

In a team repository, the pull request is how a change gets reviewed and the record reviewers and later maintainers read. The practices below keep each pull request about one piece of work, easy to review, and safe to update while others are looking at it.

## One branch, one pull request

- Each piece of work (usually one ticket) gets one branch, cut from the up-to-date default branch, and one pull request.
- Never create another branch or pull request for part of that work, such as a refactoring it needs or a follow-up step, unless the user asks. Refactoring the work needs belongs in the same pull request, in its own commit.
- Commit at stable states on the branch, as in any repository. The `committing` skill says how each commit is made.

## Commits a reviewer can read

- For a behaviour change, put the refactoring that prepares it in its own commit, which changes no behaviour, ahead of the commit that changes behaviour. A reviewer can then read the restructuring and the intended change apart. The `preparatory-refactoring` skill says how to find that refactoring and when to stop.
- The refactoring commit's message names, for each refactoring, the friction it removes for the coming change. The behaviour commit's message describes the change and its rules as the code now has them.
- Working commits made along the way are folded into those commits before review. When folding, write the combined message afresh from the final code; do not concatenate the old messages.

## During review

- Add review fixes as separate commits, so the reviewer sees exactly what changed since they looked.
- Fold them into the commit they belong to before merge, and update that commit's message and the pull request description for everything the fixes changed.
- Read every point the review summary names against the inline comments. Ask the reviewer about any point that has no comment rather than guessing what it meant.

## Rewriting a pushed branch

- Force-push only with a lease on the commit you expect the remote to have: `git push --force-with-lease=<branch>:<expected sha>`.
- Before force-pushing a branch whose pull request is approved, tell the user that the push may dismiss the approval. Many repositories dismiss approvals on any new push, so fold commits before asking for review, or after the last approval, rather than in between.
- Undo a pushed commit with `git revert` unless the user asks for the history to be rewritten. Others may have fetched it.

## The pull request

- Open it as a draft. Before moving it out of draft, check that CI passes on the head commit, that the diff and the commit messages contain nothing the work's constraints forbid (customer identifiers, secrets), and that the description matches the code.
- The description is the record reviewers read. Update it in the same step as any push that changes what it says.
- Pin links in the description to a commit hash. A relative link resolves against the pull request page and breaks, and a link to the branch breaks once the branch is deleted after merge.
