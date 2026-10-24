# Portfolio Website — Adopt Existing Data + Restore Site Features

Source of truth: https://github.com/rishisf12/Portfolio-Website (branch `master`)
Local app: frontend http://localhost:3001 · backend http://127.0.0.1:9002 (PostgreSQL `portfolio_db`)

## Scope decisions (final)
- **Single-page site**: Home with in-page anchors `#technical`, `#mechanical`, `#contact`.
  Exactly two project sections: Technical and Mechanical. No separate section routes.
- **Admin is token-only** (`rishisf123`, header `X-Admin-Token`). The repo's old JWT/user dashboard is not imported.
- **Admin is interactive**: project CRUD + publish toggle + image upload/delete, skill CRUD, education CRUD,
  achievement CRUD, and settings editing all write to PostgreSQL and appear on the public site.
- Nothing was committed or pushed to GitHub.

## Data imported from the repo
- 6 projects: Portfolio Website, CampusPilot, UrTeam (TeamPilot), PocketPilot (pocketF),
  Master DSA Frontend, Master DSA Backend — summary, description, tech stack, live/GitHub URLs.
- 6 real screenshots in `frontend/public/projects/*.png`.
- 12 skills (9 technical, 3 mechanical) grouped by domain — Languages, Frontend, Backend, Databases,
  Machine Learning, Deep Learning, Design, Mechanical Engineering — education (PDPM IIITDM Jabalpur,
  B.Tech ME, 2022–2026, CGPA 8.5+), 2 achievements, settings (name, headline, bio, about, hobby, email,
  socials, location).

## Implementation
1. **Data import** — `backend/seed_data.py` seeds categories/projects/images/skills/education/achievements/settings.
   Placeholder "AI Image Classifier" removed. `/public/projects` returns 6 with images.
2. **API** — `/public/*` read endpoints; `/admin/*` CRUD guarded by `require_admin` (all reads and writes).
   `/uploads` static mount for uploaded images.
3. **Frontend data layer** — `src/lib/api.ts` (`API_ORIGIN`, `assetUrl`, token interceptor, public/admin helpers).
4. **Project experience** — cards with image carousel, category badge, tech tags, search, empty states;
   detail page with gallery, tech stack, description, live/source buttons.
5. **Theme** — slate-950/900 surfaces, blue-600 → indigo → violet accents, `darkMode: "class"` + `<html class="dark">`.
6. **Contact** — mailto compose with prefilled subject/body; email read from settings.
7. **Settings wired to UI** — Hero name/headline, About text, Contact email all read `/public/settings`.
8. **PWA** — `public/manifest.webmanifest` (standalone, slate theme), generated icons
   (`icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`),
   hand-written `public/sw.js` (precaches the shell, network-first navigations, stale-while-revalidate
   assets, skips Vite dev modules and `/api/`), registered from `src/main.tsx`.
9. **Footer** — dedicated CTA band at the top (headline + View My Work / Contact Me + GitHub/LinkedIn icons),
   then 4-column dark footer: brand + socials, Explore anchors, Connect links, contact email/location,
   admin link and copyright bar. The hero carries no CTA row on desktop; mobile keeps its own hero buttons.
10. **Separate mobile tree** (`< 768px`) — desktop components untouched; mobile renders its own pages:
    `MobileHome` (compact hero, stacked full-width cards, skills chips, education/achievements, contact form),
    `MobileProjectDetail` (sticky back bar, swipeable snap gallery, full-width actions), `MobileHeader`,
    `MobileProjectCard`, and a fixed `BottomNav` (Home · Technical · Mechanical · Contact) with scroll-aware
    active state, 48px tap targets, 16px inputs (no iOS zoom), `viewport-fit=cover` + `env(safe-area-inset-bottom)`.
    Admin stays on the desktop layout (per scope decision).
