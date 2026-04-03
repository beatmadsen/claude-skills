# Claude Skills

A personal collection of skills for [Claude Code](https://claude.com/claude-code).

## Skills

| Skill | Description |
|-------|-------------|
| [acceptance-test-design](skills/acceptance-test-design/) | Design acceptance tests from user stories or feature descriptions |
| [atdd-cycle](skills/atdd-cycle/) | Orchestrate a full ATDD double-loop cycle with inner TDD cycles |
| [atdd-mob](skills/atdd-mob/) | Mob programming team with testing coaches and a craftsman communicating via agent-chat |
| [contract-test](skills/contract-test/) | Design contract tests between services or components |
| [flaky-test-fix](skills/flaky-test-fix/) | Diagnose and fix intermittently failing tests |
| [hotspots](skills/hotspots/) | Identify risky hotspots by combining churn and complexity analysis |
| [legacy-test](skills/legacy-test/) | Add tests to untested legacy code safely using characterization tests |
| [mock-audit](skills/mock-audit/) | Review test double usage for correctness |
| [mutation-test-review](skills/mutation-test-review/) | Interpret mutation testing results and improve test quality |
| [property-test](skills/property-test/) | Design property-based tests for functions or data transformations |
| [ralphify](skills/ralphify/) | Background knowledge about Ralphify, an autonomous AI coding loop tool |
| [tdd-green](skills/tdd-green/) | Write minimal code to make a failing test pass (TDD GREEN phase) |
| [tdd-red](skills/tdd-red/) | Write a failing test for the next behavior (TDD RED phase) |
| [tdd-refactor](skills/tdd-refactor/) | Improve design while keeping tests green (TDD REFACTOR phase) |
| [test-double-design](skills/test-double-design/) | Design the right test double for a dependency |
| [test-refactor](skills/test-refactor/) | Refactor tests for readability and maintainability |
| [test-smell](skills/test-smell/) | Diagnose test quality problems in a test file |
| [test-strategy](skills/test-strategy/) | Recommend a testing approach for a feature or component |
| [tome-capture](skills/tome-capture/) | Save research findings to an [agent-tome](https://github.com/beatmadsen/agent-tome) knowledge base |
| [tome-lookup](skills/tome-lookup/) | Search an [agent-tome](https://github.com/beatmadsen/agent-tome) knowledge base before researching a topic |
| [unit-test-design](skills/unit-test-design/) | Design unit tests by identifying exit points and choosing test doubles |

## Installation

Pick the scope that fits your needs.

### For all your projects (personal)

Copy a skill into your personal skills directory:

```bash
mkdir -p ~/.claude/skills
cp -r skills/tdd-red ~/.claude/skills/tdd-red
```

### For a single project

Copy a skill into the project's `.claude/skills/` directory:

```bash
cd /path/to/your/project
mkdir -p .claude/skills
cp -r skills/tdd-red .claude/skills/tdd-red
```

Commit it to share with your team.

### Stay up to date

Clone this repo and symlink instead of copying:

```bash
git clone https://github.com/beatmadsen/claude-skills.git ~/claude-skills

# Link a specific skill
ln -s ~/claude-skills/skills/tdd-red ~/.claude/skills/tdd-red
```

Pull to get updates:

```bash
cd ~/claude-skills && git pull
```

## Prerequisites

Some skills have external dependencies. Check the skill's `SKILL.md` for details.

**atdd-mob** requires [`agent-chat`](https://github.com/beatmadsen/agent-chat) to be installed and on your `PATH`.

**tome-capture** and **tome-lookup** require [`agent-tome`](https://github.com/beatmadsen/agent-tome) to be installed and on your `PATH`.

**hotspots** requires [`churn_vs_complexity`](https://github.com/beatmadsen/churn_vs_complexity) to be installed and on your `PATH`.

## Usage

After installing a skill, start a new Claude Code session. Invoke it with the slash command:

```
/tdd-red write a test for the User#authenticate method
```

Or describe what you want and let Claude match it to the skill automatically.
