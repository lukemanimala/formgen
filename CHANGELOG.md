# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-06-17

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
