
import React, { useState, useEffect, useRef } from 'react';
import { Radio, Volume2, Wifi } from 'lucide-react';
import { Howl } from 'howler';
import { useChaosStore } from '../../state/chaosStore';

// Assuming we have sound assets or using a reliable CDN for demo
// Reliable MP3 source (Lofi hip hop)
const LOFI_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'; // Free placeholder from Pixabay
const WHITE_NOISE_URL = 'https://assets.mixkit.co/sfx/preview/mixkit-radio-static-noise-1282.mp3';

export const SignalTuner: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [frequency, setFrequency] = useState(88.5);
    const { chaosLevel } = useChaosStore();

    const radioRef = useRef<Howl | null>(null);
    const noiseRef = useRef<Howl | null>(null);

    useEffect(() => {
        radioRef.current = new Howl({
            src: [LOFI_URL],
            html5: false, // Must be false for rate/pitch shift
            loop: true,
            volume: 0.5
        });

        noiseRef.current = new Howl({
            src: [WHITE_NOISE_URL],
            loop: true,
            volume: 0
        });

        return () => {
            radioRef.current?.unload();
            noiseRef.current?.unload();
        };
    }, []);

    // Effect: Chaos modulates static noise
    useEffect(() => {
        if (!isPlaying) return;

        // Higher chaos = LOUDER Signal, Slower Pitch (Heavy/Distorting/Haunted effect)
        const chaosFactor = chaosLevel / 100;

        // Volume: BOOST IT. 
        // We take the user's set volume and add gain based on chaos.
        // Even if volume is low, chaos forces it up.
        // At 100% Chaos, volume is boosted significantly (capped at 1.0).
        const musicVol = Math.min(1.0, volume + (chaosFactor * 0.5));
        const noiseVol = Math.min(0.6, chaosFactor * 0.6); // Static gets quite loud (60%)

        radioRef.current?.volume(musicVol);
        noiseRef.current?.volume(noiseVol);

        // Pitch Shift / Detune: Drop rate aggressively for "Humming" drone
        // At 100% Chaos -> Rate = 0.4 (Very deep, slow drone)
        const targetRate = 1.0 - (chaosFactor * 0.6);

        // Add violent flutter for instability
        const flutter = (Math.random() - 0.5) * (chaosFactor * 0.05);
        radioRef.current?.rate(Math.max(0.1, targetRate + flutter));

        // Visual Frequency Detune
        if (chaosLevel > 20) {
            setFrequency(prev => 88.5 + (Math.random() - 0.5) * chaosFactor * 10);
        } else {
            setFrequency(88.5);
        }
    }, [chaosLevel, isPlaying, volume]);

    const toggleRadio = () => {
        if (isPlaying) {
            radioRef.current?.pause();
            noiseRef.current?.pause();
        } else {
            radioRef.current?.play();
            noiseRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="w-full h-full bg-slate-100 relative overflow-hidden flex flex-col items-center p-8 border-2 border-white shadow-inner">
            {/* Speaker Grille Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:4px_4px] opacity-20 pointer-events-none"></div>

            {/* Main Frequency Display */}
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group mb-8 shadow-sm flex flex-col items-center justify-center z-10">
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-1">Frequency</span>
                <div className={`text-6xl font-sans font-black tracking-tighter transition-all duration-300 ${isPlaying ? 'text-slate-900' : 'text-slate-300'}`}>
                    {frequency.toFixed(1)}<span className="text-xl text-slate-400 font-medium ml-1">MHz</span>
                </div>

                {/* Audio Visualizer (Clean Bars) */}
                <div className="flex justify-center items-end gap-1.5 h-6 mt-4 opacity-80">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 rounded-full transition-all duration-100 ${isPlaying ? 'bg-indigo-500 animate-[bounce_0.5s_infinite]' : 'h-1.5 bg-slate-200'}`}
                            style={{
                                height: isPlaying ? `${Math.random() * 100}%` : '6px',
                                animationDelay: `${i * 0.05}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Controls Container */}
            <div className="w-full max-w-[240px] flex flex-col items-center gap-8 z-10">
                {/* Power Button */}
                <button
                    onClick={toggleRadio}
                    className={`w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center relative shadow-lg hover:-translate-y-1 active:scale-95 active:translate-y-0
                        ${isPlaying
                            ? 'bg-indigo-600 text-white shadow-indigo-200'
                            : 'bg-white text-slate-400 border border-slate-100'}`}
                >
                    <Radio size={36} strokeWidth={2} />
                    {isPlaying && <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>}
                </button>

                {/* Volume Slider */}
                <div className="w-full space-y-3">
                    <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1"><Volume2 size={12} /> Volume</div>
                        <span className="text-slate-900">{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden relative">
                        <input
                            type="range"
                            min="0" max="1" step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-full opacity-0 cursor-pointer absolute z-20"
                        />
                        <div
                            className="h-full bg-slate-900 rounded-full relative z-10 transition-all duration-100"
                            style={{ width: `${volume * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Status Text */}
            <div className="mt-auto text-[10px] uppercase tracking-widest font-bold text-center">
                <span className={chaosLevel > 80 ? 'text-red-500 animate-pulse' : 'text-slate-400'}>
                    {chaosLevel > 80 ? "Signal Unstable" : "Stereo Connected"}
                </span>
            </div>
        </div>
    );
};
export default SignalTuner;

