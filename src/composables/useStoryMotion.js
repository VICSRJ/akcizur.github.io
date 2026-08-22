import { onBeforeUnmount, onMounted } from 'vue'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll-driven story engine.
 * CSS consumes these values as a continuous cinematic state rather than a
 * one-shot reveal: depth, scale, blur, opacity and slight vertical drift.
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
      const distance = clamp((center - viewport * 0.5) / viewport, -1.25, 1.25)
      const progress = clamp(1 - distance / 1.8, 0, 1)
      const focus = clamp(1 - Math.abs(distance) / 0.72, 0, 1)
      const past = clamp(-distance, 0, 1)
      const future = clamp(distance, 0, 1)

      section.style.setProperty('--story-progress', progress.toFixed(4))
      section.style.setProperty('--story-distance', distance.toFixed(4))
      section.style.setProperty('--story-focus', focus.toFixed(4))
      section.style.setProperty('--story-scale', (1 - past * 0.035 - future * 0.018).toFixed(4))
      section.style.setProperty('--story-y', ((future - past) * 14).toFixed(2) + 'px')
      section.style.setProperty('--story-blur', (past * 5 + future * 1.5).toFixed(2) + 'px')
      section.style.setProperty('--story-opacity', (1 - past * 0.3 - future * 0.04).toFixed(4))

      section.classList.toggle('story-active', focus > 0.12)
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
