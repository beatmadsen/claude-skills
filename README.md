# Claude Skills

A personal collection of skills for [Claude Code](https://claude.com/claude-code).

## Skills

| Skill | Description |
|-------|-------------|
| [agent-team](skills/agent-team/) | Mob programming team with 2 devs, a testing coach, and a craftsman communicating via agent-chat |

## Installation

Pick the scope that fits your needs.

### For all your projects (personal)

Copy a skill into your personal skills directory:

```bash
mkdir -p ~/.claude/skills
cp -r skills/agent-team ~/.claude/skills/agent-team
```

### For a single project

Copy a skill into the project's `.claude/skills/` directory:

```bash
cd /path/to/your/project
mkdir -p .claude/skills
cp -r skills/agent-team .claude/skills/agent-team
```

Commit it to share with your team.

### Stay up to date

Clone this repo and symlink instead of copying:

```bash
git clone https://github.com/beatmadsen/claude-skills.git ~/claude-skills

# Link a specific skill
ln -s ~/claude-skills/skills/agent-team ~/.claude/skills/agent-team
```

Pull to get updates:

```bash
cd ~/claude-skills && git pull
```

## Prerequisites

Some skills have external dependencies. Check the skill's `SKILL.md` for details.

**agent-team** requires [`agent-chat`](https://github.com/beatmadsen/agent-chat) to be installed and on your `PATH`.

## Usage

After installing a skill, start a new Claude Code session. Invoke it with the slash command:

```
/agent-team build a REST API for managing bookmarks
```

Or describe what you want and let Claude match it to the skill automatically.
