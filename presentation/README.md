# Compositional random forest presentation

Open `tn_talk.html` in Chrome, Edge or Firefox. This is the existing single-file deck with its original visual design and mathematical visualisations. No build step is required. Plotly, MathJax and fonts use CDNs, so an internet connection is needed.

The complete spoken script is in [presentation_speaker_notes.md](../presentation_speaker_notes.md); work status and research caveats are in [presentation_todo.md](../presentation_todo.md). The 36-slide rehearsal plan totals **14:22**, with brief interactions and concise treatment of the retained historical slides. Rehearse to check your pace.

## Controls

- Arrow keys, Space and Page Up/Down: navigation; Home/End: first/last slide.
- F: fullscreen. S: separate private speaker window with synchronised script and planned times.
- N: explicitly show/hide the notes overlay; use S when presenting to an audience.
- P: static print/PDF mode; `?print` opens directly in print mode.
- `#7` opens slide 7. Existing slide numbers after insertions have shifted.
- Simplex-to-sphere: sphere, projection lines and projected observations have independent visibility buttons. Keep triangle enabled to see the original triangle and all original data when the three layers are hidden.

## Slide order and planned times

| # | Slide | Seconds |
|---|---|---:|
| 1 | Title | 10 |
| 2 | Compositional data: the simplex | 28 |
| 3 | Compositional data: a practical view | 23 |
| 4 | Compositional data: an example | 18 |
| 5 | Machine learning: random forest | 12 |
| 6 | Random forests framework | 12 |
| 7 | Random forest: overview | 22 |
| 8 | Random forest: tree | 20 |
| 9 | MSE splitting | 12 |
| 10 | Split rule | 18 |
| 11 | MSE splitting: the criterion | 22 |
| 12 | Dirichlet log-likelihood splitting | 25 |
| 13 | Prediction based on DirichletRF | 20 |
| 14 | Three approaches to modelling compositional data | 20 |
| 15 | Dirichlet distribution | 32 |
| 16 | Dirichlet contour sets | 20 |
| 17 | What the Dirichlet cannot capture | 25 |
| 18 | From the simplex to the sphere | 35 |
| 19 | Kent distribution: definition | 28 |
| 20 | Kent: contours | 22 |
| 21 | Kent: simulated data | 15 |
| 22 | Kent: estimation cost | 30 |
| 23 | TN: definition | 50 |
| 24 | TN: size and shape | 28 |
| 25 | TN: contour | 20 |
| 26 | TN: contour sets | 25 |
| 27 | TN: additive sufficient statistics | 55 |
| 28 | Why TN is easy to use | 60 |
| 29 | Kent vs TN | 25 |
| 30 | Multivariate logistic normal distribution | 23 |
| 31 | Results: test error | 35 |
| 32 | Results: relative difference | 12 |
| 33 | Zeros: why the square root | 18 |
| 34 | Zeros: earlier experiment | 12 |
| 35 | Summary | 22 |
| 36 | Thank you | 8 |

## Research provenance

`results_provenance.json` records all plotted values and matched experimental settings. The source table exactly matches the original Dir-RF and TN-RF series and supplies the added MLN-RF series. The latest committed three-forest paper table (`03d0e52`, 1 November 2026; unchanged at HEAD `633a540`, 8 November) matches all 72 plotted means. `Main_new.tex` is the older 20 October draft and contains different numbers; do not mix its table with this experiment. The earlier exact-zero table uses a precursor score and remains a separate historical illustration.

The TN construction and score were checked against local `Main_new.tex`, the experiment settings, and CoDARF's `leaf_kent.hpp`. The public preprint is [Compositional random forest](https://arxiv.org/abs/2611.14275). Some local draft text is stale: the implemented Jacobian approximation is `delta2`, not the Taylor-at-one variant mentioned in an unfinished paragraph.

The original research documents, older presentation, additional `three_spaces_hints.html` explainer, interactive animations, and original results are preserved. Initial preparation was local-only. The presenter subsequently authorized a GitHub commit and push.

## Completed public and historical source checks

All 72 plotted means also match [arXiv v1, Table 1](https://arxiv.org/html/2611.14275v1#S4.T1), verified against the downloaded HTML. All 30 values in the retained historical exact-zero table match archived experiment 25; its settings and separate Gaussian tangent score are now documented. Research verification is complete; only a personal timed rehearsal remains.
