/* global __BUILD_DATE__ */
import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, reveal, MOTION } from '../motion/gsap.js'
import SectionHead from '../components/SectionHead.jsx'
import { Glyph } from '../components/Mark.jsx'
import { develop, useExposures } from '../motion/exposures.js'
import { bio, story, lessons } from '../data/projects.js'
import { logStatus } from '../data/derive.js'

const { lat, lng } = bio.coords
const coords = (d) => `${lat.toFixed(d)}° N · ${lng.toFixed(d)}° E`
const pad = (n) => String(n).padStart(2, '0')

// One list for the timeline: milestones, then lessons. Each entry tints the living background as it passes.
const TONES = ['amber', 'moss', 'plum', 'dusk']
const entries = [
  ...story.map((s) => ({ key: s.when, when: s.when, year: s.when.match(/\d{4}/)[0], title: s.what, status: logStatus(s.when, __BUILD_DATE__) })),
  ...lessons.map((l) => ({ key: l.title, when: 'Lesson', year: 'Note', title: l.title, lesson: l })),
]

export default function Journal() {
  const scope = useRef(null)
  const [attempt, setAttempt] = useState(1)
  const [active, setActive] = useState(0)

  // The entry crossing the middle of the screen drives the pinned panel (date, counter, film strip).
  useEffect(() => {
    const io = new IntersectionObserver((list) => {
      const hit = list.find((e) => e.isIntersecting)
      if (hit) setActive(Number(hit.target.dataset.index))
    }, { rootMargin: '-50% 0px -50% 0px' })
    scope.current.querySelectorAll('.entry').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  const restartFound = useExposures().has('restart')

  const { contextSafe } = useGSAP(() => {
    gsap.matchMedia().add(MOTION, () => {
      const stops = gsap.utils.toArray('.entry', scope.current).map((entry) => {
        const tl = gsap.timeline({ paused: true })
          .from(entry.querySelector('.log'), { opacity: 0, duration: 0.25 })
          .from(entry.querySelector('.body'), { x: -16, opacity: 0, duration: 0.5, ease: 'power2.out' }, '<0.1')
        return reveal(entry, () => tl.play(), '0px 0px -15% 0px')
      })
      return () => stops.forEach((stop) => stop())
    })
  }, { scope, idle: true })

  // Egg 2 ("Again. But better."): replays the latest entry's reveal. Never scrolls or moves focus.
  const restart = contextSafe(() => {
    develop('restart')
    setAttempt((n) => n + 1)
    const entries = scope.current.querySelectorAll('.entry')
    const latest = entries[story.length - 1].querySelector('.body')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.killTweensOf([latest, '.again'])
    if (reduce) {
      gsap.fromTo(latest, { opacity: 0.2 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo('.again', { opacity: 1 }, { opacity: 0, delay: 1.5, duration: 0.2 })
      return
    }
    gsap.timeline()
      .fromTo(latest, { opacity: 0.15, x: -16 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' })
      .fromTo('.again', { opacity: 1, clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'steps(18)' }, 0)
      .to('.again', { opacity: 0, duration: 0.3 }, 2.2)
  })

  return (
    <section id="journal" data-tone="amber" ref={scope} aria-labelledby="journal-title" className="tactical-grid wrap py-24 lg:py-40">
      <SectionHead
        id="journal-title"
        frame="FR.04 · Journal"
        meta={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span aria-hidden="true" className="again opacity-0">Again. But better.</span>
            <span aria-live="polite">Attempt {pad(attempt)}</span>
            <button
              type="button"
              aria-label="Replay latest entry"
              onClick={restart}
              className={`p-1.5 transition-colors duration-400 hover:text-silver ${restartFound ? 'text-silver' : 'text-ash'}`}
            >
              <Glyph mark="restart" />
            </button>
            <span className="hidden md:inline">{coords(4)}</span>
            <span className="md:hidden">{coords(2)}</span>
            {' '}· Logged {__BUILD_DATE__}
          </span>
        }
      >
        Notes from the <em>process.</em>
      </SectionHead>

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Pinned panel (desktop): like a film reel, it advances one frame per entry. */}
        <aside aria-hidden="true" className="glass sticky top-24 hidden h-[min(72vh,620px)] overflow-hidden rounded-3xl lg:col-span-5 lg:block">
          <div
            className="absolute inset-y-0 left-0 w-10 border-r border-silver/10 bg-[repeating-linear-gradient(180deg,transparent_0_14px,rgb(234_229_220/0.14)_14px_26px,transparent_26px_40px)] bg-[length:12px_40px] bg-center bg-repeat-y transition-[background-position] duration-700 ease-out motion-reduce:transition-none"
            style={{ backgroundPositionY: `${active * -120}px` }}
          />
          <div className="flex h-full flex-col justify-between py-10 pr-10 pl-16">
            <p className="label text-ash">Rewind the reel</p>
            <div>
              <p key={entries[active].year} className="big-date poster text-[8.5rem] leading-none xl:text-[10rem]">{entries[active].year}</p>
              <p className="label mt-4 text-silver">{entries[active].when}{entries[active].status && ` · ${entries[active].status}`}</p>
            </div>
            <div>
              <p className="label text-ash">Log <span className="text-silver">{pad(active + 1)}</span> / {pad(entries.length)}</p>
              <div className="mt-3 h-px w-48 bg-silver/15">
                <div className="h-px origin-left bg-safelight-bright transition-transform duration-500 motion-reduce:transition-none" style={{ transform: `scaleX(${(active + 1) / entries.length})` }} />
              </div>
            </div>
          </div>
        </aside>

        <ol className="relative border-l border-safelight pl-6 lg:col-span-7 lg:border-silver/15 lg:pl-10">
          {entries.map((e, i) => (
            <li
              key={e.key}
              data-index={i}
              data-tone={TONES[i % TONES.length]}
              className={`entry relative py-8 transition-opacity duration-500 lg:flex lg:min-h-[45vh] lg:flex-col lg:justify-center lg:py-0 ${active === i ? '' : 'lg:opacity-35'}`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-9 -left-[1.85rem] size-2.5 rounded-full lg:top-1/2 lg:-left-[2.85rem] ${active === i ? 'bg-safelight-bright shadow-[0_0_0_6px_rgb(196_71_74/0.2)]' : 'bg-silver/30'}`}
              />
              <p className="log label text-ash">Log {pad(i + 1)} · {e.when}{e.status && ` · Status: ${e.status}`}</p>
              {e.lesson ? (
                <details className="body mt-2 max-w-2xl">
                  <summary className="cursor-pointer font-display text-3xl md:text-4xl"><h3 className="inline">{e.title}</h3></summary>
                  <p className="mt-3 text-ash">{e.lesson.what}</p>
                  <p className="mt-2">{e.lesson.learned}</p>
                </details>
              ) : (
                <h3 className="body mt-2 max-w-2xl font-display text-3xl leading-tight md:text-4xl">{e.title}</h3>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
