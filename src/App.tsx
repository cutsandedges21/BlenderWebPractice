import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import { Experience } from './Experience'
import { Overlay } from './Overlay'

export default function App() {
  const fadeRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Fixed wordmark / nav, floating above the canvas. */}
      <header className="topbar">
        <span className="wordmark">FORMA</span>
        <nav className="nav">
          <span>index</span>
        </nav>
      </header>

      {/* Persistent scroll hint, always pinned to the bottom of the viewport. */}
      <div className="scroll-indicator" aria-hidden="true">scroll ↓</div>

      {/* Full-screen black layer for the page-to-page cut (opacity set by scroll). */}
      <div className="cut-fade" ref={fadeRef} aria-hidden="true" />

      <Canvas shadows dpr={[1, 2]} camera={{ position: [4.5, 1.2, 12], fov: 45 }}>
        <color attach="background" args={['#06070a']} />
        <fog attach="fog" args={['#06070a', 9, 30]} />

        <ScrollControls pages={5} damping={0.25}>
          <Experience fadeRef={fadeRef} />
          <Scroll html>
            <Overlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </>
  )
}
