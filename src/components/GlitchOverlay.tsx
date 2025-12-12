/**
 * @file src/components/GlitchOverlay.tsx
 * @description Global overlay that distorts the screen based on chaos level.
 */
import React from 'react';
import { useChaosStore } from '../state/chaosStore';

export const GlitchOverlay: React.FC = () => {
    const chaosLevel = useChaosStore(state => state.chaosLevel);

    if (chaosLevel < 5) return null;

    // Calculate dynamic styles based on chaos
    const opacity = Math.min(0.8, (chaosLevel / 100) * 0.5);
    const blinkSpeed = Math.max(0.1, 2 - (chaosLevel / 50));

    // Random glitch slices
    const isGlitching = chaosLevel > 50 && Math.random() > 0.9;

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
            style={{
                zIndex: 9999
            }}
        >
            {/* Base chromatic aberration / noise layer */}
            <div
                className="absolute inset-0 bg-transparent mix-blend-overlay opacity-50"
                style={{
                    background: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(255, 0, 255, ${opacity * 0.2}) 3px,
                        transparent 4px
                    )`,
                }}
            />

            {/* Heavy Glitch (High Chaos) */}
            {isGlitching && (
                <div className="absolute inset-0 bg-red-900/10 mix-blend-difference animate-pulse">
                    <div className="absolute top-1/2 left-0 w-full h-10 bg-white/20 transform -skew-x-12 translate-x-4 mix-blend-exclusion" />
                </div>
            )}

            {/* Color shifting at extreme levels */}
            {chaosLevel > 80 && (
                <div
                    className="absolute inset-0 mix-blend-color-dodge opacity-20"
                    style={{
                        backgroundColor: 'hsl(280, 100%, 50%)',
                        animation: `pulse ${blinkSpeed}s infinite`
                    }}
                />
            )}

            {/* Vignette that tightens with chaos */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, transparent ${100 - chaosLevel}%, black 150%)`,
                    opacity: 0.8
                }}
            />
        </div>
    );
};
