# nextjs-frontend

This is the Next.js (App Router) migration of the original Vite + React Router
SPA. The Express backend is untouched — this app talks to it over the same
REST endpoints as before.

## Setup

```bash
npm install
cp .env.local.example .env.local   # if you renamed/removed the provided one
npm run dev                        # http://localhost:3000
```

Set these in `.env.local` (already pre-filled with your old `.env` values,
just renamed to the `NEXT_PUBLIC_` prefix Next.js requires):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
```

## What changed structurally

- **Routing**: `react-router-dom` `<Routes>/<Route>` in `App.jsx` → file-based
  routing under `src/app/`. Every route from the old `App.jsx` has a matching
  `page.jsx` (see the file tree in the chat message).
- **Layouts**: `MainLayout` (Header/Footer) now lives in
  `src/app/(site)/layout.jsx` and wraps all public pages automatically —
  no more manually wrapping every route element. `AdminLayout` (sidebar +
  auth guard) lives in `src/app/admin/layout.jsx` and wraps all `/admin/*`
  routes the same way.
- **SEO**: the old `setSEO()` / `setSchema()` helpers manually poked
  `document.head` after the client mounted. That's gone. Every public page
  (`/`, `/about-us`, `/products`, `/products/[slug]`, `/contact-us`) now has
  a `generateMetadata()` that fetches the same `settings` / `cms` / `products`
  endpoints **on the server** and returns title/description/OG/Twitter tags
  natively via Next's Metadata API — meaning crawlers see fully-formed
  `<head>` tags on the first response, not after a JS fetch. JSON-LD schema
  (`organizationSchema`, `productSchema`, etc. — untouched business logic
  from `schemaHelpers.js`) is rendered server-side as a `<script
  type="application/ld+json">` in each page instead of being injected via
  `document.createElement`.
- **Data fetching**: all existing client-side `fetch()` calls in components
  (for interactive content, forms, admin CRUD, etc.) are unchanged and still
  hit the Express API directly from the browser exactly like before.
- **`src/frontend/pages/*` → `src/frontend/views/*`** and
  **`src/admin/pages/*` → `src/admin/views/*`**: renamed only to avoid
  confusion with Next's own `app/.../page.jsx` files. Every `app/**/page.jsx`
  is a thin wrapper that imports and renders the corresponding view
  component — the actual UI/markup inside those view/component files is
  unchanged from your original app.
- **`react-router-dom` → `next/link` + `next/navigation`**: `<Link to="...">`
  → `<Link href="...">`; `useNavigate()` → `useRouter()` (`navigate(x)` →
  `router.push(x)`); `useLocation().pathname` → `usePathname()`; `useParams()`
  / `useSearchParams()` → same names from `next/navigation`.
- **Env vars**: Vite's `import.meta.env.VITE_X` → `process.env.NEXT_PUBLIC_X`
  (Next's equivalent for variables read in the browser). One pre-existing typo
  (`VITE_BACKED_BASE_URL` in `Header.jsx`) was corrected to
  `NEXT_PUBLIC_BACKEND_BASE_URL` to match every other usage.
- **jodit-react**: loaded via `next/dynamic` with `ssr: false` in
  `TextEditor.jsx`, since it touches `document` at import time and would
  break server rendering otherwise. Its own usage/props are unchanged.
- **Tailwind v4**: swapped the Vite plugin for `@tailwindcss/postcss`
  (`postcss.config.mjs`) — same Tailwind version, same `theme.css`/`base.css`,
  same design tokens, just a different build integration.
- **Removed, unused in the original app**: `react-router-dom`, `vite`,
  `@vitejs/plugin-react`, `@tailwindcss/vite`, `react-helmet-async` (it was a
  dependency but never actually imported — `seo.js`/`schema.js` did manual
  DOM manipulation instead, and both files were removed since the Metadata
  API replaces them), `@prerenderer/*` (Next does SSR/SSG natively, no
  prerender plugin needed).

## Verified

`npm run build` completes cleanly and statically generates all 23 routes
(dynamic `[id]`/`[slug]` routes render on-demand, as expected). The build in
this sandbox couldn't reach your Express API (not running here), so
`generateMetadata()` calls logged fetch errors and fell back to defaults —
that's expected in this environment and will resolve once pointed at your
real backend.
