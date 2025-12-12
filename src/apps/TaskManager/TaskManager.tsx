
import React, { useState, useEffect } from 'react';
import { Skull, RefreshCw, Cpu } from 'lucide-react';
import { useChaosStore } from '../../state/chaosStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Process {
    id: number;
    name: string;
    pid: number;
    memory: number;
    type: 'system' | 'user' | 'malware';
}

const PROCESS_NAMES = ['kernel.exe', 'svchost.exe', 'explorer.exe', 'chrome.exe', 'node.exe', 'doom.wad', 'virus.bat', 'unknown_entity'];

export const TaskManager: React.FC = () => {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [score, setScore] = useState(0);
    const { chaosLevel, addChaos } = useChaosStore();

    useEffect(() => {
        const interval = setInterval(() => {
            if (processes.length < 10) {
                const newProcess: Process = {
                    id: Date.now(),
                    name: PROCESS_NAMES[Math.floor(Math.random() * PROCESS_NAMES.length)],
                    pid: Math.floor(Math.random() * 9000) + 1000,
                    memory: Math.floor(Math.random() * 500) + 20,
                    type: Math.random() > 0.8 ? 'malware' : 'system'
                };
                setProcesses(prev => [...prev, newProcess]);
            }
        }, 2000 / (Math.max(1, chaosLevel / 10))); // Spawns faster with chaos

        return () => clearInterval(interval);
    }, [processes.length, chaosLevel]);

    const killProcess = (id: number, type: string) => {
        setProcesses(prev => prev.filter(p => p.id !== id));
        if (type === 'malware') {
            setScore(s => s + 100);
            addChaos(-5, 'Threat Neutralized');
        } else {
            setScore(s => s - 50);
            addChaos(2, 'System Instability');
        }
    };

    return (
        <div className="w-full h-full bg-slate-50/95 text-slate-800 font-mono flex flex-col overflow-hidden relative selection:bg-indigo-200">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200 p-4 bg-white/80 backdrop-blur-sm">
                <div className="flex gap-2 items-center text-indigo-700">
                    <Cpu size={20} />
                    <span className="tracking-wide font-bold text-sm">SYSTEM MONITOR</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Contribution Score</span>
                    <span className="text-indigo-600 font-bold font-mono text-xl leading-none">{score.toString().padStart(6, '0')}</span>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-3 space-y-2 relative z-0 custom-scrollbar">
                <AnimatePresence>
                    {processes.map(proc => (
                        <motion.div
                            key={proc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`group relative flex items-center gap-4 p-3 rounded-lg border 
                                transition-all cursor-crosshair shadow-sm
                                ${proc.type === 'malware'
                                    ? 'bg-red-50/50 border-red-200 hover:bg-red-100/80 hover:border-red-300'
                                    : 'bg-white border-slate-200 hover:bg-white hover:border-indigo-300 hover:shadow-md'
                                }`}
                            onClick={() => killProcess(proc.id, proc.type)}
                        >
                            {/* Process ID */}
                            <span className="font-mono text-xs text-slate-500 w-12">
                                {proc.pid}
                            </span>

                            {/* Icon */}
                            {proc.type === 'malware' ? (
                                <Skull size={18} className="text-red-500 animate-pulse" />
                            ) : (
                                <RefreshCw size={18} className="text-indigo-500 opacity-70" />
                            )}

                            {/* Name & Bar */}
                            <div className="flex-1 flex flex-col gap-1.5">
                                <span className={`text-sm font-bold tracking-tight ${proc.type === 'malware' ? 'text-red-700' : 'text-slate-900 group-hover:text-indigo-700'}`}>
                                    {proc.name}
                                </span>
                                {/* Mock Memory Bar */}
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(proc.memory / 600) * 100}%` }}
                                        className={`h-full rounded-full ${proc.type === 'malware' ? 'bg-red-500' : 'bg-indigo-500'}`}
                                    />
                                </div>
                            </div>

                            {/* Memory Usage */}
                            <span className="text-xs font-bold font-mono text-slate-700 w-16 text-right">
                                {proc.memory} MB
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {processes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
                        <div className="w-8 h-8 border-2 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                        <span className="text-xs uppercase tracking-widest font-bold text-slate-500">Scanning Processes...</span>
                    </div>
                )}
            </div>

            {/* Status Footer */}
            <div className="bg-white border-t border-slate-200 p-2 flex justify-between text-[10px] text-slate-500 uppercase px-4 font-bold">
                <span>Mem: <span className="text-slate-800">{processes.reduce((acc, p) => acc + p.memory, 0)} MB Used</span></span>
                <span>Active Threads: <span className="text-slate-800">{processes.length}</span></span>
            </div>
        </div>
    );
};
export default TaskManager;

