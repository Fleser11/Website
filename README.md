# Connor Fleser — Personal Portfolio Website

This is the source for my personal portfolio site, built as a collaboration between Claude Code and myself.

The site is a single-page layout covering:

- **About** — a short intro, currently focused on my work as a Computer Science graduate student at Michigan Technological University (4+1 BS/MS program), an Edison Engineering Development Program intern at GE HealthCare working on applied ML for medical imaging, and President of Innovative Global Solutions.
- **Portfolio** — a filterable grid of software engineering, machine learning, and research projects, each with its own entry.
- **Resume** — an embedded, downloadable copy of my current resume.
- **Contact** — ways to get in touch.

## Structure

- `index.html` — the single-page site markup
- `components/` — shared JS for the header, footer, and scroll-reveal animations
- `portfolio/` — portfolio entry data (`entries.json`) and the grid/filter rendering logic (`portfolioJS.js`)
- `styles/` — CSS for each section, plus shared brand variables in `variables.css`
- `images/` — site and project imagery
- `resume/` — resume PDF and related assets
