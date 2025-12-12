/**
 * @file src/core/stateMachine.ts
 * @description Finite State Machine for application lifecycle and modes.
 * 
 * Manages transitions between different OS states (e.g., Boot, Idle, Glitch, Shutdown).
 */

export enum SystemState {
    BOOTING,
    IDLE,
    ACTIVE,
    GLITCHING,
    SHUTDOWN
}

export let currentState = SystemState.BOOTING;
