# Presentation speaker notes

Presentation: `presentation/tn_talk.html`. Complete script in actual slide order. Planned delivery: **14 minutes 22 seconds**, including short transitions and brief figure actions. Rehearse at roughly 115-125 words per minute; use only the indicated short interactions. All 36 slides are retained. Longer exploration can follow questions.

Speak the script and transition. Bracketed directions and mathematical reminders are preparation notes, not spoken text. The deck uses u = sqrt(z); the geometry is the same as z = sqrt(x) in the request. S opens the synchronised private speaker view. N explicitly reveals notes as an overlay, so use S during the talk.

Timing is a rehearsal budget, not an automatic advance. If behind, leave sliders at their defaults and keep the two historical-results slides brief.

## Slide 1: Title

**Approximate speaking time:** 10 seconds (0:00?0:10).

**Say:**

Today, I am going to talk about random forests for compositional data. I will focus on our tangent normal model.

**Transition:** First, compositional data.

**Figure / interaction:** Show the title; no interaction.

**Remember:** Introduce TN as the proposed node model, not a claim of universal superiority.

## Slide 2: Compositional data: the simplex

**Approximate speaking time:** 28 seconds (0:10?0:38).

**Say:**

Before talking about compositional data, we first need to understand what the simplex space is. The simplex space is a convex set of vectors with non-negative components, where all the components add up to a constant. Usually, we set this constant equal to one. Data that belong to this space are called compositional data.

**Transition:** How do these data arise?

**Figure / interaction:** Point to the triangle and its example point.

**Remember:** The closed simplex admits zero parts and has dimension k minus one. Some density models use its interior.

## Slide 3: Compositional data: a practical view

**Approximate speaking time:** 23 seconds (0:38?1:01).

**Say:**

We often start with positive amounts. Divide each component by their total to obtain a composition. This removes absolute scale but preserves relative information. In particular, ratios between components remain unchanged.

**Transition:** Here is an example.

**Figure / interaction:** Point from the closure formula to the two boxes.

**Remember:** Ratios are preserved for positive components; closure cannot recover the original total.

## Slide 4: Compositional data: an example

**Approximate speaking time:** 18 seconds (1:01?1:19).

**Say:**

Suppose we have fifty job applicants. Twenty percent are mathematicians, thirty percent are statisticians, and fifty percent are computer scientists. These percentages sum to one hundred percent, so they form a composition.

**Transition:** We now want to predict compositions from other information.

**Figure / interaction:** Point across the three rows and then to the total.

**Remember:** Counts are 10, 15 and 25; proportions are 0.2, 0.3 and 0.5.

## Slide 5: Machine learning: random forest

**Approximate speaking time:** 12 seconds (1:19?1:31).

**Say:**

Random forests can learn complex relationships between predictors and compositional responses. We can adapt their splitting rule to the response distribution.

**Transition:** Here is the problem.

**Figure / interaction:** Indicate the splitting-rule bullet.

**Remember:** Log-ratio modelling is a legitimate alternative; do not call it inherently biased.

## Slide 6: Random forests framework

**Approximate speaking time:** 12 seconds (1:31?1:43).

**Say:**

Each row contains predictors and a compositional response. We want to predict a new composition and its conditional distribution.

**Transition:** A forest combines trees.

**Figure / interaction:** Point to X, then Y.

**Remember:** The response has k parts; the predictors need not be compositional.

## Slide 7: Random forest: overview

**Approximate speaking time:** 22 seconds (1:43?2:05).

**Say:**

A random forest is an ensemble of decision trees, usually trained on bootstrap samples. Important settings are the number of trees, maximum depth, minimum node size, and covariates considered at each split. Our later comparison uses all training observations.

**Transition:** Let us examine one tree.

**Figure / interaction:** Point to the four settings; do not read their symbols aloud.

**Remember:** Bootstrap sampling is common, not mandatory. Minimum parent and child sizes are different settings.

## Slide 8: Random forest: tree

**Approximate speaking time:** 20 seconds (2:05?2:25).

**Say:**

The root contains the training observations. A rule divides them into left and right children. We split recursively until a stopping rule produces terminal nodes, also called leaves.

**Transition:** How is a split chosen?

