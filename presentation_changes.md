# Presentation change summary

The existing presentation/tn_talk.html was rewritten into a 42-slide, approximately 25-minute conference talk. All 19 original Plotly figures and their initialization hooks remain. The original light theme, 16:9 stage, typography, distribution colours and navigation are preserved.

All 42 slides now contain TARGET, SAY, POINT TO, TRANSITION and REMEMBER components. SAY is a complete, plain-English speaking script. The standalone speaker-notes document is generated from those same embedded notes.

Added slides: 29 (Jacobian validation), 34 (LUCAS) and 37–40 (structural-zero design, weighted probability, verified curve and numerical comparison). Existing later slides were renumbered. No slides were merged. The earlier zero-study table was replaced with a short historical-context slide at 36; its distinct surrogate is explicit and it is not used to support the current TN results.

Improved the title; introduction; X-to-Z notation; split example; compact SSE and likelihood-gain formulas; forest-weight explanation; Kent density; folded-Kent caveat; TN construction; additive summaries; Gaussian profile and Jacobian explanation; Kent/TN comparison; simulation interpretation; zero explanation; and conclusions. Added simple interactive controls to the original simplex and tree diagrams. Reduced clutter in the TN score and comparison slides. New research cards were visually corrected after browser inspection.

Plotly 2.35.2 and all research figures are now local portable assets. MathJax and web fonts still use CDNs; the README documents this. The final curve uses the source publication PNG without redrawing data. Both source PDFs and Figure 2 are also included.

See presentation/TIMING_REPORT.md, presentation/SCIENTIFIC_REVIEW.md and presentation/VALIDATION_REPORT.md for timing, source qualifications and test evidence. No manuscripts were edited, no simulations were rerun, and no publication or Git push was performed.
