/**
 * @file src/components/Draggable.tsx
 * @description Physics-enabled Draggable wrapper using Framer Motion.
 * Adapts physics properties based on system Chaos Level.
 */
import * as React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useChaosStore } from '../state/chaosStore';

interface DraggableProps {
    children: React.ReactNode;
    initialPos?: { x: number; y: number };
    className?: string;
    handleRef?: React.RefObject<HTMLDivElement>; // Element to act as drag handle
    dragConstraints?: React.RefObject<Element>;
}

export const Draggable: React.FC<DraggableProps> = ({
    children,
    initialPos = { x: 0, y: 0 },
    className,
    handleRef,
    dragConstraints
}) => {
    const chaosLevel = useChaosStore((state) => state.chaosLevel);
    const dragControls = useDragControls();

    // Chaos Physics Mapping
    // High chaos = Low friction, high elasticity (floaty)
    // Low chaos = High friction, low elasticity (rigid)
    const dragElastic = 0.1 + (chaosLevel / 100) * 0.5; // 0.1 to 0.6
    const dragMomentum = true;
    const dragTransition = {
        power: 0.1 + (chaosLevel / 100) * 0.8, // More momentum at high chaos
        timeConstant: 200 + (chaosLevel * 5) // Longer slide at high chaos
    };

    return (
        <motion.div
            className={className}
            drag
            dragControls={dragControls}
            dragListener={!handleRef} // If handleRef is present, use it instead
            dragElastic={dragElastic}
            dragMomentum={dragMomentum}
            dragTransition={dragTransition}
            dragConstraints={dragConstraints}
            initial={{ x: initialPos.x, y: initialPos.y }}
            whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 50 }}
            style={{ position: 'absolute' }}
        >
            <div
                onPointerDown={(e) => {
                    if (handleRef?.current?.contains(e.target as Node)) {
                        dragControls.start(e as any);
                    }
                }}
                style={{ width: '100%', height: '100%' }}
            >
                {children}
            </div>
        </motion.div>
    );
};
