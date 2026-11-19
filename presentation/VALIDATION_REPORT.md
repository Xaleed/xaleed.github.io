# Presentation validation — 15 November 2026

Tested locally in **headless Google Chrome 157 on Windows**, using the browser's DevTools protocol. The final pass completed without JavaScript exceptions or browser error-log entries. This is browser automation and visual review, not a measured human rehearsal or a physical-projector test.

| Check | Result |
|---|---|
| Slide structure | 42 slides; 42 complete notes; all four required note components and target durations |
| Browser traversal | All 42 slides activated and captured; correct slide numbers |
| Visual review | All slides reviewed in contact sheets; new Jacobian, LUCAS and zero-result layouts additionally inspected at full size |
| Layout | No detected slide-boundary overflow at 1280 × 720; overlapping new cards found visually and corrected |
| Larger projector layout | LUCAS additionally captured at 1920 × 1080 |
| Mathematics | MathJax 3.2.2 initialized; no MathJax error elements |
| Plotly | Local Plotly 2.35.2 loaded; all 19 original chart containers rendered |
| Range controls | All 28 range inputs changed and reset without browser errors |
| Introductory diagrams | Simplex click changes displayed composition; tree trace button draws and resets a prediction path |
| Main demonstrations | Square-root visibility controls, TN construction stages and simulation metric selection exercised |
| Navigation | All-slide navigation API and keyboard next-slide navigation exercised; hash and slide counter agree |
| Speaker notes | N overlay shows target and SAY; S opens private window; slide 39 and private notes remain synchronized |
| Fullscreen | F enters fullscreen after the main window is focused; exit succeeds |
| Print preparation | 42 slides; all 19 Plotly figures converted to static images; no broken images |
| PDF | Exactly 42 pages verified in the generated PDF; every page is 960 × 540 points (16:9) |
| Asset portability | Research images and Plotly load from the adjacent assets folder; no absolute Windows image paths |
| Scientific values | All 72 original D/L/K means match the selected manuscript table; new evidence checked against the named sources |

The initial fullscreen test failed because focus remained on the speaker window. Restoring focus resolved it. The deck now catches a refused fullscreen request and displays a short instruction, rather than leaving an unhandled promise error.

The initial automated slide-boundary check did not catch overlapping cards. Visual inspection identified them on slides 29, 34 and 40. Their row heights were corrected, the slides were reinspected at full size, and the complete deck was tested again.

PDF inspection also caught clipping from the root page's hidden overflow, followed by an unwanted trailing blank page. The print stylesheet now exposes the complete document and suppresses the final forced page break. A separate print follow-up exported all 19 charts and verified exactly 42 PDF pages. This follow-up did not repeat the 28 range checks; those passed in the preceding complete browser run.

Use **P** or `?print` to prepare print mode. The browser's direct print shortcut does not perform the asynchronous chart export. Reload after printing to return to interactive presentation mode.

MathJax and web fonts still require internet. Fully offline rendering, Firefox/Edge behavior, actual projector hardware and a live spoken rehearsal were not tested. No research simulations were rerun.

Machine-readable evidence: [browser_validation.json](browser_validation.json), [slide_validation.json](slide_validation.json), [print_validation.json](print_validation.json). The dependency-free browser harness is [validate_talk.cjs](validate_talk.cjs); it requires Node and the configured Chrome installation.
