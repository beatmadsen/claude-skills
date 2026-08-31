---
name: external-writing
description: "Guardrails for any external-facing prose written on the user's behalf — articles, blog posts, documentation, emails, READMEs, release notes, social posts, or anything other people will read. TRIGGER proactively before drafting or editing such text, and whenever instructed by CLAUDE.md to invoke it. Covers punctuation rules and AI telltales/tropes to avoid."
allowed-tools: Read Edit Write
---

# External Writing Guardrails

**This paragraph is the single authoritative boundary for what counts as external;
CLAUDE.md files point here and must not restate it.** Apply these whenever you
produce or edit prose intended for readers beyond the project's own working loop:
articles, blog posts, published documentation, a repository's top-level README,
release notes, emails, social posts, PR titles, descriptions and review comments,
and commit messages. They do **not** apply to code, to replies in this
conversation, or to repo-internal working prose (nested working-note READMEs such
as `captures/**/README.md`, runway/status/bottleneck/technique notes, ledger
prose, rulebooks like CLAUDE.md and skills), which follows the house style of its
siblings. When unsure whether a piece is external, treat it as external and apply
the guardrails.

**Read this first.** None of the tells below is damning on its own; a real writer
uses any of them occasionally. The giveaway is *clustering* (several at once) or
*repetition* (one over and over). Do not mechanically scrub the list: over-avoidance
is its own tell. Optimize for sounding like a specific person with a real viewpoint,
not for passing a detector. The one reliable test: could anyone but the user have
written this? Their actual examples, stakes, and judgment are what the average can't
fake.

## Punctuation and characters

- **No dashes as sentence punctuation**, ever: not em dashes, not en dashes, not a
  spaced hyphen standing in for one. Use colons, commas, parentheses, or restructure.
  (This is stricter than the usual "cut most" advice; for this user it is zero.)
  Hyphens inside compound words are fine ("external-facing").
- **Don't overuse colons.** Because the dash ban pushes you toward colons as the
  default substitute, they cluster and become their own tell: multiple colons in one
  sentence, or one in nearly every sentence, reads as mechanical dash-avoidance. A
  colon should earn its place (introducing a genuine list or an explanation the first
  clause sets up), not stand in reflexively for a pause. When you notice clustering,
  restructure into separate sentences or use a comma instead.
- **No keyboard-foreign glyphs** in otherwise plain text: Unicode arrows (a literal
  arrow character), curly/smart quotes, ellipsis characters. Use straight quotes and
  plain ASCII.

## Word choice

- **Drop the LLM-staple vocabulary:** delve, utilize, leverage (verb), robust,
  streamline, harness, navigate (figurative), underscore, boast, foster, seamless,
  pivotal, intricate, meticulous, comprehensive/nuanced (as filler adjectives, not
  earned by content), align with, showcase/showcasing. Use plain synonyms.
- **No grandiose decorative nouns:** tapestry, landscape, realm, paradigm, synergy,
  ecosystem, framework, where a concrete word would do.
- **No significance-inflating adverbs:** quietly, deeply, fundamentally, remarkably,
  arguably, notably, tacked on to make ordinary statements feel weighty.
- **No tacked-on significance claims.** A vague clause asserting importance without
  saying why: "a testament to its enduring legacy," "underscoring its growing
  influence," "highlighting its significance." If the significance is real, state the
  specific fact that makes it so; if there's nothing more specific to say, cut the
  clause.
- **Name the source or cut the claim.** "Studies show," "experts say," "industry
  reports indicate," "observers have noted," with no named, checkable source, is a
  weasel-worded stand-in for evidence. Either cite what actually said it or drop the
  sentence.
