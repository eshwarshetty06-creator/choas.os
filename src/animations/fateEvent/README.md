# Fate Events - Deterministic Playback

The Fate Event system (`src/animations/fateEvent`) allows for complex, multi-stage "cutscenes" or system events that are fully deterministic based on a seed.

## Usage

```typescript
import { runFateEvent } from './animations/fateEvent';

// Run with a specific seed to replay an exact sequence
runFateEvent({ seed: 'event-gamma-99', intensity: 80 });

// Run with random seed (uses current RNG state)
runFateEvent();
```

## How it works

1.  **Seeding**: Initializes the shared RNG with the provided seed.
2.  **Timeline**: Builds a GSAP timeline.
3.  **Orchestration**:
    *   **Wallpaper**: Emits `command:set_wallpaper` events.
    *   **Windows**: Emits `window:fate_transform` events (Components subscribe to this).
    *   **Audio**: Plays sfx via Howler.
    *   **Text**: Types out poems/messages using `CHAOS_CORE.formatLong`.
4.  **Resolution**: Automatically lowers chaos level and logs the event upon completion.
