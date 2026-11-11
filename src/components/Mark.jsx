import { develop, useExposures } from '../motion/exposures.js'

// Original 14px glyphs. They read as frame-edge marks and are never explained in the UI.
export const GLYPHS = {
  will: <><circle cx="4" cy="7" r="2.5" /><path d="M6.5 7H13M10.5 7v2.5M12.5 7v2" /></>,
  loyalty: <path d="M1 10c3 0 4-7 7-7s2.5 5 0 6-3-3 0-4 5 4 5 5" />,
  intensity: <path d="M3 12c0-5 2-8 3.5-10M11 12c0-5-2-8-3.5-10" />,
  restart: <><path d="M11.6 4.5A5 5 0 1 0 12 9" /><path d="M12 1.5V5H8.5" /></>,
}
const FOUND = { will: 'text-silver', loyalty: 'text-silver', intensity: 'text-rose', restart: 'text-silver' }
const NAMES = { will: 'Will', loyalty: 'Loyalty', intensity: 'Intensity', restart: 'Restart' }

export function Glyph({ mark }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      {GLYPHS[mark]}
    </svg>
  )
}

// A mark the visitor can "develop". RESTART lives in the Journal as the Restart button instead.
export default function Mark({ mark }) {
  const found = useExposures().has(mark)
  return (
    <button
      type="button"
      aria-label={`Develop exposure: ${NAMES[mark]}`}
      aria-pressed={found}
      onClick={() => develop(mark)}
      className={`p-1.5 transition-colors duration-400 hover:text-silver ${found ? FOUND[mark] : 'text-ash'}`}
    >
      <Glyph mark={mark} />
    </button>
  )
}
