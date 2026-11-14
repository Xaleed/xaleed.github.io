# Presentation work checklist

## Completed

- [x] Inspected the existing HTML deck, embedded CSS/JavaScript, visualisation pages, old LaTeX presentation, local TN manuscript, forest implementation and simulation settings.
- [x] Preserved the original presentation framework, colour system, figures, animations and all 32 existing slides.
- [x] Added four slides: three modelling approaches; Dirichlet contour sets; additive TN statistics; multivariate logistic normal.
- [x] Created `presentation_speaker_notes.md` in actual 36-slide order, with complete spoken script, transitions, figure directions, mathematical reminders and a 14:22 rehearsal plan.
- [x] Synchronised the private speaker-window script and per-slide times with the separate notes file.
- [x] Added independent projected-observation visibility without removing original data or the existing sphere, line, triangle and reset controls.
- [x] Reused the original Dirichlet layout and renderer for the contour-definition slide, with distinct controls and IDs; removed its covariance panel only.
- [x] Corrected MSE wording, bootstrap qualifications and the distinction between splitting models and empirical forest prediction.
- [x] Checked the five-parameter Kent formula, support, axis constraints and the browser's five-dimensional Nelder-Mead estimation with numerical quadrature.
- [x] Reused the child-split diagram in the Kent computational-cost slide. Labelled browser timings and extrapolations as illustrations, not measured forest benchmarks.
- [x] Used the exact TN map: v = K-transpose u, normal conditioned on norm(v) < 1, and u = sqrt(1 - norm(v)^2) mu + Kv. Retained the spherical Jacobian and hemisphere support.
- [x] Distinguished a strictly positive mean direction, the non-negative compositional orthant and the larger open hemisphere. TN may allocate mass outside the orthant.
- [x] Explained additive n, sum(u), sum(uu-transpose), running left updates and right-by-subtraction. These do not determine the exact unknown-direction TN likelihood or exact Jacobian.
- [x] Distinguished moment location, analytic Gaussian shape profiling, Cholesky scoring, delta2 Jacobian approximation and omitted truncation from full TN MLE.
- [x] Added the MLN forward and inverse transformations and strict-positivity requirement.
- [x] Added real MLN results to both metric views, preserving every original Dirichlet/TN number. Recorded source values and common settings in `presentation/results_provenance.json`.
- [x] Added the correct arXiv title, three authors, identifier and preprint status on the final slide. No claim of journal publication.
- [x] Kept the older exact-zero experiment separate and qualified its interpretation; positive spherical density at a zero is not a structural-zero probability atom.
- [x] Updated the presentation README and local usage instructions.
- [x] Initial preparation completed without committing, pushing, publishing or deploying; the presenter subsequently authorized a GitHub commit and push.

## Research checks and evidence