**Figure / interaction:** Trace one path from the root to a terminal node.

**Remember:** Each observation follows one branch at every split.

## Slide 9: MSE splitting

**Approximate speaking time:** 12 seconds (2:25?2:37).

**Say:**

A split consists of a covariate and a threshold. We compare how well the two children describe their observations.

**Transition:** Consider this rule.

**Figure / interaction:** Point to the two child nodes.

**Remember:** Candidates must satisfy the minimum child-size constraint.

## Slide 10: Split rule

**Approximate speaking time:** 18 seconds (2:37?2:55).

**Say:**

Consider X two less than or equal to three point one. Observations satisfying the rule go left. The others go right: five on the left, three on the right.

**Transition:** We need a comparison score.

**Figure / interaction:** Point to the highlighted X2 column and the child labels.

**Remember:** The observation exactly at 3.1 goes left.

## Slide 11: MSE splitting: the criterion

**Approximate speaking time:** 22 seconds (2:55?3:17).

**Say:**

With MSE splitting, we calculate the combined within-node squared error. We select the split with the smallest error. MSE focuses on the conditional mean. It does not explicitly account for simplex geometry or model the full conditional distribution.

**Transition:** We can instead use a distribution-based score.

**Figure / interaction:** Point to the weighted child criterion, then the box.

**Remember:** MSE is a valid loss. It does not require homoscedasticity, and an average of compositions remains a composition.

## Slide 12: Dirichlet log-likelihood splitting

**Approximate speaking time:** 25 seconds (3:17?3:42).

**Say:**

For likelihood splitting, fit a distribution in each child and choose the largest combined log-likelihood. Subtracting the fixed parent score gives the same ranking. Our experiments use moment estimates for Dirichlet and an approximate profiled score for TN.

**Transition:** How does prediction work?

**Figure / interaction:** Trace the parent-to-children diagram. Revisit this diagram during Kent estimation.

**Remember:** Exact objective: child log-likelihoods minus parent log-likelihood. Do not describe all experimental scores as exact maximised likelihoods.

## Slide 13: Prediction based on DirichletRF

**Approximate speaking time:** 20 seconds (3:42?4:02).

**Say:**

New observations follow the rules to a leaf. We can use a parametric distribution or the empirical responses there. Our experiments combine leaf weights and predict a weighted mean of training compositions.

**Transition:** Now, the distribution models.

**Figure / interaction:** Trace the dashed prediction path and point to the distributional box.

**Remember:** The splitting distribution and the prediction distribution need not be the same.

## Slide 14: Three approaches to modelling compositional data

**Approximate speaking time:** 20 seconds (4:02?4:22).

**Say:**

Before discussing our proposed distribution, let me briefly introduce three approaches. We can model directly on the simplex. We can use log-ratios and model in real space. Or we can use square roots and model on a sphere.

**Transition:** Let us start with the Dirichlet distribution.

**Figure / interaction:** Point left to right across the three cards.

**Remember:** MLN is the log-ratio approach; Kent and TN use spherical coordinates.

## Slide 15: Dirichlet distribution

**Approximate speaking time:** 32 seconds (4:22?4:54).

**Say:**

The Dirichlet distribution has K positive parameters. Its mean has K minus one free components; the remaining degree of freedom controls concentration. Mean component i is alpha i divided by the sum of the alphas. Once the mean is fixed, one concentration parameter determines the entire covariance matrix.

**Transition:** Contours illustrate this restriction.

**Figure / interaction:** Point to the mean and covariance formulas. Keep the default slider values.

**Remember:** Only off-diagonal covariances are negative; variances are positive. Dirichlet can still be a useful model.

## Slide 16: Dirichlet contour sets

**Approximate speaking time:** 20 seconds (4:54?5:14).

**Say:**

A contour line connects points where the probability density has the same value. These lines help us see the shape of a distribution. The Dirichlet can produce different contour shapes, but it cannot freely choose their orientation and elongation at a fixed mean.

**Transition:** Here is one configuration where that matters.

**Figure / interaction:** Use the reused Dirichlet figure. Optionally change one alpha slightly; avoid a long demonstration.

**Remember:** The displayed family illustrates restrictions, not every possible Dirichlet shape.

