import { getMotionPreset } from './motionPresets.js'
import { getMotionSequence } from './motionSequences.js'
import { solveDynamicMotion, primeDynamicState } from './dynamicSolver.js'

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const smooth = (value, power = 1.35) => Math.pow(clamp(value), power)

const variantMap = {
  soft: { distance: 0.65, blur: 0.12, scale: 0.985, duration: 1.35, rotation: 0.65 }, strong: { distance: 1.35, blur: 0.24, scale: 0.965, duration: 0.95, rotation: 1 }, slow: { distance: 1.05, blur: 0.14, scale: 0.98, duration: 1.65, rotation: 0.7 }, fast: { distance: 0.85, blur: 0.12, scale: 0.975, duration: 0.65, rotation: 1 }, elastic: { distance: 1.2, blur: 0.16, scale: 0.97, duration: 1.1, rotation: 1.15 }, smooth: { distance: 0.95, blur: 0.12, scale: 0.98, duration: 1.25, rotation: 0.7 }, sharp: { distance: 0.8, blur: 0.08, scale: 0.978, duration: 0.8, rotation: 0.9 }, cinematic: { distance: 1.1, blur: 0.18, scale: 0.97, duration: 1.45, rotation: 0.8 }, fluid: { distance: 0.9, blur: 0.1, scale: 0.982, duration: 1.15, rotation: 0.95 }, deep: { distance: 1.5, blur: 0.28, scale: 0.95, duration: 1.55, rotation: 0.9 }, wide: { distance: 1.25, blur: 0.14, scale: 0.97, duration: 1.2, rotation: 0.8 }, micro: { distance: 0.35, blur: 0.04, scale: 0.992, duration: 0.55, rotation: 0.5 },
}

const familyMap = {
  fade:{x:0,y:0,z:0,rotate:0},rise:{x:0,y:1,z:0,rotate:-.3},drop:{x:0,y:-1,z:0,rotate:.3},slideleft:{x:1,y:0,z:0,rotate:-.5},slideright:{x:-1,y:0,z:0,rotate:.5},scale:{x:0,y:0,z:0,rotate:0},blur:{x:0,y:.15,z:-.2,rotate:0},focus:{x:0,y:0,z:.35,rotate:0},reveal:{x:0,y:.8,z:0,rotate:0},clip:{x:0,y:.9,z:0,rotate:0},mask:{x:.5,y:.25,z:0,rotate:0},push:{x:0,y:0,z:-1,rotate:0},pull:{x:0,y:0,z:1,rotate:0},drift:{x:.4,y:.45,z:0,rotate:.25},float:{x:.15,y:.35,z:.1,rotate:.15},parallax:{x:.8,y:.8,z:.7,rotate:0},depth:{x:0,y:0,z:1,rotate:0},rotate:{x:.2,y:.2,z:0,rotate:1},skew:{x:.25,y:0,z:0,rotate:.8},split:{x:1,y:0,z:0,rotate:0},curtain:{x:0,y:1,z:0,rotate:0},glide:{x:.5,y:.25,z:0,rotate:0},track:{x:1,y:.15,z:.25,rotate:0},zoom:{x:0,y:0,z:1,rotate:0},pulse:{x:0,y:0,z:0,rotate:0},whip:{x:1.2,y:.15,z:.15,rotate:1.4},sweep:{x:1,y:.25,z:.25,rotate:.6},wipe:{x:.7,y:.05,z:0,rotate:0},shutter:{x:0,y:1.1,z:0,rotate:0},fold:{x:.55,y:.55,z:-.8,rotate:1.1},unfold:{x:-.55,y:-.55,z:.6,rotate:-1.1},flip:{x:0,y:0,z:-.9,rotate:2.2},orbit:{x:.7,y:.4,z:.25,rotate:2.4},arc:{x:.75,y:.55,z:.1,rotate:1.8},wave:{x:.7,y:.45,z:0,rotate:1.2},ripple:{x:.25,y:.7,z:-.2,rotate:.7},elastic:{x:0,y:.9,z:-.15,rotate:-.8},bounce:{x:0,y:1.2,z:0,rotate:.4},spring:{x:0,y:1,z:.15,rotate:-.7},snap:{x:.2,y:.4,z:0,rotate:1.2},magnetic:{x:.55,y:.35,z:.25,rotate:.5},floatup:{x:.1,y:.8,z:.1,rotate:.2},floatdown:{x:-.1,y:-.8,z:.1,rotate:-.2},driftleft:{x:.85,y:.15,z:0,rotate:-.2},driftright:{x:-.85,y:.15,z:0,rotate:.2},driftup:{x:.15,y:.75,z:0,rotate:.2},driftdown:{x:.15,y:-.75,z:0,rotate:-.2},pan:{x:1,y:0,z:.2,rotate:0},tilt:{x:0,y:.2,z:0,rotate:1.2},roll:{x:0,y:0,z:0,rotate:2.5},lens:{x:0,y:0,z:.8,rotate:0},rackfocus:{x:0,y:0,z:.6,rotate:0},dolly:{x:0,y:0,z:-1,rotate:0},truck:{x:.9,y:0,z:0,rotate:0},pedestal:{x:0,y:-.85,z:0,rotate:0},crane:{x:.2,y:-.95,z:.3,rotate:.2},boom:{x:0,y:-1.1,z:-.2,rotate:0},jitter:{x:.25,y:.25,z:0,rotate:1.2},vibrate:{x:.08,y:.18,z:0,rotate:.5},breath:{x:0,y:0,z:.4,rotate:0},glow:{x:0,y:0,z:.25,rotate:0},trace:{x:.2,y:.55,z:0,rotate:0},draw:{x:.45,y:.35,z:0,rotate:.2},erase:{x:-.45,y:-.2,z:0,rotate:-.2},stretch:{x:.9,y:0,z:0,rotate:0},compress:{x:-.7,y:0,z:0,rotate:0},expand:{x:0,y:0,z:0,rotate:0},contract:{x:0,y:0,z:0,rotate:0},cascade:{x:.3,y:.8,z:0,rotate:.4},domino:{x:.75,y:.6,z:-.1,rotate:.9},stack:{x:0,y:.65,z:-.3,rotate:.3},fan:{x:.8,y:.4,z:0,rotate:1.4},scatter:{x:1,y:.8,z:-.4,rotate:1.8},assemble:{x:-1,y:-.7,z:.5,rotate:-1.4},splittext:{x:.6,y:0,z:0,rotate:.15},
}

