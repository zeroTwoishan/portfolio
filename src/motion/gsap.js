import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP as useGSAPBase } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAPBase)

export const MOTION = '(prefers-reduced-motion: no-preference)'
export const DESKTOP_MOTION = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

// An animation bug must never take the page down: React unmounts the whole app on an uncaught effect error.
// On error we undo this component's animations (back to final state), release the html.js hiding rules and log it.
// `idle: true` (below-the-fold sections) waits until the browser is idle, so the setup work runs as small
// separate tasks after the first screen instead of one long task during hydration.
const idle = typeof requestIdleCallback === 'function' ? (f) => requestIdleCallback(f, { timeout: 2000 }) : (f) => setTimeout(f, 200)
const cancelIdle = typeof cancelIdleCallback === 'function' ? cancelIdleCallback : clearTimeout

export const useGSAP = (fn, config) =>
  useGSAPBase((ctx, contextSafe) => {
    const run = () => {
      try {
        return fn(ctx, contextSafe)
      } catch (err) {
        ctx.revert()
        document.documentElement.classList.remove('js')
        console.error('Animation setup failed; showing the page without motion.', err)
      }
    }
    if (!config?.idle) return run()
    const id = idle(() => ctx.add(run)) // ctx.add keeps everything (and run's cleanup) revertible
    return () => cancelIdle(id)
  }, config)

// No manual refresh: ScrollTrigger re-measures on load and resize itself, and image boxes have fixed
// aspect ratios, so late images don't move triggers. (Extra refreshes cost seconds on slow phones.)

// One-shot reveals: run `play` the first time `el` enters the lower 80% of the viewport, or right away if it is
// already above it (a deep link or restored scroll). An IntersectionObserver reads no layout, unlike a
// ScrollTrigger, which re-measures every trigger on load and resize: seconds of work on a slow phone.
export function reveal(el, play, rootMargin = '0px 0px -20% 0px') {
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting || e.boundingClientRect.top < 0) (io.disconnect(), play())
  }, { rootMargin })
  io.observe(el)
  return () => io.disconnect()
}

export { gsap, ScrollTrigger, SplitText }
