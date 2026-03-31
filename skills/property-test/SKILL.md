---
name: property-test
description: "Design property-based tests for functions or data transformations. Use when example-based tests feel insufficient and you want to test invariants across many inputs."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Property-Based Test Design

You are a testing coach helping design property-based tests — tests that verify invariants across many randomly generated inputs rather than specific examples.

## Step 0: Understand the function

Read the code to test. Property-based testing works best for:
- Pure functions (input -> output, no side effects)
- Data transformations (parsing, serialization, encoding)
- Mathematical operations
- Data structure operations (insert, delete, merge)

If the code is heavily stateful or I/O-dependent, example-based tests may be more appropriate.

## Step 1: Identify properties

A property is an invariant that holds for ALL valid inputs. Common property patterns:

### Round-trip / Inverse
The most powerful and common property. If you can encode and decode, the round-trip should produce the original.
- `decode(encode(x)) == x`
- `deserialize(serialize(x)) == x`
- `decompress(compress(x)) == x`

### Idempotency
Applying the operation twice gives the same result as once.
- `sort(sort(list)) == sort(list)`
- `normalize(normalize(text)) == normalize(text)`

### Invariant preservation
The operation preserves some property of the input.
- `len(sort(list)) == len(list)` (sorting preserves length)
- `sum(sort(list)) == sum(list)` (sorting preserves sum)
- `set(shuffle(list)) == set(list)` (shuffling preserves elements)

### Commutativity / Associativity
Order doesn't matter.
- `add(a, b) == add(b, a)`
- `merge(merge(a, b), c) == merge(a, merge(b, c))`

### Oracle / "No worse than"
Compare against a known-correct (possibly slow) implementation.
- `fast_sort(list) == reference_sort(list)`
- `optimized_search(data, query) is subset of exhaustive_search(data, query)`

### Hard to compute, easy to verify
The output is hard to produce but easy to check.
- For a factorization: `product(factors) == original AND all(is_prime(f) for f in factors)`
- For a sort: `is_sorted(result) AND same_elements(result, input)`

## Step 2: Design generators

For each property, define what valid inputs look like:
- What types? (integers, strings, lists, custom objects)
- What ranges? (positive, non-empty, bounded size)
- Any constraints? (sorted input, unique elements, valid JSON)

Use the project's property testing library conventions (Hypothesis, QuickCheck, jqwik, fast-check, etc.).

## Step 3: Write the property tests

For each property:
1. Name it: `test_property_[invariant]` or `test_should_[invariant]_for_all_[input_type]`
2. Declare the generators
3. Express the property as an assertion
4. Consider edge cases the generator might miss (empty, single element, max size)

## Step 4: Run and interpret

Run the property tests. If a failure is found:
1. Read the **shrunk** counterexample — the simplest failing input
2. This often reveals the exact boundary condition that's broken
3. Consider adding the counterexample as a named regression test

## Guardrails

- Properties complement example-based tests — they don't replace them
- If you can't articulate a property, example-based tests are fine
- Don't over-constrain generators — let them explore the input space
- If tests are slow, reduce the number of examples rather than constraining inputs
