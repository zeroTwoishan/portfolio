import { forwardRef, useRef } from 'react'
import { gsap, useGSAP } from '../motion/gsap.js'

// Magnetic pull: on a mouse, the element leans up to `strength / 2` px toward the cursor and springs back
// when it leaves. Touch, keyboard and reduced-motion visitors get a normal, still button.
export function useMagnetic(ref, strength = 16) {
  useGSAP(() => {
    const el = ref.current
    gsap.matchMedia().add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
      const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        x(((e.clientX - r.left) / r.width - 0.5) * strength)
        y(((e.clientY - r.top) / r.height - 0.5) * strength)
      }
      const leave = () => (x(0), y(0))
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => (el.removeEventListener('pointermove', move), el.removeEventListener('pointerleave', leave))
    })
  }, { scope: ref })
}

// A link with the magnetic pull. Same props as <a>.
export const MagneticA = forwardRef(function MagneticA({ strength, ...props }, outer) {
  const ref = useRef(null)
  useMagnetic(ref, strength)
  return <a ref={(el) => { ref.current = el; if (typeof outer === 'function') outer(el); else if (outer) outer.current = el }} {...props} />
})
