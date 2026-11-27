---
name: committing
description: "How the user commits, in any repository: commit at stable states, what the message must say, when a commit also needs an intent record, and what to check after rewriting history. TRIGGER before making any commit, after a commit to decide whether it needs an intent record, before adding commits to a branch you did not start, and after a squash, rebase or amend. Which repository kind this is (solo or team) is decided first by the global CLAUDE.md, which names the matching git workflow skill."
allowed-tools: Bash Read
---

# Committing

The git workflow skill for the repository kind (`git-solo-workflow` or `git-team-workflow`) says where commits go. This skill says how each commit is made, in either kind.

## When to commit

Commit early and often at stable states: each green test run, each working increment, each coherent change.

## The message

The commit message says what changed and why. In a repository other people work in, the message (and the PR description, when there is one) is the only record they see, so reasoning a reviewer or later maintainer needs goes there, never only into an intent record.

## Before adding commits to a branch

Read `git log <base>..HEAD` and report any commit you did not make.

## After the commit: does it need an intent record?

First confirm the commit landed (`git log -1` shows it). A pre-commit gate can refuse it, and HEAD then still names the previous commit.

Record an intent with the `intent-record` skill only when the commit carries something its message does not:

- an alternative you rejected, and why;
- something deliberately left undone that a reader would otherwise "fix";
- an assumption you made without asking;
- an instruction for whoever works here next;
- references worth linking in structured form (a ticket, design page, article, PR or earlier intent), beyond a ticket key already in the message.

Bookkeeping and mechanical commits get none. Record before starting the next piece of work. After an amend, rebase or squash of a commit that has a record, attach the new hash to it (`intent-record` says how). If `intent-record` is not installed, say so once in your summary and continue.

## After a squash or rebase

Compare the result's tree with the commit that last passed the full build: `git diff --quiet <verified> HEAD`. An identical tree carries the verification over; a different one needs a new run.
