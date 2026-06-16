# Architecture Decision Records

## ADR-001: Pivot to Model Generation Focus

**Date**: 2024-01-XX

**Context**: Initially built as a complete mandala creation tool with rendering and animation. User feedback indicated desire to use professional tools (Notch, TouchDesigner) for final rendering and animation.

**Decision**: Pivot FormGen to focus on procedural geometry generation with export capabilities, rather than being an end-to-end solution.

**Consequences**:
- Added OBJ export for 3D model output
- Added layer thickness for meaningful 3D geometry
- Reduced emphasis on built-in rendering features
- Users get procedural generation power + professional tool flexibility

---

## ADR-002: WebCodecs for MP4 Export

**Date**: 2024-01-XX

**Context**: Browser MediaRecorder only supports WebM natively. FFmpeg.wasm requires SharedArrayBuffer and special server headers (COOP/COEP), making it unreliable for local development.

**Decision**: Use WebCodecs API with mp4-muxer for native MP4 encoding.

**Consequences**:
- Clean MP4 output without server configuration
- Works in Chrome/Edge 94+, Safari 16.4+
- Firefox falls back to WebM (no WebCodecs support yet)
- Lighter weight than FFmpeg.wasm (~50KB vs ~25MB)

---

## ADR-003: Macro Control System (Serum-style)

**Date**: 2024-01-XX

**Context**: Traditional parameter UIs expose dozens of controls, creating analysis paralysis. Serum synthesizer's macro system proves that 4 knobs can control complex systems effectively.

**Decision**: Implement 4 macro controls (Layers, Twist, Dimension, Energy) that map to multiple underlying parameters.

**Consequences**:
- Simple UI with 4 main knobs
- Professional-looking output without design expertise
- Power users can still access granular controls in Geometry section
- LFOs can target macros for broad animation effects

---

## ADR-004: Camera Path Automation (Front-facing)

**Date**: 2024-01-XX

**Context**: Users wanted smooth camera movements for recording. Initial implementation allowed full 360° orbit, but back of model is less interesting.

**Decision**: Limit camera paths to front-facing movements (half-orbit, ±60° range).

**Consequences**:
- More cinematic recordings focused on the interesting front view
- Orbit, Flyover, Spiral, Zoom, Tilt all stay in front hemisphere
- Simpler mental model for users

---

## ADR-005: Dual LFO System

**Date**: 2024-01-XX

**Context**: Single LFO limited animation possibilities. Users wanted compound animations.

**Decision**: Add second independent LFO with separate target, shape, speed, and amplitude controls.

**Consequences**:
- Two parameters can animate simultaneously
- Different speeds/shapes create organic, evolving patterns
- Separate visualizers for each LFO
- More complex UI, but grouped clearly

---

## ADR-006: OBJ Export with Baked Transforms

**Date**: 2024-01-XX

**Context**: Initial OBJ export produced flat geometry - all layers at Z=0.

**Decision**: Bake layer Z positions and container rotation directly into vertex data before export.

**Consequences**:
- Exported models have correct 3D structure
- No reliance on OBJ scene hierarchy
- Works reliably in Notch and other tools
- Slightly larger file sizes (transforms in vertices)

---

## ADR-007: ExtrudeGeometry for Layer Thickness

**Date**: 2024-01-XX

**Context**: Flat 2D layers export as planes with no depth, limiting usefulness in 3D tools.

**Decision**: Add Thickness parameter using Three.js ExtrudeGeometry to give layers actual depth.

**Consequences**:
- Layers become true 3D objects when thickness > 0
- More interesting exports for Notch/TouchDesigner
- Slightly higher geometry complexity
- Can be animated via LFO
