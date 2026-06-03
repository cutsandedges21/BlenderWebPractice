import { useMemo } from 'react'
import { Vector2, MeshStandardMaterial } from 'three'

// Half-profile of the column: (x = radius, y = height), revolved 360° by
// <latheGeometry> to make a solid of revolution — base moldings, a shaft with
// subtle entasis (the classical convex bulge), then the flared echinus capital.
const PROFILE: [number, number][] = [
  [0.58, -2.7], // foot, sitting on the plinth
  [0.96, -2.66], // torus base — out
  [1.0, -2.54], // torus crest
  [0.84, -2.42], // fillet back in
  [0.68, -2.3], // shaft begins
  [0.7, -0.4], // entasis — gentle mid bulge
  [0.62, 2.0], // taper toward the top
  [0.58, 2.16], // neck (hypotrachelion)
  [0.9, 2.44], // echinus flares out
  [0.96, 2.58], // echinus crest
  [0.66, 2.62], // tuck under the abacus
]

const FLUTES = 20 // classical Doric columns have 20
const SHAFT_R = 0.7

/**
 * A Greek/Roman column generated entirely in code (no .glb import):
 *  - a lathe-revolved PROFILE for the base, entasis shaft, and capital
 *  - 20 vertical flutes placed around the shaft with cos/sin
 *  - square plinth + abacus slabs (boxes) top and bottom
 */
export function Pillar() {
  const points = useMemo(() => PROFILE.map(([x, y]) => new Vector2(x, y)), [])
  const angles = useMemo(
    () => Array.from({ length: FLUTES }, (_, i) => (i / FLUTES) * Math.PI * 2),
    [],
  )
  // One shared marble-ish material for the whole column.
  const stone = useMemo(
    () => new MeshStandardMaterial({ color: '#e9e4d8', roughness: 0.82, metalness: 0 }),
    [],
  )

  return (
    <group>
      {/* Square plinth */}
      <mesh position={[0, -2.86, 0]} material={stone}>
        <boxGeometry args={[1.85, 0.32, 1.85]} />
      </mesh>

      {/* Revolved column body (base + shaft + capital) */}
      <mesh material={stone}>
        <latheGeometry args={[points, 64]} />
      </mesh>

      {/* Flutes — thin vertical rounds placed around the shaft with cos/sin */}
      {angles.map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * SHAFT_R, -0.15, Math.sin(a) * SHAFT_R]}
          material={stone}
        >
          <cylinderGeometry args={[0.05, 0.05, 4.2, 10]} />
        </mesh>
      ))}

      {/* Square abacus crowning the capital */}
      <mesh position={[0, 2.74, 0]} material={stone}>
        <boxGeometry args={[1.7, 0.28, 1.7]} />
      </mesh>
    </group>
  )
}
