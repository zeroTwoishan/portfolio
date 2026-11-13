import { useRef, useState } from 'react'
import { MagneticA } from '../components/Magnetic.jsx'
import { gsap, SplitText, useGSAP, reveal, MOTION } from '../motion/gsap.js'
import { bio, contact } from '../data/projects.js'
import { MARKS, useExposures } from '../motion/exposures.js'
import ContactForm from '../components/ContactForm.jsx'

// Shown once all four marks are found. Draft line, Ishan may edit.
const MESSAGE = 'Will to start. Loyalty to finish. Intensity in between. And when it fails — restart.'

function Revelation() {
  const scope = useRef(null)
  useGSAP(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.from(scope.current, { opacity: 0, y: reduce ? 0 : 12, duration: reduce ? 0.3 : 0.9, ease: 'power2.out' })
  }, { scope })
  return (
    <p ref={scope} className="mt-8 max-w-3xl">
      <span className="label block text-ash">Will · Loyalty · Intensity · Restart</span>
      <span className="mt-2 block font-display text-2xl italic md:text-3xl">{MESSAGE}</span>
    </p>
  )
}


export default function Contact() {
  const scope = useRef(null)
  const [copied, setCopied] = useState(false)
  const found = useExposures().size

  useGSAP((ctx, contextSafe) => {
    // Split only when the heading arrives: fonts have loaded by then, so the breaks match the real text.
    // (Creating triggers inside an autoSplit callback can run mid-refresh and crash ScrollTrigger.)
    const mm = gsap.matchMedia()
    mm.add(MOTION, () =>
      reveal(scope.current.querySelector('.contact-title'), contextSafe(() => {
        const split = SplitText.create('.contact-title', { type: 'words,chars' }) // words keep letters from wrapping mid-word
        gsap.from(split.chars, { opacity: 0, y: 24, duration: 1, stagger: 0.015, ease: 'expo.out', onComplete: () => split.revert() })
      })))
    // C2: the final safelight brightens as the last frame arrives.
    mm.add(MOTION, () => {
      gsap.fromTo('.contact-glow', { opacity: 0.2, scale: 1.2 }, {
        opacity: 1, scale: 1, ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top bottom', end: 'center center', scrub: true },
      })
    })
  }, { scope, idle: true })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (permissions, insecure origin); the mailto link above still works.
    }
  }

  return (
    <section id="contact" data-tone="signal" ref={scope} aria-labelledby="contact-title" className="relative isolate overflow-hidden py-24 lg:py-40">
      <div aria-hidden="true" className="contact-glow absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_30%_40%,rgb(146_45_48/0.22),transparent)]" />
      <div className="wrap">
        <p className="label text-ash">FR.06 · Contact</p>
        <h2 id="contact-title" className="contact-title mt-4 max-w-5xl poster text-[clamp(3rem,8vw,7.5rem)] leading-[0.95]">
          Every story needs a final <em>frame.</em>
        </h2>

        {found === MARKS.length && <Revelation />}

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a href={`mailto:${contact.email}`} className="text-xl underline underline-offset-4 hover:decoration-safelight-bright md:text-2xl">
            {contact.email}
          </a>
          <button type="button" onClick={copy} className="label glass rounded-full px-4 py-2 text-ash hover:text-silver">
            {copied ? 'Copied' : 'Copy'}
          </button>
          <span aria-live="polite" className="sr-only">{copied ? 'Email copied to clipboard' : ''}</span>
        </div>


        {/* Closing call to action, then the form. */}
        <div className="mt-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="font-display text-4xl leading-tight md:text-6xl">
            Got an idea?<br />
            <em className="text-silver/80">Let's develop it together.</em>
          </p>
          <div className="flex flex-wrap gap-3">
            <MagneticA href={`mailto:${contact.email}`} className="group inline-flex items-center gap-2 rounded-full bg-silver px-6 py-3 font-medium text-obsidian">
              Email me <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none">→</span>
            </MagneticA>
            <MagneticA href="/resume.pdf" target="_blank" rel="noreferrer" className="rounded-full border border-silver/25 px-6 py-3 transition-colors hover:bg-silver/10">
              Résumé<span className="sr-only"> (opens in a new tab)</span>
            </MagneticA>
          </div>
        </div>

        <ContactForm />

        {bio.openTo && (
          <p className="label mt-10 text-ash">
            <span aria-hidden="true" className="mr-2 inline-block size-1.5 rounded-full bg-safelight-bright align-middle" />
            {bio.openTo}
          </p>
        )}
        <p aria-live="polite" className="label mt-10 text-ash">{found > 0 && `Exposures ${found}/${MARKS.length}`}</p>
      </div>
    </section>
  )
}
