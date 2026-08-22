import { onBeforeUnmount, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { primeRemix, remixSection } from '../motion/remixMotion.js'

gsap.registerPlugin(ScrollTrigger)

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useRemixMotion() {
  let triggers = []

  onMounted(() => {
    const sections = [...document.querySelectorAll('main.story-scene > section[data-motion-section]')]
    if (!sections.length) return

    document.documentElement.classList.add('remix-motion')
    primeRemix(sections)

    if (reducedMotion()) {
      sections.forEach((section) => remixSection(section, {
        distance: 0,
        focus: 1,
        velocity: 0,
        direction: 1,
        energy: 0.65,
        enter: 1,
        exit: 0,
      }, sections.indexOf(section)))
      return
    }

    triggers = sections.map((section, index) => {
      let velocity = 0
      let lastScroll = window.scrollY
      let lastTime = performance.now()

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 88%',
        end: 'bottom 12%',
        scrub: 0.55,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const now = performance.now()
          const dt = Math.max(now - lastTime, 16)
          const currentScroll = window.scrollY
          const raw = ((currentScroll - lastScroll) / dt) * 1000
          velocity += (raw - velocity) * 0.16
          lastScroll = currentScroll
          lastTime = now

          const direction = self.direction || (velocity >= 0 ? 1 : -1)
          const progress = self.progress
          const distance = progress * 2 - 1
          const focus = Math.max(0, 1 - Math.abs(distance) / 0.72)
          const enter = Math.min(1, Math.max(0, (progress + 0.18) / 0.78))
          const exit = Math.min(1, Math.max(0, (progress - 0.22) / 0.78))
          const energy = Math.min(1, 0.55 + Math.abs(velocity) / 4200)

          remixSection(section, {
            progress,
            distance,
            focus,
            velocity: Math.min(Math.abs(velocity) / 900, 1),
            direction,
            enter,
            exit,
            energy,
          }, index)
        },
      })

      return trigger
    })

    ScrollTrigger.refresh()
  })

  onBeforeUnmount(() => {
    triggers.forEach((trigger) => trigger.kill())
    triggers = []
    document.documentElement.classList.remove('remix-motion')
  })
}
