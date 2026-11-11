import { useEffect, useRef, useState } from 'react'

// "Currently developing ___": cycles through what Ishan actually builds, like frames advancing on a reel.
// Screen readers get the whole list once; the moving part is decorative. Reduced motion keeps frame 1 still,
// and the cycle pauses while the hero is off screen.
const ROLES = ['Full-stack web apps', 'Image-processing tools', 'Chrome extensions', 'ML experiments']

export default function RoleFlip({ className = '' }) {
  const [i, setI] = useState(0)
  const box = useRef(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id = 0
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id)
      if (e.isIntersecting) id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2600)
    })
    io.observe(box.current)
    return () => (clearInterval(id), io.disconnect())
  }, [])

  return (
    <p ref={box} className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="label text-ash">Currently developing</span>
      <span className="sr-only">{ROLES.join(', ')}</span>
      <span aria-hidden="true" className="glass inline-flex items-center gap-3 rounded-full py-1.5 pr-5 pl-2">
        <span className="label rounded-full bg-silver/10 px-2 py-0.5 text-[0.625rem] text-silver">
          {String(i + 1).padStart(2, '0')}/{String(ROLES.length).padStart(2, '0')}
        </span>
        <span className="relative block h-[1.4em] overflow-hidden font-display text-xl italic leading-[1.4em] md:text-2xl">
          <span className="block transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ transform: `translateY(${-i * 1.4}em)` }}>
            {ROLES.map((r) => <span key={r} className="block whitespace-nowrap">{r}</span>)}
          </span>
          {/* Sizes the box to the longest role so the pill never jumps. */}
          <span className="invisible block h-0 whitespace-nowrap">{ROLES.reduce((a, b) => (b.length > a.length ? b : a))}</span>
        </span>
      </span>
    </p>
  )
}
