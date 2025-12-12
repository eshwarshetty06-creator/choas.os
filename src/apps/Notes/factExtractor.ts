/**
 * @file src/apps/Notes/factExtractor.ts
 * @description Logic to extract facts from user notes using simple regex rules.
 */
import core from '../../core/CHAOS_CORE';

interface Fact {
    key: string;
    value: any;
}

const patterns = [
    { regex: /I have a (\w+) named (\w+)/i, keyGroup: 1, valGroup: 2 },
    { regex: /My (\w+) is (\w+)/i, keyGroup: 1, valGroup: 2 },
    { regex: /I love (\w+)/i, key: 'likes', valGroup: 1 },
    { regex: /I hate (\w+)/i, key: 'dislikes', valGroup: 1 },
    { regex: /I am (\w+)/i, key: 'user_state', valGroup: 1 }
];

export const extractFacts = (text: string): Fact[] => {
    const facts: Fact[] = [];

    patterns.forEach(p => {
        const match = text.match(p.regex);
        if (match) {
            const key = p.key ? p.key : match[p.keyGroup!].toLowerCase();
            const value = match[p.valGroup];

            // Deduplicate internally? 
            // For now just returning what is found, store handles update
            facts.push({ key, value });

            // Determine if we should push to core immediately
            // In this specific architecture, we might just return them
            // But requirement says "calls CHAOS_CORE.setFact" - let's do both or just call it here?
            // "factExtractor. ts: ... and calls CHAOS_CORE.setFact"

            console.log(`[FactExtractor] Found fact: ${key} = ${value}`);
            core.setFact(key, value);
        }
    });

    return facts;
};
