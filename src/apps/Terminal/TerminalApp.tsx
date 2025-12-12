/**
 * @file src/apps/Terminal/TerminalApp.tsx
 * @description System Terminal UI for executing Natural Language commands.
 */
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import core from '../../core/CHAOS_CORE';
import { useChaosStore } from '../../state/chaosStore';
import { eventBus } from '../../core/eventBus';

interface LogEntry {
    type: 'input' | 'output' | 'system';
    text: string;
    timestamp: number;
}

export const TerminalApp: React.FC = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<LogEntry[]>([
        { type: 'system', text: 'Welcome to CHAOS.OS Terminal. v0.1', timestamp: Date.now() }
    ]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const { chaosLevel } = useChaosStore();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Listen for async AI responses
    useEffect(() => {
        const handleAiResponse = (payload: { originalInput: string; response: string }) => {
            setHistory(prev => [...prev, {
                type: 'output',
                text: payload.response,
                timestamp: Date.now()
            }]);
        };

        eventBus.on('ai:response', handleAiResponse);

        return () => {
            eventBus.off('ai:response', handleAiResponse);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const cmd = input.trim();
        setHistory(prev => [...prev, { type: 'input', text: cmd, timestamp: Date.now() }]);
        setInput('');

        try {
            // Execute via Core
            const result = core.parseAndExecuteCommand(cmd);

            // Add response
            const delay = 100 + ((chaosLevel || 0) * 2);
            setTimeout(() => {
                setHistory(prev => [...prev, {
                    type: 'output',
                    text: result.response || "No response received.",
                    timestamp: Date.now()
                }]);
            }, delay);
        } catch (err) {
            console.error('[Terminal] Execution Error:', err);
            setHistory(prev => [...prev, {
                type: 'system',
                text: `Error: ${err}`,
                timestamp: Date.now()
            }]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/95 text-slate-700 font-mono text-sm p-2 shadow-inner">
            <div className="flex-1 overflow-y-auto space-y-1 mb-2 custom-scrollbar p-2">
                {history.map((entry, idx) => (
                    <div key={idx} className={`leading-relaxed ${entry.type === 'input' ? 'text-slate-900 font-bold' :
                        entry.type === 'system' ? 'text-indigo-500 italic' :
                            'text-slate-700'
                        }`}>
                        <span className="opacity-40 mr-3 text-xs font-sans tracking-wide select-none text-slate-500">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        {entry.type === 'input' && <span className="mr-2 text-indigo-600 select-none">❯</span>}
                        {entry.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 pt-3 bg-white/50 backdrop-blur-sm px-2 pb-1 rounded-b-lg">
                <span className="text-indigo-600 animate-pulse font-bold">❯</span>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium"
                    placeholder="Type a command..."
                    autoFocus
                />
                <button type="submit" className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
};
