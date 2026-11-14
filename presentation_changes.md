# Presentation modification summary

The existing `presentation/tn_talk.html` deck now contains 36 slides, preserving all 32 original slides and the original visual framework. The slide-by-slide rehearsal plan totals 14:22. Speaker notes are separate from displayed slide content and are also synchronised with the existing private speaker window.

## Files created

- `presentation_speaker_notes.md`: complete spoken script in actual slide order, per-slide timing, transitions, figure actions and statistical reminders.
- `presentation_todo.md`: completed tasks, source evidence, remaining presenter decisions, mathematical limitations and validation results.
- `presentation/results_provenance.json`: all plotted means and the matched experiment's settings and source paths.
- `presentation_changes.md`: this summary.

## Files modified

- `presentation/tn_talk.html`: slides, controls, scientific wording, speaker notes and planned times.
- `presentation/README.md`: updated slide order, timing, local usage, controls and result provenance.

## Slides added

- Slide 14: three approaches to modelling compositional data.
- Slide 16: Dirichlet contour sets, reusing the original layout, figure and controls, with the covariance panel replaced by the contour definition.
- Slide 27: additive TN statistics and their use in a running split search.
- Slide 30: multivariate logistic normal, ALR transformation, normal model, inverse map and positivity requirement.

## Existing material improved

- Clarified MSE's role as a conditional-mean loss, bootstrap sampling as a common choice, generic likelihood splitting versus the implemented approximations, and empirical forest prediction.
- Clarified the Dirichlet parameter count, restricted covariance and example-specific comparison with TN.
- Added independent show/hide control for projected observations. Sphere and lines remain separately controllable; original observations remain present in every combination.
- Retained the five-parameter Kent definition and contours; clarified mapped contours versus transformed densities, whole-sphere support and parameter-dependent outside mass.
- Reused the existing split diagram in Kent's cost slide. Distinguished its numerical browser MLE from the TN Gaussian profile and labelled the extrapolated timing as illustrative.
- Used the exact TN tangent-coordinate map, unit-ball-conditioned normal and spherical Jacobian. Distinguished hemisphere support from the compositional orthant.
- Explained moment location, analytic Gaussian shape profiling, one-Cholesky scoring, the implemented delta2 Jacobian approximation and omitted truncation term. Full TN MLE is not claimed to be iteration-free.
- Preserved the Kent/TN comparison and added matching MLN results in both test-error views, without changing original Dirichlet or TN numbers.
- Qualified historical exact-zero results and the difference between admissible zero coordinates and probability atoms at structural zeros.
- Added the correct three-author arXiv preprint citation on the final slide.

## Validation and remaining work

The deck is buildless and runs locally. All 36 slides, all 19 figures, math rendering, layout, navigation, speaker controls, all eight visibility combinations and both metric views passed browser checks. All 72 plotted means match the recorded source table. Print preparation exports all 19 figures as static images.

Remaining presenter decisions are in `presentation_todo.md`: check the specific arXiv table version if needed, confirm historical-study provenance, and rehearse at your comfortable pace. The subsequent main-project Git audit confirmed that all 72 plotted means match the latest committed paper table (`03d0e52`, 1 November; HEAD `633a540`, 8 November), while `Main_new.tex` is an older 20 October draft. No new simulation results were invented or generated. Original research documents and earlier presentations were preserved.

Initial preparation was local-only. The presenter subsequently authorized a GitHub commit and push.
