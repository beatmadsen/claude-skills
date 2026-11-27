#!/usr/bin/env python3
"""PreToolUse hook for Bash: block one command that both inspects and deletes.

Guards against: printing a target's status and removing it in the same call,
so the output is never read before the delete happens. Exit 2 blocks the call
and shows the message to the agent. Any error allows the call (fails open).
"""
import json, re, sys

GIT = r"git(?:\s+(?:-C|-c)\s+\S+)*\s+"
SPLIT = re.compile(r"&&|\|\||;|\||\n")
DELETE = [
    r"^(sudo\s+)?(rm|rmdir|unlink|trash)\b",
    r"^" + GIT + r"(worktree\s+remove|clean|stash\s+(drop|clear))\b",
    r"^" + GIT + r"branch\s+(-\S*[dD]\S*|--delete)\b",
    r"^find\b.*\s-delete\b",
]
INSPECT = [
    r"^(ls|cat|head|tail|stat|du|wc|file|tree|grep|rg|find|diff)\b",
    r"^" + GIT + r"(status|log|diff|show|ls-files|worktree\s+list|branch|stash\s+list)\b",
]

def matches(patterns, segment):
    return any(re.search(p, segment) for p in patterns)

def verdict(command):
    segments = [s.strip() for s in SPLIT.split(command) if s.strip()]
    deletes = [s for s in segments if matches(DELETE, s)]
    inspects = [s for s in segments if matches(INSPECT, s) and not matches(DELETE, s)]
    if deletes and inspects:
        return (f"Blocked: this one call both inspects ({inspects[0]!r}) and deletes "
                f"({deletes[0]!r}). Run the inspection alone, read its output, then "
                f"delete in a separate call.")
    return None

if __name__ == "__main__":
    try:
        command = json.load(sys.stdin).get("tool_input", {}).get("command", "")
        message = verdict(command)
    except Exception:
        sys.exit(0)
    if message:
        print(message, file=sys.stderr)
        sys.exit(2)
