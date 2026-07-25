---
name: pyramid-rebalance
description: "Gateway skill for moving a single test file to the right level of the test pyramid. Read this BEFORE rebalancing test layers, splitting a misplaced test, or pushing acceptance coverage down. TRIGGER phrases: 'rebalance the test pyramid', 'this unit test hits the database', 'these tests are at the wrong level', 'push this acceptance test down', 'move tests off the DB', 'split this test into unit and integration', 'improve test pyramid', or when invoked inside a /loop that iterates over test files. Scope: one file per invocation. Applies decision rules: pure logic belongs in unit tests, behavior that genuinely needs the DB/HTTP belongs in integration, and acceptance tests that only validate single-command input rejection or pure validation get pushed down. Does NOT commit or push — leaves staging to the user or the surrounding loop."
allowed-tools: Read Edit Write Bash Grep Glob
---

# Pyramid Rebalance Gateway

Read this skill BEFORE refactoring a test to a different pyramid level. It coordinates dispatch to specialized test skills so the rebalance is grounded in real analysis, not pattern matching on file paths.

## When to use

Use when the user wants to **move a test to the level it belongs at**. Typical signals:

- Tests in `test/unit/` (or `tests/unit/`, `src/test/unit/`, etc.) that touch a real database, real HTTP, or other slow shared resources.
- Tests in `test/acceptance/` (or `e2e/`, `feature/`) that only validate input rejection, pure parsing, or single-command logic that a faster test could cover.
- The user mentions "test pyramid", "wrong level", "should this be unit or integration", or runs this skill from a `/loop` over a candidate list.

Do **not** use when:
- The user wants a fresh test suite designed → use `test-strategy`.
- The user wants test-quality smells fixed without moving levels → use `test-smell` directly.
- The user wants to write a *new* test → use `test-writing`.

## Scope rule

**One file per invocation.** Pyramid work compounds badly when batched — each file deserves its own analysis. If the user hands you multiple candidates, pick the highest-priority one (rules below), finish it, then offer to do the next.

## Step 1: Identify the project's test layout

Different projects label pyramid levels differently. Detect, don't assume.

1. Look for top-level test directories:
   ```bash
   find . -maxdepth 4 -type d \( -name unit -o -name integration -o -name acceptance -o -name e2e -o -name feature \) -path '*/test*' 2>/dev/null
   ```
2. Note which exist. Common mappings:
   - Unit: `test/unit/`, `tests/unit/`, `src/test/java/.../unit/`, `spec/unit/`
   - Integration: `test/integration/`, `spec/integration/`
   - Acceptance / e2e: `test/acceptance/`, `test/e2e/`, `test/feature/`, `spec/feature/`, `cypress/`, `playwright/`
3. If the project has no integration dir but the work calls for one, **create it** rather than dumping integration tests into `unit/`. Mention this to the user.
4. Identify the test runner command (`bundle exec rake test`, `pytest`, `npm test`, `mvn test`, etc.) by reading the root config (`Rakefile`, `package.json`, `pom.xml`, `Makefile`). If unclear, ask.

## Step 2: Pick the file (only if not given one)

If the user did not specify a file, prioritize:

1. **"Unit" tests that touch shared infrastructure.** Grep for DB setup mixins, HTTP fixtures, container fixtures inside the unit directory. The pattern depends on the stack — pick what fits, and add project-specific helper names if the user points them out:
   ```bash
   # Common signals across stacks — adjust to taste:
   #   Ruby:   ActiveRecord, database_cleaner, factory_bot, Rack::Test, project-local DB setup mixins
   #   Python: pytest fixtures using a real engine, TestClient, requests.Session, httpx.Client, alembic
   #   JVM:    @SpringBootTest, @DataJpaTest, TestContainers, MockMvc with a real context
   #   Node:   knex, prisma in beforeAll, supertest against a real server
   grep -rlE "(database_cleaner|factory_bot|ActiveRecord::|TestContainers|@DataJpaTest|@SpringBootTest|prisma\.\$connect|supertest|httpx\.Client|requests\.Session)" <unit-dir>/ 2>/dev/null
   ```
   Also ask the user if there's a project-local helper name (e.g. a `DbTestCase` mixin) you should grep for — it's often the most reliable signal.
   These are the biggest violations — biggest payoff to fix first.
