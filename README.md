# AI Atlas

An interactive, buildless learning application with 93 topic guides across five complementary facets, 30 historical/future milestones, five learning journeys and six research frontiers.

Maintained by **Thomas Hagelien**. Research snapshot: **21 October 2026**. Application version: **1.3.0**. See [CHANGELOG.md](CHANGELOG.md) and the [external-review response](docs/review-response.md).

## Run locally

The browser application has no JavaScript package dependencies. Python 3 serves the checked-in application; Node.js 20+ is needed only for content preparation and validation.

```bash
npm run serve
```

Open `http://localhost:8080`. Routes use URL fragments; any static host can serve `dist/` without rewrite rules. Both figure exports are also complete standalone HTML files.

## Content and build

- `content/taxonomy-base.json`: canonical five-facet tree. Each leaf has a stable topic ID; there is no duplicate flattened topic list.
- `content/enrichment-*.json`: plain-language introductions, original explanations, illustrative examples, limitations, references and directed related-topic recommendations.
- `content/glossary.json`: six shared beginner definitions, rendered in First steps and available beside every plain-language heading.
- `content/history-base.json`: milestones, period bands, source URLs and selected influences. Historical arrows are neither exclusive ancestry nor a comprehensive causal history.
- `content/learning.json`: journeys and cautiously framed research directions.
- `content/metadata.json`: fixed editorial snapshot, version and production notes. Builds do not change the snapshot date.
- `templates/`: explicit data placeholders for both interactive figures and their standalone shell.
- `scripts/prepare-data.mjs`: generates `dist/data.js`, both `dist/figures/*.html` and `content/enriched-tree.html` from shared data and templates, then copies public audit/governance documents.
- `content/original-*.html`: archived first-edition figures, retained for provenance. These are not the active exports and are not included in the active-reference audit.
- `dist/index.html`, `dist/styles.css`, `dist/app.js`: application shell, visual design and navigation.
- `dist/fonts/`: self-hosted DM Sans and Instrument Serif, their OFL notices and retrieval/source hashes.

After changing content or templates:

```bash
npm run prepare:data
npm run validate
npm test
```

The validator checks consistency, complete guides, IDs and links between topics, graph structure, scripts, font files, generated figures and HTTP-audit coverage. It does **not** fetch references or judge research claims.

## Plain-language authoring

Every topic has one required `plain` string in its existing enrichment record. Lead with **what it does**, using a concrete instance or a faithful everyday analogy. Explain **when it helps**, then give **one short, specific caveat**. Usually three short sentences work well. An analogy is encouraged when it explains the mechanism; do not add one that misleads merely to satisfy a quota.

Use familiar words. The glossary explains model, training, example and label, prediction, parameters, and evaluation. Explain other essential jargon where it occurs or replace it. Grouped topics use labelled mini-sentences on separate lines, preserving distinctions without a dense list of definitions. The RL axis guides each explain learning from rewards before introducing their labels. Keep a short caveat, usually a clause or one sentence of about ten words, and leave the fuller failure analysis in “What to keep in mind.” Caveat count and meaning require editorial review, not a keyword detector.

The same canonical text appears in topic panels, the selected tree-figure card, search results, journey steps and saved cards. All sentences stay visible, including on mobile. Compact tree navigation keeps topic names. “Six key words” beside each plain-language heading opens the shared glossary without leaving the topic. First steps displays all six definitions before its topic sequence. Technical explanations and references remain below the introduction.

The validator requires trimmed, nonempty text of 15–75 words, **at most 18 whitespace-separated words per sentence**, no semicolons, no obvious placeholders and no copied technical paragraph. The broad paragraph-length range allows grouped topics more room. It also checks exact app/figure data consistency, including the glossary. Readability above an estimated grade 9 produces a **warning**, not a build failure. Clarity and accuracy take priority over reducing a numeric score.

Run `npm run audit:readability` for a per-topic report. The dependency-free estimator uses the Flesch–Kincaid formula, English sentence segmentation and approximate syllable rules. It excludes titles and glossary definitions. Acronyms, technical names and short passages can distort the result. This is neither a certified reading level nor proof of accessibility. The [recorded comparison](docs/readability-report.json) includes the method, runtime version, per-topic results and the exact baseline commit. To reproduce the baseline comparison in a checkout containing that history:

```bash
node scripts/readability-report.mjs --baseline-ref 2de82f6dcb14db714549a64492fc362d97a0fa17
```

The existing `foundations` journey is **First steps: understanding AI**, now with 13 topics. Self-supervised learning bridges neural networks and language models. Journey and topic IDs, URLs and browser storage are unchanged, preserving bookmarks and read markers. Progress uses the current sequence and does not indicate mastery.

The text was drafted and reviewed with AI assistance against the detailed guides. **Comprehension review with readers outside the field is pending.** Ask intended readers to explain selected topics back and name one limitation, then revise concrete misunderstandings. No independent reader or expert sign-off is claimed. See the [response to the plain-language review](docs/plain-language-review.md).

## Reference availability and source review

Run the network audit separately, then regenerate the app:

```bash
npm run check:links
npm run prepare:data
npm run validate
```

The checker uses Python's standard library. It measures each unique active reference URL with HEAD and usually GET, records actual UTC timestamps, response status, redirect destination, request attempts and network errors in `content/link-checks.json`, and detects common challenge pages. A failed HEAD connection or rate limit avoids an immediate second request. Requests are serial per host; timeouts and concurrency are configurable. HTML reads are bounded. The content hash identifies the exact audited URL set.

A 2xx response means only that an endpoint responded. It does **not** validate a title, authorship, relevance, full-text access, scientific quality or support for a claim. A 403, 429 or timeout is unresolved, not proof of a dead link. The default checker exits nonzero on 404/410; `--strict` exits nonzero for any non-reachable result. The accompanying report records the actual policy used for this release; environmental network restrictions can prevent a meaningful reachability conclusion. Run again from your network if needed.

The editorial source review used primary paper records, author/institutional copies and official documentation, including sources that the direct HTTP audit may not retrieve. Research papers, technical white papers, textbooks and documentation are labelled separately. Preprints are not implied to be peer-reviewed. Canonical DOI metadata is retained where available; the audit covers the actual clickable URLs, not unused bibliographic metadata. External sources can change after publication.

## Interaction and privacy

Search by topic, concept or example; expand the taxonomy; read guides; explore interactive figures or the milestone reading view; follow a journey; bookmark topics; and mark topics as read. Ctrl/Cmd+K opens search.

Bookmarks and progress use browser-local storage with an in-memory fallback. They do not measure mastery and do not sync between devices. There is no application account database or analytics. Fonts ship with the app; it makes no Google Fonts requests. Opening reference links visits external sites. Hosting access policy is separate from the app.

## Production and licensing

AI-assisted research, writing and implementation, initiated and maintained by Thomas Hagelien. Explanations, illustrative examples and figures were created for this atlas; referenced publications and font files are third-party works. No institutional affiliation or endorsement is claimed. Source checks do not constitute comprehensive human expert review.

No open-source licence has been chosen for the first-party application or educational content. See [LICENSE.md](LICENSE.md). This project does not silently grant reuse rights to referenced papers; self-hosted fonts carry their supplied SIL Open Font License notices.
