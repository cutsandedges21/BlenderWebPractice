import { Suspense } from 'react'
import { OrbitControls, ContactShadows, Html } from '@react-three/drei'
import { Placeholder } from './Placeholder'
import { Model } from './Model'
// SmoothCube.glb lives in /Objects (outside /public), so import it as a
// bundled asset URL. Vite hashes it into the build and returns the path string.
import smoothCubeUrl from '../Objects/SmoothCube.glb?url'

export function Scene() {
  return (
    <>
      {/* Lighting — tweak these to see how PBR materials react. */}
      <hemisphereLight intensity={0.5} groundColor="#10131a" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />

      <Suspense fallback={<Html center>Loading…</Html>}>
        {/* A built-in spinning shape. */}
        <Placeholder />

        {/* Your imported Blender model, sitting below the placeholder. */}
        <Model url={smoothCubeUrl} position={[0, -2.4, 0]} />
      </Suspense>

      {/* Soft fake shadow on the "ground" so the cube feels grounded. */}
      <ContactShadows position={[0, -3.4, 0]} opacity={0.45} scale={12} blur={2.5} far={4} />

      {/* Mouse/touch camera controls. Target sits between the two objects. */}
      <OrbitControls makeDefault enableDamping target={[0, -1, 0]} />
    </>
  )
}
