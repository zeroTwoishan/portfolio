// A mechanical frame counter: one glass tile per digit, each digit a strip of 0–9 rolled to its value.
// The prerendered HTML already shows the final number (no JS needed); About.jsx rolls the strips up
// from 0 when the panel scrolls into view (the resting position is the .odo-strip rule in index.css). Screen readers get the plain number.
export default function Odometer({ value, tiles = 4 }) {
  const digits = String(value).padStart(tiles, ' ').split('')
  return (
    <span className="inline-flex gap-1.5">
      <span className="sr-only">{value}</span>
      {digits.map((d, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="relative block h-12 w-9 border border-silver/15 bg-silver/[0.06] shadow-[inset_0_1px_0_rgb(234_229_220/0.15)] overflow-hidden rounded-lg font-mono text-2xl leading-[3rem] text-silver sm:h-14 sm:w-11 sm:text-3xl sm:leading-[3.5rem] md:h-16 md:w-12 md:text-4xl md:leading-[4rem]"
        >
          {d !== ' ' && (
            <span className="odo-strip block text-center" style={{ '--d': d }}>
              {'0123456789'.split('').map((n) => <span key={n} className="block">{n}</span>)}
            </span>
          )}
          {/* The counter window's hairline, in safelight red. */}
          <span className="absolute inset-x-0 top-1/2 h-px bg-safelight/70" />
        </span>
      ))}
    </span>
  )
}