## Slide 17: What the Dirichlet cannot capture

**Approximate speaking time:** 25 seconds (5:14?5:39).

**Say:**

Both panels show the same example data. The blue tangent normal contours follow this elongated cloud more closely than the fitted orange Dirichlet contours. This illustrates greater TN flexibility for this configuration, rather than better fit in every case.

**Transition:** How do we reach TN?

**Figure / interaction:** Use the default positive-correlation preset. Point to the blue ridge and orange contours.

**Remember:** The Dirichlet is fitted by MLE in this demonstration. TN generated the example, so this is an illustration rather than a neutral performance experiment.

## Slide 18: From the simplex to the sphere

**Approximate speaking time:** 35 seconds (5:39?6:14).

**Say:**

For three-component compositional data, all observations lie on a triangle in three-dimensional space: their components are non-negative and sum to one. Take each component's square root. The observations now lie on the non-negative part of the unit sphere, because their squared components sum to one. This is one orthant, not the whole sphere. Zeros remain admissible.

**Transition:** Now consider spherical distributions.

**Figure / interaction:** Hide sphere, projection lines and projected observations to show the original triangle and data. Restore projected observations, sphere and lines to introduce the map.

**Remember:** Deck notation is u = square root of z; the requested z_i = square root of x_i is the same map with different letters. Keep the triangle visible.

## Slide 19: Kent distribution: definition

**Approximate speaking time:** 28 seconds (6:14?6:42).

**Say:**

For three components, standard Kent has five free parameters. Two describe mean direction; one describes orientation around that direction. Kappa controls concentration, and beta controls ovalness. Spread and orientation can vary more freely than under a Dirichlet with fixed mean.

**Transition:** Here are the contours.

**Figure / interaction:** Point to the three-part formula and parameter table.

**Remember:** The axes are orthonormal, not independent unrestricted vectors. Use 0 <= 2 beta < kappa for the standard unimodal form; orientation is unidentifiable when beta is zero.

## Slide 20: Kent: contours

**Approximate speaking time:** 22 seconds (6:42?7:04).

**Say:**

Concentration tightens the cloud. Ovalness stretches it; rotating the axes changes its direction. The triangle shows mapped spherical contours. These are not automatically density contours on the simplex.

**Transition:** There is a support issue.

**Figure / interaction:** Make one small change to the axis-turn slider. Point to the sphere and mapped curves.

**Remember:** Changing reference measure requires a Jacobian. Kent is not defined solely on the positive orthant.

## Slide 21: Kent: simulated data

**Approximate speaking time:** 15 seconds (7:04?7:19).

**Say:**

Kent is defined on the entire sphere. Our square-root observations occupy only the non-negative orthant. An unrestricted Kent model can therefore put probability outside the admissible region. The amount depends on its parameters.

**Transition:** Repeated estimation creates another difficulty.

**Figure / interaction:** Point to the red simulated observations and the outside-mass readout.

**Remember:** Do not claim every draw is valid at high concentration. Squaring negative coordinates gives a composition but is not the inverse of the non-negative square-root map.

## Slide 22: Kent: estimation cost

**Approximate speaking time:** 30 seconds (7:19?7:49).

**Say:**

At each node, we evaluate many splits and fit both children. This browser example uses Nelder-Mead optimisation over five Kent parameters, with numerical integration for its normalising constant. Repeating this can be expensive. The timing is an illustration, not an entire-forest benchmark.

**Transition:** We wanted simpler estimation.

**Figure / interaction:** Point to the reused split diagram and timing table. Do not wait for a second run during the timed talk.

**Remember:** TN timing measures the Gaussian profile only, excluding its Jacobian and truncation term. Do not interpret extrapolated forest times as measured results.

## Slide 23: TN: definition

**Approximate speaking time:** 50 seconds (7:49?8:39).

**Say:**

We wanted flexible shapes, similar to Kent, with simpler estimation. Start with square-root observations on the sphere. Their tangent coordinates are K transpose u. In these coordinates, use a zero-mean normal distribution conditioned to lie inside the open unit ball. Map back using the formula: the tangent component plus the positive square-root component along mu. This gives a distribution on the hemisphere centred at mu. Its spherical density includes the Jacobian, mu transpose u. We call it tangent normal because we use a normal distribution in tangent coordinates.

