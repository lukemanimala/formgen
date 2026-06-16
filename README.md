# FormGen

**Procedural geometry generator for creative tools**

Generate complex mandala-like patterns with simple controls, then export to professional tools like Notch, TouchDesigner, or any 3D software.

## Features

### Pattern Generation
- **6 pattern types**: Mandala, Spiral, Star, Rosette, Flower, Spirograph
- **Macro controls**: Layers, Twist, Dimension, Energy
- **Geometry controls**: Petals, Concavity, Pointiness, Inner Radius, Rotation, Height
- **Layer effects**: Opacity, Shadow, Thickness (3D extrusion)
- **Color**: Hue control with layer-by-layer color shift

### Animation
- **Dual LFO system**: Two independent oscillators with Speed and Amplitude
- **LFO shapes**: Sine, Triangle, Saw
- **Camera paths**: Orbit, Flyover, Spiral, Zoom, Tilt
- **Animatable parameters**: All geometry and macro controls

### Export
- **PNG**: 4x resolution render
- **MP4**: Native H.264 encoding via WebCodecs
- **OBJ**: 3D model export for Notch, TouchDesigner, Blender, etc.
- **Config**: JSON preset save/load

## Tech Stack

- **Three.js** - 3D rendering
- **WebCodecs + mp4-muxer** - Native MP4 video encoding
- **OBJExporter** - 3D model export

## Quick Start

1. Open `index.html` in a modern browser (Chrome/Edge recommended for MP4 export)
2. Select a pattern type
3. Adjust macro and geometry controls
4. Use LFOs to animate parameters
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

## Domain

[formgen.design](https://formgen.design) (planned)

## Documentation

- [STRATEGY.md](STRATEGY.md) - Product vision and roadmap
- [DECISIONS.md](DECISIONS.md) - Architecture decision records
- [CHANGELOG.md](CHANGELOG.md) - Version history

---

Built with Claude Code
