import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, reveal, MOTION, DESKTOP_MOTION } from '../motion/gsap.js'
import SectionHead from '../components/SectionHead.jsx'
import Mark from '../components/Mark.jsx'
import Print from '../components/Print.jsx'
import { projects } from '../data/projects.js'

const frameNo = (i) => `${String(i + 1).padStart(2, '0')}A`

export default function Work() {
  const scope = useRef(null)

  useGSAP(() => {
    gsap.matchMedia().add(MOTION, () => {
      const stops = gsap.utils.toArray('.print', scope.current).map((print) => {
        const tl = gsap.timeline({ paused: true })
          // W2: the image is revealed top → down while it settles from a slight zoom.
          .from(print.querySelector('.print-img'), { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.out' })
          .from(print.querySelector('.print-img > :first-child'), { scale: 1.15, duration: 1.1, ease: 'expo.out' }, 0)
          // W4: the metadata rules draw in.
          .from(print.querySelectorAll('.rule'), { scaleX: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out' }, 0)
        return reveal(print, () => tl.play())
      })
      return () => stops.forEach((stop) => stop())
    })

    const mm = gsap.matchMedia()
    // W3 (desktop): each print develops as it travels to the middle of the screen.
    mm.add(DESKTOP_MOTION, () => {
      gsap.utils.toArray('.print-img', scope.current).forEach((frame) => {
        gsap.fromTo(frame.querySelector('.develop'), { opacity: 0.7 }, {
          opacity: 0, ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'center center', scrub: true },
        })
      })
      // W5: projects with an animated preview play it only while on screen.
      const resets = gsap.utils.toArray('.print-img[data-preview]', scope.current).map((frame) => {
        const img = frame.querySelector('img')
        const source = frame.querySelector('source')
        const poster = { src: img.src, srcset: img.srcset, source: source.srcset }
        const show = (on) => {
          img.srcset = on ? '' : poster.srcset
          img.src = on ? frame.dataset.preview : poster.src
          source.srcset = on ? frame.dataset.preview : poster.source
        }
        ScrollTrigger.create({ trigger: frame, start: 'top bottom', end: 'bottom top', onToggle: (self) => show(self.isActive) })
        return () => show(false)
      })
      return () => resets.forEach((reset) => reset())
    })
    // W3 (mobile): a one-shot develop on enter.
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const stops = gsap.utils.toArray('.develop', scope.current).map((layer) => {
        const tween = gsap.fromTo(layer, { opacity: 0.7 }, { opacity: 0, duration: 1, paused: true })
        return reveal(layer, () => tween.play())
      })
      return () => stops.forEach((stop) => stop())
    })
  }, { scope, idle: true })

  return (
    <section id="work" data-tone="steel" ref={scope} aria-labelledby="work-title" className="wrap py-24 lg:py-40">
      <SectionHead id="work-title" frame="FR.02 · Work" meta={<Mark mark="loyalty" />}>Developed, not just <em>designed.</em></SectionHead>

      {/* Jump links to each project card: plain anchors, no scroll-jacking. */}
      <nav aria-label="Projects" className="mt-10">
        <ol className="flex flex-wrap gap-2">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <a href={`#${p.slug}`} className="glass inline-flex items-center gap-2.5 rounded-full py-2 pr-4 pl-3 text-sm text-silver/85 transition-colors hover:text-silver">
                <span className="label text-[0.6875rem] text-ash">{String(i + 1).padStart(2, '0')}</span>{' '}
                {p.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-16 space-y-10 lg:space-y-16">
        {projects.map((p, i) => <Print key={p.slug} project={p} frame={frameNo(i)} flip={i % 2 === 1} />)}
      </div>
    </section>
  )
}
