import { useRef } from 'react'
import type { RefObject } from 'react'
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
import { easing } from 'maath'
import { Pillar } from './Pillar'
import { Knot } from './Knot'
import { Terrain } from './Terrain'
import { Stonehenge } from './Stonehenge'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (t: number) => t * t * (3 - 2 * t) // smoothstep easing

type Key = { at: number; pos: [number, number, number]; look: [number, number, number] }

// Offset-keyed camera path. The cut between page 1 and page 2 happens in the
// gap between Act 3 (0.50) and Act 4 (0.72), hidden by the fade-to-black.
const KEYS: Key[] = [
  { at: 0.08, pos: [4.5, 1.2, 12], look: [0, 0.4, 0] }, // Act 1 — FORMA establish
  { at: 0.3, pos: [-3.6, -0.8, 6.5], look: [0, -0.6, 0] }, // Act 2 — fluted shaft
  { at: 0.5, pos: [2.4, 4.8, 7], look: [0, 4.0, 0] }, // Act 3 — the knot
  { at: 0.72, pos: [0, -45.5, 19], look: [0, -48, -2] }, // Act 4 — Stonehenge, distant
  { at: 0.92, pos: [0, -47.4, 7.5], look: [0, -48.2, -3] }, // Act 5 — inside the circle
]

const CUT_CENTER = 0.61 // scroll offset where the screen is fully black

const tmpPos = new Vector3()
const tmpLook = new Vector3()

// Interpolate the camera keyframes for a given scroll offset.
function sample(offset: number, outPos: Vector3, outLook: Vector3) {
  if (offset <= KEYS[0].at) {
    outPos.set(...KEYS[0].pos)
    outLook.set(...KEYS[0].look)
    return
  }
  const last = KEYS[KEYS.length - 1]
  if (offset >= last.at) {
    outPos.set(...last.pos)
    outLook.set(...last.look)
    return
  }
  let i = 0
  while (i < KEYS.length - 2 && offset >= KEYS[i + 1].at) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const f = smooth((offset - a.at) / (b.at - a.at))
  outPos.set(lerp(a.pos[0], b.pos[0], f), lerp(a.pos[1], b.pos[1], f), lerp(a.pos[2], b.pos[2], f))
  outLook.set(lerp(a.look[0], b.look[0], f), lerp(a.look[1], b.look[1], f), lerp(a.look[2], b.look[2], f))
}

/**
 * Eases the camera toward the scroll-derived target each frame
 * (framerate-independent), so coarse mouse-wheel steps stay smooth.
 */
function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  const look = useRef(new Vector3(...KEYS[0].look))

  useFrame((_, delta) => {
    sample(scroll.offset, tmpPos, tmpLook)
    easing.damp3(camera.position, tmpPos, 0.25, delta)
    easing.damp3(look.current, tmpLook, 0.25, delta)
    camera.lookAt(look.current)
  })

  return null
}

/** Drives the fixed black overlay's opacity to "cut" between the two pages. */
function ScrollCut({ fadeRef }: { fadeRef: RefObject<HTMLDivElement | null> }) {
  const scroll = useScroll()
  useFrame(() => {
    const el = fadeRef.current
    if (!el) return
    const d = Math.abs(scroll.offset - CUT_CENTER)
    el.style.opacity = String(Math.min(1, Math.max(0, (0.09 - d) / 0.03)))
  })
  return null
}

export function Experience({ fadeRef }: { fadeRef: RefObject<HTMLDivElement | null> }) {
  return (
    <>
      <CameraRig />
      <ScrollCut fadeRef={fadeRef} />

      {/* Shared lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 10, 6]} intensity={1.6} castShadow />
      <pointLight position={[-6, 2, -2]} intensity={45} color="#5b8cff" />

      {/* Studio reflections built from light cards (no network HDRI needed). */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, -6]} scale={[12, 6, 1]} color="#9bc1ff" />
        <Lightformer intensity={1.2} position={[-6, 1, 2]} scale={[6, 8, 1]} color="#ffffff" />
        <Lightformer intensity={1.5} position={[6, -2, 3]} scale={[6, 6, 1]} color="#5b8cff" />
      </Environment>

      {/* ── Page 1: the FORMA column ── */}
      <Pillar />
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1} position={[0, 4.0, 0]}>
        <Knot />
      </Float>
      <ContactShadows
        position={[0, -3.05, 0]}
        opacity={0.5}
        scale={16}
        blur={3}
        far={5}
        color="#000000"
      />

      {/* ── Page 2: the Stonehenge field (around y = -50) ── */}
      <Terrain />
      <Stonehenge />
      <pointLight position={[0, -44, 5]} intensity={140} distance={55} decay={2} color="#9bb8ff" />

      {/* Glow + cinematic vignette (global). */}
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  )
}
