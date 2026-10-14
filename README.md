# NEON BREACH

A sci-fi third-person 3D arena prototype that runs directly in a WebGL2-capable browser. **M1: Foundation / Movement Lab**.

![Status](https://img.shields.io/badge/milestone-M1%20prototype-49d3e3)

## Run

```bash
npm run dev
```

Visit `http://127.0.0.1:4173` in Chrome, Chromium, Edge, or Firefox with WebGL2 enabled. No `npm install`, third-party JS runtime, paid APIs or backend required. The game can run fully offline once downloaded.

## Controls

| Control | Action |
| --- | --- |
| W / A / S / D | Move in the camera-relative plane |
| Mouse | Orbit camera after pointer lock |
| Shift | Sprint |
| Space | Jump |
| Mouse wheel | Adjust camera distance |
| Esc | Pause/unlock pointer |
| Click canvas | Resume/pointer lock |

## Current milestone: M1

- WebGL2 arena renderer, procedural sci-fi environment, depth and directional shading, fog, emissive materials.
- Player third-person humanoid rig with simple walk animation.
- Camera with free look, zoom, smoothing, basic obstacle avoidance.
- Accelerated camera-relative movement, jumping, sprint and arena collision/sliding.
- Responsive HUD, onboarding screen, telemetry and fault messages.
- Pure JS deterministic gameplay units and Node built-in test suite.

### Not yet implemented

M2: advanced height-aware collision and physics; M3: weapons; M4: enemy AI; M5: boss; M6: objectives/victory; M7: polishing, mobile support, performance audits.

The terminals, health bars and mission objective are M1 presentation placeholders and **are not interactive yet**. This build must not be presented as the full game.

## Test

```bash
npm test
npm run check
```

### Browser validation

See [docs/M1-VALIDATION.md](docs/M1-VALIDATION.md). Unit tests do not alone establish GPU/browser compatibility.

## Architecture

- `src/engine/math.js` — matrix/vector math.
- `src/engine/graphics.js` — low-level WebGL2 shader pipeline.
- `src/engine/physics.js` — static collision and movement primitives.
- `src/engine/camera.js` — camera orbit and obstruction management.
- `src/game/world.js` — single source of geometry and colliders.
- `src/game/player.js` — movement controller and state.
- `src/game/visuals.js` — procedural world/player rendering.
- `src/main.js` — lifecycle, input and presentation.

This zero-dependency WebGL2 implementation was selected to validate M1 without network access. A future milestone may migrate to Three.js if asset tooling, PBR materials or editor support justify it. Record such a migration as a separate architectural decision.

## License

Copyright reserved by the repository owner until a license is selected.

## One-file offline demo

```bash
npm run build:standalone
```

Open `dist/NEON-BREACH-M1.html` directly in a WebGL2 browser. This one-file build includes the JavaScript and CSS, so no server or network is required. It is a technical prototype and has desktop keyboard/mouse controls; touch controls are planned for a later milestone.
