# Generative Mandala System Architecture

## Vision

Transform the mandala maker from a manual layer-by-layer tool into a **generative system** with Serum-style macro controls. Simple knobs control complex underlying algorithms. Outputs can be static images or animated sequences.

---

## Core Concept: Macro Controls

Inspired by Serum's macro system where 1-4 knobs modulate dozens of underlying parameters:

```
MACRO A: "Complexity"
├── Maps to: layer count, segment count, recursion depth
├── Range: 0-1
└── Low = simple, High = intricate

MACRO B: "Evolution"
├── Maps to: twist, scale falloff, rotation offset
├── Range: 0-1
└── Low = uniform, High = dynamic morphing

MACRO C: "Dimension"
├── Maps to: z-spacing, perspective tilt, depth blur
├── Range: 0-1
└── Low = flat 2D, High = deep 3D cross-section

MACRO D: "Energy"
├── Maps to: color saturation, line thickness, fill opacity
├── Range: 0-1
└── Low = subtle, High = vibrant
```

---

## Architecture

### 1. Generator Engine

Procedural pattern generators that produce geometry:

```javascript
// Pattern types
const GENERATORS = {
  // Radial symmetry patterns
  rosette: (config) => generateRosetteGeometry(config),
  spiral: (config) => generateSpiralGeometry(config),    // Like logo animation
  flower: (config) => generateFlowerGeometry(config),

  // Mathematical curves
  lissajous: (config) => generateLissajousGeometry(config),
  spirograph: (config) => generateSpirographGeometry(config),

  // Recursive/fractal
  tree: (config) => generateBranchingGeometry(config),
  mandelbrot: (config) => generateMandelbrotGeometry(config),

  // Geometric tiling
  islamic: (config) => generateIslamicGeometry(config),
  penrose: (config) => generatePenroseGeometry(config),
};
```

### 2. Layer Stack

Like the logo animation, mandalas are composed of stacked layers:

```javascript
const LAYER_CONFIG = {
  count: 12,                    // Number of layers
  radiusStart: 2.0,             // Outer radius
  radiusEnd: 0.2,               // Inner radius (or center)
  radiusCurve: 'exponential',   // linear | exponential | stepped

  rotation: {
    twist: -0.6,                // Total rotation change
    offset: Math.PI / 6,        // Starting offset
  },

  depth: {
    spacing: 0.25,              // Z-axis layer separation
    mode: 'stacked',            // stacked | flat | orbital
  },

  style: {
    strokeWidth: [3.5, 1.0],    // Outer to inner
    fillOpacity: [0.08, 0.12],  // Outer to inner
    blendMode: 'additive',
  }
};
```

### 3. Animation System

Two modes:

**A. Timeline Mode** (keyframe-based)
```javascript
const TIMELINE = {
  duration: 10,  // seconds
  keyframes: [
    { time: 0, macroA: 0.3, macroB: 0.5 },
    { time: 5, macroA: 0.8, macroB: 0.7 },
    { time: 10, macroA: 0.3, macroB: 0.5 },
  ],
  easing: 'easeInOutCubic',
  loop: true,
};
```

**B. LFO Mode** (Serum-style automation)
```javascript
const AUTOMATION = {
  macroA: {
    type: 'sine',           // sine | triangle | saw | random
    frequency: 0.1,         // Hz
    amplitude: 0.3,         // Modulation depth
    offset: 0.5,            // Center value
    phase: 0,               // Starting phase
  },
  // Different LFO per macro creates organic evolution
};
```

### 4. 3D Cross-Section Mode

Mandalas as slices through 3D geometry:

```javascript
const CROSS_SECTION = {
  enabled: true,
  geometry: 'torus',        // sphere | torus | cone | custom
  sliceAxis: 'z',           // Which axis to slice along
  slicePosition: 0.5,       // Where in the geometry (0-1)
  animate: {
    oscillate: true,        // Move slice through geometry
    range: [0.2, 0.8],      // Oscillation bounds
    speed: 0.1,
  },
};
```

---

## Three.js Implementation

Based on the logo animation pattern:

