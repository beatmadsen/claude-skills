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
- The suspicion is a prompt to look for a better name, not a ban. A suffix can be the
  honest name when it is the vocabulary of the design or domain itself: Processor for the
  component that handles each event type in an event processing (ETL style) pipeline, or
  Handler for the targets of a message dispatcher. Use it then, but only for the
  components that play that role, and stay open to a name that says more.
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
  managed state. Prefer plain objects that Spring does not manage in any way: a Spring
  managed class (or an object it created) instantiates them, passing collaborators in,
  and they do not outlive their creator. Promote to a Spring managed bean later, when the
  lifecycle clearly calls for it.
- Registering an object through a `@Bean` method is still Spring managing it as a
  singleton. It is not a lighter alternative to `@Component`, and moving registration
  into configuration classes does not keep Spring at the edges. When something should be
  a bean, declare it the way the codebase already does.
- The burden of proof is on the bean. Make something a bean only when there is a case
  for the container wiring it: it owns an expensive or external resource (a connection
  pool, an HTTP client, a cache), it needs a container feature such as a proxied
  `@Transactional`, an aspect or `@ConfigurationProperties`, it is an adapter
  implementing a port, or several components inject it. Convenience is not a case, and
  neither is swapping it for a mock in tests. Its creator's tests then run through the
  real object and are more coupled to it; that is a price worth paying when the creator
  orchestrates, because mocking the business logic it calls would only verify that the
  logic is called. An object used in one place, by a method that is not on a hot path,
  is a plain object its caller creates.
- Constructor injection only, with final fields, and no `@Autowired` on the constructor.
- Field and setter injection are out.
- Do not resolve a circular dependency with self-injection, `ObjectProvider`, or `@Lazy`.
  A cycle is the design telling you two things want to be one thing, or that a third
  thing is missing. Fix that instead.
- In Java, Lombok is fine for boilerplate. Kotlin code follows `kotlin-coding-standards`.

## Working with the framework

- There are usually several ways to get the behaviour you want out of Spring. Start by
  finding Spring's canonical solution for the problem, then tailor it with the hooks and
  configuration it already exposes. Reach for a bespoke mechanism only after that fails.
  The same holds for libraries already on the classpath: before hand-writing a generic
  runtime concern (retry, backoff, rate limiting, timing), check what the dependency tree
  and sibling code already use.
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
- Never swallow `InterruptedException` in scheduled or background work. A generic
  `catch (e: Exception)` around code that sleeps or waits turns shutdown into a logged
  failure and keeps the loop running. Catch it, restore the interrupt flag, and stop.

## Testing

- Most logic should be testable with plain JUnit and no Spring context. If it is not,
  that is a design problem, not a testing problem.
- When Spring is genuinely needed, use slices (`@WebMvcTest`, `@DataJpaTest`) rather than
  `@SpringBootTest`.
- Testcontainers over H2 and other embedded stand-ins for database tests.
- Share JUnit test setup by composition, not test base classes: extensions (`@ExtendWith`,
  a `ParameterResolver`), composed meta-annotations, test configurations and plain shared
  objects. When another suite needs setup that lives in a base class, move it out into one
  of those rather than extending the class.

### Tests that start the whole application

- Never bind fixed ports. Use `@SpringBootTest(webEnvironment = RANDOM_PORT)` and set any
  other server to port 0, such as `spring.grpc.server.port`. With a random server port, a
  `management.server.port` that follows `server.port` gives actuator a server of its own;
  list that as a deviation from production.
- `@SpringBootTest` scans the application's packages, and that includes `@Component`,
  `@Configuration` and `@GrpcService` classes compiled from other tests' sources. When a
  suite must run production's beans, exclude them with `@TypeExcludeFilters`, judged by
  where the class file lives rather than by a package list, so future test helpers cannot
  slip in. Measure what a test context contains rather than assuming it.
- A test profile overrides production values (consumer groups, feature lists, defaults)
  for every suite that uses it. Prefer activating a real production profile, such as a
  region, over copying its values; read what each active profile changes, and list what
  remains different.
- `@ConditionalOnProperty` is evaluated before `DynamicPropertyRegistrar` beans run. A
  property a condition checks must exist before the context refreshes; if a registrar
  supplies its value, give the placeholder an empty default and say why next to it.
- Errors at shutdown are a resource-ownership defect. Spring closes cached test contexts
  from a JVM shutdown hook, the JVM runs all hooks concurrently, and libraries register
  hooks of their own that clean up the same resources. Find every owner and leave exactly
  one, rather than `@DirtiesContext`, which hides the race at the cost of a context per
  test class.

### Test clients for real infrastructure

- Set up producers, consumers and admin clients in a test configuration, built with the
  framework's test utilities (`KafkaTestUtils.producerProps` and `consumerProps`, a
  `KafkaTemplate` with a default topic and a producer interceptor for headers,
  `ContainerTestUtils`), not hand-built in drivers.
- Type test beans narrowly: a `KafkaTemplate<String, SubscriptionUserEvent>` cannot
  satisfy a production injection point typed `KafkaTemplate<String, MessageLite>`.
- Look test beans up by type, with `getBeanProvider` and generics, not by name strings. A
  name is a link no compiler checks.
- With `auto.offset.reset=latest`, spring-kafka records a listener's partition assignment
  before it commits the starting position, so `ContainerTestUtils.waitForAssignment` alone
  can return before an event is safe to send. Wait until the listener's group has a
  committed offset on every assigned partition, and treat a commit past an input as done
  with it, whether it was processed or handed to error handling.

## Observability

- Greenfield: OpenTelemetry, using the canonical integrations rather than hand-rolled
  instrumentation.
- Existing applications: use the observability mechanism the framework intends for the
  version in use, rather than mixing paradigms.
- `@Scheduled` runs are already timed: since Framework 6.1, with Boot auto-configuration,
  each run is recorded as `tasks.scheduled.execution`, plus `.active` for a run in
  progress. Don't add a hand-rolled duration timer. The built-in one also counts runs a
  lock (ShedLock) skipped, so add your own only when you need that excluded.

## Concurrency model

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
