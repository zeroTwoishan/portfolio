import { useEffect, useRef, useState } from 'react'
import { useMagnetic } from './Magnetic.jsx'
import TechIcon from './TechIcon.jsx'
import { bio, contact } from '../data/projects.js'

export const SOCIAL = [
  ['GitHub', contact.github],
  ['LinkedIn', contact.linkedin],
  ['LeetCode', contact.leetcode],
]

// Brand colours shown on hover/focus. GitHub's mark is white on dark backgrounds.
const BRAND = { GitHub: '#f0f6fc', LinkedIn: '#0a66c2', LeetCode: '#ffa116', Email: '#c4474a' }

// Magnetic pull (useMagnetic): on a mouse the button leans toward the cursor; others get the colour change only.
function MagneticLink({ name, href }) {
  const ref = useRef(null)
  useMagnetic(ref)

  const email = name === 'Email'
  return (
    <a
      ref={ref}
      href={href}
      target={email ? undefined : '_blank'}
      rel="noreferrer"
      aria-label={email ? `Email ${contact.email}` : `${name} (opens in a new tab)`}
      style={{ '--brand': BRAND[name] }}
      className="grid size-12 place-items-center rounded-full text-ash ring-1 ring-transparent transition-[color,background-color,box-shadow] duration-300 hover:bg-[color-mix(in_srgb,var(--brand)_16%,transparent)] hover:text-[var(--brand)] hover:ring-[color-mix(in_srgb,var(--brand)_45%,transparent)] focus-visible:text-[var(--brand)]"
    >
      <TechIcon name={name} className="size-6" />
    </a>
  )
}

// Fixed icon rail on the left edge (desktop), like a film edge: GitHub, LinkedIn, LeetCode, Email.
export function SocialRail() {
  // The footer repeats these links, so the rail fades away (and leaves the tab order) while it is on screen.
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting))
    io.observe(document.querySelector('footer'))
    return () => io.disconnect()
  }, [])
  return (
    <nav aria-label="Profiles" inert={hidden} className={`fixed bottom-8 left-5 z-40 hidden flex-col items-center gap-2 transition-opacity duration-700 lg:flex ${hidden ? 'opacity-0' : ''}`}>
      {[...SOCIAL, ['Email', `mailto:${contact.email}`]].map(([name, href]) => (
        <MagneticLink key={name} name={name} href={href} />
      ))}
      <span aria-hidden="true" className="mt-2 h-20 w-px bg-silver/20" />
    </nav>
  )
}

const Arrow = () => <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none">↗</span>

export default function Footer() {
  return (
    <footer data-tone="signal" className="wrap pt-20 pb-12">
      <p className="font-display text-[clamp(3.25rem,11vw,9.5rem)] leading-none">{bio.name}</p>
      <div className="mt-14 grid gap-12 border-t border-silver/10 pt-10 md:grid-cols-3">
        <dl className="space-y-6">
          <div>
            <dt className="label text-ash">Email</dt>
            <dd className="mt-2"><a href={`mailto:${contact.email}`} className="break-all hover:text-silver hover:underline">{contact.email}</a></dd>
          </div>
          <div>
            <dt className="label text-ash">Location</dt>
            <dd className="mt-2">NIT Jalandhar, Punjab, India</dd>
          </div>
        </dl>
        <div>
          <h2 className="label text-ash">Social</h2>
          <ul className="mt-2">
            {[...SOCIAL, ['Résumé', '/resume.pdf']].map(([name, href]) => (
              <li key={name}>
                <a href={href} target="_blank" rel="noreferrer" className="group inline-flex min-w-48 items-center justify-between gap-6 border-b border-silver/30 py-2 font-display text-3xl transition-colors hover:border-safelight-bright">
                  {name} <Arrow /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <p className="text-2xl leading-snug">
            Designed and developed<br />by <span className="text-safelight-bright">{bio.name}</span>
          </p>
          <p className="label flex items-center gap-3 text-ash">
            <span aria-hidden="true" className="rounded-full border border-silver/25 px-2 py-1 text-silver">IK</span>
            © 2026 · Beyond the frame. · FR.06 · End of roll
          </p>
        </div>
      </div>
    </footer>
  )
}
