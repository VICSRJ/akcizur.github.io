# RUZICKA Jakub — Vue + Vite

Minimalistické portfolio ve Vue + Vite s filmovým scroll-sync motion systémem.

## Cinematic Motion Architecture

```text
scroll
  ↓
scene state
  ↓
sequence beats / phase / energy
  ↓
900 atomic presets
  ↓
element role choreography
  ↓
GPU transform + opacity
```

### Element-level choreography

Každý významný prvek má vlastní:

- `data-motion-id` — stabilní identita animace
- `data-motion-role` — význam prvku v dramaturgii
- `data-motion-preset` — konkrétní motion recipe

Používané role: `camera`, `title`, `copy`, `kicker`, `actions`, `cta`, `depth`, `icon`, `heading`, `body`, `index`, `surface`, `content`, `meta`, `rule`, `credits`, `links`, `control`.

Díky tomu se například portfolio karta skládá z několika nezávislých vrstev: surface → content → index → heading → meta → rule.

### 900 presetů

`src/motion/motionPresets.js` generuje 75 motion families × 12 variant = 900 parametrických presetů.

### Original sequences

`src/motion/motionSequences.js` obsahuje vícefázové choreografie:

`OpeningFilm` · `EditorialCurtain` · `LayeredParallax` · `ServicesRhythm` · `PortfolioSweep` · `ContactClimax` · `VelocityWhip` · `SlowCinema`

Každá sekvence má beat timing, overlap, phase a energy. Tyto hodnoty přímo modifikují motion jednotlivých elementů.

### Výkon

Velké plochy, hero typografie a celé scény nepoužívají plošný blur. Blur je povolen pouze na malých bezpečných prvcích. Primární animace používají transform/opacity a scroll state je frame-synchronizovaný.

### Accessibility

`prefers-reduced-motion` deaktivuje transformace, blur a transition layers.

## Spuštění

```bash
npm install
npm run dev
npm run build
```

## GitHub Pages

```bash
VITE_BASE_PATH=/nazev-repozitare/ npm run build
```

Workflow `.github/workflows/deploy.yml` nastavuje base path automaticky podle názvu repozitáře.

## Struktura

- `src/components` — element-level sekce
- `src/content` — obsah a data
- `src/composables` — smooth scroll + scene orchestration
- `src/motion/motionPresets.js` — 900 atomic presets
- `src/motion/motionSequences.js` — cinematic sequences
- `src/motion/motionDirector.js` — element resolver + sequence energy
- `src/styles/animations.css` — initial reveal layer
- `src/styles/story.css` — camera / scene layer
- `src/styles/motion.css` — element-level output
- `src/styles/mobile.css` — responsive motion profile
- `public/img` — SVG assets
