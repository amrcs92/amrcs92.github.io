# Portfolio — Amr Ashraf Serag Eldin

Bilingual (English / العربية) portfolio, live at **https://amrcs92.github.io/portfolio/**.
Next.js (App Router) + TypeScript + Tailwind CSS + next-intl, exported as a static site for GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000/portfolio/en/
npm run lint
npx tsc --noEmit
npm run build      # static site in out/
```

Pushing to `main` deploys through `.github/workflows/deploy.yml`
(repo Settings → Pages → Source: **GitHub Actions**).

## Where things live

| What | File |
| --- | --- |
| All copy, both languages | `messages/en.json`, `messages/ar.json` |
| Links: CV, GitHub, LinkedIn, email, APKs, project sites | `src/site.config.ts` |
| Page markup | `src/app/[locale]/page.tsx` |
| Colours, spacing, the Console styles | `src/app/globals.css` |
| Theme toggle (system default, remembered choice) | `src/components/ThemeToggle.tsx` |
| Particle background in the hero | `src/components/NanoField.tsx` |
| Screenshots (`{app}-{lang}-{theme}-{screen}.png`), app icons, CV | `public/` |

## Tuning the particle background

Edit `NANO` at the top of `src/components/NanoField.tsx`:

- **Density:** `density` / `mobileDensity` (px² per particle; higher = fewer), capped by `max` / `mobileMax`.
- **Speed:** `speed` and `drift` for idle wander; `spring` and `damping` for how particles return.
- **Cursor:** `radius`, `force`, and `mode: "repel" | "attract"`.
- **Lines:** `link` (max length in px; `0` turns them off).
- **Colours:** the `--cn-muted` and `--cn-accent` tokens in `globals.css`.

It pauses off-screen, uses fewer particles on touch devices, and shows a still field when the visitor prefers reduced motion.
