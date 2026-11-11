import { useEffect, useRef } from 'react'
import { gsap } from '../motion/gsap.js'

// Custom cursor: a safelight dot that tracks exactly and a ring that trails behind, like focusing a lens.
// The ring grows over anything clickable and presses in on click. It also moves the spotlight on whichever
// .glass surface is under the pointer (--mx/--my, see index.css). Mouse only and motion-OK only: touch,
// keyboard and reduced-motion visitors keep the normal cursor, and without JS nothing changes.
const HOT = 'a, button, summary, label, .tile'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const html = document.documentElement
    const els = [dot.current, ring.current]
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3.out' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.35, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.35, ease: 'power3.out' })
    let shown = false

    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      if (!shown) (gsap.set(els, { x: e.clientX, y: e.clientY }), gsap.to(els, { opacity: 1, duration: 0.2 }), (shown = true))
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
      ring.current.classList.toggle('is-hot', !!e.target.closest?.(HOT))
      const glass = e.target.closest?.('.glass')
      if (glass) {
        const r = glass.getBoundingClientRect()
        glass.style.setProperty('--mx', `${e.clientX - r.left}px`)
        glass.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
    }
    const hide = () => (gsap.to(els, { opacity: 0, duration: 0.2 }), (shown = false))
    const press = () => ring.current.classList.add('is-down')
    const release = () => ring.current.classList.remove('is-down')

    html.classList.add('custom-cursor')
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerdown', press)
    addEventListener('pointerup', release)
    html.addEventListener('mouseleave', hide)
    return () => {
      html.classList.remove('custom-cursor')
      removeEventListener('pointermove', move)
      removeEventListener('pointerdown', press)
      removeEventListener('pointerup', release)
      html.removeEventListener('mouseleave', hide)
    }
  }, [])

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor-ring pointer-events-none fixed top-0 left-0 z-[100] opacity-0" />
      <div ref={dot} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[100] -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-safelight-bright opacity-0" />
    </>
  )
}
