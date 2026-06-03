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
A camera rig reads the scroll offset each frame, interpolates between three
keyframes, and then **eases** the camera toward that target with framerate-
independent damping (`maath`'s `easing.damp3`). That last step matters: a desktop
mouse wheel scrolls in coarse, discrete steps, and easing absorbs them so the
motion stays smooth on wheel, trackpad, and touch alike. HTML copy is layered
over the 3D via drei's `<Scroll html>`.

```
docs/superpowers/specs/  ← the design spec for this homepage
Objects/SmoothCube.glb   ← an example imported model (no longer used by the scene)
src/
  App.tsx          ← <Canvas> + <ScrollControls> + fixed wordmark/nav
  Experience.tsx   ← lights, environment, scroll camera rig (KEYS), bloom
  Pillar.tsx       ← the procedural Greek/Roman column (lathe + flutes, no import)
  Knot.tsx         ← the glowing accent torus knot
  Overlay.tsx      ← the three HTML "acts" (headline, line, closing + footer)
  Model.tsx        ← loads a .glb via useGLTF (kept as a reference example)
```

The three acts: **(1)** establish — "STILL IN MOTION" over the column;
**(2)** camera pushes into the fluted shaft; **(3)** rises to the glowing knot
with a closing line + footer.

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
