const families = ['Fade', 'Rise', 'Drop', 'SlideLeft', 'SlideRight', 'Scale', 'Blur', 'Focus', 'Reveal', 'Clip', 'Mask', 'Push', 'Pull', 'Drift', 'Float', 'Parallax', 'Depth', 'Rotate', 'Skew', 'Split', 'Curtain', 'Glide', 'Track', 'Zoom', 'Pulse', 'Whip', 'Sweep', 'Wipe', 'Shutter', 'Fold', 'Unfold', 'Flip', 'Orbit', 'Arc', 'Wave', 'Ripple', 'Elastic', 'Bounce', 'Spring', 'Snap', 'Magnetic', 'FloatUp', 'FloatDown', 'DriftLeft', 'DriftRight', 'DriftUp', 'DriftDown', 'Pan', 'Tilt', 'Roll', 'Lens', 'RackFocus', 'Dolly', 'Truck', 'Pedestal', 'Crane', 'Boom', 'Jitter', 'Vibrate', 'Breath', 'Glow', 'Trace', 'Draw', 'Erase', 'Stretch', 'Compress', 'Expand', 'Contract', 'Cascade', 'Domino', 'Stack', 'Fan', 'Scatter', 'Assemble', 'SplitText']
const variants = ['Soft', 'Strong', 'Slow', 'Fast', 'Elastic', 'Smooth', 'Sharp', 'Cinematic', 'Fluid', 'Deep', 'Wide', 'Micro']

export const MOTION_PRESETS = Object.freeze(Object.fromEntries(
  families.flatMap((family, familyIndex) =>
    variants.map((variant, variantIndex) => {
      const id = familyIndex * variants.length + variantIndex + 1
      return [
        `${family}${variant}`,
        Object.freeze({
          id,
          name: `${family}${variant}`,
          family: family.toLowerCase(),
          variant: variant.toLowerCase(),
          seed: familyIndex * 37 + variantIndex * 11,
          familyIndex,
          variantIndex,
        }),
      ]
    }),
  ),
))

export const MOTION_PRESET_LIST = Object.freeze(Object.values(MOTION_PRESETS))
export const MOTION_PRESET_COUNT = MOTION_PRESET_LIST.length

export const getMotionPreset = (name = 'FadeCinematic') =>
  MOTION_PRESETS[name] || MOTION_PRESETS.FadeCinematic
