import { getMotionPreset } from './motionPresets.js'

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const smooth = (value, power = 1.35) => Math.pow(clamp(value), power)

const variantMap = {
  soft: { distance: 0.65, blur: 0.12, scale: 0.985, duration: 1.35 },
  strong: { distance: 1.35, blur: 0.24, scale: 0.965, duration: 0.95 },
  slow: { distance: 1.05, blur: 0.14, scale: 0.98, duration: 1.65 },
  fast: { distance: 0.85, blur: 0.12, scale: 0.975, duration: 0.65 },
  elastic: { distance: 1.2, blur: 0.16, scale: 0.97, duration: 1.1 },
  smooth: { distance: 0.95, blur: 0.12, scale: 0.98, duration: 1.25 },
  sharp: { distance: 0.8, blur: 0.08, scale: 0.978, duration: 0.8 },
  cinematic: { distance: 1.1, blur: 0.18, scale: 0.97, duration: 1.45 },
  fluid: { distance: 0.9, blur: 0.1, scale: 0.982, duration: 1.15 },
  deep: { distance: 1.5, blur: 0.28, scale: 0.95, duration: 1.55 },
  wide: { distance: 1.25, blur: 0.14, scale: 0.97, duration: 1.2 },
  micro: { distance: 0.35, blur: 0.04, scale: 0.992, duration: 0.55 },
}

const familyMap = {
  fade:{x:0,y:0,z:0,rotate:0}, rise:{x:0,y:1,z:0,rotate:-0.3}, drop:{x:0,y:-1,z:0,rotate:0.3},
  slideleft:{x:1,y:0,z:0,rotate:-0.5}, slideright:{x:-1,y:0,z:0,rotate:0.5}, scale:{x:0,y:0,z:0,rotate:0},
  blur:{x:0,y:0.15,z:-0.2,rotate:0}, focus:{x:0,y:0,z:0.35,rotate:0}, reveal:{x:0,y:0.8,z:0,rotate:0}, clip:{x:0,y:0.9,z:0,rotate:0},
  mask:{x:0.5,y:0.25,z:0,rotate:0}, push:{x:0,y:0,z:-1,rotate:0}, pull:{x:0,y:0,z:1,rotate:0}, drift:{x:0.4,y:0.45,z:0,rotate:0.25},
  float:{x:0.15,y:0.35,z:0.1,rotate:0.15}, parallax:{x:0.8,y:0.8,z:0.7,rotate:0}, depth:{x:0,y:0,z:1,rotate:0}, rotate:{x:0.2,y:0.2,z:0,rotate:1},
  skew:{x:0.25,y:0,z:0,rotate:0.8}, split:{x:1,y:0,z:0,rotate:0}, curtain:{x:0,y:1,z:0,rotate:0}, glide:{x:0.5,y:0.25,z:0,rotate:0},
  track:{x:1,y:0.15,z:0.25,rotate:0}, zoom:{x:0,y:0,z:1,rotate:0}, pulse:{x:0,y:0,z:0,rotate:0},
}

const resolveTransform = (preset, progress, velocity, direction) => {
  const v = variantMap[preset.variant] || variantMap.cinematic
  const f = familyMap[preset.family] || familyMap.fade
  const focusPhase = smooth(1 - Math.abs(progress * 2 - 1))
  const edge = 1 - focusPhase
  const speed = Math.min(Math.abs(velocity), 1)
  const directionSign = direction || 1

  return {
    x: f.x * v.distance * edge * 80 + directionSign * speed * f.x * 14,
    y: f.y * v.distance * edge * 82 - directionSign * speed * f.y * 8,
    z: f.z * v.distance * edge * 70,
    scale: 1 - edge * (1 - v.scale),
    rotate: f.rotate * edge * 6 + directionSign * speed * f.rotate * 1.5,
    blur: Math.min(edge * v.blur * 4 + speed * v.blur * 0.65, 1.25),
    skew: f.x * directionSign * speed * (preset.family === 'skew' ? 4 : 1.25),
    opacity: clamp(0.66 + focusPhase * 0.34),
  }
}

const isCompactBlurCandidate = (node) => {
  if (!(node instanceof HTMLElement)) return false
  if (node.matches('.section-title, .hero h1, .hero-number, .contact .section-title, section[data-motion-section], .container')) return false
  const rect = node.getBoundingClientRect()
  const area = rect.width * rect.height
  const textLength = (node.textContent || '').trim().length
  if (area <= 0 || area > 60000 || textLength > 140) return false
  if (node.tagName === 'IMG' || node.tagName === 'VIDEO') return area < 42000
  return true
}

export const applyMotionPreset = (element, presetName, state) => {
  if (!element) return
  const preset = typeof presetName === 'string' ? getMotionPreset(presetName) : presetName
  const values = resolveTransform(preset, state.progress ?? 0.5, state.velocity ?? 0, state.direction ?? 1)
  const duration = variantMap[preset.variant]?.duration ?? 1.2

  element.style.setProperty('--motion-x', `${values.x.toFixed(2)}px`)
  element.style.setProperty('--motion-y', `${values.y.toFixed(2)}px`)
  element.style.setProperty('--motion-z', `${values.z.toFixed(2)}px`)
  element.style.setProperty('--motion-scale', values.scale.toFixed(4))
  element.style.setProperty('--motion-rotate', `${values.rotate.toFixed(3)}deg`)
  element.style.setProperty('--motion-blur', `${values.blur.toFixed(2)}px`)
  element.style.setProperty('--motion-skew', `${values.skew.toFixed(3)}deg`)
  element.style.setProperty('--motion-opacity', values.opacity.toFixed(4))
  element.style.setProperty('--motion-duration', `${duration}s`)
}

const selector = [
  '[data-motion-preset]', '[data-motion]', '.section-label', '.section-title', '.cta-buttons',
  '.contact-email', '.about-item', '.service-item', '.portfolio-item', '.hero h1', '.hero p',
  '.hero-number', 'footer [data-motion]',
].join(',')

const fallbackPresets = ['FadeCinematic','RiseFluid','ParallaxDeep','DepthCinematic','GlideSmooth','RevealSlow','TrackWide','ZoomCinematic','FocusSoft','FloatFluid']

export const stampMotionPreset = (root = document) => {
  const nodes = [...root.querySelectorAll(selector)]
  nodes.forEach((node, index) => {
    if (!node.dataset.motionPreset) node.dataset.motionPreset = fallbackPresets[index % fallbackPresets.length]
    const blurSafe = isCompactBlurCandidate(node)
    node.toggleAttribute('data-motion-blur-safe', blurSafe)
    node.classList.toggle('motion-no-blur', !blurSafe)
  })
  return nodes
}

export const createMotionDirector = ({ root = document } = {}) => {
  const nodes = stampMotionPreset(root)
  const smoothVelocity = { value: 0 }

  const render = (state) => {
    smoothVelocity.value += ((state.velocity || 0) - smoothVelocity.value) * 0.14
    const next = { ...state, velocity: smoothVelocity.value }
    nodes.forEach((node) => applyMotionPreset(node, node.dataset.motionPreset, next))
  }

  return { render, nodes, presetCount: nodes.length }
}
