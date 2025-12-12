import * as React from 'react';
import { Terminal, StickyNote, Info, Camera, Skull, Radio, Folder, User } from 'lucide-react';
import { Window } from '../../components/Window';
import { useChaosStore } from '../../state/chaosStore';
import { TerminalApp } from '../Terminal/TerminalApp';
import { NotesApp } from '../Notes/NotesApp';
import { GlitchStudio } from '../GlitchStudio/GlitchApp';
import { TaskManager } from '../TaskManager/TaskManager';
import { SignalTuner } from '../SignalTuner/SignalTuner';
import { TheVoid } from '../TheVoid/TheVoid';
import { PersonaMirror } from '../PersonaMirror/PersonaMirror';
import { DesktopIcon } from './DesktopIcon';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { DesktopClock } from '../../components/DesktopClock';
import { eventBus } from '../../core/eventBus';

type AppId = 'welcome' | 'terminal' | 'notes' | 'glitch' | 'tasks' | 'radio' | 'void' | 'persona';

export const Desktop: React.FC = () => {
    const { chaosLevel, addChaos } = useChaosStore();
    const desktopRef = React.useRef(null);

    // Helper component for the Welcome screen
    const AppCard = ({ icon, name, desc, cmd }: { icon: any, name: string, desc: string, cmd: string }) => (
        <div className="flex gap-3 items-start p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all group hover:shadow-md cursor-pointer">
            <div className="mt-1 text-indigo-700 group-hover:scale-110 transition-transform bg-indigo-50 p-1.5 rounded-lg">{icon}</div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-black text-sm">{name}</span>
                    <button
                        className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Logic to run command could go here, or just visual
                        }}
                    >
                        {cmd}
                    </button>
                </div>
                <p className="text-xs text-slate-800 leading-snug font-bold">{desc}</p>
            </div>
        </div>
    );

    // State for open apps (Set<AppId> would be cleaner but Array is easier for React state here)
    const [openApps, setOpenApps] = React.useState<AppId[]>([]);

    const toggleApp = (id: AppId) => {
        setOpenApps(prev =>
            prev.includes(id)
                ? prev.filter(app => app !== id)
                : [...prev, id]
        );
    };



    const closeApp = (id: AppId) => {
        setOpenApps(prev => prev.filter(app => app !== id));
    };

    const openApp = (id: AppId) => {
        setOpenApps(prev => prev.includes(id) ? prev : [...prev, id]);
    };

    React.useEffect(() => {
        const handleOpen = ({ app }: { app: string }) => {
            const normalized = app.toLowerCase();
            if (normalized === 'terminal') openApp('terminal');
            if (normalized === 'notes') openApp('notes');
            if (normalized === 'glitch') openApp('glitch');
            if (normalized === 'tasks') openApp('tasks');
            if (normalized === 'radio') openApp('radio');
            if (normalized === 'void') openApp('void');
            if (normalized === 'persona') openApp('persona');
            if (normalized === 'welcome' || normalized === 'about') openApp('welcome');
        };

        const handleClose = ({ app }: { app: string }) => {
            const normalized = app.toLowerCase();
            if (normalized === 'terminal') closeApp('terminal');
            if (normalized === 'notes') closeApp('notes');
            if (normalized === 'glitch') closeApp('glitch');
            if (normalized === 'tasks') closeApp('tasks');
            if (normalized === 'radio') closeApp('radio');
            if (normalized === 'void') closeApp('void');
            if (normalized === 'persona') closeApp('persona');
            if (normalized === 'welcome' || normalized === 'about') closeApp('welcome');
        };

        eventBus.on('command:open_app', handleOpen);
        eventBus.on('command:close_app', handleClose);

        return () => {
            eventBus.off('command:open_app', handleOpen);
            eventBus.off('command:close_app', handleClose);
        };
    }, []);

    return (
        <div ref={desktopRef} className="desktop w-full h-full bg-slate-50 overflow-hidden relative selection:bg-indigo-500/30 font-sans text-slate-800">

            {/* Background / Wallpaper Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <AnimatedBackground />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* Clock Layer (Behind windows, above generic background) */}
            <div className="absolute inset-0 z-5 pointer-events-none flex items-center justify-center -translate-y-16">
                <DesktopClock />
            </div>

            {/* Desktop Grid Layout */}
            <div className="absolute inset-0 z-10 p-8 grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] grid-rows-[repeat(auto-fill,minmax(100px,1fr))] gap-4 content-start pointer-events-none">
                {/* Apps live here */}
            </div>

            {/* Bottom Dock */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-4 px-6 py-3 bg-white/40 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-300">
                <DesktopIcon
                    id="icon-welcome"
                    label="Info"
                    icon={Info}
                    onClick={() => toggleApp('welcome')}
                    isDock
                />
                <div className="w-px h-8 bg-slate-400/20 mx-2" />
                <DesktopIcon
                    id="icon-terminal"
                    label="Term"
                    icon={Terminal}
                    onClick={() => toggleApp('terminal')}
                    isDock
                />
                <DesktopIcon
                    id="icon-notes"
                    label="Notes"
                    icon={StickyNote}
                    onClick={() => toggleApp('notes')}
                    isDock
                />
                <DesktopIcon
                    id="icon-glitch"
                    label="Studio"
                    icon={Camera}
                    onClick={() => toggleApp('glitch')}
                    isDock
                />
                <DesktopIcon
                    id="icon-tasks"
                    label="Killer"
                    icon={Skull}
                    onClick={() => toggleApp('tasks')}
                    isDock
                />
                <DesktopIcon
                    id="icon-radio"
                    label="Tuner"
                    icon={Radio}
                    onClick={() => toggleApp('radio')}
                    isDock
                />
                <DesktopIcon
                    id="icon-void"
                    label="Void"
                    icon={Folder}
                    onClick={() => toggleApp('void')}
                    isDock
                />
                <DesktopIcon
                    id="icon-persona"
                    label="Mirror"
                    icon={User}
                    onClick={() => toggleApp('persona')}
                    isDock
                />
            </div>

            {/* Window Layer */}
            <div className="relative z-20 w-full h-full pointer-events-none">
                {/* Pointer events none allows clicking through empty space to icons/bg, 
                    but Windows need to re-enable pointer-events */}

                {openApps.includes('welcome') && (
                    <div className="pointer-events-auto contents">
                        <Window
                            id="welcome-window"
                            title="Welcome to CHAOS.OS"
                            initialPos={{ x: 200, y: 100 }}
                            onClose={() => closeApp('welcome')}
                            dragConstraints={desktopRef}
                        >
                            <div className="p-6 space-y-8 bg-slate-50/50 h-full font-sans text-black">
                                {/* Header */}
                                <div className="border-b border-indigo-200 pb-6">
                                    <h1 className="text-3xl font-black text-black tracking-tight flex items-baseline gap-2">
                                        CHAOS.OS <span className="text-xs text-indigo-700 font-bold bg-indigo-100 px-2 py-0.5 rounded-full align-middle">v4.0.1</span>
                                    </h1>
                                    <p className="text-sm font-bold text-slate-800 mt-2 leading-relaxed">
                                        A sentient web operating system designed to explore neural interfaces and entropy.
                                        Keep system stability in check, or let it crumble.
                                    </p>
                                </div>

                                {/* System Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
                                        <div className="text-[10px] text-black font-black uppercase tracking-widest mb-1">System Entropy</div>
                                        <div className={`text-3xl font-mono font-black ${chaosLevel > 80 ? 'text-red-600 animate-pulse' : 'text-indigo-700'}`}>
                                            {chaosLevel}%
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
                                        <div className="text-[10px] text-black font-black uppercase tracking-widest mb-1">Neural Status</div>
                                        <div className="text-3xl font-mono font-black text-green-600 flex items-center gap-2">
                                            ONLINE <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                {/* Modules Grid */}
                                <div>
                                    <h3 className="text-xs uppercase font-black text-black mb-4 tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-3 bg-indigo-600 rounded-full" />
                                        Installed Modules
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <AppCard
                                            icon={<Terminal size={18} />}
                                            name="Terminal"
                                            desc="Direct neural link. Execute raw system commands."
                                            cmd="open terminal"
                                        />
                                        <AppCard
                                            icon={<Camera size={18} />}
                                            name="Glitch Studio"
                                            desc="Visual destruction suite & datamoshing."
                                            cmd="open glitch"
                                        />
                                        <AppCard
                                            icon={<Skull size={18} />}
                                            name="Task Killer"
                                            desc="Gamified process manager. Hunt rogue threads."
                                            cmd="open tasks"
                                        />
                                        <AppCard
                                            icon={<Radio size={18} />}
                                            name="Signal Tuner"
                                            desc="Lo-Fi radio that decays with system chaos."
                                            cmd="open radio"
                                        />
                                        <AppCard
                                            icon={<User size={18} />}
                                            name="Persona Mirror"
                                            desc="Psychological profiler & visualizer."
                                            cmd="open persona"
                                        />
                                        <AppCard
                                            icon={<Folder size={18} />}
                                            name="The Void"
                                            desc="Ephemeral storage. Files rot over time."
                                            cmd="open void"
                                        />
                                    </div>
                                </div>

                                <div className="text-[10px] text-slate-600 font-bold font-mono text-center pt-6 border-t border-slate-200">
                                    System Architect: [USER] // Core: Gemini 2.5 Flash
                                </div>
                            </div>
                        </Window>
                    </div>
                )}

                {openApps.includes('terminal') && (
                    <div className="pointer-events-auto contents">
                        <Window
                            id="terminal-window"
                            title="Terminal"
                            initialPos={{ x: 100, y: 300 }}
                            initialSize={{ width: 500, height: 350 }}
                            dragConstraints={desktopRef}
                            onClose={() => closeApp('terminal')}
                        >
                            <TerminalApp />
                        </Window>
                    </div>
                )}

                {openApps.includes('notes') && (
                    <div className="pointer-events-auto contents">
                        <Window
                            id="notes-window"
                            title="Notes"
                            initialPos={{ x: 650, y: 150 }}
                            initialSize={{ width: 400, height: 500 }}
                            dragConstraints={desktopRef}
                            onClose={() => closeApp('notes')}
                        >
                            <NotesApp />
                        </Window>
                    </div>

                )}

                {openApps.includes('glitch') && (
                    <div className="pointer-events-auto contents">
                        <Window
                            id="glitch-window"
                            title="Glitch Studio"
                            initialPos={{ x: 300, y: 100 }}
                            initialSize={{ width: 640, height: 520 }}
                            dragConstraints={desktopRef}
                            onClose={() => closeApp('glitch')}
                        >
                            <GlitchStudio />
                        </Window>
                    </div>
                )}

                {openApps.includes('tasks') && (
                    <div className="pointer-events-auto contents">
                        <Window
                            id="tasks-window"
                            title="Task Manager"
                            initialPos={{ x: 400, y: 400 }}
                            initialSize={{ width: 400, height: 500 }}
                            dragConstraints={desktopRef}
                            onClose={() => closeApp('tasks')}
                        >
                            <TaskManager />
                        </Window>
                    </div>
                )}

                {openApps.includes('radio') && (
                    <div className="pointer-events-auto contents">
                        <Window
                            id="radio-window"
                            title="Signal Tuner"
                            initialPos={{ x: 800, y: 50 }}
                            initialSize={{ width: 320, height: 400 }}
                            dragConstraints={desktopRef}
                            onClose={() => closeApp('radio')}
                        >
                            <SignalTuner />
                        </Window>
                    </div>
                )}

                {openApps.includes('void') && (
                    <div className="pointer-events-auto contents">
                        <Window
                            id="void-window"
                            title="/ROOT/VOID"
                            initialPos={{ x: 150, y: 150 }}
                            initialSize={{ width: 600, height: 450 }}
                            dragConstraints={desktopRef}
                            onClose={() => closeApp('void')}
                        >
                            <TheVoid />
                        </Window>
                    </div>
                )}

                {openApps.includes('persona') && (
                    <div className="pointer-events-auto contents">
                        <Window
                            id="persona-window"
                            title="Persona Mirror"
                            initialPos={{ x: 500, y: 200 }}
                            initialSize={{ width: 450, height: 550 }}
                            dragConstraints={desktopRef}
                            onClose={() => closeApp('persona')}
                        >
                            <PersonaMirror />
                        </Window>
                    </div>
                )}

            </div>
        </div >
    );
};
