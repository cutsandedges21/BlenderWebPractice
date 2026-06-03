import { Suspense } from 'react'
import { OrbitControls, ContactShadows, Html } from '@react-three/drei'
import { Placeholder } from './Placeholder'
import { Model } from './Model'
// SmoothCube.glb lives in /Objects (outside /public), so import it as a
// bundled asset URL. Vite hashes it into the build and returns the path string.
import smoothCubeUrl from '../Objects/SmoothCube.glb?url'

export function Scene() {
  // SmoothCube is ~6 units tall (its node carries a ~3x scale on the up axis),
  // and it's centered on its position. Drop it low enough that its TOP sits
  // just below the placeholder, leaving a small floating gap.
  const cubeHalfHeight = 2.99
  const placeholderBottom = -1.1
  const gap = 0.3
  const cubeY = placeholderBottom - gap - cubeHalfHeight // ≈ -4.39

  return (
    <>
      {/* Lighting — tweak these to see how PBR materials react. */}
      <hemisphereLight intensity={0.5} groundColor="#10131a" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />

      <Suspense fallback={<Html center>Loading…</Html>}>
        {/* A built-in spinning shape, floating just above the cube. */}
        <Placeholder />

        {/* Your imported SmoothCube, dropped down so it clears the placeholder. */}
        <Model url={smoothCubeUrl} position={[0, cubeY, 0]} />
      </Suspense>

      {/* Soft fake shadow on the "ground", sitting at the cube's base. */}
      <ContactShadows
        position={[0, cubeY - cubeHalfHeight, 0]}
        opacity={0.45}
        scale={12}
        blur={2.5}
        far={4}
      />

      {/* Mouse/touch camera controls. Target sits roughly mid-scene. */}
      <OrbitControls makeDefault enableDamping target={[0, -3, 0]} />
    </>
  )
}
