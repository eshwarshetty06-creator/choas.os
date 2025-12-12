/**
 * @file src/utils/clamp.ts
 * @description Utility to constrain a value between min and max.
 */

export const clamp = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
};
