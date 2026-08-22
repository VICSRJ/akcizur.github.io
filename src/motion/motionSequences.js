/* =========================================================
   ORIGINAL CINEMATIC SEQUENCES
   A sequence is a choreographed composition of atomic motion.
   It is intentionally separate from the 900-preset library.
   ========================================================= */

const seq = (name, beats, options = {}) => Object.freeze({
  name,
  beats: Object.freeze(beats.map((beat) => Object.freeze({
    at: beat.at,
    to: beat.to,
    ease: beat.ease || 'cinematic',
    overlap: beat.overlap || 0,
  }))),
  ...options,
})

export const MOTION_SEQUENCES = Object.freeze({
  OpeningFilm: seq('OpeningFilm', [
    { at: 0.00, to: 'hero-number', ease: 'deep' },
    { at: 0.08, to: 'hero-title', ease: 'slow' },
    { at: 0.19, to: 'hero-copy', ease: 'smooth', overlap: 0.08 },
    { at: 0.31, to: 'hero-actions', ease: 'sharp', overlap: 0.06 },
    { at: 0.52, to: 'hero-lock', ease: 'micro' },
    { at: 0.72, to: 'hero-exit', ease: 'wide' },
    { at: 0.88, to: 'next-scene-preload', ease: 'fluid' },
  ], { mode: 'scroll', tone: 'opening', intensity: 0.82 }),

  EditorialCurtain: seq('EditorialCurtain', [
    { at: 0.00, to: 'label-rise', ease: 'sharp' },
    { at: 0.10, to: 'title-clip', ease: 'cinematic' },
    { at: 0.24, to: 'title-settle', ease: 'smooth', overlap: 0.10 },
    { at: 0.38, to: 'body-reveal', ease: 'fluid' },
    { at: 0.52, to: 'grid-rise', ease: 'cinematic' },
    { at: 0.64, to: 'grid-lock', ease: 'micro' },
    { at: 0.78, to: 'chapter-exit', ease: 'slow' },
  ], { mode: 'scroll', tone: 'editorial', intensity: 0.76 }),

  LayeredParallax: seq('LayeredParallax', [
    { at: 0.00, to: 'background-drift', ease: 'deep' },
    { at: 0.12, to: 'midground-track', ease: 'wide', overlap: 0.12 },
    { at: 0.24, to: 'foreground-rise', ease: 'smooth', overlap: 0.12 },
    { at: 0.42, to: 'focus-lock', ease: 'micro' },
    { at: 0.62, to: 'counter-parallax', ease: 'fluid' },
    { at: 0.80, to: 'depth-release', ease: 'slow' },
  ], { mode: 'continuous', tone: 'depth', intensity: 0.88 }),

  ServicesRhythm: seq('ServicesRhythm', [
    { at: 0.00, to: 'number-track', ease: 'sharp' },
    { at: 0.12, to: 'title-sweep', ease: 'fast' },
    { at: 0.22, to: 'description-follow', ease: 'fluid', overlap: 0.10 },
    { at: 0.34, to: 'line-trace', ease: 'micro' },
    { at: 0.46, to: 'next-row-anticipate', ease: 'smooth' },
    { at: 0.64, to: 'rhythm-pass', ease: 'cinematic' },
    { at: 0.82, to: 'service-exit', ease: 'wide' },
  ], { mode: 'scroll', tone: 'rhythm', intensity: 0.72 }),

  PortfolioSweep: seq('PortfolioSweep', [
    { at: 0.00, to: 'grid-enter', ease: 'wide' },
    { at: 0.10, to: 'card-one-focus', ease: 'cinematic' },
    { at: 0.24, to: 'card-two-focus', ease: 'fluid', overlap: 0.08 },
    { at: 0.38, to: 'card-three-focus', ease: 'fluid', overlap: 0.08 },
    { at: 0.52, to: 'card-four-focus', ease: 'fluid', overlap: 0.08 },
    { at: 0.66, to: 'counter-sweep', ease: 'wide' },
    { at: 0.84, to: 'portfolio-lock', ease: 'slow' },
  ], { mode: 'scroll', tone: 'gallery', intensity: 0.86 }),

  ContactClimax: seq('ContactClimax', [
    { at: 0.00, to: 'ambient-silence', ease: 'slow' },
    { at: 0.18, to: 'label-emerge', ease: 'soft' },
    { at: 0.31, to: 'headline-expand', ease: 'deep' },
    { at: 0.47, to: 'headline-lock', ease: 'micro' },
    { at: 0.61, to: 'cta-arrive', ease: 'cinematic' },
    { at: 0.76, to: 'scene-breathe', ease: 'slow' },
    { at: 0.91, to: 'resolution', ease: 'fluid' },
  ], { mode: 'scroll', tone: 'climax', intensity: 0.68 }),

  VelocityWhip: seq('VelocityWhip', [
    { at: 0.00, to: 'velocity-capture', ease: 'fast' },
    { at: 0.18, to: 'whip-left', ease: 'sharp' },
    { at: 0.34, to: 'whip-right', ease: 'sharp', overlap: 0.06 },
    { at: 0.52, to: 'center-lock', ease: 'micro' },
    { at: 0.68, to: 'velocity-release', ease: 'smooth' },
  ], { mode: 'velocity', tone: 'kinetic', intensity: 0.92 }),

  SlowCinema: seq('SlowCinema', [
    { at: 0.00, to: 'deep-enter', ease: 'deep' },
    { at: 0.20, to: 'focus-bloom', ease: 'slow' },
    { at: 0.42, to: 'micro-drift', ease: 'fluid' },
    { at: 0.66, to: 'camera-breathe', ease: 'slow' },
    { at: 0.86, to: 'soft-release', ease: 'smooth' },
  ], { mode: 'scroll', tone: 'quiet', intensity: 0.46 }),
})

export const MOTION_SEQUENCE_LIST = Object.freeze(Object.values(MOTION_SEQUENCES))
export const MOTION_SEQUENCE_COUNT = MOTION_SEQUENCE_LIST.length
export const getMotionSequence = (name = 'OpeningFilm') => MOTION_SEQUENCES[name] || MOTION_SEQUENCES.OpeningFilm