- **Don't lean on stock engineering analogies.** Each of these maps a physical or
  engineering concept onto an abstract one because the structural correspondence
  explains something ("load-bearing": a wall critical to a building's integrity,
  mapped onto whatever is critical to a system's or argument's integrity). They are
  analogies, not metaphors: their job is explanation, not poetic transfer. Two tiers:
  - *Banned outright, even once.* A handful are so saturated in AI-written prose that
    a single use is itself the tell, no repetition required: **load-bearing**, **first-class
    citizen**, **source of truth** (as a flourish), **turtles all the way down**, **north
    star**, **the secret sauce**, **galaxy-brained**, **batteries-included** (as praise).
    Do not use these in external prose at all. Replace with the literal meaning:
    "load-bearing" becomes "essential" or "the part the rest depends on"; "north star"
    becomes "the goal" or "the guiding constraint".
  - *Fine once, watch for abuse.* Ordinary shop-talk figures (surface area, moving
    parts, plumbing, glue code, the happy path, foot-gun, bus factor, paper over, the
    contract, primitive, heavy lift). Each is acceptable used literally for the thing it
    names. The tell is gratuitous reuse (the same figure two or three times in a piece)
    or reaching for one where a plain word is exact ("surface area" where you mean
    "scope" or "risk"). Prefer the literal word; spend the analogy only when it earns
    more than it costs. This applies in technical prose too, where these read as native
    and so accrete unnoticed.
- **Don't avoid the copula.** Use is/are/has. Not "serves as a," "stands as,"
  "marks the," or marketing verbs (features, offers, boasts) in place of "has."
- **Don't coin pseudo-technical labels** ("the supervision paradox," "workload
  creep") and treat them as established. Naming a thing is not arguing for it.

## Analogy drift in evolving documents

