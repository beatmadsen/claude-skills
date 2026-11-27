---
name: stop-time
description: "How to treat a stated stop time such as 'done by 2pm': it gates starting new work, not finishing work already started. TRIGGER when the user states a stop time or deadline for the session, and when you are deciding whether to start another task near one."
allowed-tools: Bash
---

# Stop time

A stated stop time ("done by 2pm") gates commencement, not completion. It governs exactly one thing: whether to start a new, unrelated thread. Run `date`, then apply the threshold:

- Five or more minutes left: start the next task and finish it, disregarding how long you think it will take. Overrunning the stop time to finish something you legitimately started is fine.
- Under five minutes: start nothing new, and bring what is already in your hands to completion.

Declining to start because "it cannot finish in time" is deferral dressed as prudence, and the estimate it rests on is unreliable anyway.
