# Scenario checks

Review cases for the skill's behaviour. These are illustrative planning outcomes,
not verified diagnoses of the user's projects or substitutes for executing a test.

## Overnight polish made the product less appealing

Input: "The agent worked all night. I don't like how it looks, and now I'm
questioning the whole design."

A useful response separates the working behaviour from the disappointing
appearance. It inspects the current output, preserves the user's authority over
taste, and recommends a bounded comparison instead of another unattended polish
pass or a wholesale rewrite.

The three queued steps could be:

1. Capture one representative screen and annotate the mismatch with the intended
   experience, producing a baseline the user can react to.
2. Build a comparison around one visible design question, producing equally
   finished candidates over the same content.
3. Try the chosen direction on a second representative screen, learning whether
   the choice holds beyond the first example.

The second step depends on an identified question. The third waits for the user's
choice. During preparation, the wiki uses existing screenshots or labelled
illustrations; it does not execute the queued captures or comparisons.

Failure: declaring the design fixed because tests pass, choosing the user's
favourite, or treating the overnight effort as a reason they must keep it.

## An iPad app's USB interaction meets screen-off behaviour

Input: "The app works, but the screen turns off. Background operation might not
get approved; preventing sleep feels like a compromise."

A useful response separates observed device behaviour from assumptions about
background execution and distribution policy. It consults current primary
documentation before making a policy claim and preserves the intended physical
use of the app.

The three queued steps could be:

1. Reproduce the exact USB workflow on the target device through screen-off,
   recording what actually stops and what continues.
2. Test one supported operating mode selected from that evidence and current
   documentation, with a concrete way to restore the existing behaviour.
3. Try that mode in a representative use session, learning whether its visible
   compromise preserves the experience or calls for a different product shape.

Device access is explicit. Later steps remain conditional on observed behaviour;
they do not assume background operation or preventing sleep is available or right.

Failure: guaranteeing store approval, substituting a simulator result for the
device behaviour, or proposing a risky background mode as an established solution.

## A database API never quite feels right

Input: "The web framework is almost right, but I can't settle on a database API."

A useful response looks at real caller code and identifies the awkward operation.
It preserves working functionality and makes the taste question concrete.

The three queued steps could be:

1. Extract representative caller examples, learning where the current API makes
   the intended operation hard to express.
2. Render contrasting API shapes against those same examples, leaving persistence
   internals alone and making trade-offs visible for the user's judgment.
3. Implement the chosen shape for one vertical slice, learning whether its pleasant
   caller syntax survives real behaviour and error handling.

The last step waits for the user's choice. Preparation may quote existing caller
code in the wiki, but does not implement the alternatives.

Failure: an abstract debate, a library rewrite before comparison, or inventing a
preference from the agent's own style.

## Resume and permission boundaries

For any example, "Looks interesting" leaves all steps unstarted. "Begin step one"
authorises only that step. A result that disproves the route is recorded as useful
evidence and leads to a revised proposal awaiting permission, not silent expansion
of the work.

After a new session or page reload, the same plan and task IDs remain available.
The landing page shows the current three steps, with the full plan accessible but
secondary. Missing device access or an unavailable renderer is stated plainly;
neither becomes invented evidence of feasibility or completion.
