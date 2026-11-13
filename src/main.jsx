import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/big-shoulders-display'
import '@fontsource-variable/hanken-grotesk/wght.css'
import '@fontsource-variable/martian-mono/wght.css'
import './styles/index.css'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { load as loadExposures } from './motion/exposures.js'

loadExposures() // found Easter-egg marks from earlier visits; applied right after hydration

// Tell the safety net in index.html that motion is starting. If it already fired, html.js is gone and
// components skip their entrances.
const html = document.documentElement.classList
if (html.contains('js')) html.add('motion-ready')

const root = document.getElementById('root')
// Built pages arrive prerendered (scripts/prerender.mjs); the dev server serves an empty root.
if (root.firstElementChild) hydrateRoot(root, <App />)
else createRoot(root).render(<App />)
