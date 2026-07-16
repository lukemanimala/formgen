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

---

## ADR-008: Audio-Reactive LFO System

**Date**: 2026-06-17

**Context**: Phase 1 roadmap calls for audio-reactive visuals. Traditional approach would be separate audio analysis mode.

**Decision**: Integrate audio reactivity directly into the existing LFO system by adding Bass, Mid, and Treble as LFO "shapes" alongside Sine, Triangle, and Saw.

**Consequences**:
- No separate audio mode - unified animation system
- Any parameter that can be LFO-animated can be audio-reactive
- Multiple parameters can react to different frequency bands simultaneously
- Users already understand LFO controls, minimal learning curve
- Web Audio API with AnalyserNode for FFT frequency analysis

---

## ADR-009: 4 LFO Architecture

**Date**: 2026-06-17

**Context**: With audio reactivity, users want multiple parameters animated simultaneously (e.g., bass drives scale, treble drives rotation, mid drives color).

**Decision**: Expand from 2 LFOs to 4 independent LFOs, each with target, shape, speed, amplitude, and center controls.

**Consequences**:
- Up to 4 simultaneous parameter animations
- Rich compound animations with audio + traditional LFOs
- More UI complexity, but each LFO is self-contained
- Center/offset control allows biasing oscillation midpoint

---

## ADR-010: LFO Center/Offset Control

**Date**: 2026-06-17

**Context**: Default LFO oscillates 0-1 around midpoint 0.5. Users wanted control over where the oscillation centers.

**Decision**: Add Center knob (0-1) to each LFO. Formula: `center + (lfoValue - 0.5) * amplitude`

**Consequences**:
- Center=0.5 (default): oscillates evenly around middle
- Center=0.2: biases toward low values
- Center=0.8: biases toward high values
- Combined with amplitude, precise control over oscillation range
- Particularly useful for subtle variations around a specific value

---

## ADR-011: Audio Smoothing for Calm Effects

**Date**: 2026-06-17

**Context**: Raw audio frequency data is jittery, creating nervous/frantic animations rather than smooth, calm visuals.

**Decision**: Implement exponential smoothing with adjustable Smooth knob (default 0.85). Formula: `smoothed = old * smooth + new * (1 - smooth)`

**Consequences**:
- Higher smoothing (0.9+): slow, flowing response to audio
- Lower smoothing (0.3-0.5): punchy, reactive response
- Default 0.85 provides calm, organic movement
- User-adjustable for different musical styles

---

## ADR-012: Universal Geometry Controls

**Date**: 2026-06-20

**Context**: Geometry knobs (Petals, Concavity, Pointiness, Petal Change, Align) only worked with certain patterns. Users turning knobs saw no effect on some patterns, creating confusion and eroding trust in the UI.

**Decision**: Make every geometry knob work with every pattern. Apply North Star framework: "Does this turn an idea into something real, fast, and obvious?" Dead controls fail "obvious" and "fast" tests.

**Consequences**:
- Every knob does something on every pattern
- Consistent mental model: turn knob, see change
- Some mappings are interpretive (e.g., Pointiness → curve tightness in Spirograph)
- More code per pattern, but clearer user experience
- Evaluated against alternative (show/hide knobs per pattern) - rejected due to UI instability

---

## ADR-013: Depth Curve for Layer Distribution

**Date**: 2026-06-20

**Context**: "Dimension" macro calculated perspectiveTilt but never applied it - dead code. The knob only affected layer spacing indirectly. Users expected it to do something visible.

**Decision**: Rename to "Depth" and implement actual functionality: control non-linear z-distribution of layers (0=even spacing, 1=compressed toward center).

**Consequences**:
- Depth knob now has visible, consistent effect
- Layers cluster toward top at high Depth values (more detail at apex)
- Added getLayerZ() helper used by all patterns
- Removed 90+ lines of dead code (unused helper functions, config values)

---

## ADR-014: Bloom Post-Processing

**Date**: 2026-06-27

**Context**: Users wanted more visual polish and "wow factor" for their exports. Bloom creates a glow effect around bright areas, making patterns feel more ethereal and professional.

**Decision**: Add UnrealBloomPass from Three.js post-processing library with adjustable strength (0-3), radius (0.8), and threshold (0.2).

