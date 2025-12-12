import * as React from 'react';
import { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isDock?: boolean;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, label, icon: Icon, onClick, isDock }) => {
    return (
        <button
            onClick={onClick}
            className={`group relative flex items-center justify-center transition-all duration-300
                ${isDock
                    ? 'p-3 rounded-2xl hover:bg-white/60 hover:shadow-lg hover:-translate-y-2 active:scale-95'
                    : 'flex-col gap-2 p-2 rounded-lg hover:bg-white/20 w-24 active:scale-95'
                }`}
        >
            <div className={`
                flex items-center justify-center transition-all duration-300
                ${isDock
                    ? 'p-2 bg-gradient-to-b from-white to-slate-100 rounded-xl shadow-sm border border-slate-200 text-black group-hover:text-indigo-700'
                    : 'p-3 bg-white rounded-xl shadow-md border border-slate-200 text-black group-hover:text-indigo-700'
                }
            `}>
                <Icon size={isDock ? 24 : 32} strokeWidth={2} className="drop-shadow-sm" />
            </div>

            {/* Label handling */}
            <span className={`
                pointer-events-none transition-all duration-300 font-bold tracking-tight
                ${isDock
                    ? 'absolute -top-10 bg-black text-white px-3 py-1 rounded-full text-[11px] shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                    : 'text-xs text-black mt-2 block w-full text-center drop-shadow-md'
                }
            `}>
                {label}
            </span>

            {/* Dock Indicator */}
            {isDock && (
                <div className="absolute -bottom-1 w-1 h-1 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </button>
    );
};
