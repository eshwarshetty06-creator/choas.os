/**
 * @file src/core/eventBus.ts
 * @description Typed wrapper around EventEmitter3 for system-wide events.
 */
import EventEmitter from 'eventemitter3';

export type ChaosEvents = {
    'chaos:updated': (payload: { level: number; reason?: string }) => void;
    'chaos:threshold': (payload: { threshold: number; direction: 'up' | 'down' }) => void;
    'mood:changed': (payload: { mood: string }) => void;
    'fact:added': (payload: { key: string; value: any }) => void;
    'activity:added': (payload: any) => void;
    'state:restored': (action: 'undo' | 'redo') => void;
    'command:open_app': (payload: { app: string }) => void;
    'command:close_app': (payload: { app: string }) => void;
    'command:set_wallpaper': (payload: { mode: string }) => void;
    'window:fate_transform': (payload: any) => void;
    'ai:response': (payload: { originalInput: string; response: string }) => void;
    'window:fullscreen': (payload: { id: string; isMaximized: boolean }) => void;
};

class TypedEventBus extends EventEmitter<ChaosEvents> { }

export const eventBus = new TypedEventBus();
