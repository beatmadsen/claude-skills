# Reviewing Acceptance-Level Tests

The trust, maintainability and readability reference is distilled from a book about unit tests. Its questions still hold for a test that drives the whole system, but its priorities do not: judged by unit criteria, an acceptance test looks weak wherever it leaves a decision to the collaborator that owns it, and the review then misses what actually goes wrong at this level. Use the questions below for any test that stands the system up and drives it from outside.

## Does it fail when the feature breaks?

Trust still comes first. Break production in a way a user of the system would notice (an extra message, a wrong field, a missing response) and watch the test go red. A test that describes behaviour which already exists could never start red, so deliberate breakage is the only evidence it bites. If you cannot run the suite, say in the review that this is unverified rather than leaving it out.

An acceptance test is coarse by design. A broken internal decision that it does not catch is not a gap when a lower-level test owns that decision; find that test before reporting one. Report it as a gap only when no test anywhere would fail.

## Does setup go through the front door?

Look at the given steps as hard as the assertions. Setup that writes straight into repositories, tables or caches couples the suite to the persistence layer, which is what a refactor reshapes first, and it can create a state the real input path would refuse (a record an ingestion filter drops, a combination no flow produces).

Prefer the system's real entry points (its input topics, its API) wherever they are cheap. A back door is acceptable where the real path is expensive, such as a multi-step flow with external calls, provided every state it seeds is one production can reach. Name which givens use a back door and whether a cheap front door exists.

## Is the given world realistic?

Coincidences in test data are a realism defect: two ids of different kinds sharing a value, one value standing in for several roles, inputs missing what a real upstream always sends. Rank them by whether they can change the outcome the test asserts. Remove one that can; mention one that cannot only as cleanup.

## Does it assert on what a consumer can observe?

The then side should read the system's outputs (published messages, responses, calls to its dependencies) and not stored records, logs or internal state. Asserting that only the expected output was produced is stronger than asserting the expected one is among them.

## Is the suite a list of rules?

The value of an acceptance suite is the set of behaviours it states in the domain's language. When recommending more coverage, propose the next scenario a product owner would recognise, often a negative one ("nothing is published when..."), rather than more checks on a scenario already there.

## Is the test separated from the mechanics?

As scenarios multiply, keep the test case, the domain-language steps, and the drivers that speak the system's protocols (Kafka, HTTP, a database) in separate layers, as in Dave Farley's four-layer model for acceptance tests. Steps that also hold the protocol code are fine for a handful of tests and become the maintenance cost once several features share them. Raise it in proportion to the suite's size.

## Ranking

Rank acceptance-level findings in this order: does not fail when the feature breaks; setup coupled to internals or seeding unreachable states; unrealistic data that can change the outcome; assertions on internals; missing rules; layering; readability.
