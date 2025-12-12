/**
 * @file src/components/Resizable.tsx
 * @description Wrapper for providing resize handles.
 */
import React, { useState, useCallback, useEffect } from 'react';

interface ResizableProps {
    children: React.ReactNode;
    initialSize?: { width: number; height: number };
    minSize?: { width: number; height: number };
    onResize?: (width: number, height: number) => void;
    className?: string;
}

export const Resizable: React.FC<ResizableProps> = ({
    children,
    initialSize = { width: 400, height: 300 },
    minSize = { width: 200, height: 150 },
    onResize,
    className
}) => {
    const [size, setSize] = useState(initialSize);
    const [isResizing, setIsResizing] = useState(false);

    const startResize = useCallback((e: React.PointerEvent) => {
        setIsResizing(true);
        e.preventDefault();
        e.stopPropagation(); // Prevent drag propagation

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;

        const doDrag = (moveEvent: PointerEvent) => {
            const newWidth = Math.max(minSize.width, startWidth + (moveEvent.clientX - startX));
            const newHeight = Math.max(minSize.height, startHeight + (moveEvent.clientY - startY));

            setSize({ width: newWidth, height: newHeight });
            onResize?.(newWidth, newHeight);
        };

        const stopDrag = () => {
            setIsResizing(false);
            window.removeEventListener('pointermove', doDrag);
            window.removeEventListener('pointerup', stopDrag);
        };

        window.addEventListener('pointermove', doDrag);
        window.addEventListener('pointerup', stopDrag);
    }, [size, minSize, onResize]);

    return (
        <div style={{ width: size.width, height: size.height, position: 'relative' }} className={className}>
            {children}

            {/* Resize Handle (Bottom Right) */}
            <div
                onPointerDown={startResize}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '20px',
                    height: '20px',
                    cursor: 'nwse-resize',
                    zIndex: 20,
                    background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.4) 50%)',
                    borderRadius: '0 0 0.5rem 0'
                }}
                className="resize-handle hover:bg-white/30 transition-colors"
                title="Resize"
            />
        </div>
    );
};
