import { getMotionPreset } from './motionPresets.js'
import { getMotionSequence } from './motionSequences.js'

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const smooth = (value, power = 1.35) => Math.pow(clamp(value), power)

const variantMap = {
  soft: { distance: 0.65, blur: 0.12, scale: 0.985, duration: 1.35, rotation: 0.65 }, strong: { distance: 1.35, blur: 0.24, scale: 0.965, duration: 0.95, rotation: 1.0 }, slow: { distance: 1.05, blur: 0.14, scale: 0.98, duration: 1.65, rotation: 0.7 }, fast: { distance: 0.85, blur: 0.12, scale: 0.975, duration: 0.65, rotation: 1.0 }, elastic: { distance: 1.2, blur: 0.16, scale: 0.97, duration: 1.1, rotation: 1.15 }, smooth: { distance: 0.95, blur: 0.12, scale: 0.98, duration: 1.25, rotation: 0.7 }, sharp: { distance: 0.8, blur: 0.08, scale: 0.978, duration: 0.8, rotation: 0.9 }, cinematic: { distance: 1.1, blur: 0.18, scale: 0.97, duration: 1.45, rotation: 0.8 }, fluid: { distance: 0.9, blur: 0.1, scale: 0.982, duration: 1.15, rotation: 0.95 }, deep: { distance: 1.5, blur: 0.28, scale: 0.95, duration: 1.55, rotation: 0.9 }, wide: { distance: 1.25, blur: 0.14, scale: 0.97, duration: 1.2, rotation: 0.8 }, micro: { distance: 0.35, blur: 0.04, scale: 0.992, duration: 0.55, rotation: 0.5 },
}

const familyMap = {
  fade:{x:0,y:0,z:0,rotate:0}, rise:{x:0,y:1,z:0,rotate:-0.3}, drop:{x:0,y:-1,z:0,rotate:0.3}, slideleft:{x:1,y:0,z:0,rotate:-0.5}, slideright:{x:-1,y:0,z:0,rotate:0.5}, scale:{x:0,y:0,z:0,rotate:0}, blur:{x:0,y:0.15,z:-0.2,rotate:0}, focus:{x:0,y:0,z:0.35,rotate:0}, reveal:{x:0,y:0.8,z:0,rotate:0}, clip:{x:0,y:0.9,z:0,rotate:0}, mask:{x:0.5,y:0.25,z:0,rotate:0}, push:{x:0,y:0,z:-1,rotate:0}, pull:{x:0,y:0,z:1,rotate:0}, drift:{x:0.4,y:0.45,z:0,rotate:0.25}, float:{x:0.15,y:0.35,z:0.1,rotate:0.15}, parallax:{x:0.8,y:0.8,z:0.7,rotate:0}, depth:{x:0,y:0,z:1,rotate:0}, rotate:{x:0.2,y:0.2,z:0,rotate:1}, skew:{x:0.25,y:0,z:0,rotate:0.8}, split:{x:1,y:0,z:0,rotate:0}, curtain:{x:0,y:1,z:0,rotate:0}, glide:{x:0.5,y:0.25,z:0,rotate:0}, track:{x:1,y:0.15,z:0.25,rotate:0}, zoom:{x:0,y:0,z:1,rotate:0}, pulse:{x:0,y:0,z:0,rotate:0}, whip:{x:1.2,y:0.15,z:0.15,rotate:1.4}, sweep:{x:1,y:0.25,z:0.25,rotate:0.6}, wipe:{x:0.7,y:0.05,z:0,rotate:0}, shutter:{x:0,y:1.1,z:0,rotate:0}, fold:{x:0.55,y:0.55,z:-0.8,rotate:1.1}, unfold:{x:-0.55,y:-0.55,z:0.6,rotate:-1.1}, flip:{x:0,y:0,z:-0.9,rotate:2.2}, orbit:{x:0.7,y:0.4,z:0.25,rotate:2.4}, arc:{x:0.75,y:0.55,z:0.1,rotate:1.8}, wave:{x:0.7,y:0.45,z:0,rotate:1.2}, ripple:{x:0.25,y:0.7,z:-0.2,rotate:0.7}, elastic:{x:0,y:0.9,z:-0.15,rotate:-0.8}, bounce:{x:0,y:1.2,z:0,rotate:0.4}, spring:{x:0,y:1,z:0.15,rotate:-0.7}, snap:{x:0.2,y:0.4,z:0,rotate:1.2}, magnetic:{x:0.55,y:0.35,z:0.25,rotate:0.5}, floatup:{x:0.1,y:0.8,z:0.1,rotate:0.2}, floatdown:{x:-0.1,y:-0.8,z:0.1,rotate:-0.2}, driftleft:{x:0.85,y:0.15,z:0,rotate:-0.2}, driftright:{x:-0.85,y:0.15,z:0,rotate:0.2}, driftup:{x:0.15,y:0.75,z:0,rotate:0.2}, driftdown:{x:0.15,y:-0.75,z:0,rotate:-0.2}, pan:{x:1,y:0,z:0.2,rotate:0}, tilt:{x:0,y:0.2,z:0,rotate:1.2}, roll:{x:0,y:0,z:0,rotate:2.5}, lens:{x:0,y:0,z:0.8,rotate:0}, rackfocus:{x:0,y:0,z:0.6,rotate:0}, dolly:{x:0,y:0,z:-1,rotate:0}, truck:{x:0.9,y:0,z:0,rotate:0}, pedestal:{x:0,y:-0.85,z:0,rotate:0}, crane:{x:0.2,y:-0.95,z:0.3,rotate:0.2}, boom:{x:0,y:-1.1,z:-0.2,rotate:0}, jitter:{x:0.25,y:0.25,z:0,rotate:1.2}, vibrate:{x:0.08,y:0.18,z:0,rotate:0.5}, breath:{x:0,y:0,z:0.4,rotate:0}, glow:{x:0,y:0,z:0.25,rotate:0}, trace:{x:0.2,y:0.55,z:0,rotate:0}, draw:{x:0.45,y:0.35,z:0,rotate:0.2}, erase:{x:-0.45,y:-0.2,z:0,rotate:-0.2}, stretch:{x:0.9,y:0,z:0,rotate:0}, compress:{x:-0.7,y:0,z:0,rotate:0}, expand:{x:0,y:0,z:0,rotate:0}, contract:{x:0,y:0,z:0,rotate:0}, cascade:{x:0.3,y:0.8,z:0,rotate:0.4}, domino:{x:0.75,y:0.6,z:-0.1,rotate:0.9}, stack:{x:0,y:0.65,z:-0.3,rotate:0.3}, fan:{x:0.8,y:0.4,z:0,rotate:1.4}, scatter:{x:1,y:0.8,z:-0.4,rotate:1.8}, assemble:{x:-1,y:-0.7,z:0.5,rotate:-1.4}, splittext:{x:0.6,y:0,z:0,rotate:0.15},
}

