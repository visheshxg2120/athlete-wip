# Athlete — website

Marketing site for a sports community that runs large-scale events at stadiums and schools for students and athletes across Southeast Asia.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4.

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
public/images/             Static images
src/
  app/
    layout.tsx             Root layout: fonts, metadata, <html>/<body>
    globals.css            Tailwind + design tokens (colours, fonts)
    not-found.tsx          404 page
    (site)/                Route group for public pages; shares header + footer
      layout.tsx
      page.tsx             /  (home)
      events/page.tsx      /events
      events/[slug]/       /events/:slug
      about/ community/ partners/ contact/
  components/
    layout/                Site-wide chrome: header, footer, page shell
    sections/              Page sections (hero, etc.)
  config/site.ts           Site name, nav links, regions
  content/                 Typed placeholder content (events)
  lib/utils.ts             Shared helpers
  types/                   Shared TypeScript types
```
