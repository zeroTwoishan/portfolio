import { useRef } from 'react'
import { gsap, useGSAP, reveal, MOTION } from '../motion/gsap.js'

// Section heading with the safelight wipe (A1): a red block sweeps left → right and the title appears behind it.
// `children` is the title; `meta` sits on the right of the frame label (coordinates, attempt counter, marks).
export default function SectionHead({ id, frame, children, meta }) {
  const scope = useRef(null)

  useGSAP(() => {
    gsap.matchMedia().add(MOTION, () => {
      const tl = gsap.timeline({ paused: true })
        .fromTo('.wipe', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.45, ease: 'power3.in' })
        .from('h2', { opacity: 0, duration: 0.01 })
        .set('.wipe', { transformOrigin: 'right' })
        .to('.wipe', { scaleX: 0, duration: 0.45, ease: 'power3.out' })
      return reveal(scope.current, () => tl.play())
    })
  }, { scope, idle: true })

  return (
    <div ref={scope}>
      <div className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-ash">
        <span>{frame}</span>
        {meta}
      </div>
      <div className="relative mt-4 inline-block">
        <h2 id={id} className="font-display text-5xl leading-none md:text-7xl">{children}</h2>
        <span aria-hidden="true" className="wipe absolute inset-0 origin-left scale-x-0 bg-safelight" />
      </div>
    </div>
  )
}
