# BlenderWebPractice — FORMA

A **React + TypeScript + Vite** project for practicing how to get 3D objects
(especially Blender models) running on the web, built with
[react-three-fiber](https://r3f.docs.pmnd.rs/) and
[drei](https://github.com/pmndrs/drei).

It's grown into **FORMA** — a scroll-driven, cinematic 3D experience in the
spirit of Andrii Bachynskyi's concept work: a dark stage, a glowing accent,
oversized overlaid type, and a camera that moves as you scroll. It has **two
pages**: a procedural Greek column, then a fade-to-black **cut** into a rocky
field of standing stones you zoom into.

## Run it

```bash
npm install      # first time only
npm run dev      # starts Vite, prints a http://localhost:5173 URL
```

Scroll the page — the camera moves through five "acts" across two pages. Other
scripts: `npm run build` (type-check + production build into `dist/`), `npm run preview`.

## How it works

A full-viewport `<Canvas>` is wrapped in drei's `<ScrollControls pages={5}>`.
A camera rig reads the scroll offset each frame, interpolates between
offset-keyed keyframes (`KEYS`), and then **eases** the camera toward that target
with framerate-independent damping (`maath`'s `easing.damp3`). That last step
matters: a desktop mouse wheel scrolls in coarse, discrete steps, and easing
absorbs them so the motion stays smooth on wheel, trackpad, and touch alike.
HTML copy is layered over the 3D via drei's `<Scroll html>`.

The two pages live in one scene, in separate regions of space (the column at the
origin, the Stonehenge field around `y = -50`). Between them, a fixed black
`<div>` (`.cut-fade`) has its opacity driven by scroll, hiding the camera's jump
between worlds — a fade-to-black **cut**.

```
docs/superpowers/specs/  ← design specs (homepage + Stonehenge page)
Objects/SmoothCube.glb   ← an example imported model (no longer used by the scene)
src/
  App.tsx          ← <Canvas> + <ScrollControls> + wordmark + the cut-fade layer
  Experience.tsx   ← lights, environment, both worlds, camera rig (KEYS), cut, bloom
  Pillar.tsx       ← page 1: procedural Greek column (lathe + flutes, no import)
  Knot.tsx         ← page 1: the glowing accent torus knot
  terrain-noise.ts ← shared ground math: groundHeight(x, z) (fractal value noise)
  Terrain.tsx      ← page 2: rocky ground (displaced grid) + scattered boulders
  Stonehenge.tsx   ← page 2: five standing stones placed on an arc with sin/cos
  Overlay.tsx      ← the five HTML "acts" across both pages
  Model.tsx        ← loads a .glb via useGLTF (kept as a reference example)
```

The acts: **page 1** — (1) "STILL IN MOTION" over the column, (2) push into the
fluted shaft, (3) rise to the glowing knot; **cut to black**; **page 2** —
(4) "THE CIRCLE" over the distant stones, (5) zoom inside the circle + footer.

## Code vs. import — two ways to add shapes

The column ([src/Pillar.tsx](src/Pillar.tsx)) is generated **entirely in code**:
a `latheGeometry` revolves a hand-defined profile (base → entasis shaft →
capital) and 20 flutes are placed around it with `cos/sin`. Good for
mathematical/parametric shapes — no Blender needed.

For organic/sculpted/textured assets, import a `.glb` instead. [Model.tsx](src/Model.tsx)
shows the pattern (it loads `SmoothCube.glb`). To use your own: drop a `.glb`
into `Objects/`, then in a scene file:

```ts
import myModelUrl from '../Objects/MyModel.glb?url'
// ...
<Model url={myModelUrl} position={[0, 0, 0]} />
```

(Files in `public/` are instead referenced by plain path, e.g. `"/models/x.glb"`.)
Tune the camera keyframes (`KEYS`) and lights in `Experience.tsx`.

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
