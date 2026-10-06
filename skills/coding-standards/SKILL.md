---
name: coding-standards
description: "The user's coding standards: hard limits on file length, class and method size, argument counts, nesting depth, inheritance depth, plus rules on comments, null handling, parameter side effects, constructor side effects, and JavaScript file and package layout. TRIGGER proactively before writing, refactoring, or reviewing code in any language, and whenever instructed by CLAUDE.md or an agent definition to invoke it. Applies to test code as well as production code."
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

## JavaScript

- No package should have more than 5 files. Move some of them into smaller, cohesive sub-packages.
- No file should have more than 1 class.
- No file should have more than 5 functions, including private functions.
- When a module is stateful and acts almost like an object, apply the object-oriented standards above to it as if it were a class.

## Scope

These govern code you write or restructure on the user's behalf. They do not govern:

- Vendored, generated, or third-party code.
- A project whose own documented conventions conflict. Follow the project's conventions and tell the user which standard you set aside and why.

## How to apply

- **New code**: meet the limits as you write it, not in a cleanup pass afterwards.
- **Code you are already changing**: bring the part you touch into compliance. Do not silently expand the change to rewrite the rest of the file. Report what else is out of compliance and let the user decide.
- **When a limit looks impossible**: say which limit, on which construct, and why, instead of quietly exceeding it. A limit you cannot meet is usually the design telling you something, and that is worth surfacing rather than absorbing.
- **In review**: cite the specific standard and the count that breaks it (for example "class has 6 instance variables, limit is 4"), not a general impression that something is too big.
