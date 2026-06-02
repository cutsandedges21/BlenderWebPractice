# BlenderWebPractice

A small **React + TypeScript + Vite** playground for practicing how to get 3D
objects (especially Blender models) running in a website, using
[react-three-fiber](https://r3f.docs.pmnd.rs/) and
[drei](https://github.com/pmndrs/drei).

It boots with a spinning placeholder shape so you can confirm everything works,
then you swap in your own exported model.

## Run it

```bash
npm install      # first time only
npm run dev      # starts Vite, prints a http://localhost:5173 URL
```

Open the URL. Drag to orbit, scroll to zoom.

Other scripts: `npm run build` (type-check + production build into `dist/`),
`npm run preview` (serve the built output).

## Project layout

```
public/models/        ← put your exported .glb files here (served at /models/...)
src/
  App.tsx             ← <Canvas> + the on-screen overlay
  Scene.tsx           ← lights, camera controls, shadows; swap Placeholder ↔ Model here
  Placeholder.tsx     ← the default spinning torus knot
  Model.tsx           ← loads a .glb via useGLTF
```

## How to export a model from Blender and show it on the site

### 1. Export from Blender as GLB

1. In Blender, select the object(s) you want (or export everything).
2. **File → Export → glTF 2.0 (.glb/.gltf)**.
3. In the export panel on the right:
   - **Format:** `glTF Binary (.glb)` — one self-contained file with meshes,
     materials, and textures baked in. Easiest for the web.
   - **Include:** tick **Selected Objects** if you only want your selection.
   - **Transform:** leave **+Y Up** ticked (three.js expects Y-up).
   - **Geometry:** keep **Apply Modifiers** on; tick **UVs**, **Normals**, and
     **Materials** if your model is textured.
   - **(Optional) Compression:** enabling **Draco** shrinks the file a lot. If
     you use it, see the Draco note below.
4. Save it as **`public/models/model.glb`** in this project.

> Keep it light: a few hundred KB to a few MB is ideal for the web. Decimate
> dense meshes and resize textures (1–2K) in Blender before exporting.

### 2. Show it in the scene

Open [src/Scene.tsx](src/Scene.tsx) and:

1. Uncomment the import at the top:
   ```ts
   import { Model } from './Model'
   ```
2. Comment out `<Placeholder />` and uncomment the `<Model />` line:
   ```tsx
   {/* <Placeholder /> */}
   <Model url="/models/model.glb" scale={1} />
   ```
3. Save — Vite hot-reloads and your model appears. Adjust `scale`, the camera
   `position` in [src/App.tsx](src/App.tsx), and the lights until it looks right.

That's it. The `url` is relative to `public/`, so `public/models/model.glb`
is referenced as `/models/model.glb`.

### Draco-compressed exports (optional)

If you ticked **Draco** in Blender, tell drei where the decoder lives:

```tsx
import { useGLTF } from '@react-three/drei'
useGLTF('/models/model.glb', '/draco/') // decoder files in public/draco/
```

Grab the decoder from `node_modules/three/examples/jsm/libs/draco/` and copy it
into `public/draco/`. For most practice models you can skip Draco entirely.

### Animations (optional next step)

If your GLB has animations, swap `useGLTF` for drei's `useAnimations` to play
clips. Ask and we can wire that up.
