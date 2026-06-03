import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  ContactShadows,
  Float,
  useScroll,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Vector3 } from 'three'
import { Model } from './Model'
import { Knot } from './Knot'
import smoothCubeUrl from '../Objects/SmoothCube.glb?url'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (t: number) => t * t * (3 - 2 * t) // smoothstep easing

type Key = { pos: [number, number, number]; look: [number, number, number] }

// Camera keyframes for the three scroll acts.
const KEYS: Key[] = [
  { pos: [4.5, 1.2, 12], look: [0, 0.4, 0] }, // Act 1 — establish (wide)
  { pos: [-3.6, -0.8, 6.5], look: [0, -0.8, 0] }, // Act 2 — feature the monolith
  { pos: [2.4, 4.4, 7], look: [0, 3.7, 0] }, // Act 3 — rise to the knot
]

/** Drives the camera along KEYS based on scroll position, every frame. */
function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  const look = useRef(new Vector3(...KEYS[0].look))

  useFrame(() => {
    const t = scroll.offset * (KEYS.length - 1) // 0 → (KEYS-1)
    const i = Math.min(Math.floor(t), KEYS.length - 2)
    const f = smooth(t - i)
    const a = KEYS[i]
    const b = KEYS[i + 1]

    camera.position.set(
      lerp(a.pos[0], b.pos[0], f),
      lerp(a.pos[1], b.pos[1], f),
      lerp(a.pos[2], b.pos[2], f),
    )
    look.current.set(
      lerp(a.look[0], b.look[0], f),
      lerp(a.look[1], b.look[1], f),
      lerp(a.look[2], b.look[2], f),
    )
    camera.lookAt(look.current)
  })

  return null
}

export function Experience() {
  return (
    <>
      <CameraRig />

      {/* Lighting — low ambient, a dramatic key, and a cool accent rim. */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 10, 6]} intensity={1.6} castShadow />
      <pointLight position={[-6, 2, -2]} intensity={45} color="#5b8cff" />

      {/* Studio reflections built from light cards (no network HDRI needed). */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, -6]} scale={[12, 6, 1]} color="#9bc1ff" />
        <Lightformer intensity={1.2} position={[-6, 1, 2]} scale={[6, 8, 1]} color="#ffffff" />
        <Lightformer intensity={1.5} position={[6, -2, 3]} scale={[6, 6, 1]} color="#5b8cff" />
      </Environment>

      {/* The monolith — the imposing matte subject. */}
      <Model url={smoothCubeUrl} position={[0, 0, 0]} />

      {/* The glowing accent form, floating above the monolith. */}
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1} position={[0, 3.7, 0]}>
        <Knot />
      </Float>

      {/* Faint anchor beneath the monolith. */}
      <ContactShadows
        position={[0, -3.05, 0]}
        opacity={0.5}
        scale={16}
        blur={3}
        far={5}
        color="#000000"
      />

      {/* Glow + cinematic vignette. */}
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  )
}
