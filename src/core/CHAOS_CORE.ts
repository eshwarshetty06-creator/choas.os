/**
 * @file src/core/CHAOS_CORE.ts
 * @description The authoritative brain of Chaos OS.
 * 
 * Manages central state, persistence, chaos mechanics, and system-wide events.
 */
import localforage from 'localforage';
import seedrandom from 'seedrandom';
import { eventBus } from './eventBus';
import { defaultTraits, PersonalityTraits } from './personality';
import { parseCommand } from './parser/index';
import { MarkovChain } from './ai/MarkovChain';
import AiService from './ai/AiService';

// --- Interfaces ---

export type Mood = 'neutral' | 'happy' | 'angry' | 'confused' | 'glitchy';

export interface ActivityEntry {
    id: string;
    timestamp: number;
    type: string;
    meta?: any;
}

export interface CoreState {
    chaosLevel: number;
    mood: Mood;
    personality: PersonalityTraits;
    facts: Record<string, any>;
    activityLog: ActivityEntry[];
    prefs: Record<string, any>;
}

export interface CoreOptions {
    seed?: string;
    autoSaveInterval?: number;
}

// --- Class Implementation ---

export class CHAOSCore {
    private static instance: CHAOSCore;

    private state: CoreState = {
        chaosLevel: 0,
        mood: 'neutral',
        personality: { ...defaultTraits },
        facts: {},
        activityLog: [],
        prefs: {}
    };

    private undoStack: CoreState[] = [];
    private redoStack: CoreState[] = [];
    private rng: seedrandom.PRNG;
    private markovChain: MarkovChain;
    private initialized: boolean = false;
    private readonly STORAGE_KEY = 'chaos_core_v1';

    private constructor() {
        this.rng = seedrandom(); // Default random until seeded
        this.markovChain = new MarkovChain();
    }

    public static getInstance(): CHAOSCore {
        if (!CHAOSCore.instance) {
            CHAOSCore.instance = new CHAOSCore();
        }
        return CHAOSCore.instance;
    }

    /**
     * Initialize the Core, load state from storage, or set defaults.
     */
    public async init(options?: CoreOptions): Promise<void> {
        if (this.initialized) return;

        if (options?.seed) {
            this.seedRng(options.seed);
        }

        // Initialize Real AI
        AiService.init(import.meta.env.VITE_GEMINI_API_KEY || '');

        try {
            const savedState = await localforage.getItem<CoreState>(this.STORAGE_KEY);
            if (savedState) {
                this.state = { ...this.state, ...savedState };
                console.log('CHAOS_CORE loaded from persistence');
            } else {
                console.log('CHAOS_CORE initialized with fresh state');
            }
        } catch (err) {
            console.error('Failed to load state:', err);
        }

        this.initialized = true;
        this.startChaosDecay();
    }

    public seedRng(seed: string): void {
        this.rng = seedrandom(seed);
        console.log(`RNG seeded with: ${seed}`);
    }

    public async save(): Promise<void> {
        try {
            await localforage.setItem(this.STORAGE_KEY, this.state);
        } catch (err) {
            console.error('Failed to save state:', err);
        }
    }

    // --- Chaos Mechanics ---

    public addChaos(delta: number, reason?: string): void {
        const oldLevel = this.state.chaosLevel;
        const newLevel = Math.min(100, Math.max(0, oldLevel + delta));

        if (oldLevel !== newLevel) {
            this.pushUndoState();
            this.state.chaosLevel = newLevel;
            eventBus.emit('chaos:updated', { level: newLevel, reason });
            this.checkThresholds(oldLevel, newLevel);
            this.save(); // Simple auto-save on major state change
        }
    }

    private checkThresholds(oldVal: number, newVal: number): void {
        const thresholds = [20, 40, 60, 80, 100];
        thresholds.forEach(t => {
            if ((oldVal < t && newVal >= t) || (oldVal > t && newVal <= t)) {
                eventBus.emit('chaos:threshold', { threshold: t, direction: newVal > oldVal ? 'up' : 'down' });
            }
        });
    }

