/**
 * @file src/state/factsStore.ts
 * @description Zustand store for Facts, synced with Chaos Core.
 */
import { create } from 'zustand';
import { eventBus } from '../core/eventBus';
import core from '../core/CHAOS_CORE';

interface FactsStoreState {
    facts: Record<string, any>;
    init: () => void;
    setFact: (key: string, value: any) => void;
    getFact: (key: string) => any;
}

export const useFactsStore = create<FactsStoreState>((set, get) => ({
    facts: {},

    init: () => {
        // Sync initial state
        set({ facts: core.getFacts() });

        eventBus.on('fact:added', ({ key, value }) => {
            set((state) => ({
                facts: { ...state.facts, [key]: value }
            }));
        });

        eventBus.on('state:restored', () => {
            set({ facts: core.getFacts() });
        });
    },

    setFact: (key, value) => {
        core.setFact(key, value);
    },

    getFact: (key) => {
        return get().facts[key];
    }
}));
