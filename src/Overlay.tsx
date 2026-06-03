/**
 * The HTML copy layer. Five full-height "acts" stacked to match
 * <ScrollControls pages={5} />, rendered inside drei's <Scroll html>.
 * Acts 1–3 are page one (FORMA column); acts 4–5 are page two (Stonehenge).
 */
export function Overlay() {
  return (
    <div className="overlay-root">
      {/* ── Page 1: FORMA column ── */}
      <section className="act act--hero">
        <h1 className="headline">
          Still
          <br />
          in Motion
        </h1>
      </section>

      <section className="act act--feature">
        <p className="line">
          Turned on a lathe of math —<br />
          not a single imported mesh.
        </p>
      </section>

      <section className="act act--close">
        <p className="line">Built in the browser with three.js.</p>
      </section>

      {/* ── Page 2: the Stonehenge field ── */}
      <section className="act act--hero">
        <h1 className="headline">
          The
          <br />
          Circle
        </h1>
      </section>

      <section className="act act--close">
        <p className="line">Five stones, placed by math.</p>
        <footer className="foot">
          <span>Mossimo</span>
          <span className="dot">·</span>
          <a
            href="https://github.com/cutsandedges21/BlenderWebPractice"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </footer>
      </section>
    </div>
  )
}
