---
name: external-writing
description: "Guardrails for any external-facing prose written on the user's behalf — articles, blog posts, documentation, emails, READMEs, release notes, social posts, or anything other people will read. TRIGGER proactively before drafting or editing such text, and whenever instructed by CLAUDE.md to invoke it. Covers punctuation rules and AI telltales/tropes to avoid."
allowed-tools: Read Edit Write
---

# External Writing Guardrails

Apply these whenever you produce or edit prose intended for others to read on the
user's behalf. They do **not** apply to code, commit messages, internal working
notes, or replies in this conversation.

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
  streamline, harness, navigate (figurative), underscore, boast, foster, seamless.
  Use plain synonyms.
- **No grandiose decorative nouns:** tapestry, landscape, realm, paradigm, synergy,
  ecosystem, framework, where a concrete word would do.
- **No significance-inflating adverbs:** quietly, deeply, fundamentally, remarkably,
  arguably, notably, tacked on to make ordinary statements feel weighty.
- **Don't lean on stock engineering analogies.** Two tiers:
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
    "scope" or "risk"). Prefer the literal word; spend the metaphor only when it earns
    more than it costs. This applies in technical prose too, where these read as native
    and so accrete unnoticed.
- **Don't avoid the copula.** Use is/are/has. Not "serves as a," "stands as,"
  "marks the," or marketing verbs (features, offers, boasts) in place of "has."
- **Don't coin pseudo-technical labels** ("the supervision paradox," "workload
  creep") and treat them as established. Naming a thing is not arguing for it.

## Sentence structure

- **No negative parallelism** (the single most recognizable tell): "It's not X, it's
  Y," "not because X, but because Y," "The question isn't X. The question is Y." It
  fakes insight by reframing. One in a whole piece is fine; several is a giveaway.
- **No staccato emphasis:** "It works. It scales. It wins." Strings of 2-3 word
  sentences manufacturing gravity.
- **No "From X to Y" range sweeps:** "From bustling cities to quiet villages."
- **No participial pile-ups:** main clause plus a chain of trailing -ing phrases
  ("processing the data, revealing insights, enabling decisions, driving growth").

## Paragraph and composition

- **Vary paragraph rhythm.** Avoid uniform topic-sentence / evidence / mini-summary
  blocks of near-identical length. A one-line paragraph or a long digression is good.
- **No signposted conclusions:** "In conclusion," "To sum up," "In summary." Let the
  ending land on its own.
- **No concede-and-pivot formula:** "Despite its virtues, X faces challenges. Despite
  these challenges, [upbeat close]."
- **Don't pad.** If 800 words of substance became 4,000 by restating one thesis with
  fresh metaphors, cut.

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
