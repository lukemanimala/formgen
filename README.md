# FormGen

**Procedural geometry generator for creative tools**

Generate complex mandala-like patterns with simple controls, then export to professional tools like Notch, TouchDesigner, or any 3D software.

## Features

### Pattern Generation
- **7 pattern types**: Mandala, Spiral, Star, Polygon, Rosette, Flower, Spirograph
- **Macro controls**: Layers, Twist, Depth, Energy
- **Geometry controls**: Petals, Concavity, Pointiness, Inner Radius, Petal Change, Align, Rotation, Height
- **Layer effects**: Opacity, Shadow, Thickness (3D extrusion)
- **Color**: Hue control with layer-by-layer color shift, lightness control
- **Effects**: Bloom post-processing, mirror/kaleidoscope modes, background color picker
- **Mirror modes**: Radial (shader-based kaleidoscope) or Copies (geometry duplication)
- **Collapsible UI**: Accordion sections for easier navigation
- **Keyboard shortcuts**: `[` collapse all, `]` expand all panels

### Animation
- **4 LFO system**: Four independent oscillators with Speed, Amplitude, and Center controls
- **Multi-target LFOs**: Each LFO can control multiple parameters simultaneously
- **LFO shapes**: Sine, Triangle, Saw
- **Audio-reactive**: Bass, Mid, Treble frequency bands drive any parameter
- **Audio smoothing**: Adjustable smoothing for calm or punchy audio response
- **Camera paths**: Orbit, Flyover, Spiral, Zoom, Tilt
- **Animatable parameters**: All geometry, macro, and effect controls (including bloom)

### Export
- **PNG**: 4x resolution render
- **MP4**: Native H.264 encoding via WebCodecs (720p to 4K, configurable FPS/bitrate)
- **OBJ**: 3D model export for Notch, TouchDesigner, Blender, etc.
- **Presets**: 8 built-in presets + save/load custom presets
- **Config**: Download/import JSON configurations

## Tech Stack

- **Three.js** - 3D rendering
- **WebCodecs + mp4-muxer** - Native MP4 video encoding
- **Web Audio API** - Audio analysis for reactive animations
- **OBJExporter** - 3D model export

## Quick Start

1. Open `start.html` for the landing page with preset gallery, or `index.html` directly
2. Select a pattern type or start from a built-in preset
3. Adjust macro and geometry controls
4. Use LFOs to animate parameters (select multiple targets per LFO)
5. Export as PNG, video, or OBJ

## Export to Notch

1. Set your desired pattern and parameters
2. Add thickness for 3D geometry (Thickness knob > 0)
3. Click **OBJ** button in Export section
4. Import the `.obj` file into Notch

## Browser Support

- **Chrome/Edge 94+**: Full support including MP4 export
- **Safari 16.4+**: Full support including MP4 export
- **Firefox**: WebM video export (no MP4), all other features work

## Vision

FormGen is the first step toward **the easiest way for creators to generate high-quality 3D music visuals without learning complex tools**.

See [STRATEGY.md](STRATEGY.md) for the full product vision and roadmap.

## Live

**[formgen.design](https://formgen.design)**

## Documentation

- [STRATEGY.md](STRATEGY.md) - Product vision and roadmap
- [DECISIONS.md](DECISIONS.md) - Architecture decision records
- [CHANGELOG.md](CHANGELOG.md) - Version history

---

Built with Claude Code
