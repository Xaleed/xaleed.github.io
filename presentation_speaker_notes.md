# Complete rehearsal script

SAY and TRANSITION are spoken. POINT TO and REMEMBER are private cues. Durations include the planned visual actions.

## 1. Title — 25 seconds

**SAY:**

Good morning, everyone. Today, I will discuss random forests for compositional data. We compare three distributional approaches. Our main contribution is a tangent-normal model with an efficient approximate splitting score.

**POINT TO:** Face the audience; pause after the title.

**TRANSITION:** First, what exactly are compositional data?

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 2. Compositional data: the simplex — 35 seconds

**SAY:**

Compositional data are non-negative vectors whose components sum to a fixed total, usually one. Their space is called the simplex. For three components, it is a triangle. Each point represents a composition. Interior points have three positive components. On an edge, at least one component is zero. The corners represent compositions with only one positive component.

**POINT TO:** Point to the triangle, then to an edge.

**TRANSITION:** Let me show how we obtain a composition from ordinary measurements.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 3. Closure transformation — 28 seconds

**SAY:**

Suppose we observe several positive quantities. We divide each quantity by their total. This operation is called closure. The resulting proportions sum to one. We lose the original scale: two vectors with the same proportions but different totals give the same composition.

**POINT TO:** Point to the total and the two proportional vectors.

**TRANSITION:** Here is a simple example.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 4. An example of compositional data — 24 seconds

**SAY:**

Suppose fifty applicants come from three fields. Ten studied mathematics, fifteen statistics, and twenty-five computer science. Their proportions are twenty, thirty, and fifty percent. These proportions form a composition. We may want to predict them from other information.

**POINT TO:** Point across counts 10, 15, 25 and proportions 0.2, 0.3, 0.5.

**TRANSITION:** This leads us to machine learning.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 5. Why random forests? — 20 seconds

**SAY:**

Random forests learn nonlinear relationships and interactions. Our focus is the splitting rule: we adapt it to the distributional structure of compositional responses.

**POINT TO:** Indicate the final bullet on adapted splitting.

**TRANSITION:** Here is our prediction problem.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 6. The prediction problem — 20 seconds

**SAY:**

X contains predictors, such as environmental measurements. Z contains compositions. Each response sums to one. We predict Z for new predictor values.

**POINT TO:** Point from predictor X to compositional response Z.

**TRANSITION:** We combine many decision trees.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 7. Random forest overview — 25 seconds

**SAY:**

A random forest combines many decision trees. Each tree divides the predictor space into smaller regions. Predictions combine information across trees. Important settings include the number of trees, the variables considered at each split, and the stopping rules.

**POINT TO:** Point to the tree ensemble and tuning parameters.

**TRANSITION:** Let us look at a single tree.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 8. How a decision tree works — 28 seconds

**SAY:**

We begin with the training observations in the root. A rule divides them into two groups. We repeat this process until a stopping rule is reached. The final groups are leaves. A new observation follows the same rules to a leaf. Let me trace one path.

**POINT TO:** Trace one path through the tree.

**TRANSITION:** The important question is how the tree chooses each split.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 9. Splitting a node — 25 seconds

**SAY:**

At each node, we compare candidate splits. Each split uses a predictor and a threshold. Observations on one side of the threshold go left; the others go right. The splitting criterion tells us which candidate is best.

**POINT TO:** Point to the parent, threshold and children.

**TRANSITION:** Let us consider a numerical example.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 10. A simple split example — 26 seconds

**SAY:**

Here, we use the second predictor and a threshold of three point one. Values less than or equal to the threshold go left. The others go right. Five observations go left and three go right. Notice that the observation exactly at the threshold goes left.

**POINT TO:** Highlight the selected predictor and the left and right groups.

**TRANSITION:** The classical approach uses squared error.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 11. MSE splitting — 30 seconds

**SAY:**

Ordinary regression trees often use squared error. For each split, we calculate the error within both children and select the smallest combined error. This is a valid criterion for mean prediction. However, a compositional distribution may contain useful information beyond its mean.

**POINT TO:** Point to the sum of child errors.

**TRANSITION:** This motivates a different splitting criterion.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 12. Likelihood-based splitting — 35 seconds

**SAY:**

We can instead use a distribution-based score. For each candidate split, we fit the chosen model to both children. We compare their combined score with the parent score. A larger gain is better. The parent is fixed during this comparison. In our implementation, some scores use moment estimates or approximations.

**POINT TO:** Trace parent → children; then indicate G.

