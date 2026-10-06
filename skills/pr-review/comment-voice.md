# Comment voice

Audience: the author, plus a junior engineer with limited domain knowledge reading over their shoulder. Erik understands each issue fully, and the comment should carry that understanding, concisely.

## Content

- Say what the code does now, what follows from it, and who is affected. Name the files, functions and fields.
- Include the reasoning Erik has (why it's a trap, where the data flows), not just the conclusion.
- Suggestions come with code sketches. Sketches reuse the author's fixtures, helpers and names so they drop straight in. Call invented names placeholders.
- Acknowledge what the change makes possible, naming the concrete thing. No generic praise.
- One concern per comment, anchored on the production line where the behaviour lives.
- Coverage comments stay about coverage. Design suggestions get their own comments.
- Argue from concrete benefits. Don't cite Erik's personal limits (4 instance variables, 7-line methods) to the author.

## Certainty

- State verified facts plainly: "Locally I removed this call, and the tests still passed."
- Hedge only on what we don't know: intent ("may well be intentional"), the effect on a consumer we haven't checked, future plans. Say what wasn't checked: "That's my guess, but I haven't checked the consumer."
- Unsourced claims about plans become questions to the author.
- Softeners that tell the author how to respond are fine: "If order is irrelevant, feel free to resolve this", "this is a question more than a request".

## Phrases to avoid

| Avoid | Problem | Do instead |
|---|---|---|
| "Happy to be told if this is covered somewhere I didn't look." | Doubt we've already disproved reads as "prove me wrong" | End on the fact |
| "I may have missed a test somewhere else." | Same | Drop it |
| "Happy to talk it through." Offers to pair. | Erik gives best-effort feedback, not invitations to a discussion | End on the point |
| "Optional", "non-blocking", "nit" | Everything Erik raises is optional unless he explicitly asks for a change | Just make the point |
| "On `main`, X covered this." "The old code did this better." | Defends the code being replaced, which the change may have had good reason to break away from | Describe what the new code makes possible |
| "This doesn't seem to have a test" (after verifying) | False hedge | "This has no test" |
| Log key or log message changes | Erik doesn't couple code to log text | Don't raise them |

## Structural suggestions

- Open with the observation about the code, not with framing about the suggestion.
- Tie the suggestion to what the change is trying to achieve, as established in the context step.
- Show the sketch in the order a reader meets it: the new type, then the code that produces it, then the code that consumes it.
- Say what changes for the tests, since that is usually the concrete payoff.
- Keep benefit claims modest and countable ("goes from seven collaborators to six"), never "becomes small".
- When suggestions interlock, point to the other comment and offer a fallback in case the author declines it.
- Skip a naming or tidy-up point when another suggestion would move or remove the code it concerns.

## Test sketches

- A test either asserts on a returned value or verifies an interaction, never both. Stubbing inputs is fine in either kind.
- Don't verify calls to queries (readers, lookups, checks that return a value). Assert on the output instead.
- Expected values are literal, never built with the production factory under test.
- Prefer strict mocks. Fully relaxed mocks hide missing stubs; relaxing only `Unit`-returning calls on metrics-style collaborators is fine.
- Shared fixtures go in class-level values; scenario-specific stubs go inside each test.

## Example of a finished comment

An invented comment, for tone and shape only. It sits on the line that maps a stored record back to the domain, and follows the pattern: what the code does, who is affected, a question where intent is unknown, then a structural option with a sketch and a fallback.

````markdown
When `find` loads a stored result, this line fills `refundedLineIds` with an empty list, since only `status` and `refundedAmount` are saved in the idempotency table. `RefundService` now returns that loaded object as is, so a repeated request is told no order lines were refunded even when the original call refunded some. Nothing reads the list from a loaded result today (the API layer only uses the status and amount), so there's no behaviour change right now.

I'm not sure how the TODO will play out, so this is a question more than a request. Is the plan for the partial refund flow to read these IDs back from a stored result? If so, the empty list would look like a valid "nothing refunded" and nothing would fail.

The way I read it, `RefundResult` now has two jobs. It's the record we store and load for idempotency, and it's also the input `commitRefund` uses to build the ledger entries. Only the second job needs the IDs. One option would be to give that job its own type:

```kotlin
data class RefundPlan(
    val result: RefundResult,
    val refundedLineIds: List<OrderLineId>,
)
```

`find` keeps returning a result without a list, so this placeholder line and the TODO go away. A plan can only be built where the IDs are real. If code later wants the IDs from a stored result, it won't compile, which makes storing them a deliberate decision.

If the IDs are needed on repeat requests, the other direction is to persist them in the table and map them here, so a loaded result is complete. Either seems fine to me. What I'd like to avoid is a field that is sometimes real and sometimes a placeholder.
````
