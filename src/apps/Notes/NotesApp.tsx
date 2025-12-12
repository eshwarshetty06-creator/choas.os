/**
 * @file src/apps/Notes/NotesApp.tsx
 * @description Notes application with auto-mutation and fact extraction.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import core from '../../core/CHAOS_CORE';
import { extractFacts } from './factExtractor';
import { useChaosStore } from '../../state/chaosStore';

interface Note {
    id: string;
    title: string;
    content: string;
    lastModified: number;
}

export const NotesApp: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');
    const idleTimerRef = useRef<any>(null);
    const chaosLevel = useChaosStore(s => s.chaosLevel);

    const activeNote = notes.find(n => n.id === activeNoteId);

    useEffect(() => {
        // Load notes from localstorage (mock persistence for app level)
        const saved = localStorage.getItem('chaos_notes');
        if (saved) {
            setNotes(JSON.parse(saved));
        } else {
            createNote();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveNotes = (updatedNotes: Note[]) => {
        setNotes(updatedNotes);
        localStorage.setItem('chaos_notes', JSON.stringify(updatedNotes));
    };

    const createNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: 'Untitled Note',
            content: '',
            lastModified: Date.now()
        };
        saveNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
        core.recordActivity('note:created', { id: newNote.id });
    };

    const deleteNote = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = notes.filter(n => n.id !== id);
        saveNotes(updated);
        if (activeNoteId === id) {
            setActiveNoteId(updated[0]?.id || null);
        }
        core.recordActivity('note:deleted', { id });
    };

    const updateActiveNote = (updates: Partial<Note>) => {
        if (!activeNoteId) return;

        const updatedNotes = notes.map(n =>
            n.id === activeNoteId ? { ...n, ...updates, lastModified: Date.now() } : n
        );
        saveNotes(updatedNotes);

        if (updates.content !== undefined) {
            // Reset idle timer
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

            setStatus('Typing...');

            // Auto-mutate after 6s idle
            idleTimerRef.current = setTimeout(() => {
                triggerAutoMutate(updates.content!);
            }, 6000);
        }
    };

    const triggerAutoMutate = (content: string) => {
        if (chaosLevel < 10) return; // Only mutate if some chaos exists

        setStatus('Auto-mutating...');
        const mutated = core.formatShort(content); // Using short format for subtle shifts

        // Simple "word morph" effect by replacing text
        if (mutated !== content) {
            updateActiveNote({ content: mutated });
            core.recordActivity('note:mutated', { id: activeNoteId });
        }

        setStatus('Saved');
        extractFacts(content);
    };

    const handleEscalate = () => {
        if (!activeNote) return;
        const story = core.formatLong(activeNote.content);
        updateActiveNote({ content: story });
        core.recordActivity('note:escalated', { id: activeNote.id });
        core.addChaos(5, 'Story Escalation');
    };

    return (
        <div className="flex h-full w-full bg-white text-slate-800">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-slate-200 bg-slate-50/50 flex flex-col">
                <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">All Notes</span>
                    <button onClick={createNote} className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`p-3 rounded-lg border border-transparent cursor-pointer transition-all group ${activeNoteId === note.id
                                ? 'bg-white shadow-sm border-slate-200'
                                : 'hover:bg-white/60 hover:border-slate-100'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-bold text-sm truncate pr-2 ${activeNoteId === note.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {note.title || 'Untitled'}
                                </h4>
                                <button
                                    onClick={(e) => deleteNote(note.id, e)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 truncate leading-relaxed">
                                {note.content || <span className="italic opacity-50">Empty note...</span>}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col bg-white h-full relative">
                {/* Faint grid pattern for paper effect */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-50"></div>

                {activeNote ? (
                    <>
                        <div className="p-6 border-b border-slate-100 flex gap-4 relative z-10">
                            <input
                                value={activeNote.title}
                                onChange={(e) => updateActiveNote({ title: e.target.value })}
                                className="bg-transparent text-2xl font-bold outline-none flex-1 placeholder-slate-300 text-slate-900"
                                placeholder="Untitled Note"
                            />
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={handleEscalate}
                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full hover:bg-indigo-100 flex items-center gap-1.5 transition-all shadow-sm border border-indigo-100"
                                    title="Escalate to Story"
                                >
                                    <Wand2 size={12} /> <span className="tracking-wide">AI REFINE</span>
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={activeNote.content}
                            onChange={(e) => updateActiveNote({ content: e.target.value })}
                            className="flex-1 bg-transparent p-6 outline-none resize-none font-sans text-base leading-7 text-slate-700 relative z-10 placeholder-slate-300"
                            placeholder="Start typing your thoughts..."
                        />
                        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400 flex justify-between font-medium">
                            <span>{status || 'Synced'}</span>
                            <span className="font-mono">{activeNote.content.length} chars</span>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-2">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-2">
                            <Plus size={24} className="opacity-20" />
                        </div>
                        <span className="text-sm font-medium">Create a note to begin</span>
                    </div>
                )}
            </div>
        </div>
    );
};
