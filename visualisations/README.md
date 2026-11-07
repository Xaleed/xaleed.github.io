# visualisations

Interactive pages for the manuscript *Compositional random forest*. Every page runs in the browser with no server and no build step; the libraries (Plotly 2.35.2, MathJax 3.2.2 or KaTeX 0.16.9, Google Fonts) come from a CDN. Equation numbers on the TN page refer to the manuscript version of 2 November 2026 (`Emails_Walsh_scealy/CoDARF.pdf`).

## Pages

- `index.html` — landing page that links to every page below.
- `tn/tn_distribution.html` — the tangent-normal (TN) distribution: compositions in the triangle and in 3D, the square-root map to the sphere, the tangent plane and the map ψ (14), κ and β as size and shape through (17), contour sets of g (15) on the tangent plane, the sphere and the triangle, the level-set surface that cuts the sphere along a contour, the density as a heatmap and on the sphere with live simulation and estimation, and Kent versus TN with matched parameters (17). Single file.
- `kent/kent_on_the_sphere.html` — "Kent on the Sphere": the Kent distribution from zero, fully interactive (vMF versus Kent, tangent plane, Householder basis, worked example). Single file. Was `kent-on-the-sphere.html`.
- `kent/kent_triangle_to_ellipse_standalone.html` — "From a triangle to an ellipse": nine steps from the triangle to the Kent ellipse, with rotatable 3D figures. Single file with everything inlined (works offline). Was `kent-geometry-standalone.html`.
- `kent/kent_triangle_to_ellipse_web.html` — the website build of the same page; needs `assets/` and `figures/`. Was `kent-geometry.html`.
- `kent/kent_from_zero_standalone.html` — "The Kent distribution, from zero", the Quarto tutorial with the R code behind each figure. Single file with everything inlined (works offline). Was `kent-tutorial.html`.
- `kent/kent_from_zero_web.html` — the website build of the same tutorial, with the site's navigation; needs `assets/`, `figures/` and the site's `css/style.css`. Was `kent-distribution.html`.
- `kent/kent_estimation_explainer.html` — how the Kent leaf parameters are estimated: sufficient statistics, Householder reflector, tangent block, eigen-decomposition, split gain. Single file. Name unchanged.

## Figures used by the website builds

- `kent/figures/kent_from_zero_web/` — the 16 static R figures (`fig-*.png`) of `kent_from_zero_web.html` (were in `kent-distribution_files/figure-html/`).
- `kent/figures/kent_triangle_to_ellipse_web/` — the 3 static R figures (`fig-*.png`) of `kent_triangle_to_ellipse_web.html` (were in `kent-geometry_files/figure-html/`).

## Shared assets (website builds only)

- `assets/kent/geo-chrome.css` — page design of "From a triangle to an ellipse" (same tokens as Kent on the Sphere).
- `assets/kent/geo-chrome.js` — sticky step bar, contents panel and footer of "From a triangle to an ellipse".
- `assets/kent/kent-geometry-3d.js` — the rotatable 3D figures of "From a triangle to an ellipse".
- `assets/kent/kent-interactive.js` — the interactive figures of "The Kent distribution, from zero".
- `assets/quarto/clipboard/clipboard.min.js` — Quarto runtime: copy-code buttons.
- `assets/quarto/quarto-html/light-border.css` — Quarto runtime: tooltip theme.
- `assets/quarto/quarto-html/popper.min.js` — Quarto runtime: tooltip positioning.
- `assets/quarto/quarto-html/quarto-html-734cb40618f438257b19a1e532635a32.min.css` — Quarto runtime: base page styles.
- `assets/quarto/quarto-html/quarto-syntax-highlighting-7b89279ff1a6dce999919e0e67d4d9ec.css` — Quarto runtime: code highlighting.
- `assets/quarto/quarto-html/tabby.min.js` — Quarto runtime: tabsets.
- `assets/quarto/quarto-html/tippy.css` — Quarto runtime: tooltip styles.
- `assets/quarto/quarto-html/tippy.umd.min.js` — Quarto runtime: tooltips.

The two web builds shared byte-identical copies of the Quarto runtime (`*_files/libs/`), so one copy now serves both.

## What was changed in the copies

The Kent pages are copies of the files in the repository root (the originals are untouched, so the Quarto sources still build into the root as before). In the copies only links were changed, nothing that affects how a page looks or behaves:

- paths to the shared runtime, the helper scripts and the figures now point into `assets/` and `kent/figures/`;
- links to the website itself (`blog.html`, `index.html`, `cv.html`, `projects.html`, `contact.html`, `css/style.css`) gained one `../`, because the pages are now one folder deeper. They assume that `visualisations/` sits at the root of the website, next to `blog.html`. Locally these links lead nowhere, as they did before.

## Upload

Copy the whole `visualisations/` folder to the root of the website. The TN page, the landing page, `kent_on_the_sphere.html`, `kent_estimation_explainer.html` and the two `*_standalone.html` files also work on their own.
