/**
 * @file src/core/personality.ts
 * @description Manages the AI personality and traits of the OS.
 * 
 * Defines behavior patterns, emotional states, and reactive responses.
 */

export interface PersonalityTraits {
    chaosLevel: number;
    friendliness: number;
}

export const defaultTraits: PersonalityTraits = {
    chaosLevel: 0.5,
    friendliness: 0.5
};