const getFamilyVector = (family) => familyMap[family] || { x: 0, y: 0.35, z: 0, rotate: 0.25 }

const resolveTransform = (preset, progress, velocity, direction) => {
  const v = variantMap[preset.variant] || variantMap.cinematic
  const f = getFamilyVector(preset.family)
  const focusPhase = smooth(1 - Math.abs(progress * 2 - 1))
  const edge = 1 - focusPhase
  const speed = Math.min(Math.abs(velocity), 1)
  const directionSign = direction || 1
  const seedWave = Math.sin((preset.seed || 0) * 0.071) * 0.15
  const travel = 1 - edge

  return {
    x: f.x * v.distance * edge * 72 + directionSign * speed * f.x * 12 + seedWave * travel * 8,
    y: f.y * v.distance * edge * 76 - directionSign * speed * f.y * 7 + Math.cos((preset.seed || 0) * 0.053) * travel * 4,
    z: f.z * v.distance * edge * 62,
    scale: 1 - edge * (1 - v.scale) + (preset.family === 'breath' || preset.family === 'pulse' ? Math.sin(focusPhase * Math.PI) * 0.012 : 0),
    rotate: f.rotate * edge * v.rotation + directionSign * speed * f.rotate * 1.2,
    blur: Math.min(edge * v.blur * 4 + speed * v.blur * 0.5, 1.1),
    skew: f.x * directionSign * speed * (preset.family === 'skew' ? 3.5 : preset.family === 'whip' ? 2.2 : 1.1),
    opacity: clamp(0.66 + focusPhase * 0.34),
  }
}

const getSequenceState = (sequence, progress) => {
  const beats = sequence?.beats || []
  if (!beats.length) return { phase: 0, beatIndex: -1, energy: 0, overlap: 0 }

  let beatIndex = 0
  for (let i = 0; i < beats.length; i += 1) {
    if (progress >= beats[i].at) beatIndex = i
    else break
  }

  const current = beats[beatIndex]
  const next = beats[Math.min(beatIndex + 1, beats.length - 1)]
  const span = Math.max((next?.at ?? 1) - current.at, 0.001)
  const phase = clamp((progress - current.at) / span)
  const energy = clamp((1 - Math.abs(phase * 2 - 1)) * (sequence.intensity ?? 0.7))

  return { phase, beatIndex, energy, overlap: current.overlap || 0, beat: current.to, ease: current.ease }
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

const fallbackPresets = ['FadeCinematic','RiseFluid','ParallaxDeep','DepthCinematic','GlideSmooth','RevealSlow','TrackWide','ZoomCinematic','FocusSoft','FloatFluid','WhipFast','SweepFluid','OrbitCinematic','WaveSmooth','SpringElastic','MagneticMicro','RackFocusCinematic','DollySlow','CascadeCinematic','SplitTextFluid']

export const stampMotionPreset = (root = document) => {
  const nodes = [...root.querySelectorAll(selector)]
  nodes.forEach((node, index) => {
    if (!node.dataset.motionPreset) node.dataset.motionPreset = fallbackPresets[index % fallbackPresets.length]
    const blurSafe = isCompactBlurCandidate(node)
    node.toggleAttribute('data-motion-blur-safe', blurSafe)
    node.classList.toggle('motion-no-blur', !blurSafe)
    node.style.setProperty('--motion-seed', String(index % 97))
  })
  return nodes
}

export const createMotionDirector = ({ root = document } = {}) => {
  const nodes = stampMotionPreset(root)
  const smoothVelocity = { value: 0 }
  const sequenceName = root instanceof Element ? root.dataset.motionSequence : null
  const sequence = getMotionSequence(sequenceName || 'OpeningFilm')

  const render = (state) => {
    smoothVelocity.value += ((state.velocity || 0) - smoothVelocity.value) * 0.14
    const next = { ...state, velocity: smoothVelocity.value }
    const sequenceState = getSequenceState(sequence, next.progress ?? 0.5)

    root.style.setProperty('--sequence-progress', String(next.progress ?? 0))
    root.style.setProperty('--sequence-phase', sequenceState.phase.toFixed(4))
    root.style.setProperty('--sequence-energy', sequenceState.energy.toFixed(4))
    root.style.setProperty('--sequence-beat', String(sequenceState.beatIndex))
    root.style.setProperty('--sequence-overlap', String(sequenceState.overlap))

    nodes.forEach((node) => applyMotionPreset(node, node.dataset.motionPreset, next))
  }

  return { render, nodes, presetCount: nodes.length, sequence, sequenceName: sequence.name }
}
