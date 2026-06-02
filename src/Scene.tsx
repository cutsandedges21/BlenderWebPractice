import { Suspense } from 'react'
import { OrbitControls, ContactShadows, Html } from '@react-three/drei'
import { Placeholder } from './Placeholder'
// import { Model } from './Model'

export function Scene() {
  return (
    <>
      {/* Lighting — tweak these to see how PBR materials react. */}
      <hemisphereLight intensity={0.5} groundColor="#10131a" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />

      <Suspense fallback={<Html center>Loading…</Html>}>
        {/* Default: a built-in spinning shape so the scene works with no model yet. */}
        <Placeholder />

        {/*
          ── To show YOUR Blender model ──
          1. Export from Blender as GLB → save to public/models/model.glb
          2. Uncomment the `import { Model }` line at the top of this file.
          3. Comment out <Placeholder /> above and uncomment the line below:
        */}
        {/* <Model url="/models/model.glb" /> */}
      </Suspense>

      {/* Soft fake shadow on the "ground" so the object feels grounded. */}
      <ContactShadows position={[0, -1.2, 0]} opacity={0.45} scale={12} blur={2.5} far={4} />

      {/* Mouse/touch camera controls. */}
      <OrbitControls makeDefault enableDamping />
    </>
  )
}
