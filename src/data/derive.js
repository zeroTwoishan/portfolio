// Labels computed from the data, so nothing on the page is typed by hand.

// "React 19" → "React", "Tailwind CSS v4" → "Tailwind CSS", "Chrome Extensions (Manifest V3)" → "Chrome Extensions"
export const baseName = (s) => s.replace(/\s*\(.*\)$/, '').replace(/\s+v?\d+$/, '')

// "Shipped" if a featured project uses it, "Learning" if the item says so itself, otherwise no label.
export function skillLabel(item, projects) {
  if (/learning|basics/i.test(item)) return 'Learning'
  const used = new Set(projects.flatMap((p) => p.stack.map(baseName)))
  return used.has(baseName(item)) ? 'Shipped' : null
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// Status as of the build date: the month the entry ends in is "Ongoing" if it's the build month, else "Complete".
// `when` is "2025", "Aug 2026" or a range like "Jun–Jul 2026" (the last month counts).
export function logStatus(when, buildDate) {
  const year = Number(when.match(/(\d{4})\s*$/)[1])
  const month = MONTHS.indexOf((when.match(/([A-Za-z]{3})[a-z]*\s+\d{4}\s*$/)?.[1] ?? 'dec').toLowerCase())
  const built = new Date(buildDate)
  return year === built.getUTCFullYear() && month === built.getUTCMonth() ? 'Ongoing' : 'Complete'
}