**Transition:** The variances control its shape.

**Figure / interaction:** Click steps 1 through 4 in order, pausing briefly as the points move.

**Remember:** This is the paper's orthogonal tangent-coordinate construction, not the exponential or gnomonic map. Density is zero outside the open hemisphere; divide by pi_Lambda for exact normalisation.

## Slide 24: TN: size and shape

**Approximate speaking time:** 28 seconds (8:39?9:07).

**Say:**

For three components, we express the tangent variances using kappa and beta. Kappa mainly controls size; beta changes the relative spreads. Rotating the axes changes orientation. This gives useful flexibility, although TN and Kent remain different distributions.

**Transition:** Examine one contour.

**Figure / interaction:** Point to the two variance formulas and the plane and sphere panels. Use one small slider change if time allows.

**Remember:** lambda2 = 1/(kappa - 2 beta), lambda3 = 1/(kappa + 2 beta). The variances parameterise the underlying normal before conditioning.

## Slide 25: TN: contour

**Approximate speaking time:** 20 seconds (9:07?9:27).

**Say:**

A TN contour connects points with equal spherical density. Both the tangent normal contribution and the Jacobian affect it. A mapped normal ellipse is therefore not simply a TN density contour.

**Transition:** Now connect the coordinate systems.

**Figure / interaction:** Point to a contour; leave the optional level-set surface off for the short talk.

**Remember:** Distinguish a mapped Gaussian ellipse from a level set of the spherical density.

## Slide 26: TN: contour sets

**Approximate speaking time:** 25 seconds (9:27?9:52).

**Say:**

These panels connect the tangent plane, sphere and triangle. Compositions occupy the non-negative orthant. With a strictly positive mean direction, this orthant lies inside the TN hemisphere. However, the larger hemisphere still allows mass outside the compositional region.

**Transition:** Simple summaries make computation fast.

**Figure / interaction:** Use the default view and point across the three panels; point to the outside-mass readout.

**Remember:** Mapped density contours are not interchangeable between spaces. TN is not an orthant-truncated model, and outside mass need not be small in every setting.

## Slide 27: TN: additive sufficient statistics

**Approximate speaking time:** 55 seconds (9:52?10:47).

**Say:**

The important point is that these statistics are additive. We keep the observation count, sum of square-root vectors, and sum of their outer products. For disjoint groups, we combine them simply by adding. We do not need to recalculate everything from the original observations. Sort a covariate and move its threshold through the ordered values. Update the left summaries, then subtract from the parent to obtain the right summaries. This is useful when evaluating many splits. These summaries support our approximate score; the exact Jacobian still needs the individual observations.

**Transition:** How do we obtain the score?

**Figure / interaction:** Point to T(A union B), then trace the four steps in the right box.

**Remember:** Sums are in square-root coordinates u, not changing tangent coordinates. The score is nonlinear in T; scores themselves are not additive. Exact full-likelihood sufficiency is not claimed.

## Slide 28: Why TN is easy to use

**Approximate speaking time:** 60 seconds (10:47?11:47).

**Say:**

First, normalise the sum of square-root observations to estimate mean direction. This is a moment estimate, not maximum likelihood. Given this direction, we maximise the Gaussian part over shape analytically. We avoid numerical optimisation over the full parameter vector. One Cholesky factor gives the required log-determinant, without calculating every axis and variance. Then add the second-order Jacobian approximation from the same summaries. We omit the truncation term under sufficient concentration. This implemented score needs no iterative parameter estimation. Full TN maximum likelihood differs: location generally needs numerical optimisation, and retaining truncation changes shape estimation.

**Transition:** This distinction matters for the comparison.

**Figure / interaction:** Point in order to location, Gaussian profile, implemented score and approximation note. Do not read the full determinant formula aloud.

**Remember:** Positive definiteness is required; code uses ridge safeguards. Profiling Gaussian shape conditional on a moment direction is not full truncated TN MLE. delta2 expands about the mean cosine.

## Slide 29: Kent vs TN

**Approximate speaking time:** 25 seconds (11:47?12:12).

**Say:**

