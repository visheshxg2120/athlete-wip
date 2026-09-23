# Athleta Games — website

Redesign of the Athleta Games site: school leagues, international training camps
and elite coaching for young athletes across India and Southeast Asia.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4. No UI library.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Deployment

The site is a static export (`output: "export"`), deployed to GitHub Pages by
`.github/workflows/pages.yml` on every push to `claude/loving-dijkstra-vukizu`.
The workflow sets `PAGES_BASE_PATH` so links and images work under
`/athlete-wip/`; locally the base path is empty.

## Structure

```
reference/                 Screenshots of the current site (design reference, not shipped)
public/images/             Photos, cropped from the reference screenshots for now
src/
  app/
    layout.tsx             Fonts (Archivo, Geist) and metadata
    globals.css            Design tokens and utilities (shell, display, eyebrow, lanes)
    not-found.tsx          404 page
    (site)/                Public pages; share the header and footer
      page.tsx             /
      leagues/             /leagues and /leagues/:slug
      camps/               /camps
      team/                /team
      nutrition/           /nutrition
      about/               /about
      contact/             /contact (form opens the visitor's email app)
  components/
    home/                  Home page sections
    layout/                Header, mobile menu, footer, closing call to action
    ui/                    Shared pieces: buttons, cards, page hero, photo grid + viewer
  config/site.ts           Name, navigation, contact details, social links
  content/                 All copy and data: leagues, camps, people, sports, partners
  types/content.ts         Content types
```

To change text, dates, leagues, camps or people, edit the files in `src/content/`.

## Results dashboard (`/results`)

League results, rankings and athlete profiles, laid out like HYROX's results site
(hyresult.com): a sidebar (Leagues / Rankings / Analysis), global search (⌘K or `/`)
and breadcrumbs on every page.

| Route | What it shows |
|---|---|
| `/results` | League calendar: live, upcoming and past leagues as cards, filter by season and sport |
| `/results/[edition]` | One league season: standings, leaderboards, all results; switch between seasons |
| `/results/athletes` | Athlete rankings: search, sport/gender/school filters, seasons played, podiums, pagination |
| `/results/schools` | Schools ranked by titles and medals |
| `/results/records` | Best marks and scores ever, and biggest single-league performances |
| `/results/athletes/[id]` | Profile: summary chips, then Results (by league) / Personal bests / Teammates / Venues |
| `/results/athletes/[id]/[edition]` | One athlete in one league: where they sit in the field, per-event and per-apparatus analysis, match-by-match charts |

**Data.** Everything is read from one JSON file, `src/data/results/sample.json`, typed by
`ResultsData` in `src/types/results.ts`. Standings, rankings, records and athlete
histories are all derived in `src/lib/results.ts`, so the file only holds raw results
(matches and goals, innings and performances, marks, apparatus scores), plus
`fixtures` for scheduled leagues that have no results yet.

The current file is **generated demo data** (`node scripts/generate-sample-results.mjs`):
three seasons (2024–2026), eight leagues, 370 athletes. The pages show a "Sample data"
notice while `sample` is `true`. To go live, replace it with real results in the same
shape and set `"sample": false`.

**Privacy.** Most athletes are minors. The data holds only a display name (first name +
surname initial), school and results: no full names, photos or dates of birth. Every
athlete appears in league tables and the rankings list, but only athletes with
`"profile": true` (parents opted in) get a profile and analysis pages; everyone else's
name is plain text. Profiles show initials instead of photos and aren't indexed by
search engines. Collect parental consent before publishing real results.

## Design tokens

| Token | Value | Use |
|---|---|---|
| `ink` | `#0a0d1f` | Dark sections, primary text |
| `paper` | `#f4f3ee` | Light sections |
| `volt` | `#b9f23f` | Accent: CTAs and highlights only |
| `indigo` | `#3a3fb0` | Secondary accent, from the logo |

Type: Archivo (condensed, uppercase) for display; Geist for body; Geist Mono for labels.

## Before launch

- Replace photos in `public/images/` with the original high-resolution files
  (current ones are cropped from screenshots).
- Add the official logo as an SVG (`src/components/ui/logo.tsx` is a placeholder wordmark).
- Real social profile URLs in `src/config/site.ts`.
- A form backend for `/contact`.
- Team member roles in `src/content/people.ts`.
