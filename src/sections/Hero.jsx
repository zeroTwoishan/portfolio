import { useRef } from 'react'
import { MagneticA } from '../components/Magnetic.jsx'
import { gsap, SplitText, useGSAP, MOTION } from '../motion/gsap.js'
import RoleFlip from '../components/RoleFlip.jsx'
import { bio } from '../data/projects.js'

const srcset = (ext) => [480, 720, 1086].map((w) => `/media/portrait/ishan-edit-${w}.${ext} ${w}w`).join(', ')
const sizes = '(min-width: 1024px) 54vw, 100vw'
// On phones the browser picks a tighter 4:5 head-and-shoulders crop of the same photo (art direction).
const crop = (ext) => [480, 760].map((w) => `/media/portrait/ishan-crop-${w}.${ext} ${w}w`).join(', ')
const SMALL = '(max-width: 767px)' // phones; tablets use the full photo, which already has room around the face
const cropSizes = '100vw'

export default function Hero() {
  const scope = useRef(null)

  useGSAP(() => {
    const html = document.documentElement
    if (!html.classList.contains('js')) return // the safety net already fired: everything is in its final state

    const mm = gsap.matchMedia()

    mm.add(MOTION, () => {
      // Switch the CSS hiding rule off in the same task, before the tweens read the elements' styles.
      html.classList.add('hero-live')

      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .from('.hero-meta', { y: 12, opacity: 0, duration: 0.5, stagger: 0.05 }, 0.7)
      // autoSplit re-splits if the display font loads mid-entrance, so masked lines never break wrongly.
      SplitText.create('.hero-title', {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 0.9, delay: 0.15, stagger: 0.08, ease: 'expo.out' }),
      })
    })
  }, { scope })

  return (
    <section
      id="top"
      data-tone="ember"
      ref={scope}
      aria-labelledby="hero-title"
      className="wrap relative grid gap-y-8 pb-20 lg:min-h-svh lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:pt-36"
    >
      <div className="relative z-10 -mt-[30vw] md:-mt-[16vw] lg:col-span-7 lg:mt-0">
        <p className="hero-meta reveal label text-ash">Ishan Keshari · Portfolio / 2026</p>
        <h1 id="hero-title" className="hero-title reveal mt-6 font-display text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.95]">
          I build things.<br />
          <em>And make them work.</em>
        </h1>
        <RoleFlip className="hero-meta reveal mt-8" />
      </div>

      {/* Poster photo: full-bleed on every screen. Phones/tablets: on top, fading out at the bottom. Desktop: the
          right half of the screen from the top edge, fading into the headline (left) and the page (bottom). */}
      <figure className="relative order-first -mx-5 md:-mx-10 lg:absolute lg:inset-y-0 lg:right-[calc(50%-50vw)] lg:mx-0 lg:w-[54vw]">
        <div className="relative aspect-[4/5] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_50%,transparent_96%)] md:aspect-[4/3] lg:aspect-auto lg:h-full lg:[mask-composite:intersect] lg:[mask-image:linear-gradient(to_right,transparent,#000_45%),linear-gradient(to_bottom,#000_70%,transparent)]">
          <picture>
            <source media={SMALL} type="image/avif" srcSet={crop('avif')} sizes={cropSizes} />
            <source media={SMALL} type="image/webp" srcSet={crop('webp')} sizes={cropSizes} />
            <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
            <img
              src={bio.photo}
              srcSet={srcset('webp')}
              sizes={sizes}
              width="1086"
              height="1448"
              fetchPriority="high"
              alt={`Portrait of ${bio.name}, lit in red against a dark background`}
              className="size-full object-cover object-top lg:object-[50%_30%]"
            />
          </picture>
        </div>
      </figure>

      <div className="lg:col-span-7 lg:self-end">
        <p className="hero-meta reveal max-w-xl text-ash">{bio.pitch}</p>
        <div className="hero-meta reveal mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a href="#work" className="group glass rounded-full px-6 py-3 text-center text-silver">
            Explore my work <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none">→</span>
          </a>
          <MagneticA href="/resume.pdf" className="rounded-full border border-silver/20 px-6 py-3 text-center transition-colors hover:bg-silver/10">Résumé</MagneticA>
        </div>
        <p className="hero-meta reveal label mt-10 text-ash">{bio.role} │ NIT Jalandhar</p>
        {bio.openTo && (
          <p className="hero-meta reveal mt-3 max-w-xl text-[0.9375rem] text-silver/85">
            <span aria-hidden="true" className="mr-2 inline-block size-1.5 rounded-full bg-safelight-bright align-middle" />
            {bio.openTo}
          </p>
        )}
        <p aria-hidden="true" className="scroll-cue label mt-10 hidden items-center gap-3 text-ash lg:flex">
          Scroll <span className="relative block h-px w-16 overflow-hidden bg-line"><span className="absolute inset-y-0 left-0 w-4 bg-silver" /></span>
        </p>
      </div>
    </section>
  )
}