**TRANSITION:** Before discussing these distributions, let us see how the forest makes predictions.

**REMEMBER:** The implementation may use moment estimates or approximate profiled likelihoods. Do not describe every splitting score as an exact maximum likelihood.

## 13. Prediction using forest weights — 28 seconds

**SAY:**

A new observation reaches a leaf in each tree. Training observations in those leaves receive weights. Across the forest, these weights sum to one. For mean prediction, we take a weighted average of the training compositions. Later, we will use the same weights for another target.

**POINT TO:** Trace the tree path, then the weighted mean.

**TRANSITION:** Now we are ready to discuss the distributional models.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 14. Three approaches to compositional modelling — 30 seconds

**SAY:**

We consider three geometries. First, we can model directly on the simplex, using the Dirichlet distribution. Second, we can use log-ratios and a normal model in Euclidean space. Third, we can take square roots and work on the sphere. Our tangent-normal model uses this third approach.

**POINT TO:** Point left to right: simplex, log-ratios, sphere.

**TRANSITION:** Let us begin with the Dirichlet distribution.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 15. Dirichlet distribution — 40 seconds

**SAY:**

The Dirichlet distribution has one positive parameter for each component. We can express these through a mean composition and one concentration parameter. Concentration controls how tightly observations group around the mean. But once the mean is fixed, this single parameter determines the entire covariance matrix. We cannot adjust the orientation and relative spreads freely. This restriction motivates a more flexible model.

**POINT TO:** Point to mean and covariance; keep default controls.

**TRANSITION:** We can see this restriction in the contour plots.

**REMEMBER:** Dirichlet: dee-REE-klay. Off-diagonal covariances are negative; Dirichlet still models dependence.

## 16. Dirichlet contour sets — 30 seconds

**SAY:**

A contour joins points with the same probability density. Changing the Dirichlet parameters changes the location and spread. However, these changes remain linked. At a fixed mean, concentration cannot freely rotate and stretch the distribution. Let me make one small slider change.

**POINT TO:** Move one relevant slider slowly.

**TRANSITION:** Let me compare this with a more flexible example.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 17. Limitation of Dirichlet covariance — 42 seconds

**SAY:**

These observations form a long, narrow cloud. Its direction matters. On the left, tangent-normal contours follow that pattern. On the right, a Dirichlet model is fitted to the same observations. It cannot reproduce the orientation as freely. This is an illustration using TN-generated data, not evidence that Dirichlet is always worse. We need prediction experiments for a fairer comparison.

**POINT TO:** Point to the main visual; no control change is needed.

**TRANSITION:** One way to obtain greater flexibility is to change the geometry.

**REMEMBER:** Illustrative TN-generated example, conditioned to the orthant for this display; no neutral performance comparison is claimed.

## 18. Square-root transformation — 50 seconds

**SAY:**

Now take the square root of each component. The original components sum to one, so the squares of the transformed components sum to one. The transformed vector therefore lies on the unit sphere, in its non-negative region. Watch how the triangle points map to the sphere. This map is one-to-one in that region, with squaring as its inverse. It also works when a component is zero. We can now consider directional distributions.

**POINT TO:** Demonstrate how a point on the triangle maps to the sphere.

**TRANSITION:** A well-known directional distribution is the Kent distribution.

**REMEMBER:** The non-negative orthant is the image of the closed simplex. Say square root slowly.

## 19. Kent distribution — 40 seconds

**SAY:**

Kent is a flexible distribution on the sphere. Its parameters describe a mean direction, concentration, ovalness, and axis orientation. For three-dimensional directions, these allow circular or elongated contours. The axes are perpendicular to the mean direction and to each other. This flexibility makes Kent an interesting starting point for spherical modelling.

**POINT TO:** Point to mean direction, concentration, ovalness and axes.

**TRANSITION:** Let us see how these parameters affect the contours.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 20. Kent contours — 30 seconds

**SAY:**

Increasing concentration tightens the distribution. Ovalness stretches the contours, and we can rotate their axes. Let me change one control. Kent is defined on the whole sphere, while square-root compositions occupy only the non-negative region. The curves mapped to the triangle are not automatically simplex-density contours.

**POINT TO:** Demonstrate concentration and ovalness.

**TRANSITION:** This becomes especially clear when we generate observations.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 21. Kent simulated data — 22 seconds

**SAY:**

Kent draws can leave the non-negative region. Squaring every coordinate gives a composition. Its non-negative square root is the absolute value of the original vector, so it follows a folded Kent distribution.

**POINT TO:** Point to draws outside the orthant and the folding note.