2. **Acceptance/e2e tests that look thin** — short files, single-assertion, names like `*_validation_test`, `*_rejects_*`, `*_invalid_*`. Often validation that belongs in unit.
3. **Pure unit tests with quality smells** — only worth touching if the user explicitly asks for quality, not pyramid placement.

Skip files the user has already processed (check any `progress.md`, ledger file, or recent commits the user points you at).

## Step 3: Read the test and the code under test

Read the full test file *and* the production code it exercises. You cannot judge the right level without understanding what each test is really verifying. If a test name says "validates_X" but the body actually drives a real workflow, the name is a lie and you need the code to see it.

## Step 4: Load the analyzing skills

Read these `SKILL.md` files in order:

1. **`test-strategy`** — always. It defines what each pyramid level is *for*, which is the language you'll use to argue placement.
2. **`test-smell`** — always. Smells often reveal that a test is fighting its own level (e.g. excessive mocking in an integration test usually means the behavior is really unit logic).
3. **`unit-test-design`** — load this if the file is a "unit" test that currently uses the DB or other heavy fixtures. It tells you how to identify pure logic, choose seams, and pick test doubles.
4. **`acceptance-test-design`** — load this if the file is an acceptance/e2e test you might push down. It tells you what acceptance tests are *uniquely* good at, so you don't push down something that actually needs to live end-to-end.

These live at `~/.claude/skills/<name>/SKILL.md`. Read them, don't quote them — apply their guidance to the actual file.

## Step 5: Decide the right level per behavior

Each test asserts one or more behaviors. Classify each:

| Behavior | Right level |
|---|---|
| Pure logic: validation, parsing, business rules, format conversion, math, state-machine transitions | **Unit** (no DB, no HTTP, no FS beyond tmp) |
| Persistence semantics: transactions, constraints, query correctness, schema-bound serialization | **Integration** |
| Cross-component workflows, CLI argv → command → output, full request/response cycles, multi-step user flows | **Acceptance / e2e** |
| Input rejection that's purely a validation rule | **Unit** — push down from acceptance if you find it there |

A common decision moment: a "unit" test that exercises both pure rules *and* a DB write. **Split it.** Pure rule → unit; DB write → integration. Splitting beats moving wholesale because it documents the seams.

## Step 6: Restructure

The mechanics, in order:

1. **Extract pure logic if needed.** Sometimes production code conflates validation and persistence. A small refactor — extract the pure rule into a function/class that takes input and returns a result, leaving the persistence in the original method — makes the pure path unit-testable. Do this only as far as needed; no gold-plating.
2. **Write the replacement tests at the right level(s).**
   - True unit tests: no DB mixin, no I/O, fast.
   - Integration tests: real DB, focused on persistence behavior, not pure logic.
   - Use the project's existing test-runner conventions (naming, base class, fixtures).
3. **Delete or shrink the original test.** Never lose coverage:
   - If the new tests fully replace the original, delete it.
   - If only some behaviors moved, shrink the original to the behaviors that genuinely belong at that level.
4. **Run the full test suite** with the project's runner command. All tests must pass before you call this iteration done. If a test fails, treat that as new information — don't paper over it.

## Step 7: Report to the user

Hand back:

- **What you moved**, by behavior — a small table is fine.
- **Why** — in the language of `test-strategy` (what each level is for).
- **Any production code changes** you made to enable extraction, with file:line references.
- **Test counts before/after** at each level, and the suite result (pass/fail, runtime if available).
- **What you deliberately did *not* move** and why — sometimes a test that looks misplaced is actually correctly placed for a reason worth naming.

## What this skill does not do

- **No commits, no pushes.** Staging is the user's call or the surrounding loop's call. If the user says "commit it" after seeing the report, then commit — but never as part of the skill's own work.
- **No progress-log management.** If the project has a ledger (`progress.md`, etc.), the user or the loop appends to it. You can mention what entry would belong, but don't write it unless asked.
- **No batch mode.** One file per invocation. The pyramid is built one honest decision at a time.

## Self-check before responding

- [ ] Did I read both the test file and the production code it covers?
- [ ] Did I load `test-strategy` and `test-smell`?
- [ ] Did I load `unit-test-design` or `acceptance-test-design` as relevant?
- [ ] Did I classify each behavior, not the file as a whole?
- [ ] Did I run the full test suite and confirm green?
- [ ] Did I avoid committing or pushing?
- [ ] Did I report what I moved, why, and what I left alone?
