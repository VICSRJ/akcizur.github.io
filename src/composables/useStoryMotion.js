import { onBeforeUnmount, onMounted } from 'vue'
import { createMotionDirector } from '../motion/motionDirector.js'
import { primeRemix, remixSection } from '../motion/remixMotion.js'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const smoothstep = (value) => value * value * (3 - 2 * value)
const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useStoryMotion() {
  let raf = 0
  let sections = []
  let directors = []
  let previousY = 0
  let previousTime = 0
  let velocity = 0

  const update = (time = performance.now()) => {
    raf = 0
    if (reducedMotion()) return

    const viewport = Math.max(window.innerHeight || 1, 1)
    const scrollY = window.scrollY
    const dt = Math.max(time - previousTime, 16)
    const rawVelocity = (scrollY - previousY) / dt
    velocity += (rawVelocity - velocity) * 0.10
    previousY = scrollY
    previousTime = time

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect()
      const center = rect.top + rect.height * 0.5
      const distance = clamp((center - viewport * 0.5) / viewport, -1.5, 1.5)
      const absoluteDistance = Math.abs(distance)
      const focus = clamp(1 - absoluteDistance / 0.68, 0, 1)
      const focusSoft = smoothstep(focus)
      const enter = clamp((distance + 0.9) / 0.9, 0, 1)
      const exit = clamp((-distance + 0.08) / 0.92, 0, 1)
      const travel = clamp(1 - absoluteDistance / 1.2, 0, 1)
      const chapter = index / Math.max(sections.length - 1, 1)
      const progress = clamp((distance + 1) / 2, 0, 1)
      const direction = Math.sign(velocity) || 1
      const motionVelocity = clamp(Math.abs(velocity) * 6, 0, 1)

      section.style.setProperty('--story-index', index)
      section.style.setProperty('--story-chapter', chapter.toFixed(4))
      section.style.setProperty('--story-progress', progress.toFixed(4))
      section.style.setProperty('--story-distance', distance.toFixed(4))
      section.style.setProperty('--story-focus', focusSoft.toFixed(4))
      section.style.setProperty('--story-enter', enter.toFixed(4))
      section.style.setProperty('--story-exit', exit.toFixed(4))
      section.style.setProperty('--story-travel', travel.toFixed(4))
      section.style.setProperty('--story-velocity', motionVelocity.toFixed(4))
      section.style.setProperty('--story-direction', direction.toString())
      section.style.setProperty('--story-camera-y', ((-distance * 28) + velocity * -14).toFixed(2) + 'px')
      section.style.setProperty('--story-camera-x', (Math.sin(index * 1.37) * distance * 6).toFixed(2) + 'px')
      section.style.setProperty('--story-scale', (1 + focusSoft * 0.010 - exit * 0.038 - (1 - enter) * 0.014).toFixed(4))
      section.style.setProperty('--story-opacity', (0.70 + focusSoft * 0.30 - exit * 0.20 - (1 - enter) * 0.06).toFixed(4))

      section.classList.toggle('story-active', focus > 0.16)
      section.classList.toggle('story-past', distance <= -0.54)
      section.classList.toggle('story-future', distance >= 0.54)

      const director = directors[index]
      director?.render({
        progress,
        distance,
        focus: focusSoft,
        enter,
        exit,
        travel,
        velocity: motionVelocity,
        direction,
        chapter,
      })

      remixSection(section, {
        distance,
        focus: focusSoft,
        enter,
        exit,
        velocity: motionVelocity,
        direction,
        energy: section.style.getPropertyValue('--sequence-energy') || 0.5,
      }, index)
    })
  }

  const requestUpdate = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }

  onMounted(() => {
    sections = [...document.querySelectorAll('section[data-motion-section]')]
    previousY = window.scrollY
    previousTime = performance.now()
    primeRemix(sections)

    if (reducedMotion()) return

    directors = sections.map((section) => createMotionDirector({ root: section }))
    update(previousTime)
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', requestUpdate)
    window.removeEventListener('resize', requestUpdate)
    if (raf) cancelAnimationFrame(raf)
    directors = []
  })
}
