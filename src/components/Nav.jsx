import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, MOTION } from '../motion/gsap.js'

const links = [
  ['work', 'Work'],
  ['about', 'About'],
  ['journal', 'Journal'],
  ['contact', 'Contact'],
]

export default function Nav() {
  const [active, setActive] = useState(null)
  const menu = useRef(null)
  const bar = useRef(null)

  // N1: a 1px hairline shows page progress.
  useGSAP(() => {
    gsap.matchMedia().add(MOTION, () => {
      gsap.fromTo('.progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
    })
  }, { scope: bar, idle: true })

  // Highlights the section crossing the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' },
    )
    document.querySelectorAll('main section[id]').forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const item = ([id, text]) => (
    <li key={id}>
      <a
        href={`#${id}`}
        aria-current={active === id ? 'location' : undefined}
        // The popover stays open after an in-page jump unless closed here; without JS it simply stays open.
        onClick={() => menu.current?.hidePopover?.()}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-silver/75 transition-colors hover:text-silver aria-[current]:bg-silver/10 aria-[current]:text-silver"
      >
        <span aria-hidden="true" className={`size-1.5 rounded-full ${active === id ? 'bg-safelight-bright' : 'bg-transparent'}`} />
        {text}
      </a>
    </li>
  )

  return (
    <header ref={bar} className="glass fixed top-3 left-1/2 z-50 w-[calc(100%-24px)] max-w-[980px] -translate-x-1/2 overflow-hidden rounded-full">
      <span aria-hidden="true" className="progress absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-safelight-bright" />
      <nav aria-label="Primary" className="flex h-14 items-center justify-between pr-2 pl-3">
        <a href="#top" className="flex items-center gap-3 font-display text-xl text-silver">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-full border border-silver/25 font-mono text-[0.625rem]">IK</span>
          Ishan Keshari
        </a>
        <ul className="hidden gap-1 md:flex">{links.map(item)}</ul>
        <button type="button" popoverTarget="menu" className="rounded-full px-4 py-2 text-sm font-medium text-silver hover:bg-silver/10 md:hidden">
          Menu
        </button>
      </nav>
      <div
        id="menu"
        ref={menu}
        popover="auto"
        aria-label="Menu"
        className="m-0 h-dvh w-full max-w-none border-0 bg-obsidian p-0 text-silver backdrop:bg-obsidian/80"
      >
        <div className="wrap flex h-16 items-center justify-between border-b border-line">
          <span className="label" aria-hidden="true">IK</span>
          <button type="button" popoverTarget="menu" popoverTargetAction="hide" className="label py-2">
            Close
          </button>
        </div>
        <ul className="wrap flex flex-col gap-4 pt-8">{links.map(item)}</ul>
      </div>
    </header>
  )
}
