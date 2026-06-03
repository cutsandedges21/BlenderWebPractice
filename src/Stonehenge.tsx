import { useMemo } from 'react'
import { MeshStandardMaterial, MathUtils } from 'three'
import { groundHeight, CIRCLE_CENTER } from './terrain-noise'

const RADIUS = 5

// Five standing stones placed on an arc. `a` = angle in degrees measured from
// +Z (toward the camera), leaving a gap at the front so the camera can enter.
const STONES = [
  { a: 60, h: 4.6, w: 1.3, d: 0.9, lean: 0.05 },
  { a: 120, h: 5.1, w: 1.5, d: 1.0, lean: -0.05 },
  { a: 180, h: 4.4, w: 1.2, d: 0.85, lean: 0.03 },
  { a: 240, h: 5.3, w: 1.45, d: 1.0, lean: 0.06 },
  { a: 300, h: 4.2, w: 1.25, d: 0.9, lean: -0.04 },
]

export function Stonehenge() {
  const stone = useMemo(
    () => new MeshStandardMaterial({ color: '#6a6770', roughness: 0.96, metalness: 0, flatShading: true }),
    [],
  )

  return (
    <group>
      {STONES.map((s, i) => {
        const rad = MathUtils.degToRad(s.a)
        const x = CIRCLE_CENTER[0] + Math.sin(rad) * RADIUS
        const z = CIRCLE_CENTER[1] + Math.cos(rad) * RADIUS
        const y = groundHeight(x, z) + s.h / 2 - 0.3 // embed the base slightly
        const faceCenter = Math.atan2(CIRCLE_CENTER[0] - x, CIRCLE_CENTER[1] - z)
        return (
          <mesh
            key={i}
            position={[x, y, z]}
            rotation={[s.lean, faceCenter, s.lean * 0.5]}
            material={stone}
          >
            <boxGeometry args={[s.w, s.h, s.d]} />
          </mesh>
        )
      })}
    </group>
  )
}
