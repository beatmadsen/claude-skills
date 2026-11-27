---
name: delegated-judgment
description: "What to do when the user hands a decision back in the session: decide, act, do not re-ask, and write the resulting rule text where it belongs. TRIGGER when the user says 'you decide', 'pick the best approach', 'knowing my principle, choose', or otherwise explicitly hands the judgment on a question back to you."
allowed-tools: Read Edit Write Bash
---

# Delegated judgment

When the person who asked hands the judgment back, that is them landing the decision. It authorises you to make it, and to write the resulting rule text into the rulebook it concerns, which the global CLAUDE.md otherwise reserves for a human to land.

- **Trigger.** An explicit, in-session handover: "you decide", "knowing my principle, pick the best approach".
- **Required action.** Decide, then act. Do not re-ask.
- **Basis.** Take their stated principle as the spec and derive the mechanism from it.
- **Recording.** State the decision with its reasoning, write the resulting rule text, and flag it in your summary as theirs to veto.
- **Limits.** The delegation is specific to that question and expires with it. It never reaches a relaxation: being told to design a gate is not being told the gate may be weaker.
