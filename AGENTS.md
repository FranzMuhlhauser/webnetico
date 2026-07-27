# Webnetico — Agent Guidelines

## Project type

Static vanilla HTML5/CSS3/JS (ESM) site, no framework, no build step, no bundler.  
Deployed on Vercel — every push to the default branch auto-deploys.

## Developer commands

| Command | Action |
|---|---|
| `pnpm test` | Run all tests (Node built-in test runner, `node --test tests/*.test.js`) |
| `pnpm simulate-contact` (manual) | `node scripts/invoke_contact_test_debug.mjs` (tests the contact API handler locally) |

All tests are in `tests/` — currently covers `api/utils.js` only.

## Package manager

pnpm is required (`packageManager` in `package.json`). Enable via `corepack enable && corepack prepare pnpm@latest --activate`.

## Architecture

- **No component loading** — HTML in `components/` (header, footer, whatsapp, cookie-banner) is the canonical source, but must be **manually copy-pasted** into each `.html` page. There is no include/build mechanism.
- **CSS** — `css/styles.css` is the source; `styles.min.css` is a hand-minified copy. Keep both in sync.
- **Contact API** — Vercel Serverless Function at `api/contact.js`. Sends email via **Resend** (`api.resend.com/emails`).
- **Vercel env vars required**: `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL` (configured in Vercel dashboard, never in the repo).
- **Analytics** — GTM (`GTM-KWPHS7LF`) loaded on interaction; Vercel Insights/Speed Insights opt-in via `localStorage` (`js/insights-optin.js`). Cookie consent banner (`js/cookie-banner.js`) sets `webnetico_cookie_consent`.
- **VS Code Live Server** port: `5503` (see `.vscode/settings.json`).

## SEO/AEO orientation

Every page includes JSON-LD structured data (Organization, WebPage, BreadcrumbList, FAQPage, Article, Person, etc.). The `.agents/skills/` directory contains extensive SEO/GEO/AEO skill files — do NOT modify those; they are fetched from external repos (see `skills-lock.json`).

## Conventions

- Language: `es-CL`. Domain: `https://www.webnetico.cl`.
- Vercel `cleanUrls: true` — canonical URLs omit `.html` extension.
- CSP, HSTS, and security headers enforced in `vercel.json`.
- No npm dependencies (`package.json` "dependencies": {}).
- `robots.txt` disallows `/components/`, `/scripts/`, `/api/`.
