/**
 * @file src/demo/demoScript.ts
 * @description Automated demo runner for Chaos OS.
 * Executes a deterministic sequence of actions based on a seed.
 */
import core from '../core/CHAOS_CORE';
import { eventBus } from '../core/eventBus';
import { runFateEvent } from '../animations/fateEvent';
import { extractFacts } from '../apps/Notes/factExtractor';

interface DemoAction {
    time: number;
    action: string;
    payload?: any;
    description: string;
}

export const playDemo = async (seed: string = '12345') => {
    console.log(`[DEMO] Starting playback with seed: ${seed}`);

    // 1. Initialize Determinism
    core.seedRng(seed);
    await core.init({ seed });

    // Define the sequence
    const sequence: DemoAction[] = [
        { time: 1000, action: 'boot_anim', description: 'Trigger Boot Animation' },
        { time: 3000, action: 'create_note', payload: { content: "I have a cat named Milo." }, description: 'User types note' },
        { time: 4000, action: 'fact_extraction', description: 'System extracts fact' },
        { time: 6000, action: 'terminal_cmd', payload: { cmd: "who is Milo?" }, description: 'Query Fact in Terminal' },
        { time: 9000, action: 'open_windows', description: 'Open multiple chaos windows' },
        { time: 12000, action: 'add_chaos', payload: { amount: 50 }, description: 'Inject massive chaos' },
        { time: 15000, action: 'fate_event', description: 'Trigger Fate Event' },
        { time: 25000, action: 'calm_down', description: 'Reduce chaos' },
        { time: 28000, action: 'snapshot', description: 'Export System Snapshot' }
    ];

    // Execution Loop
    for (const step of sequence) {
        setTimeout(async () => {
            console.log(`[DEMO] T+${step.time}: ${step.description}`);

            switch (step.action) {
                case 'boot_anim':
                    // Trigger hypothetical boot animation event
                    eventBus.emit('activity:added', { type: 'system', text: 'Boot Sequence Initiated' });
                    break;

                case 'create_note':
                    // Simulate creating a note
                    // In a real app we'd dispatch to the store, but here we can simulate activity/fact extraction directly mostly
                    // But easier to just simulate the note app logic:
                    extractFacts(step.payload.content); // "I have a cat named Milo"
                    core.recordActivity('note:created', { id: 'demo-note', content: step.payload.content });
                    break;

                case 'fact_extraction':
                    // Already handled in create_note via extractFacts, just verification phase
                    eventBus.emit('activity:added', { type: 'system', text: 'Logic Processor: Fact Verified' });
                    break;

                case 'terminal_cmd':
                    core.parseAndExecuteCommand(step.payload.cmd);
                    break;

                case 'open_windows':
                    // Simulate window opening
                    ['GlitchStudio', 'PersonaMirror', 'TaskManager'].forEach((app, i) => {
                        setTimeout(() => eventBus.emit('command:open_app', { app }), i * 500);
                    });
                    break;

                case 'add_chaos':
                    core.addChaos(step.payload.amount, 'Demo Injection');
                    break;

                case 'fate_event':
                    await runFateEvent({ seed, intensity: 80 });
                    break;

                case 'calm_down':
                    core.addChaos(-40, 'Demo Reset');
                    core.setMood('happy');
                    break;

                case 'snapshot':
                    core.parseAndExecuteCommand('snapshot');
                    eventBus.emit('activity:added', { type: 'system', text: '>> DEMO COMPLETE <<' });
                    break;
            }

        }, step.time);
    }
};
