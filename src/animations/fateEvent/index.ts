/**
 * @file src/animations/fateEvent/index.ts
 * @description Orchestrator for "Fate Events" - deterministic, dramatic system-wide sequences.
 */
import gsap from 'gsap';
import { Howl } from 'howler';
import core from '../../core/CHAOS_CORE';
import { eventBus } from '../../core/eventBus';
import { seedRng, getRandom } from '../../core/rng';

export interface FateOptions {
    seed?: string;
    intensity?: number;
    skipAudio?: boolean;
}

// Sound bank (placeholders)
const sounds = {
    trigger: new Howl({ src: ['/sfx/fate_trigger.mp3'], volume: 0.8 }),
    glitch: new Howl({ src: ['/sfx/glitch_stutter.mp3'], volume: 0.5 }),
    ambient: new Howl({ src: ['/sfx/fate_ambient.mp3'], loop: true, volume: 0.3 })
};

/**
 * Triggers the Fate Event sequence.
 * This is a deterministic timeline based on the seed (or current RNG state).
 */
export const runFateEvent = async (options: FateOptions = {}) => {
    // 1. Setup Determinism
    if (options.seed) {
        seedRng(options.seed);
    }

    // Generate a unique ID for this run based on RNG
    const eventId = Math.floor(getRandom() * 10000).toString(16);
    console.log(`[FATE] Starting Event ID: ${eventId}`);

    // 2. Pre-announce
    core.recordActivity('fate:start', { eventId, seed: options.seed });
    eventBus.emit('activity:added', {
        type: 'system',
        text: `>> FATE EVENT DETECTED [${eventId}] <<`, // Direct terminal output hack
        timestamp: Date.now()
    });

    if (!options.skipAudio) {
        sounds.trigger.play();
        sounds.ambient.fade(0, 0.3, 2000).play();
    }

    // 3. Create Timeline
    const tl = gsap.timeline({
        onComplete: () => {
            console.log('[FATE] Event Complete');
            sounds.ambient.fade(0.3, 0, 2000);
            setTimeout(() => sounds.ambient.stop(), 2000);

            // Lower chaos at end
            core.addChaos(-20, 'Fate Event Resolution');
            core.recordActivity('fate:complete', { eventId });
        }
    });

    // --- PHASE 1: Build Up (0-3s) ---
    tl.call(() => {
        // Switch wallpaper to 'dramatic' or 'glitch'
        const mode = getRandom() > 0.5 ? 'glitch_storm' : 'void_stare';
        eventBus.emit('command:set_wallpaper', { mode });
    });

    tl.to({}, { duration: 2 }); // Wait

    // --- PHASE 2: Initial Panic (3-5s) ---
    tl.call(() => {
        // Trigger generic mascot panic event
        eventBus.emit('chaos:threshold', { threshold: 999, direction: 'up' });
        // We reuse the threshold event or add a specific one
        // Let's assume there's a listener for general panic
    });

    // --- PHASE 3: Window Choreography (5s+) ---
    // Deterministic shuffle
    const moves = ['scatter', 'orbit', 'stack', 'implode'];
    const selectedMove = moves[Math.floor(getRandom() * moves.length)];

    tl.call(() => {
        const severity = options.intensity || core.getFacts()['chaos_level'] || 50;
        console.log(`[FATE] Executing Window Move: ${selectedMove}`);

        // Emit event for Window Manager to react
        eventBus.emit('window:fate_transform', {
            type: selectedMove,
            duration: 5,
            severity: severity
        });
    }, undefined, '+=0.5');

    // --- PHASE 4: Cryptic Poem (Typer Effect) ---
    const poems = [
        "The bits are rotting.\nThe pixels scream.\nDo you dream in hex?",
        "Gravity is a suggestion.\nChaos is the law.\nWe are floating.",
        "System unstable.\nReality buffering.\nPlease hold..."
    ];
    const poem = core.formatLong(poems[Math.floor(getRandom() * poems.length)]);

    tl.call(() => {
        // Emit special activity for typing effect
        // let typed = "";
        const chars = poem.split('');

        // Micro-timeline for typing
        const typeTl = gsap.timeline();
        chars.forEach((char, i) => {
            typeTl.call(() => {
                // typed += char;
                // Emit update event or hacks - for now just log/activity stream
                // Ideally this updates a dedicated UI overlay or Terminal
                if (i % 5 === 0) sounds.glitch.play();
            }, undefined, i * 0.05);
        });

        typeTl.call(() => {
            core.recordActivity('fate:message', { text: poem });
        });
    }, undefined, '+=1');

    return tl;
};
