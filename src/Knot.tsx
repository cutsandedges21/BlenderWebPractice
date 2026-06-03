import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

/**
 * The glowing accent form — a slowly self-rotating torus knot.
 * Its emissive material blooms under post-processing.
 */
export function Knot() {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4
  })

  return (
    <mesh ref={ref} castShadow>
      <torusKnotGeometry args={[0.7, 0.24, 180, 32]} />
      <meshStandardMaterial
        color="#5b8cff"
        emissive="#5b8cff"
        emissiveIntensity={1.6}
        metalness={0.35}
        roughness={0.2}
      />
    </mesh>
  )
}
