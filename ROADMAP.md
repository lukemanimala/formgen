# Formgen Roadmap

## Vision

**Formgen is an environment engine** — software that composes immersive spaces.

The browser is the creative interface. The outputs extend beyond the screen into the physical world.

> A single patch should be capable of transforming an ordinary room into an immersive experience.

### Philosophy

- The room is the canvas
- Software isn't the final product — the experience is
- Users compose atmosphere, not program devices
- Figma for immersive environments: powerful yet approachable

### Core Abstraction

Patches describe **intent**, not hardware:

```yaml
Scene:
  Visual:
    Patch: Fractal Bloom
  Lighting:
    Color: Cyan
    Energy: 70%
  Atmosphere:
    Density: 35%
  Audio:
    Source: Microphone
```

The engine determines how intent translates to every connected output.

---

## Current State

**Browser engine functional:**
- 7 pattern generators (Spiral, Mandala, Star, Polygon, Rosette, Flower, Spirograph)
- 5 macro controls (Layers, Twist, Depth, Energy, Energy Shift)
- 4 LFO system with multi-target modulation
- Audio-reactive (Bass, Mid, Treble frequency bands)
- Video export (MP4/WebM, up to 4K, native resolution)
- Presets system (8 built-in + custom save/load)
- Autosave session persistence
- Command palette (Cmd+K)

**Current blockers:**
- [x] Timeline/sequencing for full-song content
- [x] Native resolution recording (fixed)
- [ ] One undeniably impressive output to validate the core

---

## Phase 0: Prove the Core

**Gate**: Create one 3-minute patch that makes people say "holy shit"

This is the prerequisite for everything else. Physical outputs won't fix weak visuals — they'll just distribute them across more surfaces.

### Tasks
- [x] Fix recording resolution (render at native target)
- [x] Basic timeline with keyframes
- [x] Audio-synced scrubbing
- [ ] Create ONE compelling demo (film it, post it)

### Success Metrics
- Personal conviction: "This is undeniably good"
- External reaction: Unprompted shares, "how did you make this?"

---

## Phase 1: Browser Foundation

**Gate**: 10 people use it without explanation

### Tasks
- [x] Timeline/keyframe system for sequenced animation
- [ ] Beat grid overlay (manual BPM input)
- [ ] Landing page with live demo
- [ ] More pattern generators
- [ ] SVG export for print/laser

### Audio Philosophy
Start with laptop microphone. No mixer, no routing, no audio interface. Open Spotify, press play, environment responds. Friction removal > perfect sync.

---

## Phase 2: Physical Lighting

**Gate**: Phase 0 validated — core visuals are compelling

**Status**: Hardware acquired
- Chauvet DMX-AN 2 (Art-Net/sACN node)

### Architecture
```
Browser UI
    ↓
Local Formgen Agent
    ↓
Art-Net
    ↓
Chauvet Node
    ↓
DMX PARs
```

### First Milestone (intentionally tiny)
- [ ] Connect to node
- [ ] Control brightness
- [ ] Control RGB
- [ ] Map microphone loudness to intensity

### Hardware Next
- 2x RGBW DMX PAR lights

---

## Phase 3: Projection

**Gate**: DMX control proven

Add projector output. Single patch now drives:
- Browser visuals
- Projected visuals
- Physical lighting

The projector becomes another canvas. The lights become another brush.

---

## Phase 4: Atmosphere

**Gate**: Projection integrated

Add compact DMX hazer.

This may be the biggest leap in immersion:
- Without haze: light hits surfaces
- With haze: light occupies space

The air becomes part of the sculpture.

---

## Phase 5: Geometry

**Gate**: Atmosphere proven

Introduce RGB laser.

- Projected visuals create surfaces
- PARs create illumination
- Lasers create floating geometry

The experience shifts from lighting toward spatial sculpture.

---

## Phase 6: Ambient Architecture

**Gate**: Core installation complete

Integrate Philips Hue for:
- Wall washes
- Room ambience
- Transitions
- Extending scenes beyond the installation

Fast effects → DMX. Ambient effects → Hue.

---

## Phase 7: Spatial Computing

**Gate**: As AR hardware matures (Spectacles, Android XR, Meta, Apple)

Formgen patches gain optional AR outputs. Physical installation remains primary — AR reveals another layer. Nobody wearing glasses required.

---

## Hardware Philosophy

Every purchase should noticeably increase immersion.

**Priority order:**
1. Browser visuals (free)
2. Projector
3. DMX PARs
4. Hazer
5. Laser
6. Hue
7. AR

Each expands the same patch format rather than creating another workflow.

---

## What Formgen Is Not

- Not replacing lighting consoles (MA, ETC, Chamsys)
- Not replacing TouchDesigner/Notch
- Not another VJ application

Instead: **the simplest way to compose immersive environments**.

A musician should be able to create a room.
A designer should be able to create an installation.
An educator should be able to transform a classroom.
An artist should be able to build an exhibit.

Without becoming a DMX expert.
Without becoming a creative coder.

---

## Success Metric

Can someone walk into an ordinary room, press Play, and watch it transform into something unforgettable?

---

*Last updated: 2026-07-15*
