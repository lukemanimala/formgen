# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-07-15

### Added
- **Timeline System**: Full keyframe animation with audio sync
  - Bottom timeline bar with waveform visualization
  - Add keyframes at any point in time
  - Click keyframes to select and edit
  - Delete keyframes with visible button
  - Smooth interpolation between keyframes
  - Timeline persists in localStorage
- **Waveform Display**: Audio waveform rendered in bottom timeline with played portion highlighting
- **Audio Scrubbing**: Click anywhere on waveform to seek
- **Spacebar Play/Pause**: Quick audio control with keyboard
- **Keyboard Shortcuts**: `[` to collapse all panels, `]` to expand all panels
- **LFO Target Grouping**: Parameters organized by category (Macro, Geometry, Color, Effects) with visual separators
- **2D Background Layer**: Shader-based background effects behind 3D geometry
  - **Noise Field**: Organic flowing noise as light source (Scale, Contrast, Speed, Opacity, Glow)
  - **Column Mask**: Vertical scanlines with adjustable Count and Width
  - **Row Mask**: Horizontal lines with adjustable Count and Width (creates cell/grid effect when combined)
  - **Glow Effect**: Softens mask edges for CRT phosphor-like bloom
  - **Hue Offset**: Background color derived from main hue with adjustable offset (-180° to +180°)

### Changed
- **Presets Position**: Moved to position 2 (after Pattern) for faster discovery and onboarding
- **Bloom Defaults**: Reduced default strength (0.4), increased threshold (0.6) to prevent washout
- **Timeline Auto-Enable**: Timeline mode activates automatically when audio loads
- **LFO Toggle Labels**: Changed from ▶/⏸ icons to clear "On"/"Off" text labels
- **Background Color**: Now uses hue offset from main color instead of separate color picker

### Fixed
- **LFO Audio-Reactive Values**: Audio-reactive LFO enabled states now save/restore in keyframes
- **LFO During Playback**: Audio-reactive LFOs no longer get overwritten by timeline interpolation
- **Background Hue with LFO**: Background color now updates when main hue is animated by LFO

---

## [0.5.0] - 2026-07-03

### Added
- **Multi-Target LFOs**: Each LFO can now control multiple parameters simultaneously via checkbox multi-select
- **Built-in Presets**: 8 curated presets (Cosmic Bloom, Liquid Glass, Infinite Tunnel, Crystal Pulse, Kaleidoscope, Bass Reactor, Solar Flare, Dreamscape)
- **Landing Page**: New `start.html` with preset gallery for quick starts
- **Recording Quality Settings**: Configurable resolution (720p-4K), FPS (30/60), and bitrate (Standard/High/Max)
- **Preset Management**: Save, load, and delete custom presets with localStorage persistence
- **Config Export/Import**: Download and import JSON configuration files
- **Bloom Post-Processing**: UnrealBloomPass effect with adjustable strength (0-3)
- **Bloom LFO Target**: Bloom strength can be animated via any of the 4 LFOs
- **Background Color Picker**: Change background color via color picker in Color section
- **Lightness Control**: Adjust mandala brightness (20-80%) independent of hue
- **Mirror System**: Two modes for filling out the canvas
  - **Kaleid**: Post-processing kaleidoscope shader for true radial symmetry
  - **Ring**: Geometry duplication with center original + surrounding copies
- **Mirror Count**: 4, 6, 8, 12, or 16 segments/copies
- **Collapsible Sections**: Accordion-style UI panels for easier navigation
- **Audio Recording**: Video exports now include audio track when audio is loaded
  - MP4: AAC-LC encoding via AudioEncoder + mp4-muxer
  - WebM: Opus encoding via MediaRecorder

### Fixed
- **Video Recording**: Fixed black frames by enabling WebGL preserveDrawingBuffer
- **High-Res Recording**: Dynamic AVC level selection (4.0 for 1080p, 5.1 for 4K) enables recording up to 4K resolution

### Changed
- **LFO Target Selection**: Changed from single-select dropdown to multi-select checkboxes
- **UI Layout**: Geometry, Color, and Animation sections collapsed by default
- **LFO Bias → Center**: Renamed for clarity (describes oscillation midpoint)
- **Mirror Labels**: Radial → Kaleid, Copies → Ring (more intuitive)

---

## [0.4.0] - 2026-06-20

### Added
- **Polygon Pattern**: New pattern type where Petals controls number of sides
- **Universal Geometry Controls**: All knobs now work with all patterns
  - Petal Change: evolves complexity across layers (all patterns)
  - Align: per-layer rotational offset (all patterns)
  - Pointiness: affects curve tightness in Spirograph

### Changed
- **Dimension → Depth**: Renamed macro, now controls layer z-distribution curve
- **Twist Range**: Expanded to ±4 radians (was 0-1.5), now bipolar
- **LFO Amplitude**: Full amplitude now uses full parameter range regardless of center
- **View Cube**: Fixed rotation sync (X and Y directions corrected)

### Fixed
- Twist and Mandala Align now work together (were mutually exclusive)
- Removed glitchy jump when Twist was at 0

### Removed
- Dead code: unused config values and helper functions (~100 lines)

---

## [0.3.0] - 2026-06-17

### Added
- **4 LFO System**: Expanded from 2 to 4 independent oscillators
- **LFO Center/Offset**: Each LFO has adjustable oscillation midpoint (0-1)
- **Audio-Reactive Animation**: Upload audio files for reactive visuals
- **Frequency Band Analysis**: Bass, Mid, Treble bands as LFO shapes
- **Audio Smoothing**: Adjustable smoothing (0.85 default) for calm effects
- **Audio Reset**: Clear button to remove audio and return to upload state

## [0.2.0] - 2026-06-16

### Added
- **OBJ Export**: 3D model export for Notch, TouchDesigner, Blender
- **Layer Thickness**: Extrude 2D shapes into 3D geometry (0-0.5 range)
- **Dual LFO System**: Two independent oscillators with speed/amplitude controls
- **Camera Path Automation**: Orbit, Flyover, Spiral, Zoom, Tilt presets
- **MP4 Recording**: Native H.264 encoding via WebCodecs + mp4-muxer
- **Color Shift**: Layer-by-layer hue shift control
- **Energy Shift**: Layer-by-layer energy variation
- **Mandala Align**: 0-180° rotational alignment control
- **Publish Skill**: Documentation and decision logging

### Changed
- Layers macro now shows raw count (2-24) instead of 0-1 range
- Camera paths stay front-facing (no back-of-model views)
- Video recording at 30 FPS for smoother capture

### Fixed
- PNG export no longer breaks canvas dimensions
- OBJ export now bakes layer Z positions into vertices
- Mandala fill shapes properly align with stroke outlines