```javascript
// Core render setup
import * as THREE from 'three';
import { Line2, LineMaterial, LineGeometry } from 'three/addons/lines/...';

class MandalaRenderer {
  constructor(canvas) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.layers = [];
  }

  generateMandala(config, macros) {
    // Clear existing
    this.clearLayers();

    // Expand macros to full config
    const expanded = this.expandMacros(macros, config);

    // Generate layers
    for (let i = 0; i < expanded.layerCount; i++) {
      const progress = i / (expanded.layerCount - 1);
      const layer = this.createLayer(i, progress, expanded);
      this.layers.push(layer);
      this.scene.add(layer.group);
    }
  }

  createLayer(index, progress, config) {
    // Generate geometry based on pattern type
    const generator = GENERATORS[config.pattern];
    const vertices = generator({ ...config, progress });

    // Create stroke (Line2 for thickness control)
    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(vertices.flat());

    const lineMaterial = new LineMaterial({
      color: this.getLayerColor(progress, config),
      linewidth: this.interpolate(config.strokeWidth, progress),
      resolution: new THREE.Vector2(w, h),
    });

    const line = new Line2(lineGeometry, lineMaterial);

    // Create fill (ShapeGeometry)
    const fill = this.createFill(vertices, progress, config);

    const group = new THREE.Group();
    group.add(line);
    group.add(fill);
    group.position.z = index * config.depth.spacing;

    return { group, line, fill, lineMaterial };
  }

  animate(timestamp) {
    // Apply LFOs or timeline
    const macros = this.evaluateAutomation(timestamp);

    // Update layer properties
    this.layers.forEach((layer, i) => {
      const progress = i / (this.layers.length - 1);
      // Update colors, rotations, etc. based on macros
    });

    // Global rotations
    this.container.rotation.z += 0.01;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
}
```

---

## UI Design

Minimal, dark aesthetic (keep existing Satoshi + frosted glass):

```
┌─────────────────────────────────────────────────────────────┐
│  MANDALA MAKER                              [PNG] [SVG] [⚙] │
├────────────────────┬────────────────────────────────────────┤
│                    │                                        │
│  PATTERN           │                                        │
│  ○ Rosette         │                                        │
│  ○ Spiral          │              [CANVAS]                  │
│  ○ Flower          │                                        │
│  ○ Spirograph      │                                        │
│                    │                                        │
│  ─────────────────────────────────────────                  │
│                    │                                        │
│  MACROS            │                                        │
│                    │                                        │
│  Complexity        │                                        │
│  ●────────○ 0.65   │                                        │
│                    │                                        │
│  Evolution         │                                        │
│  ○────●────○ 0.42  │                                        │
│                    │                                        │
│  Dimension         │                                        │
│  ○──────●──○ 0.78  │                                        │
│                    │                                        │
│  Energy            │                                        │
│  ●─────────○ 0.33  │                                        │
│                    │                                        │
│  ─────────────────────────────────────────                  │
│                    │                                        │
│  COLOR             │                                        │
│  [████] Hue: 15°   │                                        │
│                    │                                        │
│  ─────────────────────────────────────────                  │
│                    │                                        │
│  ANIMATION         │                                        │
│  [▶ Play] [■ Stop] │                                        │
│  Duration: 10s     │                                        │
│  ○ Loop            │                                        │
│                    │                                        │
└────────────────────┴────────────────────────────────────────┘
```

---

## File Structure

```
mandala-maker/
├── index.html
├── css/
│   └── styles.css           # Keep existing dark frosted aesthetic
├── js/
│   ├── main.js              # App initialization
│   ├── renderer.js          # Three.js scene management
│   ├── generators/          # Pattern generators
│   │   ├── rosette.js
│   │   ├── spiral.js
│   │   ├── flower.js
│   │   └── spirograph.js
│   ├── macros.js            # Macro → parameter mapping
│   ├── animation.js         # Timeline + LFO system
│   └── export.js            # PNG/SVG/Video export
└── ARCHITECTURE.md          # This file
```

---

## MCP Integration (Future)

For AI-driven mandala generation:

```javascript
// MCP tool definition
{
  name: "generate_mandala",
  description: "Generate a mandala with specified characteristics",
  parameters: {
    style: "calm | energetic | complex | minimal",
    color_mood: "warm | cool | monochrome | vibrant",
    complexity: 0-1,
    description: "free text description of desired output"
  }
}

// AI interprets description → macro values
// "A calm, meditative mandala with subtle blue tones"
// → { macroA: 0.3, macroB: 0.2, macroC: 0.4, macroD: 0.25, hue: 210 }
```

---

## Export Options

1. **PNG** - High-res raster (16x canvas size)
2. **SVG** - Vector output for print/editing
3. **Video** - Screen capture or WebM export of animation
4. **GIF** - Animated GIF from timeline
5. **JSON** - Save/load configuration for sharing

---

## Next Steps

1. Create Three.js prototype with spiral generator (from logo animation)
2. Implement macro control system
3. Add 2-3 additional generators (rosette, flower)
4. Build animation timeline
5. Export functionality
6. Polish UI

---

*This replaces the manual layer-by-layer approach with generative, controllable patterns.*
