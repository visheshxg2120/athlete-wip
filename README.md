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
