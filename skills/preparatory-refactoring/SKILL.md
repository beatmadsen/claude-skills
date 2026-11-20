---
name: preparatory-refactoring
description: "Make the change easy, then make the easy change: before changing behaviour, state the change, list the friction in the current code that makes it harder than it needs to be, and make only the behaviour-preserving refactorings that remove that friction, stopping when the change has become a small edit in one place per caller. TRIGGER before starting a behaviour change or defect fix in existing code, when a refactoring is growing beyond what the change needs, and when the user asks to make a change easy first or to refactor before a fix."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Preparatory Refactoring

"Make the change easy (warning: this may be hard), then make the easy change" (Kent Beck). A refactoring earns its place in a piece of work by making the behaviour change smaller or safer. One that cannot point at the change it eases is a separate piece of work, however much it improves the code.

## Step 1: State the behaviour change

Write down how the behaviour should change before touching the code: the cases, what happens in each, and what stays as it is. Check it against the ticket or the request as it stands now, not as it was first written. This is what the refactoring serves, so it comes first.

## Step 2: Find the friction

Read the code the change touches and list what makes the change harder than it needs to be, with file and line. Typical friction:

- The same decision made in more than one place, so changing it means changing every copy consistently, or two copies drifting apart.
- A data shape that cannot hold what the change needs, such as a map with one value per key where the change needs every value.
- A decision tangled with the action it drives, so a new outcome has nowhere to go.
- A value unwrapped or narrowed too early, so the type no longer says what it is.

Also note what is not friction: the parts the change can already use as they are, such as tests that are already easy to write for the new case.

## Step 3: Remove it, and stop

- Make the smallest refactoring that removes each piece of friction, behaviour-preserving and confirmed by the existing tests, which should pass unchanged.
- Stop when the change is a small edit in one place per caller. Duplication the change does not touch can stay; three copies of a short, obvious flow are often cheaper to review than the abstraction that would merge them.
- In a team repository, keep the refactoring in its own commit ahead of the behaviour change, as `git-team-workflow` says, and name in its message the friction each refactoring removes.
- When the refactoring grows past what the change needs (new packages, frameworks, strategies nobody asked for), stop and ask whether it belongs in its own piece of work. A pull request that restructures more than its change needs is hard to get reviewed, whatever the quality of the restructuring.

## Then make the change

Make the behaviour change test first, as `defect-fix` or `test-writing` says. If the change still needs restructuring along the way, that friction was missed in Step 2: add it to the refactoring rather than mixing it into the change.
