# RUZICKA Jakub — Vue + Vite

Minimalistické portfolio ve Vue + Vite s filmovým scroll-sync motion systémem.

## Spuštění

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

Projekt je připravený pro GitHub Pages i jiné subcesty.

```bash
VITE_BASE_PATH=/nazev-repozitare/ npm run build
```

Workflow `.github/workflows/deploy.yml` nastavuje base path automaticky podle názvu repozitáře.

## Cinematic Motion Engine

Motion systém je rozdělený do čtyř vrstev:

```text
scroll input
   ↓
velocity + direction
   ↓
scene progress / focus / enter / exit
   ↓
Motion Director
   ↓
300 motion presets
   ↓
parallax / depth / blur / scale / rotate / opacity
   ↓
CSS variables + GPU transforms
```

### 300 presetů

`src/motion/motionPresets.js` generuje přesně 300 parametrických recipes:

- 25 motion families
- 12 variant pro každou family
- 300 unikátních presetů
- společná matematika a jednotný runtime

Příklady:

`FadeCinematic` · `RevealCinematic` · `ParallaxDeep` · `DepthCinematic` · `TrackWide` · `CurtainCinematic`

### Scroll sync

`src/composables/useStoryMotion.js` počítá kontinuální stav každé scény:

- progress
- focus
- enter / exit
- travel
- velocity
- direction
- camera X/Y
- scale
- blur
- opacity

Každá scéna má vlastní `Motion Director`, takže se její timeline navzájem nepřepisují.

### Motion Director

`src/motion/motionDirector.js` převádí preset na GPU-friendly CSS variables:

```css
--motion-x
--motion-y
--motion-z
--motion-scale
--motion-rotate
--motion-skew
--motion-blur
--motion-opacity
--motion-duration
```

### Scene choreography

- Hero — opening camera shot
- About — focus / depth reveal
- Services — track / rhythm
- Portfolio — depth / camera sweep
- Contact — cinematic climax / resolution

### Accessibility

`prefers-reduced-motion` deaktivuje transformace, blur a transition layers.

## Struktura

- `src/components` — sekce webu
- `src/content` — obsah a data
- `src/composables` — smooth scroll + scene orchestration
- `src/motion/motionPresets.js` — 300 presetů
- `src/motion/motionDirector.js` — runtime resolver
- `src/styles/animations.css` — základní reveal systém
- `src/styles/story.css` — scene / camera choreography
- `src/styles/motion.css` — Motion Director output
- `src/styles/mobile.css` — responzivní úpravy
- `public/img` — SVG assety
