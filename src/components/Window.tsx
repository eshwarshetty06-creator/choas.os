/**
 * @file src/components/Window.tsx
 * @description Reusable Window component with glassmorphism styling.
 * Composes Draggable and Resizable behaviors.
 */
import * as React from 'react';
import { useState } from 'react';
import { X, Minus, Square, Maximize2, Minimize2 } from 'lucide-react';
import { Draggable } from './Draggable';
import { Resizable } from './Resizable';
import { useChaosStore } from '../state/chaosStore';
import { eventBus } from '../core/eventBus';

interface WindowProps {
    id: string;
    title: string;
    children: React.ReactNode;
    initialPos?: { x: number; y: number };
    initialSize?: { width: number; height: number };
    onClose?: () => void;
    onMinimize?: () => void;
    dragConstraints?: React.RefObject<Element>;
}

export const Window: React.FC<WindowProps> = ({
    id,
    title,
    children,
    initialPos = { x: 100, y: 100 },
    initialSize = { width: 400, height: 300 },
    onClose,
    onMinimize,
    dragConstraints
}) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const { chaosLevel } = useChaosStore();
    const windowRef = React.useRef(null);

    const toggleMaximize = () => {
        const newState = !isMaximized;
        setIsMaximized(newState);
        eventBus.emit('window:fullscreen', { id, isMaximized: newState });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.altKey && e.key === 'Enter') {
            e.preventDefault();
            toggleMaximize();
        }
    };

    // Cleanup: If window closes while maximized, notify desktop to restore dock
    React.useEffect(() => {
        return () => {
            if (isMaximized) {
                eventBus.emit('window:fullscreen', { id, isMaximized: false });
            }
        };
    }, [isMaximized, id]);

    if (isMinimized) return null;

    // Window Content Wrapper
    const WindowContent = () => (
        <div
            className={`flex flex-col w-full h-full rounded-md overflow-hidden border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 ring-1 ring-white/5 ${isMaximized ? 'rounded-none border-0' : ''} outline-none`}
            style={{
                backgroundColor: `rgba(15, 23, 42, ${0.85 - (chaosLevel * 0.003)})`,
                boxShadow: chaosLevel > 80 ? '0 0 20px rgba(255,0,0,0.2)' : 'none'
            }}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {/* Title Bar */}
            <div ref={!isMaximized ? windowRef : null} // Disable drag ref when maximized
                onDoubleClick={toggleMaximize}
                className="flex items-center justify-between px-3 h-9 bg-slate-900/50 border-b border-white/5 cursor-grab active:cursor-grabbing select-none hover:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {/* Traffic Lights */}
                    <div className="flex gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500 hover:bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500 hover:bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500 hover:bg-green-500" onClick={toggleMaximize} />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono ml-2 opacity-80">
                        {title}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { setIsMinimized(true); onMinimize?.(); }} className="text-slate-500 hover:text-white transition-colors">
                        <Minus size={12} />
                    </button>
                    <button onClick={toggleMaximize} className="text-slate-500 hover:text-white transition-colors">
                        {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                    </button>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400 transition-colors">
                        <X size={12} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-slate-950/20 backdrop-filter backdrop-blur-sm text-slate-300">
                {children}
            </div>
        </div>
    );

    if (isMaximized) {
        return (
            <div className="fixed inset-0 z-50 p-0 m-0 w-full h-full">
                <WindowContent />
            </div>
        );
    }

    return (
        <Draggable initialPos={initialPos} handleRef={windowRef} className="absolute z-20" dragConstraints={dragConstraints}>
            <Resizable initialSize={initialSize} minSize={{ width: 200, height: 150 }}>
                <WindowContent />
            </Resizable>
        </Draggable>
    );
};