- `../CompositionalRF/dev/28072026_2/Main_new.tex`: exact TN definition, Gaussian-profile theorem, location-MLE qualification. This draft includes unfinished passages and a table version different from the deck.
- `../CoDARF/core/include/codarf/leaf_kent.hpp`: `tn_jacobian_additive` implements delta2 as n log(R/n) - (mu-transpose S2 mu - n(R/n)^2)/(2(R/n)^2). Exact-row evaluation is implemented separately.
- `../CompositionalRF/dev/28072026_2/final_experiments/R/00_common.R`: implemented MLN, Dirichlet moments, TN Gaussian profile with delta2; shared 80/20 data split, paired seeds, common fixed forest settings. `02_A_sim_run.R` runs these designs.
- `../CompositionalRF/dev/28072026_2/final_experiments/tables/tab_sample_size_m10.tex`: exact match for existing plotted Dirichlet/TN values and the added MLN values. The four-method source also includes MMD-raw, which is outside this requested three-model comparison.
- `../CompositionalRF/dev/28072026_2/final_experiments/tables_paper/tab_forest_settings.tex`: identical growth rule, 1000 trees, mtry 3, no resampling, depth 10, minimum child size m.
- [Compositional random forest, arXiv:2611.14275](https://arxiv.org/abs/2611.14275), submitted 10 November 2026: public title, authors and preprint record; Section 3.2.3 agrees with the delta2 formulation.
- [Kent (1982), The Fisher-Bingham Distribution on the Sphere](https://doi.org/10.1111/j.2517-6161.1982.tb01189.x): standard five-parameter spherical model; the three-dimensional formula and count also appear in the local manuscript and code.

## Remaining verification completed; personal rehearsal

- [x] Reconciled the deck with the latest committed main-project paper table: all 72 means match `final_experiments/tables_paper/tab_sample_size.tex`, committed as `03d0e52` on 1 November 2026 and unchanged at HEAD `633a540` (8 November). `Main_new.tex` was committed as `062ae00` on 20 October and is an older draft.
- [x] Retrieved the versioned public arXiv HTML and compared every mean in Table 1: all 72 plotted values match v1 exactly. The result slides now cite arXiv v1, Table 1 directly; the HTML SHA-256 and verification date are recorded in results_provenance.json.
- [x] Retained the historical exact-zero slide, as required by the instruction to preserve existing slides. Located its source table, manuscript and experiment script; all 30 table values match. Corrected the study description to 500 training and 300 test observations, 20 replications and 200 trees, and labelled its Gaussian tangent surrogate separately from current TN-RF. No presenter confirmation is required to retain this verified slide.
- [ ] Rehearse the 14:22 plan at your comfortable pace. Full interactive exploration will take longer; only the short specified interactions fit the plan.

## Missing results, figures and mathematical limits

- No MLN placeholder is needed: matching results and an implemented engine were located. No new simulations were run.
- No new figures are missing for the requested slides; existing renderers and figures were reused.
- No full-MLE performance claim has been added. Exact TN location generally needs numerical optimisation; retaining the truncation constant also changes shape estimation.
- No universal prediction ranking, exact orthant support, structural-zero probability atom or causal explanation for the earlier zero experiment is claimed.
- The shown mapped spherical level curves are labelled separately from simplex-density contours; transformation Jacobians are necessary when interpreting densities.

## Optional future work outside the requested deliverables

- Research extension, not unfinished presentation work: an orthant-truncated or folded model changes normalisation and estimation and requires a separate study.
- Optional enhancement, not a blocker: uncertainty displays using the source-table standard deviations. No new significance claims have been added.
- Optional enhancement, not a blocker: an offline bundle if the venue lacks reliable internet. The currently requested online presentation has passed browser checks.

## Validation

- [x] All inline JavaScript passes the installed Node runtime's syntax check.
- [x] All 36 slides load in headless Chrome using the actual CDN Plotly 2.35.2 and MathJax dependencies, with no browser errors or MathJax error nodes.
- [x] All 19 plot containers initialise. Layout checks at 1440 by 900 found no slide overflow; representative screenshots were visually inspected.
- [x] All eight sphere/line/projected-observation visibility combinations pass. Every combination retains all 150 original observations. The hidden-point state persists after resize to 1280 by 720.
- [x] Both metric buttons produce nine chart traces: three methods across three designs. All 72 plotted means match the recorded source table, including all original Dirichlet and TN values.
- [x] Home, End and previous-slide navigation, the private speaker window, and the explicitly toggled notes overlay pass.
- [x] Source DOM IDs are unique. Plotly generates its own repeated internal `scene` ID across separate 3D figures; this did not affect rendering or interactions.
- [x] Print/PDF preparation produces all 19 static figure images. The initial premature assertion was corrected to await asynchronous export completion; no print-pipeline change was required.
- [x] The presentation needs no build step. It runs directly from the local HTML file; CDN access is still required.
- [x] Total planned slide time is 862 seconds (14:22). This is a rehearsal target; personal delivery speed must be checked by the presenter.

Browser-test scripts, screenshots and the detailed test report were kept under `C:/Temp/presentation-qa`, outside the project. No server was left running.

## Main-project Git follow-up

Checked the repository at `../CompositionalRF/dev/28072026_2` following the presenter's supplied path. This directory is itself the repository; its outer `CompositionalRF` folder is not.

- Latest commit: `633a540`, 8 November 2026, LUCAS application and zero-component studies.
- Latest three-forest paper table: `03d0e52`, 1 November 2026, `final_experiments/tables_paper/tab_sample_size.tex`. All 72 means match the presentation and the earlier raw `tab_sample_size_m10.tex` table.
- Full experiment results: `8c1f03a`, 1 November 2026.
- Older manuscript: `062ae00`, 20 October 2026, `Main_new.tex`. Its differing table is not the latest committed results table.
- The latest zero-component study uses the current TN `delta2` score. It is distinct from the historical precursor table preserved in the presentation; these studies must not be conflated.
- The main research checkout contains existing modified and untracked files, particularly in `lucas_zeros`. They were left unchanged. Commit identifiers refer to local Git history; no fetch, pull, commit or push was performed.

The presentation's numerical results and executable HTML did not need to change after this audit. Only provenance and documentation were updated; the previous browser validation remains applicable.

## Final closure of the research checks

- Public source: https://arxiv.org/html/2611.14275v1#S4.T1. Programmatically compared all 72 displayed means against the actual versioned HTML, not only a local manuscript.
- Archived source: `paper/results/tables/25_zeros.tex`, also reproduced in `Main_old.tex`; generation script `paper/experiments/25_geometry_zeros.R`. Programmatically compared all 30 displayed values. Its source commit and verified settings are recorded in `presentation/results_provenance.json`.
- Retaining the archived slide follows the original requirement to preserve existing slides; it is a short historical illustration with a 12-second script, not a current TN-RF result.
- The only remaining original-deliverable checklist item is a personal timed rehearsal. A browser or code test cannot verify the presenter's speaking pace or pronunciation.
