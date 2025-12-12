/**
 * @file tests/unit/core_stores.test.ts
 * @description Unit tests for EventBus, RNG, and Stores.
 */
import { eventBus } from '../../src/core/eventBus';
import { seedRng, getRandom } from '../../src/core/rng';
import core from '../../src/core/CHAOS_CORE';
import { useChaosStore } from '../../src/state/chaosStore';
import { useFactsStore } from '../../src/state/factsStore';

describe('Core Utilities & Stores', () => {

    // --- RNG Tests ---
    test('RNG should be deterministic with seed', () => {
        seedRng('test-seed');
        const r1 = getRandom();
        const r2 = getRandom();

        seedRng('test-seed');
        const r3 = getRandom();
        const r4 = getRandom();

        expect(r1).toBe(r3);
        expect(r2).toBe(r4);
        expect(r1).not.toBe(r2); // Basic sanity check
    });

    // --- EventBus & Core Integration ---
    test('addChaos should emit event and update store', (done) => {
        // Initialize store
        useChaosStore.getState().init();

        const handler = jest.fn();
        eventBus.on('chaos:updated', handler);

        // Add chaos via store (which calls core)
        useChaosStore.getState().addChaos(10, 'test');

        // Allow event loop to process
        setTimeout(() => {
            // Check if Core event ended up in EventBus
            expect(handler).toHaveBeenCalledWith(expect.objectContaining({ level: 10, reason: 'test' }));

            // Check if Store updated reactively
            expect(useChaosStore.getState().chaosLevel).toBe(10);
            done();
        }, 50);
    });

    // --- Knowledge/Facts Tests ---
    test('setFact should emit event and update facts store', (done) => {
        useFactsStore.getState().init();

        const handler = jest.fn();
        eventBus.on('fact:added', handler);

        useFactsStore.getState().setFact('skyColor', 'blue');

        setTimeout(() => {
            expect(handler).toHaveBeenCalledWith({ key: 'skyColor', value: 'blue' });
            expect(useFactsStore.getState().facts['skyColor']).toBe('blue');
            done();
        }, 50);
    });
});
