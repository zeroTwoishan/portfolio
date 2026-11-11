// One-time image pipeline: writes web-sized copies under new names. Never writes to the masters it reads.
// Run with `npm run images` after adding or replacing a source image.
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

async function variants(src, outBase, widths, input = {}) {
  for (const w of widths) {
    const img = sharp(src, input).resize({ width: w, withoutEnlargement: true })
    await img.clone().avif({ quality: 55 }).toFile(`${outBase}-${w}.avif`)
    await img.clone().webp({ quality: 78 }).toFile(`${outBase}-${w}.webp`)
  }
  console.log(`${outBase}: ${widths.join(', ')}`)
}

await mkdir('public/media/portrait', { recursive: true })
await variants('source-media/ishan.png', 'public/media/portrait/ishan-edit', [480, 720, 1086])
// Small screens: a tighter 4:5 head-and-shoulders crop of the same photo, so the face reads bigger and the
// image takes less height. Box from the person outline (x 181–968, head from y≈268), with headroom so the
// head clears the floating nav when the photo runs full-bleed to the top.
{
  const crop = { left: 195, top: 60, width: 760, height: 950 }
  for (const w of [480, 760]) {
    const img = sharp('source-media/ishan.png').extract(crop).resize({ width: w })
    await img.clone().avif({ quality: 55 }).toFile(`public/media/portrait/ishan-crop-${w}.avif`)
    await img.clone().webp({ quality: 78 }).toFile(`public/media/portrait/ishan-crop-${w}.webp`)
  }
  console.log('public/media/portrait/ishan-crop: 480, 760')
}

// Project images for the Work section. darkroom.webp is animated, so its poster is the first frame.
await variants('public/media/darkroom.webp', 'public/media/darkroom-poster', [800, 1120], { pages: 1 })
await variants('public/media/cinescope.webp', 'public/media/cinescope', [800, 1280])
await variants('public/media/xceed-learning.webp', 'public/media/xceed-learning', [800, 1600])

// Grain: a 256px tile of white specks with random low alpha, laid over the living background (never over photos).
const size = 256
const noise = Buffer.alloc(size * size * 4, 255)
for (let i = 3; i < noise.length; i += 4) noise[i] = Math.floor(Math.random() * 14)
await sharp(noise, { raw: { width: size, height: size, channels: 4 } }).webp({ lossless: true }).toFile('public/grain.webp') // lossy would smooth the noise away
console.log('public/grain.webp')