11. **PostgreSQL via SQLModel** — `DATABASE_URL=postgresql+psycopg2://…@localhost:5432/portfolio_db`
    (separate DB on the existing local Postgres container; CampusPilot's DB untouched), `create_all` + reseed.
12. **Skill domains** — new `Skill.domain` column; `/public/skills` and `/admin/skills` carry it; admin has a
    domain select; desktop About and `MobileHome` render ordered domain groups via `src/lib/skills.ts`
    (`SKILL_DOMAINS`, `groupByDomain`, `isTechnicalDomain`), blue for technical, emerald for mechanical/design.
13. **About profile block** — avatar (`settings.profile_image`, default `/profile.jpg`, RS monogram fallback on
    load error) + name/role on desktop, compact photo row on mobile, with a gradient separator line before the
    education/skills cards and the bio.
14. **Image lightbox** — `components/ui/Lightbox.tsx`: fullscreen overlay, counter, dots, prev/next, Esc and
    backdrop close; advances every 2s and loops, pauses while the pointer presses or hovers the image and resumes
    on release/leave. Opened from the desktop carousel and the mobile swipe gallery.
15. **Education editing** — `PUT /admin/education/{id}` (`EducationUpdate`, partial update) plus an Edit action in
    the admin Education tab: pencil loads the entry into the form ("Edit education" / Save changes / Cancel) and
    writes every field including sort order; create + delete unchanged.
16. **Admin project images** — every project row has an upload control (multi-file picker) and a clickable
    thumbnail; the edit panel lists all images as clickable thumbnails (opens the shared lightbox), shows the
    count, allows multi-file upload and per-image delete.
17. **Instagram-style auto preview** — a project with several images cycles them on its own: desktop home card,
    project detail carousel and mobile card advance every 2s (2.5s on mobile) and loop, showing an `n/m` counter;
    hovering or touching pauses and releasing resumes. Mobile detail gallery auto-scrolls the same way.

## Verified (2026-10-24)
- `npx vite build` passes (1654 modules, no type errors).
- Postgres: `seed_data.py` created all tables in `portfolio_db` and seeded 6 projects / 12 skills / 1 education /
  2 achievements / 10 settings; `/public/skills` returns 12 rows with `domain`.
- Home: 6 technical projects, all screenshots load (`naturalWidth: 1280`), 0 console errors.
- Admin (token refresh flow): stats 6/6/11/2; created a mechanical project → appeared on `#mechanical`;
  publish toggle → disappeared (5 visible) → re-publish → 6 visible; delete → removed.
- Skills / Education / Achievements: add → visible on public site → delete works.
- Skill domains: desktop `#about` shows the domain groups in order (Languages → Full Stack → Databases →
  Machine Learning → Deep Learning → Design) with the current chips (Python, JavaScript, React, FastAPI,
  SQLModel, Full Stack, Progressive Web App (PWA), PostgreSQL, TensorFlow, AI / ML, Generative AI,
  Deep Learning, ANN / CNN / RNN, CAD, TinkerCAD); mobile About shows the same groups as stacked cards.
- Settings: headline, about, email changes appear on the public site; reverted to original values.
- Project detail: `/project/portfolio-website` and `/project/campuspilot` render title, image, tags, description;
  unknown slug shows "Project not found".
- Token guard: `/admin/stats` → 200 with token, 401 without.
- PWA (`vite preview` on 3002): manifest 200 `application/manifest+json`, SW `activated` and controlling,
  all 4 icons load at correct dimensions, offline reload renders the cached shell (`Rishikesh Saroj`).
  Dev server 3001 also registers the SW (installable); its modules stay network-only, so offline is a
  production-build feature.
- Footer renders on desktop and mobile (390px wide), links and email correct.
- Hero CTAs moved to the footer (desktop): hero has 0 CTA links; footer band renders "Have a project in mind?" with
  View My Work / Contact Me / GitHub / LinkedIn, and View My Work scrolls to `#technical`. Mobile hero buttons and
  bottom nav unchanged. 0 console errors.
- Hero stats row removed (6+ Projects shipped / 2 Core sections / 8.5+ CGPA); hero now ends at the bio.
- Education editing: pencil loads the entry into the form, grade change saved through the UI shows in the admin
  list and in `/public/education`, then reverted; missing entry returns 404.
- Admin project images: row upload control took 2 files at once → `Portfolio Website` went 1 → 3 images; row
  thumbnail opened the lightbox at `1 / 3` then advanced to `2 / 3`; edit panel listed 3 clickable thumbnails and
  removing 2 brought the public API back to 1. Test uploads deleted from `backend/app/uploads`.
- Auto preview (3 temporary images, since removed): desktop home card went `2/3 → 3/3 → 1/3`, detail carousel
  `2/3 → 3/3`, mobile card `1/3 → 2/3`, mobile detail gallery auto-scrolled to image 2; hover held the frame and
  releasing resumed it. 0 console errors.
- Profile block + separator render in desktop About and mobile About (monogram shows until `public/profile.jpg` is
  added; name/role come from settings).
- Lightbox (3 temporary images on `portfolio-website`, since removed): opened at `1 / 3`; advanced to `2 / 3`
  after 2s; held at `2 / 3` while hovering/pressing; resumed to `3 / 3` on pointer leave; loops both ways;
  Esc, ✕ and backdrop close; body scroll restored. Single-image projects open `1 / 1` with no arrows/dots.
  Mobile: same gallery opens from the swipe image, autoplay + hold + resume verified, bottom nav below overlay.
- Mobile tree at 390×844: bottom nav fixed and visible with 4 tabs, no desktop navbar, hero/cards render,
  all 6 project images load; Technical tab scrolls (`scrollY 990`) and highlights; card opens mobile detail
  (`/project/portfolio-website`) with gallery, tech stack and nav; Contact tab reaches the form; inputs 16px.
  Desktop at 1440×900: unchanged navbar/Footer, 6 cards, zero bottom navs. No console errors.
- Screenshots: `Portfolio Website/screenshots/{home-hero,home-projects,project-detail,admin-dashboard,footer,footer-mobile,footer-cta,mobile-home,mobile-projects,mobile-project-detail,skills-desktop,skills-mobile,about-profile,about-profile-mobile,lightbox-desktop,lightbox-mobile}.png`.

## Run
```
cd "Portfolio Website/backend"  && uvicorn app.main:app --port 9002
cd "Portfolio Website/frontend" && npm run dev -- --port 3001 --strictPort
```
- `frontend/.env` → `VITE_API_URL=http://localhost:9002`
- Admin: http://localhost:3001/admin/login → token `rishisf123`
- Port 9001 has a zombie socket; 8001 belongs to another app — do not use them.

## Notes / risks
- Vercel deployment is password-protected → data comes from repo files, not the live site.
- Mechanical has no real repo projects yet; it renders an empty state pointing to the admin.
- Vite resolves `.jsx` before `.tsx`; the old duplicate `.jsx` tree must stay deleted.
- Empty `src/sections/` folder could not be deleted (permission denied, harmless).

## Stop conditions
- Same fix fails twice: stop and report.
- >3 files changed in one step: re-read this file first.
- After each phase: update this file.
