# M1 Test Protocol — NEON BREACH

## Acceptance criteria

| ID | Requirement | Evidence to collect |
| --- | --- | --- |
| M1-01 | Browser creates WebGL2 context | `window.__neonBreachState.webgl2 === true` |
| M1-02 | World and player visible on first frame | screenshot and drawCalls > 50 |
| M1-03 | WASD moves character | position changes after keyboard input |
| M1-04 | Sprint speed exceeds walk | deterministic Node unit test |
| M1-05 | Jump leaves ground and lands | deterministic Node unit test |
| M1-06 | Solid walls block traversal | swept-collision Node unit test |
| M1-07 | Orbit/pointer input works | browser interaction smoke test |
| M1-08 | No uncaught errors on start | browser console/pageerror log |
| M1-09 | Tests run without external packages | `npm run check` |

## Important scope boundaries

- No enemy AI, shooting, boss, terminal activation or victory in M1.
- Physics collisions are 2.5D against static collider footprints. Height-aware navigation and stairs are scheduled for M2.
- Low-level WebGL2 does not support device-specific rendering fallback; show a clear error if WebGL2 is unavailable.
- Fonts use local fallback if Google Fonts CDN cannot be reached. No game runtime dependencies on external domains.

## Test environment

Record browser version, GPU mode, viewport, UTC timestamp, console errors, test command and output in the handover report.
