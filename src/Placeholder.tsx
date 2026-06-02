import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

/**
 * A simple spinning torus knot so the scene renders something before you've
 * added a real model. Delete this once you wire up <Model />.
 */
export function Placeholder() {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5
  })

  return (
    <mesh ref={ref} castShadow>
      <torusKnotGeometry args={[0.8, 0.28, 160, 32]} />
      <meshStandardMaterial color="#6ea8fe" metalness={0.3} roughness={0.25} />
    </mesh>
  )
}
