---
name: spring-jvm
description: "The user's preferences and accumulated lessons for working with the Spring framework on the JVM (Java, Kotlin, and other JVM languages). Covers abstraction and naming, object lifecycle and injection, how to lean on the framework, configuration isolation, web and error handling, persistence, async work, testing, observability, and dependency posture. TRIGGER proactively before writing, refactoring, or reviewing any Spring or Spring Boot code, including configuration classes and tests."
allowed-tools: Read Edit Write Bash Grep Glob
---

# Spring on the JVM

These are the user's own preferences, learned from working in Spring codebases of
varying age and quality. They are about keeping the framework in its place: Spring is
very good at wiring, transport, and infrastructure, and it is a poor substitute for
having designed the domain.

The user is deliberate about what they will and will not commit to. Where a preference
is recorded, apply it. Where this file says a topic is deliberately unspecified, do not
invent a rule; ask, or follow what the codebase already does.

## How to apply

- **New code, and code you are already changing**: apply these preferences directly.
- **Everywhere else**: advisory. Follow the project's existing conventions, and say out
  loud where they conflict with what is written here so the user can decide.
- Never do a silent drive-by rewrite of surrounding code to match these preferences.

## Abstraction and naming

- "Service" is a cop-out and a missed opportunity to find a good abstraction. Reserve it
  for the top layer that controllers talk to. Everything underneath should be named for
  what it actually is.
- The same suspicion applies to Manager, Helper, Util, Handler, and Processor. These are
  names for "code that does things", which is all code.
- Facade, Coordinator, and Orchestrator are legitimate patterns and frequent dumping
  grounds. If one of them is growing without a clear responsibility, it is the former
  turning into the latter.
- Do not create `FooImpl`, and do not extract an interface that has exactly one
  implementation just so there is an interface. Ports that exist to invert a real
  dependency are a different thing and are welcome.
- Avoid suffixes that describe mechanism rather than meaning: DTO, VO, Bean. Name the
  concept.

## Object lifecycle and injection

- Not everything is or should be a singleton, even when it needs injection of Spring
  managed state. Prefer objects you instantiate yourself, passing collaborators in.
  Promote to a Spring managed bean later, when the lifecycle clearly calls for it.
- The clearest signal for promotion is that the object owns an expensive or external
  resource: a connection pool, an HTTP client, a cache. Convenience is not a signal.
- Constructor injection only, with final fields, and no `@Autowired` on the constructor.
- Field and setter injection are out.
- Do not resolve a circular dependency with self-injection, `ObjectProvider`, or `@Lazy`.
  A cycle is the design telling you two things want to be one thing, or that a third
  thing is missing. Fix that instead.
- Lombok is fine for boilerplate.

## Working with the framework

- There are usually several ways to get the behaviour you want out of Spring. Start by
  finding Spring's canonical solution for the problem, then tailor it with the hooks and
  configuration it already exposes. Reach for a bespoke mechanism only after that fails.
- When something behaves unexpectedly, read the autoconfiguration before working around
  it.
- Be conservative about adding starters. Each one brings autoconfiguration that you now
  own the behaviour of.
- Do not build in-house starters or a house framework layered on top of Spring.
- AOP is for cross-cutting infrastructure: transactions, metrics, security. Never for
  business rules.

## Configuration

- Isolate configuration code from business logic, even when a convenient annotation
  exists. This matters more, not less, under hexagonal or onion architecture.
- No framework annotations on domain classes at all, including the tempting ones:
  `@Component`, `@Transactional`, `@Cacheable`, JPA mappings.
- Spring should appear only at the edges. The core should compile with Spring off the
  classpath.
- `@ConfigurationProperties` over `@Value` scattered through the code.
- Wiring and configuration get their own thin test rather than being covered
  incidentally by something larger.

## Structure

- Package by feature or bounded context, not by layer. No top-level `controller`,
  `service`, `repository` packages.

## Web and errors

- Controllers are thin: parse the request, delegate, map the response. No logic.
- Error mapping lives in `@RestControllerAdvice`. No try/catch in controllers.
- The domain throws domain exceptions and the web layer translates them. Never the
  reverse.
- Unchecked exceptions only.
- Never leak stack traces or internal messages into API responses.
- Prefer authorization at the edge over `@PreAuthorize` scattered through the code.

## Persistence and outbound calls

- Prefer `JdbcClient` or Spring Data JDBC over JPA where the use case allows it.
- Wrap outbound clients in a port named for the domain capability. No raw HTTP or
  messaging client in business code.

## Async and background work

- Prefer a transactional outbox to publishing events inside a transaction.
- `@Scheduled` needs a locking story (ShedLock or equivalent) before the application runs
  on more than one instance.

## Testing

- Most logic should be testable with plain JUnit and no Spring context. If it is not,
  that is a design problem, not a testing problem.
- When Spring is genuinely needed, use slices (`@WebMvcTest`, `@DataJpaTest`) rather than
  `@SpringBootTest`.
- Testcontainers over H2 and other embedded stand-ins for database tests.

## Observability

- Greenfield: OpenTelemetry, using the canonical integrations rather than hand-rolled
  instrumentation.
- Existing applications: use the observability mechanism the framework intends for the
  version in use, rather than mixing paradigms.

## Kotlin and JVM specifics

- Prefer blocking MVC with virtual threads over WebFlux unless there is a demonstrated
  need for reactive.

## Deliberately unspecified

The user has considered these and declined to set a general rule, because the tradeoffs
depend too much on the application's context, size, and age. Do not extrapolate a
preference here; follow the codebase, or ask.

- **Transaction boundaries.** Some of the user's applications handle transactions
  entirely outside `@Transactional`.
- **How many mapping layers.** Whether persistence, domain, and API models are separate
  types depends on the service's size and expected lifespan.
- **Outbound client technology and resilience policy.** Driven by the app's context and
  age.

## Growing this file

New lessons go under the theme they belong to, in the same voice: a preference, and the
reason it exists. Create a new theme section only when a lesson genuinely does not fit an
existing one. If a lesson turns out to be context-dependent on reflection, it belongs in
"Deliberately unspecified" with a note on what the tradeoff is.
