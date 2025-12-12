
import React from 'react';
import { User, Activity } from 'lucide-react';

// Placeholder using simple random data since we don't have full history access easily here yet
export const PersonaMirror: React.FC = () => {
    // Generate random stats for "Shadow Self"
    const stats = {
        chaos: Math.floor(Math.random() * 100),
        order: Math.floor(Math.random() * 50),
        aggression: Math.floor(Math.random() * 80),
        curiosity: 95
    };

    return (

        <div className="w-full h-full bg-slate-50 text-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Subtle background mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />

            <div className="relative z-10 text-center space-y-8 w-full max-w-sm">

                {/* ID Photo */}
                <div className="relative mx-auto group cursor-pointer">
                    <div className="w-32 h-32 mx-auto rounded-full bg-white p-1.5 shadow-[0_10px_40px_rgba(99,102,241,0.2)] border border-indigo-100 transition-transform group-hover:scale-105">
                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden relative">
                            <User size={64} className="text-slate-300 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10" />
                        </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-slate-600 whitespace-nowrap">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        ONLINE
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">Subject #001</h2>
                    <p className="text-xs text-slate-500 font-medium">Psychometric Analysis</p>
                </div>

                <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
                    {Object.entries(stats).map(([key, val]) => (
                        <div key={key} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wide">
                                <span>{key}</span>
                                <span className="text-indigo-600">{val}%</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                                    style={{ width: `${val}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default PersonaMirror;
