/**
 * @file src/state/chaosStore.ts
 * @description Zustand store for Chaos Core state, acting as a reactive proxy.
 */
import { create } from 'zustand';
import { eventBus } from '../core/eventBus';
import core from '../core/CHAOS_CORE';
import type { Mood } from '../core/CHAOS_CORE';

interface ChaosStoreState {
    chaosLevel: number;
    mood: Mood;
    init: () => void;
    addChaos: (delta: number, reason?: string) => void;
    setMood: (mood: Mood) => void;
}

export const useChaosStore = create<ChaosStoreState>((set) => ({
    chaosLevel: 0,
    mood: 'neutral',

    init: () => {
        // Sync initial state
        // In a real app we might want to wait for core.init() but for now we assume it's callable
        // Subscribe to events to update store
        eventBus.on('chaos:updated', ({ level }) => set({ chaosLevel: level }));
        eventBus.on('mood:changed', ({ mood }) => set({ mood: mood as Mood }));
        eventBus.on('state:restored', () => {
            // On undo/redo, we might need to pull fresh state from core if we don't track it all
            // For now, let's just re-fetch mood (chaos level is usually pushed by event)
            set({ mood: core.getMood() });
        });
    },

    addChaos: (delta, reason) => {
        core.addChaos(delta, reason);
    },

    setMood: (mood) => {
        core.setMood(mood);
    }
}));
