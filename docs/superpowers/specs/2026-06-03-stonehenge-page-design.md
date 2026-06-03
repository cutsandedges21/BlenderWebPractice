# Page 2 — "The Circle" (Stonehenge scene)

**Date:** 2026-06-03
**Status:** Approved, implementing

## Goal

Extend the FORMA homepage with a second scroll "page": after the
"Built in the browser with three.js." act, the screen **cuts to black** and
fades up on a small **rocky terrain** with **5 standing stones** (Stonehenge,
in the distance). Continued scrolling **zooms the camera into the circle**.
Mood stays dark + foggy to match page one.

## Decisions (from brainstorming)

| Question | Choice |
|---|---|
| Transition | Fade-to-black cut |
| Stonehenge form | 5 standing stones in an arc |
| Mood | Dark + fog (match FORMA) |

## Architecture

One `<Canvas>`; `<ScrollControls>` grows from 3 → **5 pages**. The Stonehenge
world lives in a separate region of space (around `y = -50`) so it never
collides with the column at the origin. The camera rig uses **offset-keyed
keyframes** (`{ at, pos, look }`) and eases toward the sampled target with
`maath` `easing.damp3` (the existing smooth-scroll fix, preserved).

```
at 0.08  Act 1  FORMA establish
at 0.30  Act 2  FORMA fluted shaft
at 0.50  Act 3  FORMA — "Built in the browser…"
   ~0.61  cut-fade peaks (screen black); camera traverses to the terrain world
at 0.72  Act 4  Stonehenge distant (stones small, fogged)
at 0.92  Act 5  Stonehenge — zoomed into the circle
```

A fixed full-screen black `<div>` (`.cut-fade`) has its opacity driven each
frame by a `ScrollCut` component: full black for `|offset − 0.61| ≤ 0.06`,
ramping to 0 by ±0.09. This hides the camera's cross-world jump → reads as a
true second page.

## Components (single-purpose, all procedural — no imports)

- **`terrain.ts`** — `TERRAIN_Y`, `CIRCLE_CENTER`, and `groundHeight(x, z)`:
  fractal value-noise (4 octaves) for rolling hills, flattened within radius 6
  of the circle center so stones sit level. Shared by terrain + stones.
- **`Terrain.tsx`** — a `BufferGeometry` grid (≈100×100) sampled from
  `groundHeight`, dark matte flat-shaded rock, plus a few scattered low rocks
  (icosahedrons) for texture.
- **`Stonehenge.tsx`** — 5 weathered standing stones (boxes with per-stone
  size/lean variation) placed on an arc via `sin/cos`, seated on the terrain via
  `groundHeight`, each yawed to face the circle center.

## Touched files

- `Experience.tsx` — offset-keyed `KEYS` + sampler; add `Terrain`, `Stonehenge`,
  a dim accent fill light for the circle, and `ScrollCut` (takes `fadeRef`).
- `App.tsx` — `pages={5}`; render the `.cut-fade` div, pass its ref to `Experience`.
- `Overlay.tsx` — add Act 4 ("THE CIRCLE" hero) + Act 5 (closing + footer moved here).
- `index.css` — `.cut-fade` styles.

## Out of scope (YAGNI)

Lintels/trilithons, separate mounted scenes, day/night toggle, terrain textures,
collision, audio.

## Verification

`npm run build` type-checks/builds; Playwright screenshots at offsets ≈
0.08 / 0.30 / 0.50 / 0.61 (black) / 0.72 / 0.92 confirm each act + the cut, on
desktop (1440×900) and mobile portrait (390×844), with no real console errors.
