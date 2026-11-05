---
name: kotlin-coding-standards
description: "The user's Kotlin-specific coding standards, layered on top of coding-standards: how the general limits are counted in Kotlin (constructor properties, init blocks, companion factories), extension functions versus members, computed properties, value classes, sealed types and exhaustive when, object declarations, Kotlin collection vocabulary, MockK strictness, and Kotlin with Spring. TRIGGER proactively before writing, refactoring, or reviewing Kotlin code (.kt, .kts), always together with coding-standards, never instead of it. Applies to test code as well as production code."
allowed-tools: Read Edit Write Bash Grep Glob
---

# Kotlin Coding Standards

These are the user's own, and they add to `coding-standards`; they never replace it.
Load `coding-standards` first: every limit and rule there applies to Kotlin unchanged.
This file holds only what is specific to Kotlin, either a rule that exists because of a
Kotlin construct or the Kotlin form a general rule takes. Where a general rule already
says something, this file says how it lands in Kotlin and does not restate it.

The scope, team-facing caveats and "How to apply" section of `coding-standards` govern
this file too.

## Counting the limits in Kotlin

- Every property declared in the primary constructor with `val` or `var` is an instance
  variable, and counts towards the limit of 4 the same as a property declared in the
  class body. A plain constructor parameter that is not stored does not count.
- An `init` block is part of construction, so it carries no side effects. A factory in
  the `companion object` is Kotlin's static factory method: it may construct and run the
  side effects together, while the constructor and its `init` blocks only set state.
- An expression body (`fun total() = ...`) is counted like a block body. Writing a
  method as one expression does not exempt the calls inside it from getting their own
  named lines.

## Types and members

- Declare behaviour on a type you own as a member. Use an extension function only for a
  type you cannot change, or for behaviour that belongs to an outer layer than the type.
- Prefer a computed property (a `val` with a getter) to a function when the value reads
  as a property of the object, like the area of a square: computing it has no side
  effects, does not throw, is relatively cheap, and gives the same result while the
  object's state is unchanged. Otherwise use a function. This follows the heuristics of
  the Kotlin coding conventions on functions and properties.
- The role-named value type that `coding-standards` asks for, to keep two same-typed
  values from being swapped, is a `@JvmInline value class` in Kotlin.
- The singular-noun naming rule holds for `object` declarations and value classes as for
  any class. An `object` named after its only function is the procedure holder class
  `coding-standards` forbids, and so is a file of top-level functions that exists only to
  give one procedure a home.

## Null handling

- Object methods take and return non-nullable types. Nullable types (`T?`) belong to data
  structures, matching the general rule that only data structures work with null.

## Sealed types and outcomes

- Model a set of input kinds or named outcomes as a `sealed interface` or `sealed class`
  (or an `enum class` when the cases carry no data), and branch on it with `when`.
- A `when` over a sealed type or enum has no `else` branch. An `else` silently absorbs a
  case added later, which is exactly what the exhaustive branch is there to prevent.

## Naming

- The standard vocabulary for collection operations is the Kotlin standard library's:
  `contains`, `any`, `none`, `all`, `first`, `filter` and so on. Name a domain check after
  the stdlib operation it mirrors rather than inventing a synonym.

## Tests

- MockK mocks are strict by default; keep them strict. Do not use `relaxed = true`,
  because a fully relaxed mock hides missing stubs. `relaxUnitFun = true` is fine on
  metrics-style collaborators whose `Unit`-returning calls the test does not care about.

## Kotlin with Spring

- Constructor injection means a primary constructor of `private val` properties, with no
  `@Autowired`. Lombok has no place in Kotlin code.

## Growing this file

A new lesson goes here only if it depends on a Kotlin construct or is the Kotlin form of
a general rule. Anything that would hold in Java or another language belongs in
`coding-standards`, and anything about the Spring framework belongs in `spring-jvm`.
