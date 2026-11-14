# xaleed.github.io

Your personal academic portfolio website.

## How to deploy
1. Create a GitHub repo named exactly: `xaleed.github.io`
2. Upload all these files to the repo
3. Go to Settings → Pages → set source to `main` branch
4. Your site will be live at https://xaleed.github.io

## File structure
- index.html          → About / Home
- publications.html   → Publications
- cv.html             → Curriculum Vitae
- projects.html       → Projects & Repositories
- blog.html           → Blog listing
- contact.html        → Contact
- posts/post-1.html   → Blog post template
- css/style.css       → All shared styles
- assets/img/         → Put your photo here (photo.jpg)
- assets/cv.pdf       → Put your CV PDF here

## Customising
Search for "Your Name" and replace with your real name.
Search for "Your Field" and replace with your field.
Update all placeholder links, emails, and descriptions.


## Website content and editing

- `index.html`: profile, research introduction and Stellenbosch photograph viewer.
- `cv.html`: the web CV, with keyboard-accessible section tabs and a printable view. `assets/cv.pdf` is the separately maintained original PDF.
- `projects.html`, `blog.html`, `publications.html` and `contact.html`: public entry points for research, writing and contact information.
- `visualisations/index.html`: the guided interactive research collection. The main Kent, estimation and tangent normal pages keep their original numerical scripts and figure IDs.
- `css/site-polish.css` and `assets/site.js`: shared presentation, navigation and accessibility improvements for the main pages.
- `css/reading.css`: reading guides, figure framing and mobile formula/code handling for research pages.
- `assets/img/stellenbosch/`: credited public photographs. `credits.html` and `credits.json` record authors, sources and licences. These photographs are explicitly distinguished from the owner's personal collection. When adding personal photographs, update the homepage album configuration and corresponding credit information.

The interactive presentation is linked from both the blog and projects pages. Technical preparation documents remain separate from public article content. No framework migration or build step is required.


### Validation of the November 2026 website revision

Checked the main pages and research tutorials at desktop and phone widths in Chrome. Navigation, CV tabs and filters, gallery controls and attribution links pass. The printable CV includes all eight sections and every publication even after using a screen filter. Long equations and code remain readable within bounded scroll areas on phones. Local resource and anchor checks found no missing targets. All 55 edited-page inline scripts and the shared navigation script pass syntax checks; the original numerical scripts and existing figure/section IDs on 11 research pages remain unchanged. Browser reports and screenshots are kept outside the repository in the local QA temporary folder.
