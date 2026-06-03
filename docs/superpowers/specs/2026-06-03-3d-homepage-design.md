# 3D Homepage — "Abstract 3D Experiment" (Design Spec)

**Date:** 2026-06-03
**Status:** Approved, implementing

## Goal

Turn the BlenderWebPractice playground into a single-page, scroll-driven 3D
homepage in the visual language of Andrii Bachynskyi's concept work: one hero
subject, a dark cinematic stage, oversized overlaid typography, and motion as the
signature. Framed as an **abstract experiment** (atmosphere, not selling).

The two existing objects are the subjects:
- **SmoothCube** (`Objects/SmoothCube.glb`) — a tall (~6u) rounded monolith.
- **Torus knot** (currently `Placeholder.tsx`) — a floating accent form.

## Analysis basis (Bachynskyi recipe)

1. One hero object, centered, surrounded by negative space.
2. Dark palette + a single glowing accent.
3. Oversized confident type that overlaps/layers with the object.
4. Dramatic studio lighting (HDRI reflections + soft contact shadows).
5. Motion is the signature: idle float + **scroll-driven camera moves**.
6. Clean, minimal sections.

## Decisions (from brainstorming)

| Question | Choice |
|---|---|
| Purpose | Abstract 3D experiment (minimal copy, moody) |
| Hero layout | Full-bleed centerpiece, type overlaid |
| Interaction | Scroll-driven cinematic |
| Vibe | Dark cinematic + accent (electric blue/cyan) |
| Glow | Real bloom via `@react-three/postprocessing` |

## Architecture

Full-viewport `<Canvas>` wrapped in drei `<ScrollControls pages={3}>`. A camera
rig reads `useScroll().offset` and interpolates between keyframes each frame.
Objects idle-float independently via `useFrame`. HTML copy lives in a drei
`<Scroll html>` layer synced to the same scroll.

### Components (single-purpose units)

- **`App.tsx`** — `<Canvas>` + `<ScrollControls>`; renders `<Experience />` and
  `<Scroll html><Overlay /></Scroll>`. Also a fixed wordmark/nav over everything.
- **`Experience.tsx`** *(new)* — lights, `<Environment>`, `<ContactShadows>`, the
  objects group, the scroll-driven `CameraRig`, and the `<EffectComposer>` bloom.
- **`CameraRig`** (inside Experience) — `useFrame` + `useScroll`; lerps camera
  position and lookAt target across 3 keyframes.
- **`Overlay.tsx`** *(new)* — three full-height HTML acts (headline, line, close).
- **`Knot.tsx`** — renamed from `Placeholder.tsx`; the floating torus knot.
- **`Model.tsx`** — reused as-is (loads SmoothCube).
- **`Scene.tsx`, `Placeholder.tsx`** — removed (superseded).

### Scroll choreography (offset 0 → 1, 3 acts)

1. **Act 1 — establish:** wide shot of monolith + floating knot. Headline
   "STILL IN MOTION" overlaps the form; "scroll ↓" cue.
2. **Act 2 — feature:** camera pushes in + orbits the monolith surface. Copy:
   "Geometry, rounded by hand — rendered in real time."
3. **Act 3 — release:** camera rises to frame the knot. Closing line
   "Built in the browser with three.js." + footer (name · GitHub link).

### Visual system

- Background `#06070a` with a radial accent glow (CSS) behind the canvas.
- Accent `#5b8cff` (electric blue) on glow, emissive highlights, link underline.
- Bloom (+ optional Vignette) for the signature glow.
- Type: large `clamp()`-scaled sans headline, tight tracking; sparse body copy.

## Dependencies

Add `@react-three/postprocessing` (+ peer `postprocessing`). Everything else
(`three`, `@react-three/fiber`, `@react-three/drei`) already installed.

## Out of scope (YAGNI)

Routing, CMS, multiple pages, model loader UI, animations baked in the GLB,
mobile gesture choreography beyond native scroll.

## Verification

`npm run build` type-checks/builds, and Playwright screenshots at scroll
offsets ~0, ~0.5, ~1 confirm all three acts render with no console errors.
