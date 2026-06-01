# Saifi — Multi-Page Landing Site Plan

**Direction chosen:** Bright & warm summer (sand / terracotta / teal daylight, editorial serif + grotesk, Airbnb / Visit-Jordan energy).
**Images:** You generate from the prompts in this doc; I build with placeholders that swap 1:1.
**Bilingual:** EN + AR (RTL) must keep working — every new string goes into `src/lib/i18n.tsx`.

---

## 1. Site map (routes)

| Route | Page | Status |
|---|---|---|
| `/` | Home (redesigned landing) | rebuild |
| `/events` | Events index — full filter/grid | new (extract from home) |
| `/events/[id]` | Event detail | move from `/event/[id]` |
| `/map` | Full interactive map | new (extract from home) |
| `/cities` | Browse by city | new |
| `/cities/[city]` | One city's events + intro | new |
| `/about` | Mission / why free | new |
| `/submit` | Organizer submits an event | new (form) |
| `/guide` | "Summer in Jordan" editorial | new (SEO + anti-AI) |

**Build order:** Events → Map → move Event detail → Home redesign → About → Submit → Cities → Guide.

---

## 2. Design tokens (replace dark theme)

```
PALETTE (light, warm)
  sand-50   #FAF6EF   page background
  sand-100  #F2EADC   cards / sections
  ink       #211B17   primary text (warm near-black)
  ink-soft  #6B5F54   secondary text
  terracotta#D2603A   primary accent / CTA
  clay      #B14A2C   accent hover
  teal      #1E8C7A   secondary accent (links, sports)
  gold      #E0A23B   highlights / food
  sky       #6FA8C7   cultural accent
  line      #E4DAC# 8 hairline borders

FONTS
  display: editorial serif (e.g. "Fraunces" or "Playfair Display") — headlines
  body:    humanist grotesk (e.g. "General Sans" / "Geist") — UI + paragraphs
  arabic:  "IBM Plex Sans Arabic" or "Cairo" — Arabic pairing
  label:   mono (e.g. "Geist Mono") — small caps labels/tags (magazine feel)

ANTI-AI RULES
  - No glowing blobs, no purple→blue gradient.
  - Real photography full-bleed; subtle film grain overlay.
  - One accent color dominant (terracotta); others used sparingly per category.
  - Asymmetric hero (text left, photo right or full-bleed) — not centered.
  - Specific copy: real venues, real dates, opinionated voice.
  - Replace category emojis with real photos + a single clean icon set.
```

---

## 3. Sections per page + image slots

### `/` Home
1. **Header/nav** — logo, links (Events, Map, Cities, Guide, About), language toggle, "Submit event" button. *(no image)*
2. **Hero** — left: headline + sub + search field + 2 CTAs. Right/full-bleed: `IMG-hero`. *(asymmetric)*
3. **Category strip** — Music / Cultural / Sports / Food as 4 photo tiles: `IMG-cat-music`, `IMG-cat-cultural`, `IMG-cat-sports`, `IMG-cat-food`.
4. **Featured this week** — 3–4 event cards (uses `IMG-event-*`).
5. **Browse by city** — 6 city chips with thumbnails (uses `IMG-city-*`).
6. **How it works** — 3 steps, icons only. *(no photo)*
7. **Map teaser** — styled map preview: `IMG-map-teaser`.
8. **Editorial CTA** — newsletter / "never miss summer" with `IMG-lifestyle-1`.
9. **Footer** — links, nonprofit note, language. *(logo only)*

### `/events`
- Filter bar (category / city / cost / date) — *(no image)*
- Results grid — each card `IMG-event-{id}` (12 events).
- Empty state — `IMG-empty` small graphic.

### `/events/[id]`
- Banner — `IMG-event-{id}` large.
- Details panel (date/time/venue/price/accessibility/organizer).
- Map snippet (uses Leaflet).
- Similar events (3 cards).

### `/map`
- Full-height Leaflet map + filter sidebar. *(no generated image)*

### `/cities` + `/cities/[city]`
- City grid, each `IMG-city-{city}`.
- City page: hero `IMG-city-{city}` + editorial intro paragraph + that city's events.

### `/about`
- Mission block `IMG-lifestyle-2`.
- Why-free values (icons).
- "Submit an event" CTA.

### `/submit`
- Form: title (EN/AR), category, city, venue, date, time, cost, organizer, description.
- Reassurance panel `IMG-lifestyle-3`.
- Submit posts to `/api/submit` (rebuild route).

### `/guide`
- Article cards, each header `IMG-guide-{n}`.
- Sample articles: "10 free things in Amman this July", "Where to eat after dark in Jordan", "A weekend in Aqaba on a budget".

---

## 4. IMAGE GENERATION PROMPTS

> Global style suffix to append to EVERY prompt for consistency + realism:
> `— shot on a 35mm full-frame camera, natural daylight, warm summer tones, slight film grain, photojournalistic, real people, candid, no text, no logos, no watermark, ultra realistic, --ar as noted`

### Hero
- **IMG-hero** (16:9, 1920×1080): *"Golden-hour wide shot of a lively outdoor summer evening event in Jordan — warm string lights over a crowd of diverse Jordanian families and young people enjoying live music, ancient sandstone architecture softly lit in the background, terracotta and warm gold tones."* `--ar 16:9`

