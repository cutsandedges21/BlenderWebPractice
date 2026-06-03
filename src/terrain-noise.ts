// Shared ground math for the Stonehenge scene. Pure functions — used both to
// build the terrain mesh and to seat the stones on it.

export const TERRAIN_Y = -50
// Center of the stone circle (world X/Z); the ground is flattened around it.
export const CIRCLE_CENTER: [number, number] = [0, -2]

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

// 2D value noise with smooth (smoothstep) interpolation → returns ~0..1.
function valueNoise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const tl = hash(xi, yi)
  const tr = hash(xi + 1, yi)
  const bl = hash(xi, yi + 1)
  const br = hash(xi + 1, yi + 1)
  return (tl * (1 - u) + tr * u) * (1 - v) + (bl * (1 - u) + br * u) * v
}

// Fractal Brownian motion: layered noise for natural-looking hills.
function fbm(x: number, y: number) {
  let sum = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < 4; i++) {
    sum += amp * valueNoise(x * freq, y * freq)
    freq *= 2
    amp *= 0.5
  }
  return sum
}

/** World-space ground height (Y) at a given world X/Z. */
export function groundHeight(x: number, z: number) {
  const rolling = (fbm(x * 0.06 + 4, z * 0.06 + 9) - 0.5) * 2.6
  const detail = (fbm(x * 0.16 + 20, z * 0.16 + 7) - 0.5) * 1.1
  let h = rolling + detail
  // Flatten the ground inside the circle so the stones stand level.
  const d = Math.hypot(x - CIRCLE_CENTER[0], z - CIRCLE_CENTER[1])
  const flat = Math.min(1, Math.max(0, (d - 6) / 10)) // 0 within r6 → 1 by r16
  h *= flat
  return TERRAIN_Y + h
}