Both models represent oriented, elongated shapes. Kent lives on the whole sphere; TN on a hemisphere. Neither is automatically restricted to the compositional orthant. Here, the practical difference is that our approximate TN score avoids repeated iterative parameter fitting.

**Transition:** One more model enters the comparison.

**Figure / interaction:** Move across the estimation, cost and support rows.

**Remember:** A small truncation correction is concentration-dependent. Do not claim equal flexibility or predictive superiority for every parameter regime.

## Slide 30: Multivariate logistic normal distribution

**Approximate speaking time:** 23 seconds (12:12?12:35).

**Say:**

Another common approach is the multivariate logistic normal distribution. Transform the composition using log-ratios, then assume a multivariate normal distribution. The inverse formulas return a composition. Standard log-ratios require strictly positive components.

**Transition:** We include MLN in the comparison.

**Figure / interaction:** Point to the forward transformation, normal model and inverse formulas.

**Remember:** X and Y here denote compositions and ALR coordinates, not the earlier predictor matrix. For a nonsingular sample covariance, Gaussian ML estimates are closed form.

## Slide 31: Results: test error

**Approximate speaking time:** 35 seconds (12:35?13:10).

**Say:**

These matched local results use the same data and eighty-twenty train-test splits, forty paired replications, and common forest settings. Lower error is better. TN improves on Dirichlet in most displayed cells. MLN is competitive and often best in the logistic-normal design. Performance depends on data structure and metric.

**Transition:** Here are the TN-Dirichlet differences.

**Figure / interaction:** Show Aitchison first, then click RMSE. Identify the grey MLN line using the legend.

**Remember:** These are tab_sample_size_m10.tex results, preserving original deck values. They differ from some manuscript drafts; do not call them arXiv Table 1 without checking. No new significance claim from means alone.

## Slide 32: Results: relative difference

**Approximate speaking time:** 12 seconds (13:10?13:22).

**Say:**

Negative bars mean lower TN error than Dirichlet. Many differences are small, so practical size also matters.

**Transition:** What about zeros?

**Figure / interaction:** Point to zero and the positive RMSE exception.

**Remember:** The denominator is the Dirichlet error. This plot excludes MLN and does not display uncertainty.

## Slide 33: Zeros: why the square root

**Approximate speaking time:** 18 seconds (13:22?13:40).

**Say:**

Square roots are defined at zero, while standard log-ratios are not. With a positive mean direction, zero-containing compositions remain admissible under the spherical TN model. This does not mean a continuous model assigns positive probability to an exact structural zero.

**Transition:** An earlier experiment explored exact zeros.

**Figure / interaction:** Point to the boundary of the triangle.

**Remember:** Positive spherical density at an edge does not create a boundary probability atom. This figure displays spherical density over triangle coordinates.

## Slide 34: Zeros: earlier experiment

**Approximate speaking time:** 12 seconds (13:40?13:52).

**Say:**

This earlier study used a TN precursor. It is separate from the main comparison.

**Transition:** Here are the main messages.

**Figure / interaction:** Indicate the earlier-experiment label; do not read the table values.

**Remember:** Energy score, 20 replications, n = 500; no Jacobian in the precursor. Similar errors after replacement do not establish a causal mechanism.

## Slide 35: Summary

**Approximate speaking time:** 22 seconds (13:52?14:14).

**Say:**

The Dirichlet is useful, but its covariance is restricted. Square roots provide spherical coordinates that admit zeros. TN gives flexible tangent covariance and an efficient approximate split score. Finally, the simulations favour different models under different data structures. There is no universal winner.

**Transition:** The work is available as a preprint.

**Figure / interaction:** Point briefly to the four messages.

**Remember:** The main contribution is the TN construction and fast split criterion, with its approximations stated explicitly.

## Slide 36: Thank you

**Approximate speaking time:** 8 seconds (14:14?14:22).

**Say:**

The research is an arXiv preprint, not yet published in a peer-reviewed journal. Thank you.

**Transition:** I welcome your questions.

**Figure / interaction:** Leave the paper citation visible.

**Remember:** Compositional random forest; Masoumifard, van der Westhuizen and Gardner-Lubbe; arXiv:2611.14275, submitted 10 November 2026.
