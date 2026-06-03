import { useMemo } from 'react'
import { BufferGeometry, Float32BufferAttribute, MeshStandardMaterial } from 'three'
import { groundHeight } from './terrain-noise'

const SIZE = 150
const SEG = 100

// Build a grid of (x, groundHeight, z) vertices → a rocky displaced plane.
function buildTerrain() {
  const positions: number[] = []
  const indices: number[] = []

  for (let j = 0; j <= SEG; j++) {
    for (let i = 0; i <= SEG; i++) {
      const x = (i / SEG - 0.5) * SIZE
      const z = (j / SEG - 0.5) * SIZE
      positions.push(x, groundHeight(x, z), z)
    }
  }

  const row = SEG + 1
  for (let j = 0; j < SEG; j++) {
    for (let i = 0; i < SEG; i++) {
      const a = j * row + i
      const b = a + 1
      const c = a + row
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  const geo = new BufferGeometry()
  geo.setIndex(indices)
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.computeVertexNormals()
  return geo
}

// A few scattered boulders for texture.
const ROCKS: [number, number][] = [
  [12, 8], [-14, 4], [9, -16], [-10, -12], [18, -4], [-20, -8], [6, 14], [-7, 16],
]

export function Terrain() {
  const geo = useMemo(buildTerrain, [])
  const ground = useMemo(
    () => new MeshStandardMaterial({ color: '#3b393f', roughness: 1, metalness: 0, flatShading: true }),
    [],
  )
  const rockMat = useMemo(
    () => new MeshStandardMaterial({ color: '#4a4750', roughness: 1, metalness: 0, flatShading: true }),
    [],
  )

  return (
    <group>
      <mesh geometry={geo} material={ground} receiveShadow />
      {ROCKS.map(([x, z], i) => {
        const r = 0.55 + (i % 3) * 0.3
        return (
          <mesh
            key={i}
            position={[x, groundHeight(x, z) + r * 0.35, z]}
            rotation={[i * 0.9, i * 1.3, i * 0.6]}
            material={rockMat}
          >
            <icosahedronGeometry args={[r, 0]} />
          </mesh>
        )
      })}
    </group>
  )
}