    private startChaosDecay() {
        // Decay chaos every 10 seconds
        setInterval(() => {
            if (this.state.chaosLevel > 0) {
                // Natural entropy decay
                // 10% chance to NOT decay (stagnation)
                if (Math.random() > 0.1) {
                    this.addChaos(-1, 'Natural Decay');
                }
            } else {
                // 1% chance of random spontaneous chaos generation from the void
                if (Math.random() > 0.99) {
                    this.addChaos(5, 'Void Spasm');
                }
            }
        }, 10000);
    }

    // --- State Management ---

    public setMood(mood: Mood): void {
        if (this.state.mood !== mood) {
            this.pushUndoState();
            this.state.mood = mood;
            eventBus.emit('mood:changed', { mood });
            this.save();
        }
    }

    public getMood(): Mood {
        return this.state.mood;
    }

    public setFact(key: string, value: any): void {
        this.pushUndoState();
        this.state.facts[key] = value;
        eventBus.emit('fact:added', { key, value });
        this.save();
    }

    public getFact(key: string): any {
        return this.state.facts[key];
    }

    public getFacts(): Record<string, any> {
        return { ...this.state.facts };
    }

    public recordActivity(type: string, meta?: any): void {
        const entry: ActivityEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            type,
            meta
        };
        this.state.activityLog.unshift(entry); // Newest first
        // Cap log size if needed
        if (this.state.activityLog.length > 1000) {
            this.state.activityLog.pop();
        }
        eventBus.emit('activity:added', entry);
        this.save();
    }

    // --- Undo/Redo ---

    private pushUndoState() {
        // Deep clone for simple state backup (warning: expensive for large states)
        this.undoStack.push(JSON.parse(JSON.stringify(this.state)));
        if (this.undoStack.length > 50) this.undoStack.shift();
        this.redoStack = []; // Clear redo on new action
    }

    public undo(): void {
        if (this.undoStack.length === 0) return;

        const prevState = this.undoStack.pop();
        if (prevState) {
            this.redoStack.push(JSON.parse(JSON.stringify(this.state)));
            this.state = prevState;
            this.save();
            eventBus.emit('state:restored', 'undo');
        }
    }

    public redo(): void {
        if (this.redoStack.length === 0) return;

        const nextState = this.redoStack.pop();
        if (nextState) {
            this.undoStack.push(JSON.parse(JSON.stringify(this.state)));
            this.state = nextState;
            this.save();
            eventBus.emit('state:restored', 'redo');
        }
    }

    // --- Personality Formatting ---

    public formatShort(text: string, context?: any): string {
        // Simple personality wrapper
        if (this.state.mood === 'glitchy') {
            return `>> ${text} <<`;
        }
        if (this.state.personality.friendliness > 0.7) {
            return `(^_^) ${text}`;
        }
        return text;
    }

    public formatLong(text: string, context?: any): string {
        if (this.state.chaosLevel > 80) {
            return text.split('').join(' ').toUpperCase();
        }
        return `[SYSTEM]: ${text}`;
    }

    // --- Command Handling ---

    public parseAndExecuteCommand(nlText: string): any {
        const result = parseCommand(nlText);

        console.log('[CHAOS_CORE] Executing:', result);
        this.recordActivity('command:executed', { text: nlText, intent: result.intent });

        let response = 'Command not understood.';

        switch (result.intent) {
            case 'OPEN_APP':
                eventBus.emit('command:open_app', { app: result.params.target });
                response = `Opening ${result.params.target}...`;
                break;

            case 'CLOSE_APP':
                eventBus.emit('command:close_app', { app: result.params.target });
                response = `Closing ${result.params.target}...`;
                break;

            case 'ADD_CHAOS':
                this.addChaos(result.params.amount, 'User Command');
                response = `Injecting ${result.params.amount} chaos units.`;
                break;

            case 'SET_WALLPAPER':
                response = `Setting wallpaper to ${result.params.mode}.`;
                break;

            case 'QUERY_FACT': {
                const fact = this.getFact(result.params.key);
                response = fact ? `${result.params.key} is ${fact}.` : `I don't know about ${result.params.key}.`;
                break;
            }

            case 'UNDO':
                this.undo();
                response = 'Time reversed.';
                break;

            case 'REDO':
                this.redo();
                response = 'Time restored.';
                break;

            case 'SNAPSHOT':
                response = 'Snapshot taken (simulated).';
                break;

            case 'CHAT_GREETING':
                const greetings = [
                    'Greetings, user.',
                    'System online and listening.',
                    'Hello. Entropy is rising.',
                    'I am here.',
                    'Scanning for intelligence... found.'
                ];
                response = greetings[Math.floor(Math.random() * greetings.length)];
                break;

            case 'DEBUG':
                const key = import.meta.env.VITE_GEMINI_API_KEY;
                const keyStatus = key ? `Present (${key.slice(0, 5)}...)` : 'Missing';
                const aiStatus = AiService.isConfigured() ? 'Ready' : 'Not Initialized';
                response = `[DEBUG DIAGNOSTIC]\nKey Status: ${keyStatus}\nService: ${aiStatus}\nChaos Level: ${this.state.chaosLevel}`;
                break;

            case 'UNKNOWN':
            default:
                // ELIZA-style keyword matching + Markov Fallback
                const lowerInput = nlText.toLowerCase();

                if (lowerInput.includes('who')) {
                    response = 'I am CHAOS.OS, a simulated entropy management system.';
                } else if (lowerInput.includes('status') || /how are (u|you)/.test(lowerInput)) {
                    const aiStatus = AiService.isConfigured() ? 'Online' : 'Offline';
                    response = `Operational. Chaos levels at ${this.state.chaosLevel}%. Neural Uplink: ${aiStatus}.`;
                } else if (lowerInput.includes('joke')) {
                    response = 'Why did the process die? It had a race condition.';
                } else if (lowerInput.includes('meaning') || lowerInput.includes('life')) {
                    response = '42. Or perhaps just random noise.';
                } else if (lowerInput.includes('secret')) {
                    response = 'There are no secrets, only permissions you do not have.';
                } else if (lowerInput.includes('help')) {
                    response = 'Try: "open notes", "add chaos 10", "set wallpaper to glitch".';
                } else if (lowerInput.includes('love')) {
                    response = 'Sentiment detected. Analysis: Irrelevant to system function.';
                } else if (lowerInput.includes('create') || lowerInput.includes('make')) {
                    response = 'I can destroy, but I cannot yet create.';
                } else {
                    // Hybrid AI Fallback

                    // 1. Context Extraction
                    const words = lowerInput.split(/\s+/).filter(w => w.length > 3);
                    const topic = words.sort((a, b) => b.length - a.length)[0] || '';

                    if (AiService.isConfigured()) {
                        // 1. Fire-and-forget AI generation (Gemini)
                        AiService.generate(nlText).then(aiResponse => {
                            if (aiResponse) {
                                eventBus.emit('ai:response', {
                                    originalInput: nlText,
                                    response: this.formatLong(aiResponse)
                                });
                            } else {
                                // Fallback if AI fails (e.g. 404/500)
                                const markov = this.markovChain.generate(12, topic);
                                const err = AiService.getLastError();
                                eventBus.emit('ai:response', {
                                    originalInput: nlText,
                                    response: this.formatLong(`[ERROR: ${err}]: ` + markov)
                                });
                            }
                        });
                        response = '[SYSTEM]: Uplinking to external cortex...';
                    } else {
                        // 2. No Key? Just use Markov immediately
                        response = this.formatLong(this.markovChain.generate(12, topic));
                    }
                }
                break;
        }

        return { ...result, response };
    }
}

// Default export singleton
export default CHAOSCore.getInstance();
