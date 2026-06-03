/**
 * The HTML copy layer. Three full-height "acts" stacked to match
 * <ScrollControls pages={3} />, rendered inside drei's <Scroll html>.
 */
export function Overlay() {
  return (
    <div className="overlay-root">
      <section className="act act--hero">
        <h1 className="headline">
          Still
          <br />
          in Motion
        </h1>
        <span className="scroll-cue">scroll ↓</span>
      </section>

      <section className="act act--feature">
        <p className="line">
          Turned on a lathe of math —<br />
          not a single imported mesh.
        </p>
      </section>

      <section className="act act--close">
        <p className="line">Built in the browser with three.js.</p>
        <footer className="foot">
          <span>Mossimo</span>
          <span className="dot">·</span>
          <a href="https://github.com/cutsandedges21/BlenderWebPractice" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </footer>
      </section>
    </div>
  )
}
