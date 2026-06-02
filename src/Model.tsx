import { useGLTF } from '@react-three/drei'

type Vec3 = [number, number, number]

type ModelProps = {
  /** A URL string — either "/models/x.glb" (from public/) or an imported asset URL. */
  url: string
  position?: Vec3
  rotation?: Vec3
  scale?: number | Vec3
}

/**
 * Loads a glTF/GLB file and drops its scene graph into the canvas.
 * useGLTF caches by url, so the same file is only fetched/parsed once.
 */
export function Model({ url, position, rotation, scale = 1 }: ModelProps) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />
}

// Optional: start fetching before the component mounts (faster first paint).
// useGLTF.preload('/models/model.glb')
