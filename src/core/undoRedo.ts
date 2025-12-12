/**
 * @file src/core/undoRedo.ts
 * @description Global Undo/Redo history manager.
 * 
 * Tracks actions and allows time-travel debugging or user correction.
 */

export const history: any[] = [];
export const undoStack: any[] = [];
