import { useEffect } from 'react';
import { Desktop } from './apps/Desktop/Desktop';
import { GlitchOverlay } from './components/GlitchOverlay';
import core from './core/CHAOS_CORE';
import { useChaosStore } from './state/chaosStore';

function App() {
    useEffect(() => {
        core.init();
        useChaosStore.getState().init(); // Hook up reactive store to event bus
    }, []);

    return (
        <div className="w-full h-screen overflow-hidden bg-black text-white">
            <GlitchOverlay />
            <Desktop />
        </div>
    );
}

export default App;
