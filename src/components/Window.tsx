/**
 * @file src/components/Window.tsx
 * @description Reusable Window component with glassmorphism styling.
 * Composes Draggable and Resizable behaviors.
 */
import * as React from 'react';
import { useState } from 'react';
import { X, Minus } from 'lucide-react';
import { Draggable } from './Draggable';
import { Resizable } from './Resizable';
import { useChaosStore } from '../state/chaosStore';

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
    title,
    children,
    initialPos = { x: 100, y: 100 },
    initialSize = { width: 400, height: 300 },
    onClose,
    onMinimize,
    dragConstraints
}) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const { chaosLevel } = useChaosStore();
    const windowRef = React.useRef(null);

    if (isMinimized) {
        // Simple minimized representation (could be a dock icon in real OS)
        return null;
    }

    return (
        <Draggable initialPos={initialPos} handleRef={windowRef} className="absolute z-20" dragConstraints={dragConstraints}>
            <Resizable initialSize={initialSize} minSize={{ width: 200, height: 150 }}>
                <div className="flex flex-col w-full h-full rounded-md overflow-hidden border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 ring-1 ring-white/5"
                    style={{
                        backgroundColor: `rgba(15, 23, 42, ${0.85 - (chaosLevel * 0.003)})`, // Darker, simpler background
                        boxShadow: chaosLevel > 80 ? '0 0 20px rgba(255,0,0,0.2)' : 'none'
                    }}
                >
                    {/* Title Bar */}
                    <div ref={windowRef} className="flex items-center justify-between px-3 h-9 bg-slate-900/50 border-b border-white/5 cursor-grab active:cursor-grabbing select-none hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-2">
                            {/* Mac-style traffic lights but cool */}
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50 hover:bg-red-500/50 transition-colors" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/50 hover:bg-yellow-500/50 transition-colors" />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono ml-2 opacity-80">
                                {title}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { setIsMinimized(true); onMinimize?.(); }}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <Minus size={12} />
                            </button>
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto bg-slate-950/20 backdrop-filter backdrop-blur-sm text-slate-300">
                        {children}
                    </div>
                </div>
            </Resizable>
        </Draggable>
    );
};
