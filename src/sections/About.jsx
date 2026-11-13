import { useRef } from 'react'
import { gsap, useGSAP, reveal, MOTION } from '../motion/gsap.js'
import SectionHead from '../components/SectionHead.jsx'
import Mark from '../components/Mark.jsx'
import Odometer from '../components/Odometer.jsx'
import { bio, contact } from '../data/projects.js'
import stats from '../data/stats.json' with { type: 'json' }

const { leetcode: lc, github: gh } = stats
// Difficulty split of solved problems. Each segment is labelled with its number too, so colour is never the only cue.
const split = [
  ['Easy', lc.easy, 'bg-ash-light'],
  ['Medium', lc.medium, 'bg-safelight-bright'],
  ['Hard', lc.hard, 'bg-rose'],
]

// The frame-counter board: only numbers that update themselves (stats.json), never typed by hand.
// PR counts appear once the daily job has fetched them with its token (see scripts/fetch-stats.mjs).
const board = [
  ['LeetCode problems solved', lc.solved],
  ['GitHub contributions, last year', gh.contributionsLastYear],
  ...(gh.prsAuthored ? [['Pull requests authored', gh.prsAuthored], ['Merged into main', gh.prsMerged]] : []),
  ['Public repos', gh.publicRepos],
]

// A year of activity, one square per day, a column per week (the GitHub layout). Levels 0–4 set the opacity.
const SHADE = ['bg-silver/[0.07]', 'opacity-35', 'opacity-55', 'opacity-80', '']
function Heatmap({ title, summary, heat, color }) {
  return (
    <figure className="min-w-0">
      <figcaption className="flex items-baseline justify-between gap-4 text-sm">
        <span className="label text-silver">{title}</span>
        <span className="text-ash">{summary}</span>
      </figcaption>
      {/* Phones: fixed-size squares, clipped to the most recent months. Desktop: the whole year, fluid. */}
      <div aria-hidden="true" className="mt-3 flex justify-end overflow-hidden">
        <div className="heat grid shrink-0 auto-cols-[9px] grid-flow-col grid-rows-7 gap-[3px] lg:w-full lg:auto-cols-fr">
          {heat.levels.split('').map((level, i) => (
            <span
              key={i}
              style={i === 0 ? { gridRowStart: new Date(heat.start).getUTCDay() + 1 } : undefined}
              className={`aspect-square rounded-[2px] ${level === '0' ? SHADE[0] : `${color} ${SHADE[level]}`}`}
            />
          ))}
        </div>
      </div>
    </figure>
  )
}

export default function About() {
  const scope = useRef(null)

  useGSAP(() => {
    gsap.matchMedia().add(MOTION, () => {
      const $ = (s) => scope.current.querySelector(s)
      // Whole paragraphs, not split lines: body text wraps differently once the fonts load.
      const copy = gsap.from('.about-copy > *', { opacity: 0.15, y: 12, duration: 0.8, stagger: 0.15, ease: 'power2.out', paused: true })
      const panel = gsap.timeline({ paused: true })
        .from('.odo-strip', { y: 0, duration: 1.4, stagger: 0.06, ease: 'power3.out', clearProps: 'transform' }) // roll up from 0, then hand back to CSS
        .from('.split-bar > span', { scaleX: 0, transformOrigin: 'left', duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.1)
        .from('.heat > span', { scale: 0, duration: 0.4, ease: 'power2.out', stagger: { amount: 1, grid: 'auto', from: 'start' } }, 0.2)
      const stops = [reveal($('.about-copy'), () => copy.play()), reveal($('.exposure'), () => panel.play())]
      return () => stops.forEach((stop) => stop())
    })
  }, { scope, idle: true })

  return (
    <section id="about" data-tone="rose" ref={scope} aria-labelledby="about-title" className="wrap py-24 lg:py-40">
      <SectionHead id="about-title" frame="FR.03 · About" meta={<Mark mark="will" />}>Behind the <em>lens.</em></SectionHead>

      <div className="mt-12 space-y-12">
        <div className="about-copy space-y-10">
          <p className="text-lg leading-relaxed text-silver/90">{bio.about}</p>
          <blockquote className="border-l-2 border-safelight-bright pl-6 font-display text-2xl leading-snug md:text-3xl">
            {bio.approach}
          </blockquote>
        </div>

        <aside aria-labelledby="exposure-title" className="exposure glass rounded-3xl p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 id="exposure-title" className="label text-silver">Exposure data</h3>
            <p className="label text-ash">Updated {gh.updatedAt}</p>
          </div>

          <dl className="mt-6 lg:grid lg:grid-cols-2 lg:gap-x-16">
            {board.map(([label, n]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-silver/10 py-4">
                <dt className="label max-w-[7rem] text-ash sm:max-w-[9rem]">{label}</dt>
                <dd><Odometer value={n} /></dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <p className="text-sm text-ash">
              LeetCode by difficulty, almost all in C++ ·{' '}
              <a href={contact.leetcode} target="_blank" rel="noreferrer" className="text-silver underline-offset-4 hover:underline">
                profile ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <div aria-hidden="true" className="split-bar mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full">
              {split.map(([name, n, color]) => <span key={name} className={color} style={{ flexGrow: n }} />)}
            </div>
            <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {split.map(([name, n, color]) => (
                <div key={name} className="flex items-center gap-2">
                  <span aria-hidden="true" className={`size-2 rounded-full ${color}`} />
                  <dt className="text-ash">{name}</dt>
                  <dd className="text-silver">{n}</dd>
                </div>
              ))}
            </dl>
          </div>

          {gh.heat && lc.heat && (
            <div className="mt-8 grid gap-8 border-t border-silver/10 pt-6 lg:grid-cols-2 lg:gap-x-16">
              <Heatmap title="GitHub" summary="daily contributions" heat={gh.heat} color="bg-safelight-bright" />
              <Heatmap title="LeetCode" summary="daily submissions" heat={lc.heat} color="bg-[#ffa116]" />
            </div>
          )}

          <p className="mt-8 border-t border-silver/10 pt-6 text-sm text-silver/90">
            B.Tech Instrumentation and Control
            <span className="block text-ash">NIT Jalandhar · Class of 2029</span>
          </p>
        </aside>
      </div>
    </section>
  )
}
