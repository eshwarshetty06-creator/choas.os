# Limitations & Future Roadmap

## Current Limitations
1.  **Parser**: Currently uses regex-based rules (`src/core/parser/rules.ts`). Complex natural language queries may fail or fallback to "UNKNOWN".
2.  **Personality Engine**: Text formatting (`formatShort`/`formatLong`) uses simple prefix/suffix logic.
3.  **UI Styling**: Wireframe/Glassmorphism hybrid. Some components are placeholders.

## LLM Integration Points
-   **`src/core/parser/index.ts`**: Replace the fallback logic with an LLM call to handle fuzzy intents or complex questions.
-   **`src/core/CHAOS_CORE.ts`**: Update `formatLong` to use an LLM for rewriting note content into stories or poems dynamically.
-   **`src/apps/Notes/factExtractor.ts`**: Replace regex with an LLM-based entity extractor for better fact gathering.
