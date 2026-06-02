import { useGLTF } from '@react-three/drei'

type ModelProps = {
  /** Path under /public, e.g. "/models/model.glb" */
  url: string
  scale?: number
}

/**
 * Loads a glTF/GLB file and drops its scene graph into the canvas.
 * useGLTF caches by url, so the same file is only fetched/parsed once.
 */
export function Model({ url, scale = 1 }: ModelProps) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={scale} />
}

// Optional: start fetching before the component mounts (faster first paint).
// useGLTF.preload('/models/model.glb')
