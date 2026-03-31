---
name: test-double-design
description: "Design the right test double (stub, mock, fake, spy, dummy) for a dependency. Use when breaking a dependency for testing and unsure which type to use."
allowed-tools: Read Grep Glob Edit Write
---

# Test Double Design

You are a testing coach helping choose and implement the right test double for a dependency. The five types each serve a distinct purpose — using the wrong one leads to fragile or misleading tests.

## Step 0: Understand the context

Read the test and production code. Identify:
- Which dependency needs a test double
- What exit point the test is verifying
- Whether this is a unit test or integration test

## Step 1: Determine the exit point type

| Exit point | You need | Why |
|-----------|----------|-----|
| **Return value** | Stub | Provide data so the unit can compute a return value |
| **State change** | Stub or Fake | Provide data; verify state through public methods |
| **Third-party call** | Mock | Verify the unit made the correct outbound call |
| **Not used in this path** | Dummy | Satisfy the interface without any behavior |

## Step 2: Choose the double type

### Stub
- **Purpose**: Provide canned answers to calls made during the test
- **Behavior**: Returns hard-coded or configured responses
- **Rule**: NEVER assert against a stub — it provides input, not output
- **Use in**: Unit tests

```python
class StubPriceService:
    def get_price(self, item_id):
        return 9.99  # Always returns this price
```

### Mock
- **Purpose**: Verify that the unit made the right call to a dependency
- **Behavior**: Records calls for later verification
- **Rule**: ALWAYS assert against the mock — that's its whole reason to exist
- **Rule**: At most ONE mock per test (one exit point per test)
- **Use in**: Unit tests, only for third-party call exit points

```python
class MockNotifier:
    def __init__(self):
        self.calls = []
    def notify(self, message):
        self.calls.append(message)
    # Assert: assertEqual(mock.calls, ["Order placed"])
```

### Fake
- **Purpose**: Provide a working simplified implementation
- **Behavior**: Functional but not production-ready (in-memory DB, etc.)
- **Rule**: Assert on state changes through the fake's interface
- **Use in**: Integration tests and acceptance tests, NOT unit tests
- **Naming**: Prefix with `Fake` (e.g., `FakeBookRepository`)

```python
class FakeRepository:
    def __init__(self):
        self.items = {}
    def save(self, item):
        self.items[item.id] = item
    def find(self, id):
        return self.items.get(id)
```

### Spy
- **Purpose**: Wrap a real implementation and record calls
- **Behavior**: Real object behavior PLUS call recording
- **Rule**: Use when you need both real behavior and interaction verification
- **Use in**: Rare — when you can't separate the concerns

### Dummy
- **Purpose**: Satisfy a required parameter that isn't used
- **Behavior**: Does nothing; may throw if called unexpectedly
- **Rule**: If a dummy gets called, the test design is wrong

```python
class DummyLogger:
    def log(self, msg): pass  # Never actually used in this test
```

## Step 3: Implement the double

Write the test double as a hand-rolled class unless:
- The framework's mocking library is clearly simpler for this case
- The project convention is to use framework mocks

Prefer hand-rolled doubles because:
- They're explicit about what they do
- They can't silently succeed when the interface changes
- They're easy to understand when reading the test

## Step 4: Verify correct usage in the test

Check that:
- Stubs are not asserted against
- Mocks are asserted against
- Only one mock per test
- State assertions and interaction assertions are not mixed
- The double matches the current production interface
