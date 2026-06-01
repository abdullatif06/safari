# Graph Report - New Project  (2026-05-31)

## Corpus Check
- 102 files · ~9,176,248 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 449 nodes · 917 edges · 22 communities (16 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88d47e1f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `useI18n()` - 73 edges
2. `compilerOptions` - 16 edges
3. `formatDate()` - 14 edges
4. `createAdminClient()` - 14 edges
5. `EVENT COVERS (4:3) — one per event id` - 13 edges
6. `requireAccountUser()` - 12 edges
7. `requireBusiness()` - 12 edges
8. `formatTime()` - 12 edges
9. `EventItem` - 12 edges
10. `createClient()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `CityPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/cities/[city]/page.tsx → src/app/not-found.tsx
- `EditEventPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/dashboard/events/[id]/edit/page.tsx → src/app/not-found.tsx
- `EventPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/events/[id]/page.tsx → src/app/not-found.tsx
- `TicketDetailPage()` --calls--> `NotFound()`  [INFERRED]
  src/app/account/tickets/[id]/page.tsx → src/app/not-found.tsx
- `CitiesPage()` --calls--> `useI18n()`  [EXTRACTED]
  src/app/cities/page.tsx → src/lib/i18n.tsx

## Import Cycles
- None detected.

## Communities (22 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (32): AccountPage(), submitOrganizerRequest(), BecomeOrganizerPage(), createEvent(), deleteEvent(), readEventFields(), slugify(), updateEvent() (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (25): AccountDashboard(), AccountShell(), AccountUser, ROLE_LABEL, ReviewsView(), SettingsView(), Status, TicketView() (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (29): AboutPage(), SavedView(), TicketsView(), EventsMap(), Footer(), Hero(), CATEGORIES, CategoryStrip() (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (39): `cat-cultural.jpg`, `cat-food.jpg`, `cat-music.jpg`, `cat-sports.jpg`, CATEGORY TILES (square 1:1), CITIES (16:9), `city-amman.jpg`, `city-aqaba.jpg` (+31 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (24): Avatar(), initials(), toneFor(), TONES, EditProfileView(), Initial, arabic, body (+16 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (24): CitiesPage(), CityPage(), CityView(), CATEGORIES, EventsList(), EventsPage(), EventPage(), CITIES (+16 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (25): approveEvent(), approveOrganizer(), emailFor(), rejectEvent(), rejectOrganizer(), AdminPanel(), Tab, AdminPage() (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (14): Latest, NotFound(), signInWithGoogle(), signInWithPassword(), signUpWithPassword(), ArticleView(), AuthForm(), EventsPageClient() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (31): dependencies, leaflet, lenis, lucide-react, next, qrcode, react, react-dom (+23 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (21): 1. Site map (routes), 2. Design tokens (replace dark theme), 3. Sections per page + image slots, 4. IMAGE GENERATION PROMPTS, 5. Inspiration sites (study these, don't copy), 6. Decisions (CONFIRMED), 7. Logo generation prompt, `/about` (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (11): DashboardOverview(), STATUS_STYLE, CATEGORIES, COSTS, DashboardPage(), countsForEvents(), getOwnerEvent(), getOwnerEvents() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (6): __dirname, env, EVENTS, root, rows, supabase

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (6): DATA_DIR, FILE, POST(), readAll(), REQUIRED, Submission

## Knowledge Gaps
- **150 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+145 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useI18n()` connect `Community 2` to `Community 1`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 10`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 0` to `Community 10`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `createAdminClient()` connect `Community 6` to `Community 0`, `Community 10`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _150 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09490196078431372 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11839323467230443 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08305647840531562 - nodes in this community are weakly interconnected._