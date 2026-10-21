# Response to the external review

AI Atlas 1.1.0 · Editorial review date: 21 October 2026

Most findings were justified. The revision strengthens provenance, industrial coverage and reproducibility without treating one historical lineage or one bibliography as exhaustive. The review is a useful independent assessment, not a certification of the complete atlas.

| Finding | Assessment and action |
| --- | --- |
| Hard-coded `verified` date | Agree. Removed it from all active reference records. A real HEAD/GET checker records attempts, HTTP codes, redirects, timestamps and unresolved failures. The site never equates HTTP success with content verification. |
| Backpropagation → Mamba edge | Agree that it was too generic. Added S4 (2021 preprint / 2022 conference) and S4 → Mamba. Mamba's authors explicitly identify the S4 lineage. A transformer edge would describe a comparison/alternative, not the clearest predecessor. |
| Overlapping eras / Titans | Agree. Bands are now nonoverlapping; Titans is in 2024–2025 with the December 2024 first-submission qualification retained. The 2026 diffusion-LM study has its own milestone; undated possibilities remain separate. |
| Topic 033 grammar | Fixed to “an active research direction for parallel generation.” |
| Missing foundational research | Agree. Added GPT/BERT, early diffusion and score-based/SDE research, options for hierarchical RL, World Models/Dreamer, CoT/Tree of Thoughts, confidence/abstention and the requested classical-method foundations. Useful framework docs remain supplementary. |
| “World models” coined in 2018 | Do not adopt this claim. Ha and Schmidhuber's paper is influential, but Sutton's 1990 Dyna paper already uses “world model.” The atlas describes 2018 as a landmark, not the invention of the term. |
| AlphaGeometry / AlphaEvolve / Nested Learning blogs | Agree. Added the Nature paper's institutional record with DOI, AlphaEvolve's technical white paper, and official NeurIPS 2025 Nested Learning proceedings. Blogs can remain introductory secondary resources. An arXiv record does not establish peer review. |
| Genie 3 blog should become a paper | Qualified. No dedicated Genie 3 technical paper was located in the official sources checked. Retain clearly labelled official documentation; do not substitute the different 2024 Genie paper. |
| Pinned BoTorch URL “will rot” | Too categorical: versioned URLs can improve reproducibility. Updated the learner-facing link to the current overview and added a research reference. No URL is guaranteed permanent. |
| CBR / AlexNet durability | Changed CBR to its canonical DOI. Retained AlexNet's official NeurIPS proceedings record; do not invent a DOI or replace a stable primary archive only for stylistic uniformity. |
| Industrial topic omissions | Agree. Added anomaly detection, state estimation and control, security including poisoning and prompt injection, evaluation/leakage, fairness/governance, symbolic regression and scaling laws. Control is explicitly an adjacent classical foundation, not inherently ML. |
| Interpretability too narrow | Added SHAP and sparse-autoencoder research, distinguishing input attribution, internal representations and provenance. These are not equivalent to causal explanations or guarantees. |
| Journey gaps and one-way related links | Partly agree. Added a monitoring journey, control steps and governance/security steps, and useful inbound links for reservoir networks, GANs and federated learning. Related links are directed reading recommendations, so automatic symmetry or inclusion of every topic in a journey is not a correctness requirement. |
| No accountable maintainer / production notes | Added Thomas Hagelien as maintainer and disclosed AI-assisted preparation. Figures and explanations are original to this project. No institutional endorsement or comprehensive human expert review is claimed. |
| No licence | Agree that status must be explicit. Added a licence-status notice and third-party font notices. A permissive licence has not been silently chosen on the maintainer's behalf. |
| Remote Google Fonts | Agree on the avoidable third-party request. Both families now ship locally with OFL notices. This removes those requests; it is not a legal opinion about GDPR compliance. |
| Snapshot looks auto-stamped | Fixed through a versioned changelog and explicit snapshot metadata. Builds preserve it; HTTP timestamps come from actual requests. |
| Brittle figure patching | Agree. Replaced literal date/JavaScript replacement with explicit templates and shared canonical data. Both active figure exports regenerate in the same command as the app data. |

## Primary evidence for qualified findings

- S4: https://arxiv.org/abs/2111.00396 ; Mamba authors' repository: https://github.com/state-spaces/mamba
- Dyna (1990), using “world model”: https://papers.neurips.cc/paper_files/paper/1990/hash/d9fc5b73a8d78fad3d6dffe419384e70-Abstract.html
- Nested Learning official proceedings: https://proceedings.neurips.cc/paper_files/paper/2025/hash/4309616aaed8e848009bc4a7ef73b493-Abstract-Conference.html
- AlphaGeometry paper record: https://research.google/pubs/solving-olympiad-geometry-without-human-demonstrations/ ; DOI 10.1038/s41586-023-06747-5
- AlphaEvolve white paper: https://arxiv.org/abs/2506.13131
- Genie 3 official documentation: https://deepmind.google/models/genie/
- BoTorch current overview: https://botorch.org/docs/overview ; arXiv historical-version policy: https://info.arxiv.org/help/versions.html
- Google Fonts' own description of receiving visitor IP addresses for font delivery: https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html

The two 2026 studies were re-opened and match their descriptions: Reflective Test-Time Planning (https://arxiv.org/abs/2602.21198) and the diffusion-language-model experimental analysis (https://arxiv.org/abs/2606.19475). The current reflective-planning record also lists Leonidas Guibas, omitted from the review's author shorthand. The atlas now uses the full paper title in its references.

## Audit evidence and limitations

The release includes the machine-readable `content/link-checks.json` (published as `link-checks.json`). Its URL-set hash prevents silently reusing a report for changed references. `npm run validate` checks this coverage without sending network requests. The checker can be rerun independently; access can vary by host, network and time. Editorial primary-source retrieval and direct HTTP probing are different operations and may yield different access results.

Actual audit: **157 unique URLs**, completed **2026-10-21T13:01:02+00:00**. **5 responded successfully; 152 were inconclusive network errors.** No 404/410 response was observed, which is not evidence that all remaining links work. This execution environment restricts outbound networking; the report preserves the failed attempts rather than upgrading them to success. The run used `python3 scripts/check-links.py --timeout 3 --workers 6`; the default timeout is 12 seconds. Re-run from a network that can reach the references before claiming a complete availability audit. Primary-source browser/search retrieval used during the editorial review was separate from these direct HTTP requests.

Validation also passed ten focused checker tests, generated-data/figure consistency checks, and desktop/mobile interaction checks for new guides, history, search and the expanded tree. Related-topic coverage now gives every topic at least one incoming recommendation; 42 of 93 topics are outside a journey/frontier, which are intentionally curated selections rather than an exhaustive syllabus.

This review does not claim an exhaustive technical peer review of all 93 guides. Research descriptions remain bounded by the cited studies and their evaluated settings. Future directions are possibilities, not delivery forecasts.
