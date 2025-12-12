/**
 * @file tests/unit/chaosCore.test.ts
 * @description Unit tests for CHAOS_CORE logic.
 */
import core from '../../src/core/CHAOS_CORE';
import localforage from 'localforage';

// Mock localforage
jest.mock('localforage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    keys: jest.fn()
}));

describe('CHAOS_CORE', () => {
    beforeEach(() => {
        // Reset state
        (core as any).state = {
            chaosLevel: 0,
            mood: 'neutral',
            personality: { chaosLevel: 0.5, friendliness: 0.5 },
            facts: {},
            activityLog: [],
            prefs: {}
        };
        (core as any).initialized = true; // Skip async init for simple tests
    });

    test('addChaos should clamp values between 0 and 100', () => {
        core.addChaos(50);
        expect((core as any).state.chaosLevel).toBe(50);

        core.addChaos(100);
        expect((core as any).state.chaosLevel).toBe(100); // Should accept 100 max

        core.addChaos(-200);
        expect((core as any).state.chaosLevel).toBe(0); // Should clamp to 0
    });

    test('setFact should update state and persist', () => {
        core.setFact('testKey', 'testValue');

        expect(core.getFact('testKey')).toBe('testValue');
        expect(localforage.setItem).toHaveBeenCalled();
    });

    test('formatShort should respect personality', () => {
        const text = 'Hello';
        (core as any).state.personality.friendliness = 0.8;

        // As per current simple implementation:
        // if friendliness > 0.7 -> "(^_^) " prefix
        expect(core.formatShort(text)).toContain('(^_^)');
    });
});
