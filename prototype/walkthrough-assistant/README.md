# Resy OS How-to Assistant (demo)

A self-contained mock of a Whatfix-style assistant chatbot that launches
WalkMe-style walkthroughs, records them, and shows Scribe-style generated
documentation — built around **real Resy restaurant-partner onboarding**
content (Resy OS Help Desk). Zero dependencies, no build step.

## Run

Open `index.html` in any browser. Nothing to install.

## What it does

- **Assistant** (bottom-right `?`): answers the questions restaurant partners
  actually ask, grounded in Resy's own "Resy OS FAQ" and Help Desk. Each
  answer can launch a guided walkthrough, open a screen, or jump to a how-to.
- **Walkthroughs** (WalkMe-style): spotlight + balloon guides that play over
  the host app in real time. Three journeys:
  1. **Create a shift** — the real 5-step shift wizard (Shift Basics → Service
     Settings → Availability → Reservation Settings → Custom Policies),
     including **off-market time** and **Online / In-house / Walk-in** tables.
  2. **Going live on Resy** — the exact 5-item launch checklist from Resy's
     "Going Live on Resy" article.
  3. **Invite a team member** — Users screen + role/permission invite, matching
     "Add User and Password Permissions for Users".
- **Recording**: every finished guide is stored in `localStorage` and appears
  under **How-to guides** as a Scribe-style document (numbered step cards,
  screenshot placeholders, tips, "Was this helpful?").
- **How-to guides**: catalog of native Resy Help Desk articles + your recorded
  walkthroughs.

## Intent routing

Question → matched intent → answer + action. Fallback → contact support
(<resysupport@resy.com>). Matcher and journey data are pure —
`node js/intents.js` runs the self-check:
`ponytail: intents self-check OK (11 intents, 3 journeys)`.

In the browser, run `selfcheck()` in the console to assert every journey
anchor exists in the DOM.

## Files

```text
index.html            Host app (mock Resy OS Dashboard) + init
css/resy-system.css   Resy tokens (#336FDE, ink #2A2A2A, black rail)
js/intents.js         INTENTS, JOURNEYS, matchIntent + node self-check
js/mock-api.js        Mock API layer (latency wrapper)
js/walkthrough.js     Spotlight/balloon engine + anchor check
js/recorder.js        localStorage recordings
js/docs.js            Scribe-style how-to rendering + source articles
js/assistant.js       Chat panel UI + intent routing
```

Brand tokens pulled live from resy.com this session: action blue `#336FDE`,
ink `#2A2A2A`, black `#000`, white background, Helvetica Neue stack.

## Notes / honest ceilings

- `ponytail: journey progress and recordings are stored client-side in
  localStorage — swap in a backend when multiple devices need shared state.`
- `ponytail: spotlight "hole" uses a single fixed box — fine for rectangular
  targets; per-pixel clipping (clip-path) is the upgrade if targets rotate.`
- This is a demo: mock screens show representative data, not a live Resy OS
  sync. Source articles link to the real Resy Help Desk URLs they mirror.
