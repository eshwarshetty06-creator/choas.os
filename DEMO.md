# CHAOS.OS Demo Guide

This document outlines the deterministic demo sequence for judging and verification.

## Running the Demo

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser to `http://localhost:5173`.
3.  Open the browser console (F12).
4.  Run the following command:
    ```javascript
    window.playDemo('12345');
    ```

## Demo Timeline (Seed: 12345)

| Timestamp | Action | Description | Expected Outcome |
|-----------|--------|-------------|------------------|
| **00:01s** | Boot Anim | System Startup | "Boot Sequence Initiated" in logs. |
| **00:03s** | Create Note | "I have a cat named Milo" | Fact Extractor runs. |
| **00:04s** | Fact Check | Extraction Verification | `milo` -> `cat` added to Knowledge Graph. |
| **00:06s** | Terminal | "who is Milo?" | Terminal replies "milo is cat". |
| **00:09s** | Windows | Open Apps | GlitchStudio, PersonaMirror, TaskManager open. |
| **00:12s** | Add Chaos | +50 Entropy | Windows become floaty/elastic. |
| **00:15s** | **Fate Event** | Trigger ID: `...` | Poem typing, sound cues, wallpaper glitch. |
| **00:25s** | Calm Down | Reset Chaos | Gravity stabilizes. mood -> happy. |
| **00:28s** | Snapshot | Export System | "Snapshot taken" message. |

## Verification Points

-   **Determinism**: Running with seed `12345` MUST always produce the same Event ID and poem text.
-   **Physics**: During T+12s to T+25s, windows should be difficult to drag precisely due to low friction.
-   **Persistence**: Facts extracted from notes should be queryable in the terminal immediately.