**TRANSITION:** Repeated fitting creates another difficulty.

**REMEMBER:** The browser demo uses numerical grid inversion; experimental design K uses exact FB5 draws. Squaring folds signs.

## 22. Why Kent fitting is expensive — 43 seconds

**SAY:**

Kent has a complicated normalizing constant. Parameter estimation generally requires numerical optimization. A single fit may be manageable. In a forest, however, we compare many candidate splits at every node and fit both children. Repeating full optimization can become expensive. This browser timing illustrates that repeated work; it is not a measured forest benchmark. We wanted a simpler splitting calculation.

**POINT TO:** Show the repeated parent/child fitting process.

**TRANSITION:** Now I will introduce the main methodological idea.

**REMEMBER:** Browser timing is illustrative, not a forest benchmark. Its TN timing includes only the Gaussian profile.

## 23. Tangent-normal construction — 65 seconds

**SAY:**

Our construction starts with a mean direction on the sphere. We use coordinates in its tangent plane. In these coordinates, we take a normal distribution conditioned to stay inside the unit ball. Its covariance controls size, shape, and orientation. We then map these points back to the sphere. Let me walk through the four visual stages. The resulting TN distribution lives on a hemisphere centred at the mean direction. Its density includes a Jacobian factor. The hemisphere is larger than the compositional orthant, so TN can still place mass outside the non-negative region.

**POINT TO:** Walk through all three visual stages slowly.

**TRANSITION:** Let us look more closely at the parameters.

**REMEMBER:** The tangent-normal model is defined on a hemisphere, not exactly the positive orthant. The normal is conditioned to the open unit ball. This is the orthogonal tangent-coordinate map, not the exponential map. TN: tangent normal.

## 24. Tangent-normal size and shape — 32 seconds

**SAY:**

For three components, we express the two tangent variances using concentration and ovalness. Concentration mainly controls width. Ovalness changes the relative spreads along the axes. Rotating the covariance changes orientation. These are the variances of the underlying normal before conditioning. Let me make one small change.

**POINT TO:** Make one small ovalness change; point to the tangent spreads.

**TRANSITION:** These effects can also be seen in the contours.

**REMEMBER:** Covariance parameters refer to the normal before conditioning. Keep 0 ≤ 2 beta < kappa.

## 25. TN contours — 25 seconds

**SAY:**

These are contours of the spherical TN density. Equal tangent variances give circular contours; unequal variances give elongated contours. Both the normal term and the Jacobian affect these curves. A mapped normal ellipse is not exactly a TN density contour.

**POINT TO:** Point to one blue contour; leave the optional surface off.

**TRANSITION:** We can now connect these contours to the original compositions.

**REMEMBER:** Spherical TN contours include the Jacobian; mapped Gaussian ellipses differ.

## 26. Three connected spaces — 40 seconds

**SAY:**

These panels connect the tangent plane, sphere, and simplex. We map tangent coordinates to the hemisphere. In the non-negative region, squaring returns the original composition. Outside it, squaring folds the signs. The tangent covariance helps explain the patterns in the triangle. But mapped curves need not remain equal-density contours after a change of space.

**POINT TO:** Move visually from the plane to the sphere and then to the triangle.

**TRANSITION:** Next, I will explain why this construction is computationally useful.

**REMEMBER:** Only the orthant gives the inverse of the non-negative square-root map. TN can put mass outside it; mapped density levels need not remain density levels.

## 27. Additive summaries — 48 seconds

**SAY:**

For each node, we keep three summaries: the observation count, the sum of square-root vectors, and the sum of their outer products. These summaries are additive. We sort a predictor and move its candidate threshold through the observations. Updating the left child is simple. Subtracting from the parent gives the right child. This supports fast repeated split evaluation. The summaries determine our approximate score, but not the complete TN likelihood with an unknown direction.

**POINT TO:** Point to the main visual; no control change is needed.

**TRANSITION:** Now let us see how we use them to calculate the splitting score.

**REMEMBER:** These summaries support the implemented approximate criterion. Do not claim they are sufficient for the complete TN likelihood with unknown direction.

## 28. Efficient approximate TN splitting — 58 seconds

**SAY:**

First, we normalize the average square-root vector to estimate mean direction. This is a moment estimate. Given that direction, we profile the Gaussian covariance analytically. The main calculation is a log-determinant. We add a second-order approximation to the Jacobian term. Under sufficient concentration, we omit the truncation-normalization term. These steps avoid repeated optimization over all parameters. They define an efficient approximate score, not the exact fully maximized TN likelihood.

