# Sources and their traps

Traps in the sources a production investigation draws its facts from: code, logs, a warehouse, a primary data store, the tracker. Each one produced a wrong number at least once before it was caught. The general gathering rules in SKILL.md step 3 apply on top.

## Code

- Read the production version. Find it from the version field in the logs or the deploy record on the release ticket, then compare that ref with your branch.
- Find the log line each path emits and **its level**. Production usually logs at INFO, so a DEBUG line such as "no action taken" never appears. Measure an INFO line on the same path instead.
- Check whether the log text survived a refactor (`git log -S '<text>'`). If it did, one query covers both the old and the new code.
- Repository read paths may filter or recompute things: a query that drops backup or archive rows, a lookup that recomputes a key from the record. Read them before you claim a lookup "can never find" something.

## Logs (occurrence, recent days)

- Full-text query syntax often joins words with OR by default. Quote the phrase, inspect the generated query before running it, and read sampled messages to confirm they all match.
- A search tool that returns a sample plus facets does not give totals. For totals, daily counts or per-ID joins, run date histogram and terms aggregations.
- Retention is often about a week. Measure it before quoting a rate: query a wide window and read the earliest timestamp. Older events are only in the warehouse.
- To follow one request across services, search its trace ID in every index on the flow, in the message text as well as the trace field. Some services print the trace ID only in their messages.
- An interactive single sign-on login can stall a foreground command. Run the first query in the background and poll it.
- A field you expect, such as region, may be missing on some services. Find another facet that carries the same information.
- Exports contain real user IDs. They stay local, and they cannot be fetched again once retention passes, so back them up.

## Warehouse (history, harm)

- User IDs may be masked in refined tables, so they cannot be mapped to keys in the primary store. Plan joins on business IDs instead.
- Before trusting history, validate the warehouse signature against the logs for the overlapping days, record by record. Then check daily row counts for the whole window: an ingest gap of several weeks looks like a real drop.
- A table that keeps one row per published version shows a carried-over record as one entity ID under two or more parent IDs. Know whether you are reading current state or version history.
- A success flag on an API audit event often means only that the request was accepted. Whether it was processed shows later on the same trace: the downstream event, or an error notification.
- Inbound and outbound events may not carry the same fields, so a filter on a field only one direction carries misses the other. Link them by a field both carry.
- Joining failed events to "any later good state for that customer" also counts customers who genuinely did it again. Label such a count an upper bound when you first state it.
- `min()` of an event time can select an event from before the anchor you care about. Compare against all events after the anchor, and check that sub-counts add up to the total.
- Day buckets may differ from the logs because of time zones. Join by ID before you explain a difference.

## Mirrored state (who decides the status)

- When a service holds a status it takes from another system (by revalidation, sync or callback), a wrong status there usually means the upstream system still holds it. Check the upstream's own records before suspecting the mirror.

## Primary data store (current state)

- Describing a table is usually free and gives the key schema, billing mode, item count and size, so you can price a read before doing it.
- Lower roles are often denied reads on production tables (an explicit deny on the query action, or no permission on the table's encryption key). Try the least privileged role first. Ask the user before using an elevated role, and keep to read commands.
- A key lookup costs about one read. When warehouse IDs cannot be mapped to keys, a full scan of a small pay-per-request table costs little money; the real risk is load. Use parallel segments, throttle to a modest read rate, paginate, and pass a projection that leaves out user IDs.
- For a large table, or analysis you will repeat, prefer a point-in-time export queried offline over scanning production.
- Read one item's attribute names (not values) before projecting, because a wrong attribute name drops out silently.
- Exclude the records the repository excludes (backup or archive rows), or your counts will not match what the service sees.
- A copied record often keeps the original's creation timestamp, so a scan cannot date when copies appeared.

## Tracker and documentation (intent and remediation history)

- Read the comments on remediation tickets: "Done" has meant closed without the run. Check the audit data for the actions a completed run would have produced.
- Documentation states intended behaviour. Code that disagrees with it is either the bug or a documentation error. Say which you believe and why.