const family = (name) => familyMap[name] || { x: 0, y: .35, z: 0, rotate: .25 }

const resolveTransform = (preset, progress, velocity, direction, sequenceEnergy = 0, sequencePhase = 0, role = '') => {
  const v = variantMap[preset.variant] || variantMap.cinematic
  const f = family(preset.family)
  const focusPhase = smooth(1 - Math.abs(progress * 2 - 1))
  const edge = 1 - focusPhase
  const speed = Math.min(Math.abs(velocity), 1)
  const directionSign = direction || 1
  const seed = preset.seed || 0
  const seedWave = Math.sin(seed * .071) * .15
  const pulse = Math.sin(sequencePhase * Math.PI) * sequenceEnergy
  const boost = role === 'title' ? 1.08 : role === 'camera' ? .72 : role === 'cta' ? 1.05 : role === 'rule' ? .55 : 1
  const index = Number.isFinite(preset.index) ? preset.index : 0
  const stagger = Math.sin(index * .9 + sequencePhase * Math.PI) * sequenceEnergy * .035
  return {
    x: (f.x * v.distance * edge * 72 + directionSign * speed * f.x * 12 + seedWave * (1 - edge) * 8) * boost,
    y: (f.y * v.distance * edge * 76 - directionSign * speed * f.y * 7 + pulse * f.y * 5 + stagger * 22) * boost,
    z: f.z * v.distance * edge * 62 + pulse * f.z * 8,
    scale: 1 - edge * (1 - v.scale) + pulse * (['breath','pulse','scale','zoom'].includes(preset.family) ? .016 : .005),
    rotate: f.rotate * edge * v.rotation + directionSign * speed * f.rotate * 1.2 + pulse * f.rotate * .8,
    blur: Math.min(edge * v.blur * 4 + speed * v.blur * .5, 1.1),
    skew: f.x * directionSign * speed * (preset.family === 'skew' ? 3.5 : preset.family === 'whip' ? 2.2 : 1.1),
    opacity: clamp(.66 + focusPhase * .34 + pulse * .035),
  }
}

const isCompactBlurCandidate = (node) => {
  if (!(node instanceof HTMLElement)) return false
  if (node.matches('.section-title,.hero h1,.hero-number,.contact .section-title,section[data-motion-section],.container')) return false
  const rect = node.getBoundingClientRect()
  const area = rect.width * rect.height
  const textLength = (node.textContent || '').trim().length
  if (area <= 0 || area > 60000 || textLength > 140) return false
  if (node.tagName === 'IMG' || node.tagName === 'VIDEO') return area < 42000
  return true
}

const selector = ['[data-motion-preset]','[data-motion]','.section-label','.section-title','.cta-buttons','.contact-email','.about-item','.service-item','.portfolio-item','.hero h1','.hero p','.hero-number','footer [data-motion]'].join(',')
const fallbacks = ['FadeCinematic','RiseFluid','ParallaxDeep','DepthCinematic','GlideSmooth','RevealSlow','TrackWide','ZoomCinematic','FocusSoft','FloatFluid','WhipFast','SweepFluid','OrbitCinematic','WaveSmooth','SpringElastic','MagneticMicro','RackFocusCinematic','DollySlow','CascadeCinematic','SplitTextFluid']