**POINT TO:** Point in order to the moment direction, profile, determinant and Jacobian.

**TRANSITION:** An important question is whether this approximation changes the selected splits.

**REMEMBER:** Do not call the approximate TN split score the exact fully maximized TN likelihood. Omit −n log pi_Lambda only under the stated concentration approximation; positive-definite covariance and ridge safeguards are needed.

## 29. Jacobian approximation validation — 45 seconds

**SAY:**

We compared the second-order Jacobian approximation with the exact Jacobian term. Across more than one hundred and seventy-four thousand nodes in designs D, L, and K, they selected the same variable and threshold in about ninety-nine point nine eight percent of cases. A separate one-hundred-tree benchmark took zero point three five seconds with the approximation and three point eight seconds with the exact term. This supports the shortcut in the tested settings.

**POINT TO:** Emphasize the 99.979% figure.

**TRANSITION:** Let me briefly summarize the difference between Kent and TN.

**REMEMBER:** Exact means exact Jacobian at the same moment direction and profiled Gaussian covariance; not full TN MLE. Separate benchmark: n=1000, 100 trees, 5 threads. Jacobian: juh-KOH-bee-un.

## 30. Kent versus TN — 28 seconds

**SAY:**

Kent and TN allow elongated spherical shapes. Kent generally needs numerical optimization. Our TN score uses a moment direction, an analytic Gaussian profile, and an approximate Jacobian. Their supports differ: whole sphere versus hemisphere.

**POINT TO:** Point across the fitting and support rows.

**TRANSITION:** Our other comparison uses log-ratios.

**REMEMBER:** TN efficiency here is relative to repeated full directional fitting. It does not establish faster fitting than MLN or Dirichlet.

## 31. Multivariate logistic-normal — 30 seconds

**SAY:**

The multivariate logistic-normal model uses another geometry. We transform a composition using log-ratios, then model those coordinates with a multivariate normal distribution. This allows flexible covariance in log-ratio space. Standard log-ratios require every component to be positive, so exact zeros need separate handling. MLN is an important comparison.

**POINT TO:** Point from log-ratio coordinates to the Gaussian model.

**TRANSITION:** Now let us examine the prediction results.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 32. Simulation prediction accuracy — 50 seconds

**SAY:**

We compare the three forests under Dirichlet, logistic-normal, and Kent-generated designs. All methods use shared data and train-test splits, forty paired repetitions, and common forest settings. Lower error is better. Let us switch from Aitchison distance to RMSE. TN performs well in the Kent-based design, while MLN is competitive, especially under the logistic-normal design. The ranking depends on both the data structure and the metric. These results do not show a universal winner.

**POINT TO:** Use the Aitchison and RMSE controls.

**TRANSITION:** We can also look at the relative differences.

**REMEMBER:** Aitchison: AT-chi-sun. All 72 means are retained and checked against the current local real-data manuscript Table 1. These are observed-response errors, not conditional-mean truth errors.

## 33. Relative prediction errors — 25 seconds

**SAY:**

Here we compare TN with Dirichlet using relative errors. Negative bars favour TN. There are improvements in several settings, but some are small and one RMSE comparison goes the other way. This plot shows mean differences; it does not establish significance.

**POINT TO:** Point to zero and the small positive RMSE exception.

**TRANSITION:** Next, let us examine a real environmental application.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 34. LUCAS soil-texture prediction — 55 seconds

**SAY:**

We also studied soil texture in Germany: clay, silt, and sand. There are seventeen hundred and eighty-five sites and one hundred and eighty predictor columns after encoding. We used ten repetitions of five-fold cross-validation with shared random folds. Overall accuracy is very similar across the forests. For clay, MLN and TN improve on Dirichlet. TN has no clear overall advantage over MLN, and took longer to fit. Because the folds are random, this does not test geographic extrapolation.

**POINT TO:** Point to clay RMSE, then to the random-fold limitation.

**TRANSITION:** So far, we have mainly discussed positive compositions. What happens when some components are zero?

**REMEMBER:** The validation uses random folds, not spatially blocked folds. Do not claim geographic extrapolation. LUCAS: LOO-kas. Ten repetitions of five random folds; 169 raw predictors become 180 columns. Component-wise improvement does not prove a boundary mechanism.

## 35. Why zeros matter — 22 seconds

**SAY:**

Standard log-ratios are undefined at zero. Square roots map zero to a valid boundary coordinate. This permits TN-based forest construction with zeros. A continuous TN density still gives no probability atom at zero.

