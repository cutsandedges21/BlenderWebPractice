import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'

export default function App() {
  return (
    <>
      <div className="overlay">
        <h1>Blender Web Practice</h1>
        <p>
          Drag to orbit · scroll to zoom. Drop a <code>.glb</code> into{' '}
          <code>public/models/</code>, then swap <code>&lt;Placeholder /&gt;</code> for{' '}
          <code>&lt;Model /&gt;</code> in <code>src/Scene.tsx</code>.
        </p>
      </div>

      <Canvas shadows camera={{ position: [5, -0.5, 12], fov: 50 }}>
        <Scene />
      </Canvas>
    </>
  )
}
