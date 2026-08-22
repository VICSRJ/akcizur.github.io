import { onBeforeUnmount, onMounted } from 'vue'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll-driven story engine.
 * Each section gets a normalized progress value:
 * - 0 = entering from below
 * - 0.5 = story center / hero position
 * - 1 = leaving through the top
 *
 * CSS consumes --story-progress and --story-distance for depth/parallax.
 */
export function useStoryMotion() {
  let raf = 0
  let sections = []

  const update = () => {
    raf = 0
    if (reducedMotion()) return

    const viewport = window.innerHeight || 1
    for (const section of sections) {
      const rect = section.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const progress = clamp(1 - (center - viewport * 0.5) / (viewport + rect.height) , 0, 1)
      const distance = clamp((center - viewport * 0.5) / viewport, -1.25, 1.25)

      section.style.setProperty('--story-progress', progress.toFixed(4))
      section.style.setProperty('--story-distance', distance.toFixed(4))
      section.classList.toggle('story-active', Math.abs(distance) < 0.58)
      section.classList.toggle('story-past', distance <= -0.58)
      section.classList.toggle('story-future', distance >= 0.58)
    }
  }

  const requestUpdate = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }

  onMounted(() => {
    sections = [...document.querySelectorAll('section[data-motion-section]')]
    if (reducedMotion()) return

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', requestUpdate)
    window.removeEventListener('resize', requestUpdate)
    if (raf) cancelAnimationFrame(raf)
  })
}
