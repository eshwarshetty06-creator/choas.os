/**
 * @file src/core/rng.ts
 * @description Deterministic Random Number Generator wrapper.
 */
import seedrandom from 'seedrandom';

let prng = seedrandom();

export const seedRng = (seed: string) => {
    prng = seedrandom(seed);
    console.log(`[RNG] Seeded with: ${seed}`);
};

export const getRandom = (): number => {
    return prng();
};

export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(prng() * (max - min + 1)) + min;
};
