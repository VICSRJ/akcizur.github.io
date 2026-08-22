import { gsap } from 'gsap'
import { getMotionPreset } from './motionPresets.js'

const clamp = gsap.utils.clamp(0, 1)
const smooth = (value, power = 1.35) => Math.pow(clamp(value), power)

const variantMap = {
  soft: { distance: 0.65, blur: 0.35, scale: 0.985, duration: 1.35 },
  strong: { distance: 1.35, blur: 1.0, scale: 0.965, duration: 0.95 },
  slow: { distance: 1.05, blur: 0.6, scale: 0.98, duration: 1.65 },
  fast: { distance: 0.85, blur: 0.5, scale: 0.975, duration: 0.65 },
  elastic: { distance: 1.2, blur: 0.45, scale: 0.97, duration: 1.1 },
  smooth: { distance: 0.95, blur: 0.45, scale: 0.98, duration: 1.25 },
  sharp: { distance: 0.8, blur: 0.25, scale: 0.978, duration: 0.8 },
  cinematic: { distance: 1.1, blur: 0.75, scale: 0.97, duration: 1.45 },
  fluid: { distance: 0.9, blur: 0.35, scale: 0.982, duration: 1.15 },
  deep: { distance: 1.5, blur: 1.15, scale: 0.95, duration: 1.55 },
  wide: { distance: 1.25, blur: 0.55, scale: 0.97, duration: 1.2 },
  micro: { distance: 0.35, blur: 0.15, scale: 0.992, duration: 0.55 },
}

const familyMap = {
  fade: { x: 0, y: 0, z: 0, rotate: 0 },
  rise: { x: 0, y: 1, z: 0, rotate: -0.3 },
  drop: { x: 0, y: -1, z: 0, rotate: 0.3 },
  slideleft: { x: 1, y: 0, z: 0, rotate: -0.5 },
  slideright: { x: -1, y: 0, z: 0, rotate: 0.5 },
  scale: { x: 0, y: 0, z: 0, rotate: 0 },
  blur: { x: 0, y: 0.15, z: -0.2, rotate: 0 },
  focus: { x: 0, y: 0, z: 0.35, rotate: 0 },
  reveal: { x: 0, y: 0.8, z: 0, rotate: 0 },
  clip: { x: 0, y: 0.9, z: 0, rotate: 0 },
  mask: { x: 0.5, y: 0.25, z: 0, rotate: 0 },
  push: { x: 0, y: 0, z: -1, rotate: 0 },
  pull: { x: 0, y: 0, z: 1, rotate: 0 },
  drift: { x: 0.4, y: 0.45, z: 0, rotate: 0.25 },
  float: { x: 0.15, y: 0.35, z: 0.1, rotate: 0.15 },
  parallax: { x: 0.8, y: 0.8, z: 0.7, rotate: 0 },
  depth: { x: 0, y: 0, z: 1, rotate: 0 },
  rotate: { x: 0.2, y: 0.2, z: 0, rotate: 1 },
  skew: { x: 0.25, y: 0, z: 0, rotate: 0.8 },
  split: { x: 1, y: 0, z: 0, rotate: 0 },
  curtain: { x: 0, y: 1, z: 0, rotate: 0 },
  glide: { x: 0.5, y: 0.25, z: 0, rotate: 0 },
  track: { x: 1, y: 0.15, z: 0.25, rotate: 0 },
  zoom: { x: 0, y: 0, z: 1, rotate: 0 },
  pulse: { x: 0, y: 0, z: 0, rotate: 0 },
}

const resolveTransform = (preset, progress, velocity, direction) => {
  const v = variantMap[preset.variant] || variantMap.cinematic
  const f = familyMap[preset.family] || familyMap.fade
  const phase = smooth(progress)
  const travel = (1 - Math.abs(progress * 2 - 1))
  const speed = Math.min(Math.abs(velocity), 1)
  const directionSign = direction || 1

  const x = f.x * v.distance * (1 - phase) * 80 + directionSign * speed * f.x * 18
  const y = f.y * v.distance * (1 - phase) * 90 - directionSign * speed * f.y * 10
  const z = f.z * v.distance * (1 - phase) * 90
  const scale = 1 - (1 - phase) * (1 - v.scale)
  const rotate = f.rotate * (1 - phase) * 7 + directionSign * speed * f.rotate * 1.8
  const blur = (1 - phase) * v.blur * 10 + speed * v.blur * 2.5
  const skew = f.x * directionSign * speed * (preset.family === 'skew' ? 5 : 1.5)
  const opacity = clamp(0.58 + phase * 0.42 + travel * 0.06)

  return { x, y, z, scale, rotate, blur, skew, opacity }
}

export const applyMotionPreset = (element, presetName, state) => {
  if (!element) return
  const preset = typeof presetName === 'string' ? getMotionPreset(presetName) : presetName
  const values = resolveTransform(
    preset,
    state.progress ?? 0.5,
    state.velocity ?? 0,
    state.direction ?? 1,
  )

  element.style.setProperty('--motion-x', `${values.x.toFixed(2)}px`)
  element.style.setProperty('--motion-y', `${values.y.toFixed(2)}px`)
  element.style.setProperty('--motion-z', `${values.z.toFixed(2)}px`)
  element.style.setProperty('--motion-scale', values.scale.toFixed(4))
  element.style.setProperty('--motion-rotate', `${values.rotate.toFixed(3)}deg`)
  element.style.setProperty('--motion-blur', `${values.blur.toFixed(2)}px`)
  element.style.setProperty('--motion-skew', `${values.skew.toFixed(3)}deg`)
  element.style.setProperty('--motion-opacity', values.opacity.toFixed(4))
  element.style.setProperty('--motion-duration', `${(variantMap[preset.variant]?.duration ?? 1.2)}s`)
}

export const stampMotionPreset = (root = document) => {
  const nodes = root.querySelectorAll('[data-motion-preset]')
  nodes.forEach((node, index) => {
    const fallback = ['FadeCinematic', 'RiseFluid', 'ParallaxDeep', 'DepthCinematic', 'GlideSmooth'][index % 5]
    if (!node.dataset.motionPreset) node.dataset.motionPreset = fallback
  })
  return nodes
}

export const createMotionDirector = ({ root = document } = {}) => {
  const nodes = [...stampMotionPreset(root)]
  const smoothVelocity = { value: 0 }

  const render = (state) => {
    smoothVelocity.value += ((state.velocity || 0) - smoothVelocity.value) * 0.16
    const next = { ...state, velocity: smoothVelocity.value }
    nodes.forEach((node) => applyMotionPreset(node, node.dataset.motionPreset, next))
  }

  return {
    render,
    nodes,
    presetCount: nodes.length,
  }
}
