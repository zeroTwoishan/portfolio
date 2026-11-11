import { useRef } from 'react'
import { gsap, useGSAP, reveal, MOTION } from '../motion/gsap.js'
import SectionHead from '../components/SectionHead.jsx'
import Mark from '../components/Mark.jsx'
import TechIcon, { brandColor } from '../components/TechIcon.jsx'
import { skills, projects } from '../data/projects.js'
import { skillLabel } from '../data/derive.js'

export default function Arsenal() {
  const scope = useRef(null)

  useGSAP(() => {
    gsap.matchMedia().add(MOTION, () => {
      const stops = gsap.utils.toArray('.skill-row', scope.current).map((row) => {
        const tl = gsap.timeline({ paused: true })
          .from(row.querySelector('h3'), { opacity: 0, duration: 0.3 })
          .from(row.querySelectorAll('.tile'), { opacity: 0, y: 16, duration: 0.6, stagger: 0.04, ease: 'power3.out' }, '<0.1')
        return reveal(row, () => tl.play(), '0px 0px -15% 0px')
      })
      return () => stops.forEach((stop) => stop())
    })
  }, { scope, idle: true })

  return (
    <section id="arsenal" data-tone="dusk" ref={scope} aria-labelledby="arsenal-title" className="wrap py-24 lg:py-40">
      <SectionHead id="arsenal-title" frame="FR.05 · Arsenal" meta={<Mark mark="intensity" />}>Tools of the <em>trade.</em></SectionHead>
      <p className="label mt-6 text-ash">Shipped = used in a project above · Learning = still learning it</p>

      <div className="mt-12 space-y-10">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="skill-row">
            <h3 className="label text-ash">{group}</h3>
            <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-3">
              {items.map((s) => {
                const tag = skillLabel(s, projects)
                const color = brandColor(s)
                return (
                  <li
                    key={s}
                    style={color ? { '--brand': color } : undefined}
                    className="tile glass group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-3 text-center transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-silver/35 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <TechIcon name={s} className="size-8 text-silver/85 transition-colors duration-300 group-hover:text-[var(--brand,var(--color-silver))]" />
                    <span className="text-xs leading-tight text-silver/90">{s}</span>
                    {tag && <span className="label absolute top-2 right-2.5 text-[0.55rem] text-ash">{tag}</span>}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
