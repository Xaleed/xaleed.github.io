# Scientific consistency review — 15 November 2026

## Primary source selection

The latest completed manuscript located is [Main_with_real_data.tex](../../CompositionalRF/dev/28072026_2/Main_with_real_data.tex), dated 15 November, with the LUCAS application and the second-order expansion about the mean cosine. It was used as the primary reference. Main_new.tex and Main_old.tex are older drafts. No Main.tex, CompositionalRF_submission/Main.tex or separate Real_data_LUCAS_section.tex was found in the searched GitHub and Documents trees.

No located manuscript contains the new zero-probability experiment. Its authoritative source is the separately completed [ZERO_PROBABILITY_RESULTS_REPORT.md](../../CompositionalRF/dev/28072026_2/final_experiments/lucas_zeros/results/zero_probability/ZERO_PROBABILITY_RESULTS_REPORT.md), dated 15 November. That report explicitly records that no manuscript was changed. The deck identifies these results separately rather than claiming they are in the paper.

## Verified numerical evidence

- All **72** D/L/K plotted means were programmatically compared with the selected manuscript's sample-size table; every value agrees. They remain observed-response prediction errors, separate from conditional-mean experiments. No simulations were run.
- The LUCAS table matches all nine displayed cells: 0.7705/13.05/8.63, 0.7681/12.97/8.14 and 0.7684/12.97/8.12. Counts, encoding, CV repetitions, mtry and random-fold limitation match the real-data section. TN has no clear overall advantage over MLN; fitting was slower in the separate timing check.
- Jacobian evidence comes from [summary_prompt1.md](../../CompositionalRF/dev/28072026_2/paper/experiments_tn_jacobian/results/prompt1/summary_prompt1.md), §4: 174,271 nodes; pooled 99.979% agreement. The 0.35 s versus 3.8 s result is explicitly a separate 100-tree, n=1000, 5-thread benchmark. This historical validation uses its own recorded software and growth rule; it is not relabelled as the structural-zero run.
- Structural K: the probability formula, 40 repetitions, 800/200 split, 1,000 trees, native TN zeros and replacement f=0.65 for MLN/Dirichlet match the completed report. Original observed zero indicators are used for every method.
- All eight Brier/MSE table cells, 5.85% and 9.83% reductions, and rounded Holm p-values 0.0394/0.00264 match the report. The six pairwise comparisons per metric form each Holm family. Brier differences among forests are not significant.
- Slide 39 uses an unchanged copy of the verified publication_ready PNG corresponding to figure1_zero_probability_curves.pdf. Both PDFs and matching PNGs were copied into assets. Figure 2 is supporting material, not crowded onto the numerical-results slide. Binned average curves are labelled correctly.

## Mathematical qualifications retained

Dirichlet covariance depends on the mean and one concentration parameter; the model still describes dependence. Kent lives on the whole sphere. Squaring its draws gives compositions whose non-negative square roots follow a folded Kent law. The latest manuscript still uses shorthand saying that the square root follows Kent in its discussion; the deck uses the more precise folded interpretation verified against the experiment report.

TN uses orthogonal tangent coordinates, a normal conditioned to the open unit ball, and the inverse tangent-coordinate map to a hemisphere. The hemisphere is not the non-negative orthant. The density includes the spherical Jacobian and exact normalization. Mapped curves are not automatically density contours in another space. The Dirichlet/TN shape illustration conditions the example draws to the orthant; it is an illustration, not a neutral performance experiment.

The implemented splitting score uses a moment direction, an analytically profiled Gaussian covariance, delta2 Jacobian, and omitted truncation correction under sufficient concentration. It is not full TN maximum likelihood. Additive summaries support this approximate score and are not sufficient for the exact unknown-direction likelihood. Numerical covariance safeguards are noted privately.

Square-root admissibility of zeros, native-zero forest construction and empirical probability mass from forest weights are distinct. A continuous TN density does not itself supply an atom at zero. No claim of perfect calibration, universal superiority, geographic extrapolation, or a causal effect of replacement is made. The old Gaussian-tangent zero experiment is retained only as brief labelled historical context.

Source paths and SHA-256 fingerprints are recorded in results_provenance.json. Manuscripts and original research outputs were read only.
