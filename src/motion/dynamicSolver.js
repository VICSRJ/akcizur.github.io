const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const lerp = (a, b, t) => a + (b - a) * t
const damp = (current, target, factor) => lerp(current, target, 1 - Math.exp(-factor))

const ROLE_PROFILE = {
  camera: { depth: 0.35, response: 0.55, elasticity: 0.08, inertia: 0.82 },
  title: { depth: 0.55, response: 0.78, elasticity: 0.16, inertia: 0.68 },
  copy: { depth: 0.28, response: 0.62, elasticity: 0.10, inertia: 0.58 },
  kicker: { depth: 0.18, response: 0.88, elasticity: 0.08, inertia: 0.45 },
  actions: { depth: 0.36, response: 0.82, elasticity: 0.14, inertia: 0.64 },
  cta: { depth: 0.42, response: 0.9, elasticity: 0.18, inertia: 0.62 },
  depth: { depth: 0.82, response: 0.48, elasticity: 0.12, inertia: 0.9 },
  icon: { depth: 0.68, response: 0.86, elasticity: 0.22, inertia: 0.52 },
  heading: { depth: 0.52, response: 0.76, elasticity: 0.14, inertia: 0.6 },
  body: { depth: 0.22, response: 0.56, elasticity: 0.08, inertia: 0.5 },
  index: { depth: 0.72, response: 0.92, elasticity: 0.2, inertia: 0.72 },
  surface: { depth: 0.48, response: 0.62, elasticity: 0.1, inertia: 0.84 },
  content: { depth: 0.38, response: 0.68, elasticity: 0.1, inertia: 0.62 },
  meta: { depth: 0.2, response: 0.72, elasticity: 0.08, inertia: 0.5 },
  rule: { depth: 0.12, response: 0.96, elasticity: 0.06, inertia: 0.34 },
  credits: { depth: 0.14, response: 0.62, elasticity: 0.08, inertia: 0.44 },
  links: { depth: 0.18, response: 0.82, elasticity: 0.12, inertia: 0.48 },
  control: { depth: 0.16, response: 0.9, elasticity: 0.18, inertia: 0.4 },
  card: { depth: 0.5, response: 0.72, elasticity: 0.16, inertia: 0.72 },
}

const DEFAULT_PROFILE = { depth: 0.32, response: 0.68, elasticity: 0.12, inertia: 0.62 }

export const RELATIONS = Object.freeze({
  'about-card-1': { follow: [['about-card-1', 0]], counter: 0 },
  'about-card-2': { follow: [['about-card-1', 0.22]], counter: 0.08 },
  'about-card-3': { follow: [['about-card-2', 0.24]], counter: 0.12 },
})

const stateByElement = new WeakMap()

const getState = (element) => {
  let state = stateByElement.get(element)
  if (!state) {
    state = {
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      rx: 0, ry: 0, rz: 0,
      scale: 1,
      opacity: 1,
    }
    stateByElement.set(element, state)
  }
  return state
}

const roleProfile = (element) => ROLE_PROFILE[element.dataset.motionRole] || DEFAULT_PROFILE

const getElementIndex = (element) => Number(element.style.getPropertyValue('--motion-index')) || 0

export const solveDynamicMotion = (element, input) => {
  const state = getState(element)
  const profile = roleProfile(element)
  const progress = clamp(input.progress ?? 0.5)
  const focus = clamp(input.focus ?? 0)
  const energy = clamp(input.sequenceEnergy ?? input.energy ?? 0)
  const phase = clamp(input.sequencePhase ?? 0)
  const velocity = Number(input.velocity || 0)
  const direction = Number(input.direction || 1)
  const distance = Number(input.distance || 0)
  const index = getElementIndex(element)
  const localPulse = Math.sin(phase * Math.PI)
  const focusCurve = smoothFocus(focus)
  const cinematicMode = velocity > 0.72 ? 'kinetic' : velocity < 0.18 ? 'slow' : 'fluid'

  const role = element.dataset.motionRole || 'content'
  const modeFactor = cinematicMode === 'kinetic' ? 1.18 : cinematicMode === 'slow' ? 0.76 : 1
  const stagger = clamp(index / 12, 0, 1)
  const depth = profile.depth * (1 + energy * 0.22)

  const target = {
    x: distance * depth * -18 * profile.response,
    y: (1 - focusCurve) * (20 + depth * 22) - velocity * direction * profile.inertia * 8,
    z: -distance * depth * 34,
    rx: (1 - focusCurve) * profile.elasticity * -4 + velocity * direction * profile.elasticity * 0.8,
    ry: distance * depth * 3.2,
    rz: direction * velocity * profile.elasticity * 1.8,
    scale: 1 - (1 - focusCurve) * (0.016 + (1 - profile.response) * 0.018),
    opacity: clamp(0.56 + focusCurve * 0.44 + localPulse * energy * 0.035),
  }

  if (role === 'title') {
    target.x += Math.sin(phase * Math.PI * 0.9) * energy * 3.5
    target.scale += localPulse * energy * 0.012
  }

  if (role === 'icon') {
    target.x += Math.sin((phase + stagger) * Math.PI * 2) * energy * 7
    target.y -= localPulse * energy * 4
    target.rz += Math.sin((phase + stagger) * Math.PI * 2) * energy * 1.2
  }

  if (role === 'rule') {
    target.x *= 0.45
    target.y *= 0.45
    target.scale = 0.35 + focusCurve * 0.65 + energy * 0.08
    target.opacity = 0.14 + focusCurve * 0.86
  }

  const stiffness = (108 + profile.response * 112) * modeFactor
  const damping = 18 + profile.inertia * 12
  const factor = clamp(stiffness / (damping * 12), 0.06, 0.28)

  state.x = damp(state.x, target.x, factor)
  state.y = damp(state.y, target.y, factor)
  state.z = damp(state.z, target.z, factor * 0.9)
  state.rx = damp(state.rx, target.rx, factor)
  state.ry = damp(state.ry, target.ry, factor)
  state.rz = damp(state.rz, target.rz, factor)
  state.scale = damp(state.scale, target.scale, factor)
  state.opacity = damp(state.opacity, target.opacity, factor * 1.2)

  state.vx = state.x - target.x
  state.vy = state.y - target.y
  state.vz = state.z - target.z

  return {
    ...state,
    mode: cinematicMode,
    energy,
    focus: focusCurve,
    depth,
  }
}

const smoothFocus = (value) => value * value * (3 - 2 * value)

export const primeDynamicState = (root) => {
  if (!root) return
  root.querySelectorAll('[data-motion-role], [data-motion-preset], [data-motion]').forEach((node) => getState(node))
}

export const clearDynamicState = () => stateByElement
