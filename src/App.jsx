import { useRef } from 'react'
import { gsap, useGSAP, DESKTOP_MOTION } from './motion/gsap.js'
import Nav from './components/Nav.jsx'
import Backdrop from './components/Backdrop.jsx'
import Cursor from './components/Cursor.jsx'
import Footer, { SocialRail } from './components/Footer.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Work from './sections/Work.jsx'
import Arsenal from './sections/Arsenal.jsx'
import Journal from './sections/Journal.jsx'
import Contact from './sections/Contact.jsx'
import { bio } from './data/projects.js'

export default function App() {
  const spine = useRef(null)

  // R1: the red line draws down the gutter as you read (desktop; it is fully drawn without JS).
  useGSAP(() => {
    gsap.matchMedia().add(DESKTOP_MOTION, () => {
      gsap.fromTo('.red-line', { scaleY: 0 }, {
        scaleY: 1, ease: 'none', transformOrigin: 'top',
        scrollTrigger: { trigger: spine.current, start: 'top 60%', end: 'bottom bottom', scrub: true },
      })
    })
  }, { scope: spine, idle: true })

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-silver focus:px-4 focus:py-2 focus:text-obsidian">
        Skip to content
      </a>
      {/* Refraction for .glass in Chromium: a slow, wide displacement reads as thick liquid glass. */}
      <svg aria-hidden="true" className="absolute size-0">
        <filter id="liquid" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Backdrop />
      <Cursor />
      <Nav />
      <SocialRail />
      <main id="main">
        <Hero />
        {/* One continuous red line in the left gutter, from About to Contact (desktop). */}
        <div ref={spine} className="relative">
          <span aria-hidden="true" className="red-line absolute inset-y-0 left-[calc(max((100%-1384px)/2,0px)+36px)] hidden w-px bg-safelight lg:block" />
          {/* Karan's order, with About (the numbers) before the story. */}
          <Work />
          <About />
          <Journal />
          <Arsenal />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}
