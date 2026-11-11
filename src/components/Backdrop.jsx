import { useEffect, useRef } from 'react'

// Living background: a slow, low-resolution WebGL gradient behind the whole page.
// Colours follow whichever [data-tone] element (section or journal entry) crosses the middle of the screen.
// Kept dark on purpose: secondary text sits straight on it and must keep 4.5:1 contrast.
// Starts when the browser is idle; until then (and without WebGL) the CSS gradient on body shows.
export const TONES = {
  ember: ['#0a0808', '#2a1012', '#3a1a1c'], // hero: safelight red
  rose: ['#0a0809', '#241418', '#33202a'], // about
  steel: ['#08090a', '#161a20', '#2a1416'], // work: cool with a red edge
  dusk: ['#0a0809', '#1f1424', '#2e1a22'], // arsenal
  amber: ['#0a0908', '#241a10', '#33221a'], // journal entries cycle through these four
  moss: ['#08090a', '#121c16', '#24201a'],
  plum: ['#0a080a', '#1e1222', '#2c1620'],
  signal: ['#0b0808', '#331214', '#4a1a1e'], // contact: the strongest safelight
}

const FRAG = `precision mediump float;
uniform vec2 r; uniform float t; uniform vec3 c1, c2, c3;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + 1.), f.x), f.y); }
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 4; i++) { v += a * n(p); p *= 2.; a *= .5; } return v; }
void main() {
  vec2 uv = gl_FragCoord.xy / r, p = uv * vec2(r.x / r.y, 1.) * 1.4;
  float q = fbm(p + t * .03), w = fbm(p + q * 1.6 - t * .02);
  vec3 col = mix(c1, c2, smoothstep(.2, .8, w));
  col = mix(col, c3, smoothstep(.5, .95, q * w * 1.7));
  col *= .6 + .4 * smoothstep(1.3, .1, length(uv - vec2(.72, .55)));
  gl_FragColor = vec4(col, 1.);
}`

const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255)

function start(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
  if (!gl) return null
  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
  const prog = gl.createProgram()
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, 'attribute vec2 p; void main() { gl_Position = vec4(p, 0., 1.); }'))
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  const u = Object.fromEntries(['r', 't', 'c1', 'c2', 'c3'].map((k) => [k, gl.getUniformLocation(prog, k)]))

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const scale = matchMedia('(min-width: 1024px)').matches ? 0.25 : 0.18 // a soft gradient needs few pixels
  let current = TONES.ember.map(hex), target = current, raf = 0, last = 0
  const t0 = performance.now()

  const resize = () => {
    canvas.width = Math.max(1, Math.round(innerWidth * scale))
    canvas.height = Math.max(1, Math.round(innerHeight * scale))
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
  const frame = (now) => {
    raf = requestAnimationFrame(frame)
    if (now - last < 33) return // ~30 fps is plenty for drifting colour
    last = now
    let moving = false
    current = current.map((c, i) => c.map((v, j) => {
      const d = target[i][j] - v
      if (Math.abs(d) > 0.001) moving = true
      return reduce ? target[i][j] : v + d * 0.04
    }))
    gl.uniform2f(u.r, canvas.width, canvas.height)
    gl.uniform1f(u.t, reduce ? 0 : (now - t0) / 1000)
    current.forEach((c, i) => gl.uniform3fv(u[`c${i + 1}`], c))
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    if (reduce && !moving) (cancelAnimationFrame(raf), (raf = 0)) // static: draw only when the tone changes
  }
  const run = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(frame) }
  const onVisible = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0)) : run())

  // The tone of whatever crosses the middle of the viewport.
  const io = new IntersectionObserver((entries) => {
    const hit = entries.find((e) => e.isIntersecting)
    const tone = TONES[hit?.target.dataset.tone]
    if (tone) (target = tone.map(hex), run())
  }, { rootMargin: '-50% 0px -50% 0px' })
  document.querySelectorAll('[data-tone]').forEach((el) => io.observe(el))

  resize()
  addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisible)
  run()
  canvas.classList.add('opacity-100')
  return () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisible)
  }
}

export default function Backdrop() {
  const canvas = useRef(null)
  useEffect(() => {
    let stop = null
    const begin = () => { stop = start(canvas.current) }
    const id = typeof requestIdleCallback === 'function' ? requestIdleCallback(begin, { timeout: 2500 }) : setTimeout(begin, 300)
    return () => {
      typeof cancelIdleCallback === 'function' ? cancelIdleCallback(id) : clearTimeout(id)
      stop?.()
    }
  }, [])
  return (
    <div aria-hidden="true" className="backdrop pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvas} className="size-full opacity-0 transition-opacity duration-[1500ms]" />
    </div>
  )
}