### Category tiles (square 1:1, 1000×1000)
- **IMG-cat-music**: *"Candid crowd at an open-air concert in Jordan at dusk, hands raised, warm stage light, real audience."*
- **IMG-cat-cultural**: *"Traditional dabke dancers / theatre performers on a stone stage at a Jordanian cultural festival, daylight, colorful traditional dress."*
- **IMG-cat-sports**: *"Runners at a community road race in a Jordanian city at sunrise, warm light, real athletes, numbered bibs."*
- **IMG-cat-food**: *"Close-up of Jordanian street food at a night market — knafeh and falafel on a vendor stall, steam, warm bulbs, hands serving."*

### Event covers (4:3, 1200×900) — one per event id
- **jerash-festival**: *"Roman colonnaded street and South Theatre of Jerash lit at night during a festival, audience seated, warm stage glow."*
- **rainbow-street-night**: *"Rainbow Street Amman closed to cars at evening, string lights, food stalls, crowds strolling, oud player."*
- **aqaba-beach-concert**: *"Sunset beach concert on the Red Sea in Aqaba, small band on a low stage, people on blankets on the sand, orange sky."*
- **dead-sea-run**: *"Early-morning runners along the Dead Sea shoreline, salt formations, hazy warm light over the water."*
- **amman-citadel-evenings**: *"Amman Citadel ruins (Temple of Hercules columns) at golden hour with visitors, city sprawl below."*
- **irbid-food-fest**: *"Outdoor food festival in Irbid, long tables, families sharing mezze, warm evening light, fairy lights."*
- **wadi-rum-stargazing**: *"Group stargazing in Wadi Rum desert at night, milky way over red sand dunes, small campfire, silhouettes."*
- **zarqa-youth-football**: *"Youth football match on a community pitch in Zarqa, late afternoon sun, spectators along the fence."*
- **amman-jazz-roof**: *"Rooftop jazz night in Amman overlooking the city lights at dusk, small band, intimate crowd with drinks."*
- **salt-heritage-walk**: *"Guided heritage walking tour through As-Salt's yellow-stone Ottoman streets, daytime, group with guide."*
- **madaba-mosaic-fair**: *"Artisan mosaic fair in Madaba, colorful stone mosaics on display, craftspeople at work, daylight market."*
- **amman-night-cycle**: *"Group night bike ride through Amman streets, bike lights, warm streetlamps, riders smiling."*

### Cities (16:9, 1600×900)
- **IMG-city-amman**: *"Amman hillside cityscape at golden hour, white-stone houses cascading over hills."*
- **IMG-city-jerash**: *"Jerash Roman ruins colonnade in warm afternoon light."*
- **IMG-city-aqaba**: *"Aqaba Red Sea waterfront with palm trees and boats, bright summer day."*
- **IMG-city-irbid**: *"Irbid university-city street life, warm daytime, lively sidewalks."*
- **IMG-city-wadi-rum**: *"Wadi Rum red desert dunes and rock formations under blue sky."*
- **IMG-city-salt**: *"As-Salt yellow sandstone old town stacked on a hillside, golden light."*

### Lifestyle / editorial
- **IMG-lifestyle-1** (16:9): *"Friends laughing together at a summer evening event in Jordan, warm bokeh lights behind."*
- **IMG-lifestyle-2** (4:3): *"Small diverse team of young Jordanians collaborating outdoors, candid, warm daylight."* (About)
- **IMG-lifestyle-3** (4:3): *"Event organizer setting up a community stage in daylight, friendly, hands-on."* (Submit)
- **IMG-map-teaser** (16:9): *"Stylized warm-toned map of Jordan with glowing event pins."* (or just screenshot the real map)
- **IMG-guide-1/2/3** (16:9): match article topics above.

**Total: ~30 images.** Generate event covers first (highest visual impact), then hero, then cities, then category/lifestyle.

---

## 5. Inspiration sites (study these, don't copy)

| Site | Why it matters for Saifi | Steal this |
|---|---|---|
| **dice.fm** | Event discovery done warm + human, great mobile cards | Card layout, "this week" urgency, clean filters |
| **ra.co** (Resident Advisor) | The gold standard for an events index/listing | Listing density, date grouping, map integration |
| **timeout.com** | City-events editorial + listings hybrid | The `/guide` editorial voice, "best of" lists |
| **airbnb.com** | The warm/light reference for your chosen palette | Photo-led cards, rounded warmth, category tiles |
| **eater.com** | Food/culture magazine feel | Big serif headlines + photo, anti-AI editorial grid |
| **visitjordan.com** | Same subject, official tourism brand | Color cues, real Jordan imagery, tone |
| **cereal mag / kinfolk** | Premium editorial restraint | Whitespace, type scale, calm asymmetry |
| **partiful.com** | Friendly modern event UI | Playful-but-clean CTA + RSVP energy |

**The anti-AI lever that matters most:** real photography (your generated set) + the `/guide` editorial content + specific local copy. Layout polish is secondary to those three.

---

## 6. Decisions (CONFIRMED)
- [x] **Fonts:** Fraunces (display serif) + General Sans (body grotesk) + IBM Plex Sans Arabic.
- [x] **`/submit`:** Submissions are SAVED. Plan: POST `/api/submit` → append to a JSON store (`data/submissions.json`) with status `pending`. (Upgrade to a DB later if needed.) Show "thanks, we'll review" on success.
- [x] **Theme:** FULLY REPLACE dark with the warm light theme. No toggle. Remove `night/purple` usage, glow shadows, `color-scheme: dark`, dark Leaflet CSS.
- [x] **Logo:** Generate from the prompt in §7. Use SVG/PNG once made; until then keep ☀️ + "Saifi / صيفي" wordmark.

## 7. Logo generation prompt
See prompt set delivered in chat (wordmark + icon variants). Drop final files in `public/logo/`.
