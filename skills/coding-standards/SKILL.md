---
name: coding-standards
description: "The user's coding standards: hard limits on file length, class and method size, argument counts, nesting depth, inheritance depth, plus rules on comments, null handling, parameter side effects, constructor side effects, value types, I/O shape, where decisions live, total functions, result types, exceptions, naming, type and package placement in layered architectures, dead code and staged migrations, and JavaScript file and package layout. TRIGGER proactively before writing, refactoring, or reviewing code in any language, and whenever instructed by CLAUDE.md or an agent definition to invoke it. Applies to test code as well as production code."
allowed-tools: Read Edit Write Bash Grep Glob
---

# Coding Standards

The standards below are the user's own, and they apply to test code as well as
production code. They exist to keep software soft: easy to change. The forces they
protect are coupling, cohesion, readability, and simplicity, on the maxim that in most
matters pertaining to software, smaller is usually better.

The limits are counted, not estimated. If you are unsure whether a method exceeds 7
lines or a class exceeds 4 instance variables, count them. Method length is counted in
effective lines, as defined under object-oriented design below, not in the lines the
current formatting happens to use.

## General

- No code file should be longer than 150 lines. Trimming whitespace is not a fix for this; break the code into multiple files.
- Delete every comment that isn't documenting a public API or contract. If a comment was needed to explain a difficult piece of code, extract that code into a well-named class or function instead.
- Prefer a plain guard over deferred evaluation. When an explicit check (`isEmpty()`, a null or size check) gives the same short circuit as `lazy`, memoisation or a supplier, use the check: it is simpler to reason about and costs less once compiled.

## Object-oriented design

- No class should have more than 4 instance variables. More is a sign the class is doing too much and should be split into several classes; it also makes the class harder to understand and test. Don't work around this by turning the instance variables into method parameters.
- No method should have more than 4 arguments.
- Don't side-effect on parameters. Only side-effect on the instance variables of the class you are in.
- Method bodies should not exceed 7 effective lines, excluding blank lines and comments. The limit is a proxy for the single responsibility principle: a method that needs more is doing more than one thing, and the fix is to extract well-named smaller methods or objects. Count the body as it reads with clarifying formatting, so dense formatting cannot bring a method under the limit:
  - An `if`, `else`, or loop counts with its braces on their own lines, even when the language lets you drop them or put the whole statement on one line. A `when` or `match` branch of the form `condition -> expression` counts as one line.
  - A call whose result is used counts as its own line, assigned to a named variable. Nesting calls as arguments, chaining them, or calling them inside a condition to save lines is cheating, not compliance.
  - Exception: a side-effect-free boolean check on a value already in hand may sit directly in a condition, such as `isEmpty()`, `contains(x)`, an equality or comparison, or a boolean property. Naming it would only repeat the expression. A boolean that comes from asking a collaborator, such as `service.canHandle(input)` or a lookup, still gets its own named line, because it is a step the reader needs to see.
  - One statement per line. Several statements joined on one line count as several lines.
- No more than 2 levels of nesting in any method.
- No more than 2 levels of inheritance in any class hierarchy.
- Object methods should assume non-null inputs and never return null. Only data structures should work with null.
- Construction should have no side effects; a constructor only sets instance variables. Put any side effects in a separate method called after construction, so an object can be built without being used immediately. A static factory method may do the construction and the side effects together, but the constructor itself stays side-effect-free.
- Give values that share a type but differ in role their own value types. When a method takes, or a class holds, two values of the same type that could be swapped (two ids of the same kind, two lists of the same element type), wrap at least one in a value class named for its role, so swapping them fails to compile.
- Move behaviour to the type whose data it uses. A method that reads several fields of one object and little else belongs on that object.

## Data flow and I/O

- Never fetch the same data twice in one flow. Once a flow has read something, later steps receive it instead of reading it again, whichever I/O shape the flow uses.
- Shape I/O for the flow, not for the abstraction. Choosing between fewer, broader interactions (a wide query, a join) and several specialised round trips is a judgment call for each flow; lean towards fetching only what the flow needs. Do not widen a query, or fetch data up front for every case, so that an abstraction can be reused. If reuse needs extra I/O, the abstraction is wrong.
- Data already fetched may travel to the steps that use it. What is ruled out is fetching ahead, or carrying a bag of data along, because a later stage might need it.

## Decisions and contracts

