# Response to the beginner-language review

AI Atlas 1.3.0 · 21 October 2026

The central criticism is accepted. Version 1.2.0 introduced a consistent entry point, but too many entries were compact technical summaries with long caveats. Completeness and short paragraphs did not establish beginner accessibility.

## What changed

- All 93 introductions now lead with a concrete explanation and use, followed by one brief caveat. Faithful analogies are encouraged, and concrete examples are used where a metaphor would mislead.
- Grouped topics use labelled mini-sentences on separate lines. This preserves their scope without compressing several definitions into one sentence. Each RL axis entry first explains learning from rewards.
- Six shared definitions explain model, training, example and label, prediction, parameters, and evaluation. They appear before the First steps topics and are reachable beside every “In plain words” heading, including the standalone tree.
- Self-supervised learning is inserted between neural networks and language models. The existing journey now has 13 steps. Its route, topic IDs and browser storage format are preserved.
- Sentence length is capped at 18 whitespace-separated words, and semicolons are rejected. The broad 15–75-word paragraph bound remains to accommodate grouped techniques. An estimated reading grade above 9 is a warning. Caveat meaning and count are reviewed editorially rather than claimed to be certified by a regular expression.

## Measurements and their limits

The new reproducible estimator broadly supports the review's diagnosis. Against the exact 1.2.0 commit, it measures a mean estimated grade of **12.45** and **20.35 words per sentence**. For 1.3.0, the corresponding figures are **7.25** and **11.14**. All 93 entries have sentences of at most 18 words and no semicolons. Nine entries remain above an estimated grade 9; their results are retained as warnings rather than hidden by an exemption.

Those nine entries are 017, 021, 032, 045, 074, 077, 080, 083 and 084. Their wording was revisited for concrete use, scope and short sentences. Some names and mathematical qualifications remain necessary. The warnings are prompts for reader review, not a declaration that those texts are suitable or unsuitable for a particular person.

The estimator uses the Flesch–Kincaid formula with approximate English syllable counts and `Intl.Segmenter`. The review did not supply its scorer or tokenization settings, so its exact grade figures are not presented as independently reproduced. [The complete report](readability-report.json) records per-topic results, method, runtime and baseline commit. Titles and glossary text are excluded from these statistics. Short passages and acronyms are especially sensitive to scoring choices.

**Comprehension testing with readers outside the field has not happened.** The changes were drafted and checked with AI assistance. A lower score is not evidence that a reader understands the concept, and there is no human-review or universal-accessibility claim.

## Where the suggested examples needed qualification

- A transformer can connect positions in a sequence, but access depends on the design and mask. The original decoder generates one element at a time and blocks access to later positions. The rewrite avoids “reads all parts at once.” See [Vaswani et al., sections 3.1 and 3.2.3](https://arxiv.org/html/1706.03762v7).
- Gaussian-process smoothness depends on the covariance assumptions. The rewrite does not imply an always-smooth curve passing exactly through every measurement. See [Rasmussen and Williams, chapter 4](https://gaussianprocess.org/gpml/chapters/RW4.pdf).
- Physical knowledge can guide learning, but data savings and small rule violations are not universal promises. The introduction says predictions can still conflict with physical laws. The detailed guide retains the difference between soft penalties and enforced constraints. See [Raissi et al.'s research overview](https://maziarraissi.github.io/PINNs/).
- Conformal coverage concerns an overall rate under data assumptions, not a guarantee for one case. A change in conditions can invalidate the standard promise, but does not necessarily do so in every method or setting. Selective prediction remains a separate choice to decline an answer. See [Angelopoulos and Bates](https://arxiv.org/html/2107.07511v6).
- An offline log limits evidence about untried actions, rather than making every estimate beyond logged actions logically impossible. The rewrite describes gaps in experience as a source of unreliable estimates.

These decisions follow the intent of [W3C's clear-word guidance](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/): explain necessary unfamiliar terms and make explanations easy to reach. That guidance is supplemental and is not a claim of WCAG conformance.

## Implementation checks

The data validator and all 16 automated tests pass. Browser checks covered the topic glossary, Escape and focus return, the 13-step journey, and a 390-pixel layout. The standalone tree uses an inline glossary to avoid oversized dialogs inside its expanding frame. Both figure exports are regenerated from the same source. These are interface and consistency checks, not reader comprehension tests.

## Attribution and release scope

The existing individual maintainer credit is retained. No employer affiliation or endorsement is added. Institutional publication approval and legal compliance have not been assessed or certified. No new personal information is introduced by this release.

The technical explanations, examples, limitations, topic references and historical material are unchanged. Existing HTTP-audit results keep their original timestamps; this editorial revision is not a fresh link check.
