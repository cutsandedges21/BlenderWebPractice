# BlenderWebPractice — FORMA

A **React + TypeScript + Vite** project for practicing how to get 3D objects
(especially Blender models) running on the web, built with
[react-three-fiber](https://r3f.docs.pmnd.rs/) and
[drei](https://github.com/pmndrs/drei).

It's grown into **FORMA** — a scroll-driven, cinematic one-page 3D homepage in
the spirit of Andrii Bachynskyi's concept work: one dark stage, a glowing accent,
oversized overlaid type, and a camera that moves as you scroll.

## Run it

```bash
npm install      # first time only
npm run dev      # starts Vite, prints a http://localhost:5173 URL
```

Scroll the page — the camera moves through three "acts". Other scripts:
`npm run build` (type-check + production build into `dist/`), `npm run preview`.

## How it works

A full-viewport `<Canvas>` is wrapped in drei's `<ScrollControls pages={3}>`.
A camera rig reads the scroll offset each frame and interpolates between three
keyframes, while the objects idle-float. HTML copy is layered over the 3D via
drei's `<Scroll html>`.

```
Objects/SmoothCube.glb   ← the rounded "monolith" (imported as a bundled asset)
docs/superpowers/specs/  ← the design spec for this homepage
src/
  App.tsx          ← <Canvas> + <ScrollControls> + fixed wordmark/nav
  Experience.tsx   ← lights, environment, objects, scroll camera rig, bloom
  Overlay.tsx      ← the three HTML "acts" (headline, line, closing + footer)
  Model.tsx        ← loads a .glb via useGLTF (accepts position/rotation/scale)
  Knot.tsx         ← the glowing accent torus knot
```

The three acts: **(1)** establish — "STILL IN MOTION" over the monolith;
**(2)** camera pushes into the rounded surface; **(3)** rises to the glowing knot
with a closing line + footer.

## Swapping in your own model

`Objects/SmoothCube.glb` is loaded in [src/Experience.tsx](src/Experience.tsx)
via a Vite asset import:

```ts
import myModelUrl from '../Objects/MyModel.glb?url'
// ...
<Model url={myModelUrl} position={[0, 0, 0]} />
```

Drop a new `.glb` into `Objects/`, change the import, and reposition. (Files in
`public/` instead are referenced by plain path, e.g. `"/models/x.glb"` — no
import needed.) Tune the camera keyframes (`KEYS`) and lights in `Experience.tsx`.

## Exporting from Blender (GLB)

1. **File → Export → glTF 2.0 (.glb/.gltf)**, format **glTF Binary (.glb)**.
2. **Data → Mesh → Apply Modifiers ✅** — without this, Bevel/Subdivision
   *modifiers* are ignored and you export the un-rounded base mesh.
3. If you scaled the object in Object Mode, **Ctrl+A → Apply → Scale** so it
   isn't stretched on the web (an unapplied scale rides along as a node scale).
4. **Textures:** use a **Principled BSDF** material; image textures embed into
   the `.glb` automatically. Procedural textures (noise/voronoi) must be **baked**
   to images first, and the mesh **UV-unwrapped** (`U → Smart UV Project`). Keep
   **UVs/Normals** (and **Tangents** for normal maps) ticked on export.
5. Keep it light (a few hundred KB–few MB); resize textures to 1–2K.

> PBR materials (metallic/glossy) need something to reflect — the scene already
> includes an `<Environment>` built from light cards, plus bloom for glow.