**POINT TO:** Point to a triangle edge and √0 = 0.

**TRANSITION:** An earlier study helped motivate our current experiment.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 36. Earlier exploratory experiment — 24 seconds

**SAY:**

An earlier exploratory study examined exact zeros using a different Gaussian tangent surrogate. It did not include the TN Jacobian. It helped motivate this work, but it is separate from the current method. I will focus on the new experiment.

**POINT TO:** Indicate the historical label; do not compare numerical scores.

**TRANSITION:** Let me explain the new simulation design.

**REMEMBER:** Historical experiment: Gaussian tangent surrogate without TN Jacobian, 200 trees, energy score. Keep separate from current Structural K.

## 37. Structural-zero simulation — 45 seconds

**SAY:**

We now use Structural K. We square Kent draws to obtain compositions, then allow the third component to become exactly zero. Its zero probability depends on predictor six through the formula shown here. We know this probability, so we can evaluate recovery directly. All methods share forty repetitions, one thousand observations, and one thousand trees. TN uses native zeros; MLN and Dirichlet use the prespecified replacement procedure.

**POINT TO:** Trace the point to the boundary; point to x6 in the formula.

**TRANSITION:** How can a random forest estimate this probability?

**REMEMBER:** Structural K uses exact Kent draws, squared and reclosed, then zero injection; x6 is Uniform(−1,1). Replacement is only for MLN/Dirichlet tree construction.

## 38. Predicting zero probability — 45 seconds

**SAY:**

Recall the forest weights. For each training observation, we record whether the original third component is zero. The indicator is one for a zero and zero otherwise. We multiply these indicators by the weights and add them. This estimates the conditional zero probability without fitting another regression model. We always use original indicators, even if replacement was used to grow the trees. The probability comes from the weighted empirical distribution.

**POINT TO:** Trace weights × original indicators → probability.

**TRANSITION:** Now let us compare these estimates with the true probability.

**REMEMBER:** The indicator uses the original observed data, even if zero replacement was used to construct an MLN or Dirichlet forest. Do not claim that the continuous TN density itself assigns positive probability to an exact zero.

## 39. Recovering the true probability — 45 seconds

**SAY:**

The dashed curve is the true zero probability. The coloured curves show the forests, and the horizontal line is the training-frequency baseline. All forests learn the general relationship with predictor six. The baseline cannot follow it. These curves average predictions within bins and across repetitions. They can hide variation between individual predictions, so their closeness to the truth alone does not determine the overall error ranking.

**POINT TO:** Start with the true curve, then compare the estimated curves and the baseline.

**TRANSITION:** Here are the numerical results.

**REMEMBER:** These are binned means, not individual-forest partial dependence. TN has more attenuation but less within-bin error variation; do not infer MSE ranking from mean curves alone.

## 40. Zero-probability prediction errors — 50 seconds

**SAY:**

We use two errors. Brier score evaluates predictions of observed zero events. Probability MSE compares estimates with the known true probability. TN has the lowest probability MSE: about six percent below MLN and ten percent below Dirichlet. These paired differences are significant after the reported Holm adjustment. But the forests have no significant Brier-score differences. Our conclusion is specific to this simulation and replacement setting. Different preprocessing and splitting rules were compared together, so we cannot isolate their separate effects.

**POINT TO:** Point to MSE first, then Brier; pause between the two targets.

**TRANSITION:** Let me finish with the main conclusions.

**REMEMBER:** Do not claim universal superiority. The comparison includes different splitting criteria and different zero-preprocessing procedures. Only the primary replacement setting, f = 0.65, was evaluated for this probability target. Brier: BRY-er. Six paired comparisons per metric form the Holm family. Only f=0.65 was evaluated. This result is documented in the separate 15 November report, not yet in the manuscript.

## 41. Main conclusions — 35 seconds

**SAY:**

Our main messages are these. Compositional geometry matters. TN provides flexible tangent covariance. Additive summaries make its approximate splitting score efficient. The same forest weights can estimate conditional zero probabilities. The evidence is encouraging, but no single geometry is best for every dataset.

**POINT TO:** Point once to each of the four messages.

**TRANSITION:** I will leave you with these four messages.

**REMEMBER:** Pause naturally. Read symbols in words; do not read every formula aloud.

## 42. Thank you — 15 seconds

**SAY:**

Thank you very much for your attention. I would be happy to answer any questions.

**POINT TO:** Leave the citation visible; face the audience.

**TRANSITION:** I welcome your questions.

**REMEMBER:** Allow the audience to finish reading the citation. End speaking, then invite questions.
