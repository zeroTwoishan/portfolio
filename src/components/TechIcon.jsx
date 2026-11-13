// Logos for the Arsenal tiles and social links. Brand marks come from Simple Icons (CC0), imported one by one
// so only these paths ship. Skills with no logo of their own get a plain drawn glyph instead of a borrowed one.
import {
  siCplusplus, siJavascript, siPython, siC, siOpenjdk, siReact, siVite, siTailwindcss, siReactrouter, siChakraui,
  siNodedotjs, siExpress, siJsonwebtokens, siMongodb, siGit, siGithubactions, siDocker, siLinux, siVercel,
  siGooglechrome, siNumpy, siPandas, siGithub, siLeetcode,
} from 'simple-icons'

const BRANDS = {
  'C++': siCplusplus, JavaScript: siJavascript, Python: siPython, C: siC, 'Java (basics)': siOpenjdk,
  React: siReact, Vite: siVite, 'Tailwind CSS': siTailwindcss, 'React Router': siReactrouter, 'Chakra UI': siChakraui,
  'Node.js': siNodedotjs, Express: siExpress, JWT: siJsonwebtokens, MongoDB: siMongodb, Git: siGit,
  'GitHub Actions': siGithubactions, Docker: siDocker, Linux: siLinux, Vercel: siVercel, 'Chrome Extensions': siGooglechrome,
  NumPy: siNumpy, pandas: siPandas, GitHub: siGithub, LeetCode: siLeetcode,
}

// Drawn on the same 24px grid. LinkedIn asked Simple Icons to remove its logo, so this is a plain "in".
const DRAWN = {
  'REST APIs': 'M8 4C6 4 6 6 6 8s-1 4-3 4c2 0 3 2 3 4s0 4 2 4M16 4c2 0 2 2 2 4s1 4 3 4c-2 0-3 2-3 4s0 4-2 4',
  'Learning ML': 'M5 6a2 2 0 1 0 0 .1M19 6a2 2 0 1 0 0 .1M12 18a2 2 0 1 0 0 .1M6.7 7l4.3 9.2M17.3 7 13 16.2M7 6h10',
  LinkedIn: 'M4 9h3.5v11H4zM5.75 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4M10 9h3.4v1.6C14 9.6 15.3 8.8 17 8.8c3 0 3.5 2 3.5 4.6V20H17v-5.8c0-1.4 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z',
  Email: 'M3 6h18v12H3zM3 6l9 7 9-7',
}

// Brand colour, unless it is too dark to see on the page (e.g. Vercel, GitHub, Express are black).
const visible = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.25
}

export const brandColor = (name) => (BRANDS[name] && visible(BRANDS[name].hex) ? `#${BRANDS[name].hex}` : null)

export default function TechIcon({ name, className = 'size-8' }) {
  const brand = BRANDS[name]
  if (brand) return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor"><path d={brand.path} /></svg>
  const filled = name === 'LinkedIn'
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={DRAWN[name]} />
    </svg>
  )
}
