# CHAOS.OS Acceptance Checklist

## Core Capabilities
- [ ] **Determinism**: The system behaves identically when seeded with the same value.
- [ ] **State Management**: `CHAOS_CORE` correctly updates `chaosLevel`, `mood`, and `facts`.
- [ ] **Persistence**: State persists across reloads (simulated via localforage).

## Interactions
- [ ] **Window Physics**: Windows float/drift based on chaos level. High chaos = high elasticity.
- [ ] **Terminal**: Accepts natural language commands (e.g., "open notes", "who is Milo?").
- [ ] **Notes**: Can create/delete notes. Facts are extracted from text ("I have a cat named Milo").

## Visuals & Polish
- [ ] **Fate Event**: Only triggers when commanded or threshold reached. Includes audio, typing, and window choreography.
- [ ] **Glitch Effects**: Wallpaper changes based on mode (`glitch_storm`, `void_stare`).

## Automated Verification
- [ ] **E2E Demo**: Running `npm run test:e2e` (or via scripts) completes the detailed demo flow successfully.