**Consequences**:
- Immediate visual upgrade - everything glows
- Added to Effects UI section with slider control
- Bloom is an LFO target, enabling animated glow effects
- Higher threshold (0.2) prevents dark background from blooming excessively
- Slight performance cost from post-processing pass

---

## ADR-015: Video Recording Resolution Scaling

**Date**: 2026-06-27

**Context**: MP4 recording failed on high-resolution displays because H.264 AVC level 4.0 has a maximum coded area of ~2M pixels. Canvas at 2240x1566 = 3.5M pixels exceeded this limit.

**Decision**: Automatically scale down recording resolution to fit within AVC level 4.0 limits while maintaining aspect ratio. Use 16-pixel macroblock alignment.

**Consequences**:
- Recording works on all display sizes
- Maximum recording resolution is approximately 1080p equivalent
- 16-pixel alignment prevents codec rounding issues
- Quality trade-off: recorded video may be lower resolution than display
- Alternative (using higher AVC level) rejected due to device compatibility concerns

---

## ADR-016: Dual Mirror System (Radial vs Copies)

**Date**: 2026-06-27

**Context**: Users wanted to fill out the canvas more with repeated patterns. Two approaches emerged: shader-based kaleidoscope and geometry duplication.

**Decision**: Implement both modes, letting users choose:
- **Radial**: Post-processing kaleidoscope shader that divides the screen into segments and mirrors them. Performant, true radial symmetry.
- **Copies**: Clone the geometry and arrange copies in a circle around the center original. More copies = more geometry, but different visual effect.

**Consequences**:
- Users get both options based on their needs
- Radial is zero-cost (shader operates on final image)
- Copies increases geometry count but keeps center mandala visible
- Count selector works for both modes (4, 6, 8, 12, 16)
- Copies mode interprets count as "how many MORE" (center + N copies)

---

## ADR-017: Collapsible UI Sections

**Date**: 2026-06-27

**Context**: Control panel had grown to 7+ sections, requiring significant scrolling. Users needed to navigate between frequently-used and rarely-used controls.

**Decision**: Add accordion-style collapsible sections. Click header to toggle. Some sections start collapsed (Geometry, Color, Animation) while others stay open (Pattern, Macros, Effects, Export).

**Consequences**:
- Reduced initial visual clutter
- Faster navigation to desired controls
- Users can expand only what they need
- State persists during session (not saved between reloads)
- Minimal CSS/JS overhead (~30 lines)

---

## ADR-018: Audio Recording Integration

**Date**: 2026-06-28

**Context**: FormGen is a music visuals tool, but video exports had no audio. Users expected to hear the music they were visualizing in their exports.

**Decision**: Integrate audio capture into both recording paths:
- **MP4 (WebCodecs)**: Use AudioEncoder with AAC-LC codec, capture via ScriptProcessorNode, mux with mp4-muxer
- **WebM (MediaRecorder)**: Create MediaStreamDestination from existing audio graph, combine with video stream

**Consequences**:
- Video exports include synced audio when audio file is loaded
- Reuses existing Web Audio API graph (no duplicate connections)
- AAC for MP4 ensures broad compatibility
- Opus for WebM provides good quality at low bitrate
- Audio only included when user has loaded an audio file

---

## ADR-019: Multi-Target LFO System

**Date**: 2026-07-03

**Context**: Users wanted one LFO to drive multiple parameters simultaneously for synced animations (e.g., rotation AND scale moving together). Single-target LFOs required dedicating multiple LFOs to achieve this.

**Decision**: Change LFO target selection from single-select dropdown to multi-select checkboxes. Each LFO stores an array of targets instead of a single target string.

**Consequences**:
- One LFO can now animate any combination of the 19 available parameters
- Synced animations without "wasting" multiple LFOs
- UI shows "X targets" when multiple selected, or parameter name for single target
- Backwards compatible: config loading handles both old single-target and new array formats
- Slightly more complex animation loop (iterates over target array)

---

## ADR-020: Dynamic AVC Level Selection for Recording

**Date**: 2026-07-03

**Context**: ADR-015 capped recording at AVC level 4.0 (~1080p) for compatibility, but users with 1440p or 4K displays wanted higher resolution exports.

**Decision**: Dynamically select AVC level based on resolution:
- **Level 4.0** (`avc1.640028`): For resolutions ≤2M pixels (~1080p)
- **Level 5.1** (`avc1.640033`): For resolutions up to 9.4M pixels (~4K)
- Auto-scale down if resolution exceeds even level 5.1 limits

