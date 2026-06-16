# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2024-01-XX

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
