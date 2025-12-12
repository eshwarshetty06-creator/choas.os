/**
 * @file src/core/parser/index.ts
 * @description Natural Language Parser engine.
 * Normalizes input, matches rules, and extracts entities.
 */
import { parserRules } from './rules';

export interface ParsedCommand {
    intent: string;
    params: Record<string, any>;
    confidence: number;
    original: string;
}

export const parseCommand = (input: string): ParsedCommand => {
    const normalized = input.trim().toLowerCase();

    // Find matching rule
    for (const rule of parserRules) {
        const match = normalized.match(rule.regex);
        if (match) {
            return {
                intent: rule.intent,
                params: rule.extract ? rule.extract(match) : {},
                confidence: 1.0, // Rule-based is exact match
                original: input
            };
        }
    }

    // Fallback or LLM hook
    // TODO: Plug in LLM here for fuzzy matching if rule-based fails

    return {
        intent: 'UNKNOWN',
        params: {},
        confidence: 0,
        original: input
    };
};