const getSequenceState = (sequence, progress) => {
  const beats = sequence?.beats || []
  if (!beats.length) return { phase: 0, beatIndex: -1, energy: 0, overlap: 0 }
  let beatIndex = 0
  for (let i = 0; i < beats.length; i += 1) { if (progress >= beats[i].at) beatIndex = i; else break }
  const current = beats[beatIndex]
  const next = beats[Math.min(beatIndex + 1, beats.length - 1)]
  const span = Math.max((next?.at ?? 1) - current.at, .001)
  const phase = clamp((progress - current.at) / span)
  return { phase, beatIndex, energy: clamp((1 - Math.abs(phase * 2 - 1)) * (sequence.intensity ?? .7)), overlap: current.overlap || 0 }
}

export const applyMotionPreset = (element, presetName, state, dynamic = null) => {
  if (!element) return
  const base = typeof presetName === 'string' ? getMotionPreset(presetName) : presetName
  const preset = { ...base, index: Number(element.style.getPropertyValue('--motion-index')) || 0 }
  const role = element.dataset.motionRole || ''
  const values = resolveTransform(preset, state.progress ?? .5, state.velocity ?? 0, state.direction ?? 1, state.sequenceEnergy ?? 0, state.sequencePhase ?? 0, role)
  const duration = variantMap[preset.variant]?.duration ?? 1.2
  if (dynamic) {
    values.x += dynamic.x
    values.y += dynamic.y
    values.z += dynamic.z
    values.rotate += dynamic.rz
    values.scale *= dynamic.scale
    values.opacity *= dynamic.opacity
  }
  element.style.setProperty('--motion-x', `${values.x.toFixed(2)}px`)
  element.style.setProperty('--motion-y', `${values.y.toFixed(2)}px`)
  element.style.setProperty('--motion-z', `${values.z.toFixed(2)}px`)
  element.style.setProperty('--motion-scale', values.scale.toFixed(4))
  element.style.setProperty('--motion-rotate', `${values.rotate.toFixed(3)}deg`)
  element.style.setProperty('--motion-blur', `${values.blur.toFixed(2)}px`)
  element.style.setProperty('--motion-skew', `${values.skew.toFixed(3)}deg`)
  element.style.setProperty('--motion-opacity', values.opacity.toFixed(4))
  element.style.setProperty('--motion-duration', `${duration}s`)
  if (dynamic) {
    element.style.setProperty('--motion-dynamic-energy', dynamic.energy.toFixed(4))
    element.style.setProperty('--motion-dynamic-focus', dynamic.focus.toFixed(4))
    element.style.setProperty('--motion-dynamic-depth', dynamic.depth.toFixed(4))
    element.style.setProperty('--motion-dynamic-mode', dynamic.mode)
  }
}

export const stampMotionPreset = (root = document) => {
  const nodes = [...root.querySelectorAll(selector)]
  nodes.forEach((node, index) => {
    if (!node.dataset.motionPreset) node.dataset.motionPreset = fallbacks[index % fallbacks.length]
    node.style.setProperty('--motion-index', String(index % 24))
    node.style.setProperty('--motion-seed', String(index % 97))
    node.toggleAttribute('data-motion-blur-safe', isCompactBlurCandidate(node))
    node.classList.toggle('motion-no-blur', !node.hasAttribute('data-motion-blur-safe'))
  })
  primeDynamicState(root)
  return nodes
}

export const createMotionDirector = ({ root = document } = {}) => {
  const nodes = stampMotionPreset(root)
  const smoothVelocity = { value: 0 }
  const sequence = getMotionSequence(root instanceof Element ? root.dataset.motionSequence || 'OpeningFilm' : 'OpeningFilm')

  const render = (state) => {
    smoothVelocity.value += ((state.velocity || 0) - smoothVelocity.value) * .14
    const next = { ...state, velocity: smoothVelocity.value }
    const sequenceState = getSequenceState(sequence, next.progress ?? .5)
    root.style.setProperty('--sequence-progress', String(next.progress ?? 0))
    root.style.setProperty('--sequence-phase', sequenceState.phase.toFixed(4))
    root.style.setProperty('--sequence-energy', sequenceState.energy.toFixed(4))
    root.style.setProperty('--sequence-beat', String(sequenceState.beatIndex))
    root.style.setProperty('--sequence-overlap', String(sequenceState.overlap))

    nodes.forEach((node) => {
      const dynamic = solveDynamicMotion(node, {
        ...next,
        sequenceEnergy: sequenceState.energy,
        sequencePhase: sequenceState.phase,
        sequenceBeat: sequenceState.beatIndex,
      })
      applyMotionPreset(node, node.dataset.motionPreset, {
        ...next,
        sequenceEnergy: sequenceState.energy,
        sequencePhase: sequenceState.phase,
      }, dynamic)
    })
  }

  return { render, nodes, presetCount: nodes.length, sequence, sequenceName: sequence.name }
}
