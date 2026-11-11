// Renders scripts/og.html to public/og.jpg (1200×630) with headless Chrome, plus the 180px touch icon.
// Run with `npm run og` after changing the portrait, the headline or the favicon.
// Set CHROME_PATH if Chrome is not in the default Windows location.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const chrome = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const dir = mkdtempSync(join(tmpdir(), 'og-'))
const png = join(dir, 'og.png')
execFileSync(chrome, [
  '--headless=new', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1',
  '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${png}`, pathToFileURL(resolve('scripts/og.html')).href,
], { stdio: 'ignore' })
await sharp(png).resize(1200, 630).jpeg({ quality: 82, mozjpeg: true }).toFile('public/og.jpg')
rmSync(dir, { recursive: true })
console.log('public/og.jpg')

await sharp('public/favicon.svg', { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('public/apple-touch-icon.png')
