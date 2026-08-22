const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const smooth = (value) => value * value * (3 - 2 * value)

const SCENES = Object.freeze([
  { key: 'OpeningFilm', x: 0.00, y: -1.00, z: 1.00, rotate: -0.30, scale: 0.020, shadowX: -0.55, shadowY: 0.90 },
  { key: 'EditorialCurtain', x: 1.00, y: -0.18, z: 0.42, rotate: -0.65, scale: 0.014, shadowX: -1.00, shadowY: 0.72 },
  { key: 'ServicesRhythm', x: -1.00, y: 0.12, z: 0.30, rotate: 0.42, scale: 0.012, shadowX: 1.00, shadowY: 0.55 },
  { key: 'PortfolioSweep', x: 0.44, y: 1.00, z: 0.72, rotate: 0.70, scale: 0.022, shadowX: -0.72, shadowY: 1.00 },
  { key: 'ContactClimax', x: -0.20, y: -1.00, z: 0.58, rotate: -0.22, scale: 0.016, shadowX: 0.46, shadowY: 1.00 },
])

const ROLE = Object.freeze({
  camera: { amp: 0.40, depth: 0.45 },
  kicker: { amp: 0.65, depth: 0.18 },
  title: { amp: 1.00, depth: 0.62 },
  copy: { amp: 0.58, depth: 0.24 },
  actions: { amp: 0.74, depth: 0.38 },
  cta: { amp: 0.86, depth: 0.42 },
  depth: { amp: 0.46, depth: 0.92 },
  icon: { amp: 0.78, depth: 0.68 },
  heading: { amp: 0.74, depth: 0.52 },
  body: { amp: 0.50, depth: 0.24 },
  index: { amp: 0.82, depth: 0.76 },
  surface: { amp: 0.40, depth: 0.48 },
  content: { amp: 0.64, depth: 0.40 },
  meta: { amp: 0.42, depth: 0.22 },
  rule: { amp: 0.34, depth: 0.14 },
  row: { amp: 0.76, depth: 0.52 },
  indicator: { amp: 0.38, depth: 0.16 },
})

const sceneFor = (section, index) => {
  const name = section.dataset.motionSequence
  return SCENES.find((scene) => scene.key === name) || SCENES[index] || SCENES[0]
}

const zIndexOf = (element) => {
  const parsed = Number.parseFloat(window.getComputedStyle(element).zIndex)
  return Number.isFinite(parsed) ? parsed : 0
}

const setVar = (element, name, value, unit = '') => {
  element.style.setProperty(name, `${value.toFixed(3)}${unit}`)
}

const shadowToneFor = (section) => {
  if (section.classList.contains('about') || section.classList.contains('portfolio')) return [0, 0, 0]
  return [255, 255, 255]
}

