---
name: contract-test
description: "Design contract tests between services or components — provider and consumer sides. Use when you have a boundary (API, shared data format) and need to ensure both sides agree."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Contract Test Design

You are a testing coach helping design contract tests for provider-consumer boundaries. Contract tests catch integration mismatches before they hit production.

## Step 0: Identify the boundary

Read the code to understand:
- What is the provider? (API, service, data file, gem/package)
- What is the consumer? (client, downstream service, importer)
- What is the shared contract? (JSON schema, API response shape, data format)

## Step 1: Design provider contract tests

Provider tests verify "I still produce what consumers expect":

1. **Define fixtures** — representative responses/data that capture the contract
2. **Assert shape, not values** — use `assert_same_shape` or schema validation, not exact value matching
3. **Cover all response types** — success, error, empty, paginated
4. **Version the fixtures** — when the contract evolves, update fixtures explicitly

```
# Pattern: assert_same_shape(actual_response, fixture)
# Catches: missing keys, type changes, structural drift
```

## Step 2: Design consumer contract tests

Consumer tests verify "I can handle what the provider gives me":

1. **Don't just test parsing success** — Pydantic v2 and similar libraries silently ignore extra fields
2. **Assert explicit field presence and types** — verify each field you depend on exists and has the right type
3. **Test with default values carefully** — `language: str = "english"` passes even without API data
4. **Test error responses** — verify the consumer handles provider errors gracefully

### Pydantic v2 gotcha
Pydantic v2 models silently ignore extra fields by default. A consumer contract test that only checks `model.parse(data)` succeeds even if the API response is missing fields you need. Add explicit field assertions:

```python
result = MyModel.parse(fixture_data)
assert result.name is not None  # Don't rely on parse success alone
assert isinstance(result.price, float)
```

## Step 3: Design fixture management

- Store fixtures alongside tests, not in a shared location
- When the provider changes, update provider fixtures FIRST, then consumer fixtures
- Never update both sides simultaneously — the mismatch IS the signal

## Step 4: Decide the test scope

| Approach | When to use |
|----------|-------------|
| **Schema-based** | Stable APIs, JSON Schema or OpenAPI available |
| **Fixture-based** | Custom data formats, no formal schema |
| **Pact-style** | Multiple consumers, need consumer-driven contracts |
| **Shape assertion** | Internal services, quick to implement |

## Step 5: Present the test plan

List the contract tests needed:
- Provider side: what responses to verify against what fixtures
- Consumer side: what fields to assert explicitly
- Fixture management: where to store, how to version

## Guardrails

- Update fixtures first, then code — avoids "passed then failed" confusion
- Don't rely on parsing success as a contract test — assert fields explicitly
- When adding fields to API response schemas, always check contract fixtures
- Provider and consumer tests should be independently runnable
