/**
 * @file src/core/parser/rules.ts
 * @description Rules and regex patterns for determining user intent.
 */

export interface ParserRule {
    id: string;
    regex: RegExp;
    intent: string;
    extract?: (match: RegExpMatchArray) => Record<string, any>;
    examples: string[];
}

export const parserRules: ParserRule[] = [
    {
        id: 'open_app',
        regex: /open\s+(.+)/i,
        intent: 'OPEN_APP',
        extract: (match) => ({ target: match[1].trim() }),
        examples: ['open notes', 'open terminal']
    },
    {
        id: 'close_app',
        regex: /close\s+(.+)/i,
        intent: 'CLOSE_APP',
        extract: (match) => ({ target: match[1].trim() }),
        examples: ['close notes']
    },
    {
        id: 'set_wallpaper',
        regex: /set\s+wallpaper\s+to\s+(.+)/i,
        intent: 'SET_WALLPAPER',
        extract: (match) => ({ mode: match[1].trim() }),
        examples: ['set wallpaper to glitch', 'set wallpaper to calm']
    },
    {
        id: 'who_is',
        regex: /who\s+is\s+(.+)\?/i,
        intent: 'QUERY_FACT',
        extract: (match) => ({ key: match[1].trim().replace('?', '') }),
        examples: ['who is milo?']
    },
    {
        id: 'add_chaos',
        regex: /(?:add\s+|increase\s+)?chaos\s+(?:\+)?(\d+)/i,
        intent: 'ADD_CHAOS',
        extract: (match) => ({ amount: parseInt(match[1]) }),
        examples: ['add chaos 10', 'chaos 50', 'chaos +20', 'increase chaos 10']
    },
    {
        id: 'remove_chaos',
        regex: /(?:remove|reduce|lower|decrease|minus)\s+chaos\s+(?:-)?(\d+)|chaos\s+-(\d+)/i,
        intent: 'ADD_CHAOS',
        extract: (match) => ({ amount: -parseInt(match[1] || match[2]) }),
        examples: ['remove chaos 20', 'reduce chaos 50', 'chaos -20']
    },
    {
        id: 'set_personality',
        regex: /be\s+(more|less)\s+(\w+)/i,
        intent: 'SET_PERSONALITY',
        extract: (match) => ({ trait: match[2], direction: match[1] }),
        examples: ['be more friendly', 'be less chaotic']
    },
    {
        id: 'undo',
        regex: /^undo$/i,
        intent: 'UNDO',
        examples: ['undo']
    },
    {
        id: 'redo',
        regex: /^redo$/i,
        intent: 'REDO',
        examples: ['redo']
    },
    {
        id: 'snapshot',
        regex: /snapshot|backup/i,
        intent: 'SNAPSHOT',
        examples: ['create snapshot', 'backup system']
    },
    {
        id: 'chat_greeting',
        regex: /^(hello|hi|hey|greetings|sup|yo)/i,
        intent: 'CHAT_GREETING',
        examples: ['hello', 'hi chaos']
    }
];