const rgba = (rgb, alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha.toFixed(3)})`

/*
 * ZURB-inspired layered shadow generator.
 * The original experiment builds depth from many 1px hard shadows rather
 * than relying on a single blurred drop shadow. Here the same idea is driven
 * by the existing scene vector, scroll velocity and element depth.
 */
const buildZurbShadow = ({ rgb, x, y, depth, velocity, opacity, text = false }) => {
  const directionX = Math.sign(x || 1)
  const directionY = Math.sign(y || 1)
  const baseX = x * (0.55 + depth * 0.9) + directionX * velocity * 1.25
  const baseY = y * (0.55 + depth * 0.9) + directionY * velocity * 1.65
  const steps = text ? 5 : 7
  const density = text ? 0.72 : 0.92
  const alpha = clamp((0.05 + depth * 0.10 + velocity * 0.10) * opacity, 0.04, 0.24)
  const stack = []

  for (let index = 1; index <= steps; index += 1) {
    const scale = index / steps
    stack.push(`${(baseX * scale).toFixed(2)}px ${(baseY * scale).toFixed(2)}px 0 ${rgba(rgb, alpha * density * (1 - index * 0.07))}`)
  }

  const soft = `${(baseX * 1.08).toFixed(2)}px ${(baseY * 1.08).toFixed(2)}px ${(2 + depth * 7 + velocity * 4).toFixed(2)}px ${rgba(rgb, alpha * 0.72)}`
  stack.push(soft)
  return stack.join(', ')
}

export const remixSection = (section, state, index) => {
  const profile = sceneFor(section, index)
  const distance = Number(state.distance || 0)
  const focus = smooth(Number(state.focus || 0))
  const velocity = clamp(Number(state.velocity || 0))
  const direction = Number(state.direction || 1)
  const energy = clamp(Number(state.energy ?? state.sequenceEnergy ?? 0.5))
  const enter = clamp(Number(state.enter || 0))
  const exit = clamp(Number(state.exit || 0))
  const approach = clamp(1 - Math.abs(distance) / 1.05)
  const edge = 1 - approach
  const cinematic = 0.74 + energy * 0.26
  const shadowRGB = shadowToneFor(section)

  setVar(section, '--remix-scene-x', profile.x * edge * 38 + velocity * direction * profile.x * 6, 'px')
  setVar(section, '--remix-scene-y', profile.y * edge * 48 - velocity * direction * profile.y * 8, 'px')
  setVar(section, '--remix-scene-z', profile.z * edge * 28, 'px')
  setVar(section, '--remix-scene-rotate', profile.rotate * edge * cinematic, 'deg')
  setVar(section, '--remix-scene-scale', 1 - edge * profile.scale)
  setVar(section, '--remix-scene-opacity', clamp(0.72 + focus * 0.28 - exit * 0.12 - (1 - enter) * 0.06))
  setVar(section, '--remix-energy', energy)
  setVar(section, '--remix-focus', focus)
  setVar(section, '--remix-direction', direction)

  const elements = section.querySelectorAll('[data-motion-preset], [data-motion], [data-motion-role]')
  elements.forEach((element, elementIndex) => {
    const role = ROLE[element.dataset.motionRole] || ROLE.content
    const stagger = clamp(elementIndex / Math.max(elements.length - 1, 1))
    const phase = clamp((focus * 0.78) + (1 - stagger) * 0.22)
    const local = smooth(phase)
    const zLayer = clamp(zIndexOf(element) / 20, 0, 1)
    const depth = role.depth + zLayer * 0.12
    const amp = role.amp * cinematic

    const x = profile.x * distance * (10 + depth * 18) * amp + profile.shadowX * velocity * direction * 2.2
    const y = profile.y * distance * (12 + depth * 20) * amp - velocity * direction * (2 + depth * 4)
    const z = profile.z * distance * (18 + depth * 30) * amp
    const rotation = profile.rotate * distance * (0.55 + depth) * amp + velocity * direction * 0.42 * amp
    const scale = 1 - edge * (0.012 + (1 - role.amp) * 0.018) + local * 0.006
    const opacity = clamp(0.50 + local * 0.50 + energy * 0.05)

    const shadowDepth = clamp(Math.abs(z) / 42 + depth * 0.48 + edge * 0.18, 0, 1.5)
    const shadowDistance = 2.2 + shadowDepth * 13 + velocity * 2.4
    const shadowX = profile.shadowX * shadowDistance + direction * velocity * 1.8
    const shadowY = profile.shadowY * shadowDistance
    const shadowBlur = 1.2 + shadowDepth * 8.5
    const shadowAlpha = clamp(0.13 + shadowDepth * 0.15 + velocity * 0.05, 0.13, 0.32)

    const zurbShadow = buildZurbShadow({
      rgb: shadowRGB,
      x: shadowX,
      y: shadowY,
      depth: shadowDepth,
      velocity,
      opacity,
      text: ['title', 'heading', 'index', 'depth'].includes(element.dataset.motionRole),
    })

    const hoverShadow = buildZurbShadow({
      rgb: shadowRGB,
      x: shadowX * 1.15,
      y: shadowY * 1.15,
      depth: clamp(shadowDepth + 0.25, 0, 1.5),
      velocity: clamp(velocity + 0.15),
      opacity: Math.min(1, opacity + 0.12),
      text: false,
    })

    setVar(element, '--remix-x', x, 'px')
    setVar(element, '--remix-y', y, 'px')
    setVar(element, '--remix-z', z, 'px')
    setVar(element, '--remix-rotate', rotation, 'deg')
    setVar(element, '--remix-scale', scale)
    setVar(element, '--remix-opacity', opacity)
    setVar(element, '--remix-shadow-x', shadowX, 'px')
    setVar(element, '--remix-shadow-y', shadowY, 'px')
    setVar(element, '--remix-shadow-blur', shadowBlur, 'px')
    setVar(element, '--remix-shadow-alpha', shadowAlpha)
    setVar(element, '--remix-layer', zLayer)
    element.style.setProperty('--remix-scene-index', String(index))
    element.style.setProperty('--remix-stagger', stagger.toFixed(3))
    element.style.setProperty('--remix-zurb-shadow', zurbShadow)
    element.style.setProperty('--remix-zurb-shadow-hover', hoverShadow)
    element.style.setProperty('--remix-zurb-text-shadow', zurbShadow)
  })
}

export const primeRemix = (sections) => {
  sections.forEach((section, index) => {
    section.dataset.remixScene = sceneFor(section, index).key
    section.style.setProperty('--remix-scene-index', String(index))
  })
}
