
import React, { useState, useEffect } from 'react';
import { File, Folder, Trash, AlertTriangle } from 'lucide-react';
import { useChaosStore } from '../../state/chaosStore';

interface VoidFile {
    id: string;
    name: string;
    size: string;
    integrity: number; // 0-100%
}

export const TheVoid: React.FC = () => {
    const [files, setFiles] = useState<VoidFile[]>([
        { id: '1', name: 'secrets.txt', size: '12kb', integrity: 100 },
        { id: '2', name: 'memories.dat', size: '2.4gb', integrity: 90 },
        { id: '3', name: 'consciousness_backup_v2.iso', size: '89tb', integrity: 100 },
        { id: '4', name: 'project_chaos.doc', size: '1mb', integrity: 60 },
    ]);
    const { chaosLevel } = useChaosStore();

    // Entropy Decay Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setFiles(prev => prev.map(f => {
                // Higher chaos = faster decay
                const decayChance = chaosLevel > 50 ? 0.2 : 0.05;
                if (Math.random() < decayChance) {
                    return { ...f, integrity: Math.max(0, f.integrity - 5) };
                }
                return f;
            }).filter(f => f.integrity > 0)); // Delete if 0%
        }, 1000);

        return () => clearInterval(interval);
    }, [chaosLevel]);

    return (
        <div className="w-full h-full bg-white text-slate-800 p-0 flex flex-col font-sans text-sm">
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex gap-2 items-center text-sm font-medium text-slate-500">
                <Folder size={16} className="text-indigo-500" />
                <span>/ root / void</span>
                <div className="ml-auto text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>ENTROPY ACTIVE</span>
                </div>
            </div>

            <div className="p-6 grid grid-cols-3 sm:grid-cols-4 gap-6 overflow-auto content-start bg-slate-50/30 h-full">
                {files.map(f => (
                    <div
                        key={f.id}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all cursor-pointer group relative"
                        style={{ opacity: f.integrity / 100 }}
                    >
                        <div className="relative">
                            <File size={42} strokeWidth={1} className={`text-slate-400 group-hover:text-indigo-500 ${f.integrity < 50 ? 'text-red-400' : ''}`} />
                            {f.integrity < 100 && (
                                <span className="absolute -top-1 -right-1 text-[10px] font-bold text-red-500 bg-white shadow-sm px-1 rounded-full border border-red-100">
                                    {f.integrity}%
                                </span>
                            )}
                        </div>

                        <span className="text-center truncate w-full font-medium text-slate-700 text-xs">{f.name}</span>

                        {/* Decay Bar (as underline) */}
                        <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden mt-1 opacity-50">
                            <div
                                className={`h-full ${f.integrity < 30 ? 'bg-red-500' : 'bg-slate-800'}`}
                                style={{ width: `${f.integrity}%` }}
                            />
                        </div>
                    </div>
                ))}

                {files.length === 0 && (
                    <div className="col-span-full text-center text-slate-400 py-20 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                            <Folder size={24} className="opacity-20" />
                        </div>
                        <span className="font-medium">The void is empty.</span>
                    </div>
                )}
            </div>
        </div>
    );
};
export default TheVoid;
