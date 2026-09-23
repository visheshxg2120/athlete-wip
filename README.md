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

League results, leaderboards and athlete profiles, similar to HYROX's results site.

| Route | What it shows |
|---|---|
| `/results` | Totals, athlete search, every league edition, standout performances, school medal table |
| `/results/[edition]` | Football: group tables, top scorers, goals chart, all results · Cricket: points table, batting/bowling leaders · Athletics: event results by category, medal table · Gymnastics: all-around rankings |
| `/results/athletes` | Searchable athlete directory (filter by sport and school) |
| `/results/athletes/[id]` | An athlete's history across every league they've played |

**Data.** Everything is read from one JSON file, `src/data/results/sample.json`, typed by
`ResultsData` in `src/types/results.ts`. Standings, leaderboards, medal tables and
athlete histories are all derived in `src/lib/results.ts`, so the file only holds raw
results (matches and goals, innings and performances, marks, apparatus scores).

The current file is **generated demo data** (`node scripts/generate-sample-results.mjs`);
the pages show a "Sample data" notice while `sample` is `true`. To go live, replace it
with real results in the same shape and set `"sample": false`.

**Privacy.** Most athletes are minors. The data holds only a display name (first name +
surname initial), school and results: no full names, photos or dates of birth.
Collect parental consent before publishing real results.

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