- Keep each decision in one place. A caller must not inspect an input to choose which of several parallel functions to call, and a callee must not rely on its caller having made that check. When a stage handles several kinds of input, model them as one sealed type (or the language's closest equivalent) and branch once, inside the stage.
- Make functions total over the inputs their callers legitimately pass. A function that throws for, or rejects, a value one of its callers may validly give it is a partial function guarded by that caller. Widen its input type to model every case instead, so the compiler checks that each case is handled. Rejecting input that is invalid for every caller, such as malformed data or an unsupported type, is still fine.
  - During an incremental migration, a branch may reject a case no caller produces yet, if a test pins the rejection and the branch is replaced when that case's handling arrives. Never add a mirror type or a domain grouping to avoid it.
- Remove a branch that cannot change the outcome. When a condition leads to the same observable behaviour either way, delete the condition and the I/O it drives, and pin the simplification with a test.
- Return a named outcome, not a boolean, when the caller acts on why. A boolean answers a yes or no question. When the caller decides what to do from the reason (which metric, which log, whether to retry), return a sealed type or enum and branch exhaustively, so a new outcome cannot be handled wrongly without the compiler noticing.
- A result type shared by several callers names general outcomes, and caller-specific detail travels as data. Do not give it a top-level case named after one caller; model the general outcome (`Processed`, `Declined`) and carry the specific reason as a value (`Declined(reason)`).
- Fail with an exception that names the problem and the value. Do not let a low-level exception escape from parsing or conversion; wrap it in one that says what was invalid and includes the value, such as `IllegalArgumentException("Invalid price plan id: 'abc'")` instead of a bare `NumberFormatException`.

## Naming

- A noun class name says what an instance is. Do not name a component that does work after the thing it handles or produces: an object that makes purchases is not a purchase.
- Qualify a name enough to tell it apart from other code in the codebase that does the same kind of work, and no further. If several paths purchase, the name says which one this is.
- Name event and message types for what happened, and the components that handle them for how they treat it: an activation type, handled by a component that processes it as a purchase. A nested type is already qualified by its enclosing type, so it needs less qualification than a top-level one.
- Name statuses, outcomes and reasons after what happened in the domain, not after the mechanism that detected it: `REPLACED_BY_SUCCESSOR`, not `NO_PROCESSOR`. One name per outcome; split a name that covers two.
- A predicate reads as a true domain sentence at the call site. Choose the word order that is both correct and readable: `event.isTerminationForUpgradeOrDowngrade`, not `event.isUpgradeOrDowngradeTermination`.

## Layered architectures

These matter most in an intentionally layered architecture, such as Onion, Hexagonal (ports and adapters), or Clean, where the domain sits at the centre and must not depend on the layers around it. Elsewhere they are still good guidance on where a type belongs.

- A type belongs to the layer whose concern it expresses. A type that carries data from an adapter into orchestration belongs to the application layer, not the domain, even when it holds only domain types.
- Domain types never implement interfaces from an outer layer. When an application abstraction must cover a domain type, wrap the domain type once in an application layer type; never mirror the domain hierarchy subtype by subtype.
- A type used by only one layer lives in that layer, even when it is built from domain types.
- Do not let a language rule decide which layer a type lives in. If a construct would force a type into the wrong layer, such as a sealed type requiring its implementations to share its package, change the design instead of moving the type.
- Before introducing a type, check whether the domain already models the concept. A new type must add something: a case the existing type lacks, or data it cannot hold. A wrapper that renames each existing subtype adds nothing and is the mirror forbidden above.
- Transport types stop at the adapter. Wire types (protobuf, DTOs, framework messages) are mapped to domain types before orchestration begins, and no inner package imports them. Enforce this with an architecture test.
- A type two feature packages share lives in the package that owns its concept, not in whichever feature introduced it, so features do not depend on each other.

## JavaScript

- No package should have more than 5 files. Move some of them into smaller, cohesive sub-packages.
- No file should have more than 1 class.
- No file should have more than 5 functions, including private functions.
- When a module is stateful and acts almost like an object, apply the object-oriented standards above to it as if it were a class.

## Scope

These govern code you write or restructure on the user's behalf. They do not govern:

- Vendored, generated, or third-party code.
- A project whose own documented conventions conflict. Follow the project's conventions and tell the user which standard you set aside and why.

These standards are the user's, not their team's. In PR descriptions, review comments and other team-facing text, argue from the concrete problem (coupling, a bug, readability) and never cite these limits as rules. Where a team codebase has an established convention, such as how framework components are declared, follow it.

## How to apply

- **New code**: meet the limits as you write it, not in a cleanup pass afterwards.
- **Code you are already changing, and code you walk into**: bring it into compliance now, while you have the context, because fixing it later means rebuilding that context. This is the default everywhere, and holds without exception in a repository where the user is the only developer.
- **Team repositories with peer review**: the size of a change is a real cost, because large changes are hard to get reviewed and integrated. Fix small violations in place, and put a larger fix in its own commit or small PR next to the work, rather than growing it.
- **Dead code**: delete it instead of fixing it, with its tests, in the change that makes it dead or the first change that notices.
- **Declared staged migrations**: the one exception to fixing what you walk into and to deleting dead code. Such migrations are rare, and the exception applies only when one is declared: the user says so, or the repository's `AGENTS.md`, the ticket, or the code's own migration comments name the legacy path and its planned removal. Never infer one from old-looking code, duplicated classes, or names like "legacy"; without a declaration, the rules above apply in full. Within a declared migration that keeps the legacy path until a final removal step, leave the legacy code alone, even where it is unreachable. Change it only as far as the build needs to keep compiling, such as an import of a type that moved. Do not refactor it, fix its violations, or delete it early: the deletion belongs to the planned final step.
- **When a limit looks impossible**: say which limit, on which construct, and why, instead of quietly exceeding it. A limit you cannot meet is usually the design telling you something, and that is worth surfacing rather than absorbing.
- **In review**: cite the specific standard and the count that breaks it (for example "class has 6 instance variables, limit is 4"), not a general impression that something is too big.
