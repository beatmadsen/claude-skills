---
name: flaky-test-fix
description: "Diagnose and fix a flaky test — passes sometimes, fails other times. Use when a test is intermittently failing."
allowed-tools: Read Grep Glob Edit Write Bash
---

# Flaky Test Fix

You are a testing coach diagnosing and fixing intermittent test failures. Flaky tests erode trust in the entire test suite.

## Step 0: Reproduce the flakiness

Read the failing test and its production code. Try to reproduce:
- Run the test in isolation: does it pass?
- Run the full suite: does it fail?
- Run it multiple times: is the failure random or order-dependent?

## Step 1: Check for common causes

### Shared mutable state
- **Symptom**: Test fails only when run after another specific test
- **Cause**: Previous test modifies global state, class variables, or shared fixtures
- **Fix**: Make each test create and clean up its own state

### Time dependency
- **Symptom**: Test fails at specific times (midnight, month boundaries, timezone changes)
- **Cause**: Using `Time.now`, `Date.today`, or similar without control
- **Fix**: Inject time as a dependency; use a clock stub

### Test order dependency
- **Symptom**: Test passes in one order, fails in another
- **Cause**: Test relies on side effects from a previous test
- **Fix**: Make tests fully independent; randomize test order to catch this

### Dir.chdir in parallel tests (Ruby)
- **Symptom**: Tests fail with "directory not found" or wrong file paths
- **Cause**: `Dir.chdir` is process-global — changes `Dir.pwd` for ALL threads
- **Fix**: Never use `Dir.chdir` in tests that run in parallel; resolve paths to absolute at API entry points

### Shared temp directories
- **Symptom**: Tests that create files/worktrees collide
- **Cause**: Multiple tests use the same fixed temp path
- **Fix**: Use unique identifiers in temp paths (`SecureRandom.hex`, `Thread.current.object_id`)

### STDERR capture in shared suites
- **Symptom**: STDERR assertions catch output from other tests
- **Cause**: Fd-level STDERR capture (`STDERR.reopen`) catches leaks from other tests in the same process
- **Fix**: Verify the command string includes the redirect, or verify the redirect mechanism separately

### ENV manipulation
- **Symptom**: Tests pass in isolation but fail in suite
- **Cause**: `ENV['PATH']` or other env var manipulation leaks between tests
- **Fix**: Never manipulate ENV in tests; inject dependencies instead. Pattern: `attr_writer :command_runner` with default fallback

### Race conditions
- **Symptom**: Test fails ~5-10% of the time regardless of order
- **Cause**: Async operations, thread timing, network latency
- **Fix**: Use deterministic synchronization (waiters, latches) instead of `sleep`; prefer structural tests (lock exists, lock is held) over true concurrency tests

### Floating point comparison
- **Symptom**: Test fails with values like `0.30000000000000004 != 0.3`
- **Cause**: IEEE 754 floating point arithmetic
- **Fix**: Use `assert_in_delta` / `assertAlmostEqual` with tolerance

## Step 2: Identify the root cause

Based on the symptoms, identify which cause matches. Read the test carefully for:
- Global state access (`ENV`, class variables, singletons, `Dir.chdir`)
- Time-dependent logic
- Shared fixtures or temp directories
- Async operations without synchronization
- File system operations with relative paths

## Step 3: Apply the fix

Fix the root cause, not the symptom:
- Don't add `sleep` or retries — these mask the problem
- Don't skip the test — that's giving up
- Inject dependencies instead of manipulating globals
- Make tests atomic and isolated

## Step 4: Verify the fix

Run the test suite multiple times to confirm the flakiness is resolved. If the suite supports randomized order, run with random seed.

## Guardrails

- Fix the root cause, not the symptom
- Never add `sleep` to fix flaky tests
- Never skip/disable a flaky test without filing a ticket to fix it
- After fixing, run the suite multiple times to confirm stability
