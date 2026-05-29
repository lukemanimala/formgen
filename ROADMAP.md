# Mandala Maker Roadmap

## Product Thesis (Updated)

**Problem**: Existing mandala tools require manual drawing or tedious layer-by-layer placement. Results depend on drawing skill and lack the polish of professionally designed work.

**Solution**: A **generative mandala system** with Serum-style macro controls. Simple knobs control complex underlying algorithms to produce professional-quality patterns without requiring design skill. Animation and 3D cross-sections add depth impossible with manual tools.

**Differentiator**: Output quality + ease of use. Four sliders produce results that look like a designer made them.

---

## Current State

**V2 Prototype Complete** (`index-v2.html`)
- Three.js-based renderer
- 4 pattern generators: Spiral, Rosette, Flower, Spirograph
- 4 macro controls: Complexity, Evolution, Dimension, Energy
- LFO animation system
- Hue control
- PNG export (4x resolution)

---

## Phase 0: V2 Polish & Personal Use

**Gate**: I actually use this tool regularly

### Tasks
- [ ] Add more pattern generators (Islamic, Penrose, Lissajous)
- [ ] Improve spirograph mathematics
- [ ] Add secondary LFO for compound animations
- [ ] SVG export
- [ ] Save/load presets as JSON
- [ ] Keyboard shortcuts for rapid iteration
- [ ] Full-screen mode

### Success Metrics
- Personal satisfaction
- Creating content I want to share

---

## Phase 1: Public Beta

**Gate**: 5 people understand the value without explanation

### Tasks
- [ ] Landing page with live demo
- [ ] Example gallery (pre-made presets)
- [ ] Video/GIF export for animation
- [ ] Mobile-responsive (or clear desktop messaging)
- [ ] Analytics integration

### Success Metrics
- Qualitative: "This is way faster than X"
- Unprompted shares
- Export rate > 40%

---

## Phase 2: Feature Expansion

**Gate**: 100 users, evidence of creative use

### Tasks
- [ ] 3D cross-section mode (slice through torus, sphere)
- [ ] MCP/AI integration for natural language generation
- [ ] Unsplash integration for background/texture
- [ ] Audio-reactive mode (beat detection → macro modulation)
- [ ] Custom pattern generator (user-defined equations)

### Success Metrics
- Users creating unexpected outputs
- Feature requests indicating engagement

---

## Phase 3: Distribution & Proof

**Gate**: 500 users, clear narrative on what works

### Tasks
- [ ] SEO for "mandala maker", "mandala generator"
- [ ] Product Hunt launch
- [ ] True Impulse case study
- [ ] Creator showcase gallery

### Success Metrics
- Organic search traffic
- Case study ready for publication

---

## Future Vision

Parked until Phase 2 gates are met:

### Advanced Features
- Real-time collaboration
- Physical output (laser cutting files, 3D printing)
- VR/AR mandala visualization

### Monetization (if validated)
- Premium pattern packs
- High-res video export
- API access

---

## Technical Architecture

See `ARCHITECTURE.md` for detailed system design.

### Core Concepts
1. **Macro Controls**: 4 knobs that map to many underlying parameters
2. **Pattern Generators**: Algorithmic geometry (spiral, rosette, flower, spirograph)
3. **Layer Stack**: Z-axis layered geometry with color/opacity interpolation
4. **Animation System**: LFO-based automation + manual timeline

### Files
```
mandala-maker/
├── index.html          # Original layer-based version (deprecated)
├── index-v2.html       # New generative version
├── ARCHITECTURE.md     # Technical design
├── ROADMAP.md          # This file
└── css/styles.css      # Shared styles
```

---

## Next Actions

1. Test V2 prototype personally
2. Add 2-3 more pattern generators
3. Implement SVG export
4. Create 5-10 preset examples
5. Share with small group for feedback

---

*Last updated: 2025-05-28*