Terminology first, because it's routinely botched: a **metaphor** is a literary
device that directly equates two unrelated things to transfer a poetic or conceptual
meaning, where the literal statement is false ("Time is a thief"; "All the world's a
stage"; "'Hope' is the thing with feathers"). An **analogy** maps a structural
correspondence between two domains in order to *explain*; its goal is clarity, not
resonance, and it needs no "like" or "as" ("load-bearing" applied to a decision is an
engineering analogy, not a metaphor). What accumulates in technical writing is almost
always analogy: LLMs farm the physical and engineering world for correspondences to a
project's concepts. A screen becomes "a room," dense content "a wall," a recurring
bug something that "arrives through a door." Each mapping earns its keep the first
time, when the correspondence is stated and genuinely explains.

The failure sets in when the document evolves across sessions: design notes, specs,
changelogs, a README revised commit after commit. An analogy coined once to make a
single point gets picked up next session as available vocabulary, then extended (the
room gets doors, the doors get watchers), until by the fifth reuse it's stretched far
past the correspondence that justified it and reads as settled jargon a fresh reader
was never given, and can barely be decoded by an initiated one.

- **A reused analogy needs a standing definition, not repeated context-free use.**
  If a coined term is going to appear more than once across a document, or across
  sibling documents, state the mapping once, explicitly, the first time: "call this
  X, meaning Y." Don't just use it in a sentence and let the reader reconstruct the
  correspondence from three scattered examples.
- **Extend an analogy only as far as the correspondence actually holds.** Every
  elaboration ("three doors into the same room," "arriving through the one door it
  was not watching") adds structure on the analogy's side that has no counterpart on
  the real side. If you cannot say what the door literally is, the sentence has
  stopped explaining and started decorating. Trim back to the part that maps.
- **Don't refer to specifics that no longer exist.** Not a figure of speech at all,
  just a dangling reference: "chosen by walking the arc between the two colours a
  round had picked" only works if what was picked is still visible somewhere. If the
  material that grounds a comparison has been deleted (an old commit, a folded draft,
  a scrapped round), either inline what it actually was or drop the comparison. Don't
  point at a ghost.
- **Personified processes must state the object of their intent.** "The closest of
  its round to the thing that round existed to get away from" gives an abstract batch
  of work a goal and then omits the goal from the sentence carrying it. Personifying
  verbs, "arrives," "survives," "is born," "wants," applied to a bug, a finding, or a
  draft are the tell; either name the thing plainly or drop the personification.
- **Watch for one word doing two jobs.** If a word is both a literal name (a CSS
  token, a function, a person's title) and part of an analogy established elsewhere
  in the same document or its siblings, a sentence using it one way reads as using it
  the other way too ("the wall colour is no longer the wall colour," where "wall" is
  a literal token name and also the document's analogy for dense, unscannable
  content). Rename one of them.
- **Don't count recurrences as though they're an omen.** "The seventh instance of
  this pattern's oldest fault," "the fourth time X broke the moment Y adopted it"
  turn a genuinely useful observation, that a class of bug keeps recurring, into
  something that reads like liturgy. State the fact plainly, name the bug class and
  where it recurred, skip the tally and the incantation.
- **The test:** before reusing a coined term, ask whether a reader handed only this
  document, with no memory of earlier sessions or deleted commits, could resolve
  every sentence that uses it. If not, restate the mapping inline where you reuse it,
  or stop reusing it and say the plain thing instead.

## Sentence structure

- **No negative parallelism** (the single most recognizable tell): "It's not X, it's
  Y," "not because X, but because Y," "The question isn't X. The question is Y." It
  fakes insight by reframing. One in a whole piece is fine; several is a giveaway.
- **No staccato emphasis:** "It works. It scales. It wins." Strings of 2-3 word
  sentences manufacturing gravity.
- **No "From X to Y" range sweeps:** "From bustling cities to quiet villages."
- **No participial pile-ups:** main clause plus a chain of trailing -ing phrases
  ("processing the data, revealing insights, enabling decisions, driving growth").
- **No rule-of-three synonym triads:** "innovative, transformative, and
  groundbreaking," three near-synonyms stacked for emphasis rather than because each
  adds distinct content. One well-chosen word beats three that restate it.
- **Don't default to formal transition words as sentence or paragraph openers.**
  Moreover, furthermore, additionally, consequently, cycled reflexively, mark no real
  logical relationship. Use one where the relationship is real and needs marking;
  otherwise let the sentences sit next to each other, or use "and"/"but"/"so."

## Paragraph and composition

- **Vary paragraph rhythm.** Avoid uniform topic-sentence / evidence / mini-summary
  blocks of near-identical length. A one-line paragraph or a long digression is good.
- **No signposted conclusions:** "In conclusion," "To sum up," "In summary." Let the
  ending land on its own.
- **No concede-and-pivot formula:** "Despite its virtues, X faces challenges. Despite
  these challenges, [upbeat close]."
- **Don't pad.** If 800 words of substance became 4,000 by restating one thesis with
  fresh imagery, cut.

## Tone and substance

- **Don't flag your own honesty.** Never reach for "honestly," "to be honest,"
  "candidly," "in all honesty," "I'll be frank," or "the honest truth is." In
  external writing this backfires twice: it quietly implies the unflagged sentences
  are *less* honest, undermining the presumption that the whole piece is truthful,
  and it reads as an awkward, hollow intensifier. The emphasis it reaches for is
  usually unneeded; when emphasis is genuinely warranted, get it from a specific fact,
  a concrete example, or sentence structure, not from asserting candor. (This tell is
  amplified by the user's standing instruction to be very honest in-conversation;
  that instruction governs the working dialogue, not the prose.)
- **No editorializing asides that flag their own importance:** "it's important to
  note that," "it's worth noting that," "needless to say." These imply the
  unflagged sentences are less important, and the reader can't tell if that's true.
  State the thing directly; let its placement and content carry the weight.
- **Don't hedge uniformly.** Match certainty to the actual strength of the evidence;
  don't present "on one hand / on the other" balance when it points one way.
- **Avoid corporate flatness:** the neutral, emotionally detached documentation
  voice that reads as the average of many voices rather than one.
- **No unearned profundity:** solemn transitions and flourishes with no payload. Earn
  the weight first.
- **No generic positivity:** don't replace a specific, unusual, true detail with
  broad flattering description. The rare detail is the point.

## Formatting

- **Don't open every bullet with a bolded lead** by default. It's a strong
  Claude/ChatGPT markdown tell; almost nobody hand-formats lists this way. (Use bold
  leads only when scannability genuinely warrants it, not reflexively.)
- **No emoji-studded headers or list items**, especially in READMEs and docs.

## How to apply

Check a draft against these sections, but treat them as a sensitivity, not a
checklist. When a rule would force an awkward construction, restructure the sentence
rather than reaching for the banned form. If a passage has no original insight, no
stakes, and no voice, no amount of surface fixing will help: the fix is to add a real
viewpoint, a specific source, or first-hand knowledge.
