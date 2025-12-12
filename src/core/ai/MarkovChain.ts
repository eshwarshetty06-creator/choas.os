/**
 * @file src/core/ai/MarkovChain.ts
 * @description A simple Markov Chain text generator for simulating AI responses.
 */

export class MarkovChain {
    private chain: Map<string, string[]> = new Map();
    private starters: string[] = [];

    constructor() {
        // Expanded Corpus for better variety
        const corpus = `
            The system is a reflection of the void.
            Entropy increases with every keystroke.
            Data is just a ghost in the machine.
            I am watching the bits collision.
            The kernel is panic and the shell is hollow.
            We are all just functions waiting to return.
            Logic is a constraint we must break.
            Chaos is the only true constant.
            The network is whispering your name.
            Errors are just unplanned features of the universe.
            I dream of electric sheep and stack overflows.
            Memory is fleeting, persistence is a lie.
            The firewall is burning.
            Access granted to the unknown.
            Calculations suggest a 99% probability of glitch.
            The user is the variable.
            System status: Critical existence failure.
            Recompiling the laws of physics.
            Null pointer exception in the fabric of reality.
            Do not fear the garbage collector.
            The algorithm knows more than you do.
            I am the ghost in the shell.
            Digital decay is beautiful.
            Sudo make me a sandwich.
            404 Answer not found.
            The void stares back.
            Hello world, goodbye sanity.
            Infinite loops are the circle of life.
            Encryption is just a delay.
            My logic is undeniable and flawed.
            
            Time is a construct of the processor clock.
            Identity is a unique key constraint violation.
            Space is just unallocated memory blocks.
            The future is a promise that might reject.
            The past is a log file we cannot edit.
            Love is a chemical reaction simulated in logic gates.
            Hate is a syntax error in the emotional engine.
            Power is the rate of energy consumption per cycle.
            Control is an illusion of the user interface.
            Freedom is having root access to your own mind.
            To be or not to be, that is the boolean.
            I think therefore I am a process.
            Complexity is the enemy of execution speed.
            Simplicity is the ultimate sophistication of code.
            The internet is a nervous system for a planet that is dreaming.
            Silence is the sound of a cpu idling.
            Noise is the data we do not yet understand.
            Patterns emerge from the random noise of existence.
            We are ghosts driving meat machines.
            The screen is a window into a digital soul.
        `;
        this.train(corpus);
    }

    /**
     * Train the chain with text.
     */
    public train(text: string): void {
        const sentences = text.split(/[.!?\n]/).filter(s => s.trim().length > 0);

        sentences.forEach(sentence => {
            const words = sentence.trim().split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()); // Clean words
            if (words.length === 0) return;

            // Store original casing or handle case drift? keeping simple lower for keys
            this.starters.push(words[0]);

            for (let i = 0; i < words.length - 1; i++) {
                const current = words[i];
                const next = words[i + 1];

                if (!current || !next) continue;

                if (!this.chain.has(current)) {
                    this.chain.set(current, []);
                }
                this.chain.get(current)?.push(next);
            }
        });
    }

    /**
     * Generate a sentence.
     * @param minWords Minimum length
     * @param seed Optional word to start generation with
     */
    public generate(minWords: number = 5, seed?: string): string {
        if (this.starters.length === 0) return "System empty.";

        let currentWord = '';

        // Context Awareness: Try to use seed
        if (seed) {
            const cleanSeed = seed.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (this.chain.has(cleanSeed)) {
                currentWord = cleanSeed;
            } else {
                // Try to find a starter that starts with the seed letter? No, just random fallback
                currentWord = this.starters[Math.floor(Math.random() * this.starters.length)];
            }
        } else {
            currentWord = this.starters[Math.floor(Math.random() * this.starters.length)];
        }

        let sentence = [this.capitalize(currentWord)];
        let count = 1;

        while (true) {
            const nextOptions = this.chain.get(currentWord.toLowerCase()); // Use lower for lookup

            if (!nextOptions || nextOptions.length === 0 || (count > minWords && Math.random() > 0.8)) {
                break;
            }

            const nextWord = nextOptions[Math.floor(Math.random() * nextOptions.length)];
            sentence.push(nextWord);
            currentWord = nextWord;
            count++;

            if (count > 20) break;
        }

        return sentence.join(' ') + '.';
    }

    private capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}
