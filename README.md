# Saifi · صيفي

**Discover free summer events and places across Jordan — in one bilingual place.**

🔗 **Live:** [safari-ebon.vercel.app](https://safari-ebon.vercel.app)

![Saifi — your summer in Jordan, all in one place](https://safari-ebon.vercel.app/opengraph-image)

Saifi is a full-stack, fully bilingual (English / العربية) discovery platform for
summer events and places across Jordan — concerts, festivals, heritage walks, food
markets, cafés, rooftops, and viewpoints. Anyone can browse for free; organizers can
list events; admins review and publish them.

---

## ✨ Features

- **Bilingual everything (EN / AR)** — 300+ UI strings, automatic RTL layout, language preference persisted per user.
- **Event discovery** — filter by category, city, cost, and free-text search; featured “hero” cards break the grid.
- **Places guide** — cafés, rooftops, parks, malls, and viewpoints across Amman, with area and price filters.
- **Interactive maps** — every event and place plotted on a Leaflet map with a warm custom theme.
- **Accounts & RSVPs** — save events, RSVP, and get a **QR-code ticket** to show at the door.
- **Reviews** — post-event 1–5 star ratings and comments.
- **Business dashboard** — approved organizers create and manage their own events.
- **Admin approval queue** — admins approve / reject events and organizer requests, with reasons.
- **Transactional email** — RSVP confirmations, approval / rejection notices, and public-submission alerts via Resend.
- **Role-based access** — `user` / `business` / `admin`, enforced in middleware **and** Postgres Row-Level Security.
- **SEO-ready** — per-page metadata, Open Graph + Twitter cards, a dynamically generated share image, `sitemap.xml`, and `robots.txt`.

---

## 🛠️ Tech stack

| Layer | Tech |
|-------|------|
| Framework | **Next.js 15** (App Router, React Server Components) |
| Language | **TypeScript** (strict) |
| UI | **React 19**, **Tailwind CSS**, Lucide icons |
| Backend / DB | **Supabase** — Postgres, Auth, Storage, Row-Level Security |
| Maps | **Leaflet** + React-Leaflet |
| Email | **Resend** |
| Tickets | **qrcode** |
| Smooth scroll | **Lenis** |
| Hosting | **Vercel** |

---

## 🏗️ Architecture highlights

- **Server Components by default** — data fetching happens on the server; client components are scoped to interactivity (filters, maps, auth state).
- **Row-Level Security** — the database enforces access rules independently of the app. Approved events are public; users only touch their own saves / RSVPs / reviews; admins are gated by an `is_admin()` SQL function.
- **Auth + middleware** — Supabase SSR session refresh on every request, with role-based route guards for `/dashboard` and `/admin`.
- **Serverless-safe** — public event submissions email the admin via Resend (no filesystem writes), so everything runs cleanly on Vercel.
- **Dynamic OG image** — the social-share card is generated with `next/og` and statically cached at build time.

---

## 🚀 Getting started

```bash
# 1. Install
npm install

# 2. Configure env — copy the example and fill in real values
cp .env.example .env.local

# 3. Set up the database
#    Run supabase/schema.sql, phase3.sql, phase4.sql in the Supabase SQL editor.

# 4. Seed sample events
npm run seed         # original 12 events
npm run seed:extra   # 8 additional showcase events

# 5. Run
npm run dev          # http://localhost:3000
```

### Environment variables

See [`.env.example`](.env.example). You'll need a Supabase project (URL + anon + service-role keys),
a Resend API key, an `ADMIN_EMAIL`, and `NEXT_PUBLIC_SITE_URL`.

---

## 📁 Project structure

```
src/
├── app/                 # App Router pages, layouts, API routes, SEO files
│   ├── (events, places, cities, guide, about, map, submit)
│   ├── account/         # user dashboard (tickets, saved, reviews, profile)
│   ├── dashboard/       # business organizer dashboard
│   ├── admin/           # approval queue
│   ├── api/             # submit, avatar, event-cover, rsvp-email
│   ├── opengraph-image.tsx, sitemap.ts, robots.ts, not-found.tsx, error.tsx
├── components/          # ~45 React components (cards, maps, forms, shells)
├── lib/                 # data access, i18n, types, Supabase clients, email
└── middleware.ts        # auth refresh + role-based route guards
supabase/                # SQL schema + migrations
scripts/                 # database seed scripts
```

---

## 📄 License

Personal portfolio project. © Abdullatif Qaisieh.
