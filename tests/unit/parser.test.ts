/**
 * @file tests/unit/parser.test.ts
 * @description Unit tests for natural language parser.
 */
import { parseCommand } from '../../src/core/parser/index';

describe('Parser', () => {
    test('should identify OPEN_APP intent', () => {
        const input = 'Open Notes';
        const result = parseCommand(input);
        expect(result.intent).toBe('OPEN_APP');
        expect(result.params.target).toBe('notes'); // regex uses match parameters which might keep case or not depending on impl, let's check loose
    });

    test('should identify ADD_CHAOS intent', () => {
        const input = 'Add chaos 50';
        const result = parseCommand(input);
        expect(result.intent).toBe('ADD_CHAOS');
        expect(result.params.amount).toBe(50);
    });

    test('should identify SET_WALLPAPER intent', () => {
        const input = 'Set wallpaper to glitch';
        const result = parseCommand(input);
        expect(result.intent).toBe('SET_WALLPAPER');
        expect(result.params.mode).toBe('glitch');
    });

    test('should match QUERY_FACT', () => {
        const input = 'Who is Milo?';
        const result = parseCommand(input);
        expect(result.intent).toBe('QUERY_FACT');
        expect(result.params.key).toBe('milo');
    });

    test('should match UNDO', () => {
        expect(parseCommand('undo').intent).toBe('UNDO');
    });

    test('should fallback to UNKNOWN for garbage', () => {
        expect(parseCommand('blarg blarg').intent).toBe('UNKNOWN');
    });
});
