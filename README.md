# Connor Fleser — Personal Portfolio Website

This is the source for my personal portfolio site, built as a collaboration between Claude Code and myself.

The site is a single-page layout covering:

- **About** — a short intro and a fuller "What I'm Working On" section, currently focused on my work as a Computer Science graduate student at Michigan Technological University (4+1 BS/MS program), an Edison Engineering Development Program intern at GE HealthCare working on applied ML for medical imaging, and President of Innovative Global Solutions.
- **Skills** — grouped badges for languages, frameworks/tools, and domains.
- **Portfolio** — a filterable grid of software engineering, machine learning, and research projects, each with its own entry, plus a featured row highlighting a few standout projects. Cards reveal a short blurb and tags on hover/focus.
- **Awards, Honors & Recognition** — academic honors and project awards, with short context for each.
- **Resume** — an embedded, downloadable copy of my current resume.
- **Contact** — ways to get in touch.

The site also supports a light/dark theme toggle (persisted via `localStorage`, respects `prefers-color-scheme` on first visit).

## Structure

- `index.html` — the single-page site markup
- `components/` — shared JS for the header, footer, theme toggle, and scroll-reveal animations
- `portfolio/` — portfolio entry data (`entries.json`) and the grid/filter rendering logic (`portfolioJS.js`)
- `styles/` — CSS for each section, plus shared theme tokens in `variables.css`
- `images/` — site and project imagery
- `resume/` — resume PDF and related assets