**Consequences**:
- 1440p and 4K recording now works
- Fallback scaling ensures never exceeds codec limits
- Level 5.1 has broad device support (all modern browsers/devices)
- Console logging shows actual recording resolution and level used

---

## ADR-021: Built-in Preset System

**Date**: 2026-07-03

**Context**: New users faced a blank canvas with many parameters. Presets provide starting points and demonstrate the tool's capabilities.

**Decision**: Ship 8 curated built-in presets with evocative names and distinct visual styles. Presets stored as JavaScript constant, separate from user presets in localStorage.

**Consequences**:
- Immediate value for new users - click and see impressive results
- Landing page (`start.html`) showcases presets as entry points
- Built-in presets cannot be modified/deleted (immutable)
- User presets stored separately in localStorage
- URL parameters enable deep-linking to presets (e.g., `?preset=cosmic-bloom`)

---

## ADR-022: Presets as Discovery (Position 2)

**Date**: 2026-07-07

**Context**: Presets section was positioned 7th of 9 in the left panel, treating it as a "save your work" utility. North Star critique revealed this failed the "Fast" test: new users had to scroll past everything to discover what the tool could do.

**Decision**: Move Presets to position 2 (after Pattern, before Macros). Reframe presets from "save" to "discover."

**Consequences**:
- New users see presets immediately after selecting a pattern type
- Faster path to value: pick preset → instant delight → then tweak
- Users who know what they want can skip past presets
- Presets become an onboarding ramp, not just a utility
- Custom preset save/load functionality remains unchanged

---

## ADR-023: LFO Target Parameter Grouping

**Date**: 2026-07-07

**Context**: LFO target dropdown listed 19 parameters in a flat list. Order followed code structure (Macros → Geometry → Color → Effects) but wasn't obvious to users. North Star critique scored 8/15 — "Kill or rethink."

**Decision**: Group parameters by section with visual separators matching the main panel organization. Groups: Macro (5), Geometry (9), Color (3), Effects (2).

**Consequences**:
- Users can scan by category instead of reading all 19 items
- Mental model matches the main control panel sections
- Visual separators (dividers + labels) make groups obvious
- No search needed — structure makes scanning fast enough
- Same grouping applied to all 4 LFO dropdowns

---

## ADR-024: Timeline/Keyframe System

**Date**: 2026-07-15

**Context**: Phase 0 gate requires creating one compelling 3-minute demo. Without a timeline, users could only create real-time animations (LFOs), not sequenced content that evolves throughout a song.

**Decision**: Implement keyframe system with full config snapshots. Each keyframe stores the complete output of `getCurrentConfig()`. Interpolation uses linear lerp for numeric values, snap-to-previous for discrete values (pattern, LFO shapes).

**Consequences**:
- Full-song animations now possible
- Config snapshots are simple but large (entire state per keyframe)
- Linear interpolation provides smooth transitions
- Discrete values snap at keyframe boundaries (no pattern morphing)
- Future enhancement: per-parameter keyframes for finer control

---

## ADR-025: Bottom Timeline with Waveform

**Date**: 2026-07-15

**Context**: Timeline scrubber in Animation section wasn't visible enough and lacked audio context. Users couldn't see where they were in the song.

**Decision**: Add fixed bottom timeline bar (64px) with canvas-rendered waveform. Use Web Audio `decodeAudioData` to extract samples, draw waveform with played portion highlighted.

**Consequences**:
- Always-visible timeline regardless of scroll position
- Waveform provides audio context for keyframe placement
- Click-to-seek on waveform for quick navigation
- Keyframes displayed as dots on waveform
- Minimal performance impact (waveform generated once on load)

---

## ADR-026: Audio-Reactive LFO Priority

**Date**: 2026-07-15

**Context**: Timeline interpolation was overwriting audio-reactive LFO values during playback, causing bass/mid/treble-driven macros to reset when the song started.

**Decision**: Skip timeline interpolation when any audio-reactive LFO is active. Check all 4 LFOs for bass/mid/treble shapes; if any are active, let LFO system control those parameters instead of timeline.

**Consequences**:
- Audio-reactive animations work during playback
- Keyframes still define baseline state
- Trade-off: keyframed changes to audio-reactive parameters won't apply during playback
- User expectation: audio-reactive LFOs "win" over timeline interpolation
