// Puts the server-rendered page into dist/index.html, so the content works without JavaScript
// and the hero paints before any JS loads. Runs after the client and SSR builds (see package.json).
import { readFile, writeFile, rm, readdir } from 'node:fs/promises'

const { render } = await import('../dist-ssr/entry-server.js')
let page = await readFile('dist/index.html', 'utf8')
if (!page.includes('<!--app-->')) throw new Error('dist/index.html is missing the <!--app--> placeholder')

// Preload the three fonts the first screen needs (poster headline, its serif italic accent, body). Their names are hashed by Vite,
// so look them up; late font swaps otherwise relayout the whole page on slow phones.
const assets = await readdir('dist/assets')
const fonts = [
  /^instrument-serif-latin-400-italic-.*\.woff2$/,
  /^big-shoulders-display-latin-wght-normal-.*\.woff2$/,
  /^hanken-grotesk-latin-wght-normal-.*\.woff2$/,
].map((re) => {
  const file = assets.find((f) => re.test(f))
  if (!file) throw new Error(`font for ${re} not found in dist/assets`)
  return `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`
})
page = page.replace('</title>', `</title>\n    ${fonts.join('\n    ')}`)

// Social cards and structured data, from the same data the page uses. Link previews need absolute URLs,
// so canonical, og:url and og:image appear only once bio.siteUrl is a real address.
const { bio, contact } = await import('../src/data/projects.js')
const site = bio.siteUrl.includes('TODO') ? null : bio.siteUrl.replace(/\/$/, '')
const title = page.match(/<title>([^<]*)<\/title>/)[1]
const description = page.match(/<meta\s+name="description"\s+content="([^"]*)"/)[1]
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: bio.name,
  jobTitle: bio.role,
  affiliation: { '@type': 'CollegeOrUniversity', name: 'NIT Jalandhar' },
  sameAs: [contact.github, contact.linkedin, contact.leetcode],
  ...(site && { url: `${site}/`, image: `${site}/og.jpg` }),
}
const head = [
  '<meta property="og:type" content="website" />',
  `<meta property="og:title" content="${title}" />`,
  `<meta property="og:description" content="${description}" />`,
  '<meta name="twitter:card" content="summary_large_image" />',
  ...(site
    ? [
        `<link rel="canonical" href="${site}/" />`,
        `<meta property="og:url" content="${site}/" />`,
        `<meta property="og:image" content="${site}/og.jpg" />`,
        '<meta property="og:image:width" content="1200" />',
        '<meta property="og:image:height" content="630" />',
        `<meta property="og:image:alt" content="${bio.name}: I build things. And make them work." />`,
      ]
    : []),
  `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`,
]
if (!site) console.warn('bio.siteUrl is still a placeholder: canonical, og:url and og:image are left out')
page = page.replace('</head>', `  ${head.join('\n    ')}\n  </head>`)

await writeFile('dist/index.html', page.replace('<!--app-->', render()))
await rm('dist-ssr', { recursive: true })
console.log('Prerendered dist/index.html')
