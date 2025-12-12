
import React, { useRef, useState, useEffect } from 'react';
import { Upload, Download, RefreshCw, Zap } from 'lucide-react';
import { useChaosStore } from '../../state/chaosStore';

export const GlitchStudio: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [glitchIntensity, setGlitchIntensity] = useState(10);
    const { addChaos } = useChaosStore();

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => setImage(img);
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (image && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = 600;
                canvas.height = 400; // Fixed size for now, preserve aspect ratio later
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
        }
    }, [image]);

    const applyGlitch = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        // 1. RGB Shift
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const offset = Math.floor(glitchIntensity * 2);

        for (let i = 0; i < data.length; i += 4) {
            // Red channel shift
            if (i + offset * 4 < data.length) {
                data[i] = data[i + offset * 4];
            }
        }

        // 2. Random Slices
        ctx.putImageData(imageData, 0, 0);

        const slices = Math.floor(glitchIntensity / 2);
        for (let i = 0; i < slices; i++) {
            const h1 = Math.random() * h;
            const h2 = Math.random() * 50;
            const xOffset = (Math.random() - 0.5) * glitchIntensity * 5;
            try {
                const sliceData = ctx.getImageData(0, h1, w, h2);
                ctx.putImageData(sliceData, xOffset, h1);
            } catch (e) { /* ignore bounds */ }
        }

        addChaos(5); // Glitching increases entropy
    };

    const saveImage = () => {
        const link = document.createElement('a');
        link.download = `chaos_glitch_${Date.now()}.png`;
        link.href = canvasRef.current?.toDataURL() || '';
        link.click();
    };

    return (

        <div className="w-full h-full bg-white text-slate-800 p-4 flex flex-col gap-4 overflow-hidden font-sans">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black flex items-center gap-2 tracking-tight text-slate-900">
                    <div className="p-1.5 bg-indigo-600 rounded text-white"><Zap size={14} fill="currentColor" /></div>
                    GLITCH STUDIO
                </h2>
                <div className="flex gap-2">
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors">
                        <Upload size={14} />
                        Open Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                    </label>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden">
                {/* Checkerboard background for transparency */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb),linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb)] bg-[size:20px_20px] bg-[position:0_0,10px_10px] opacity-40 pointer-events-none"></div>

                {!image && (
                    <div className="text-slate-400 flex flex-col items-center gap-2">
                        <Upload size={32} className="opacity-20" />
                        <span className="text-sm font-medium">Drop an image here to start</span>
                    </div>
                )}
                <canvas ref={canvasRef} className="max-w-full max-h-full shadow-xl shadow-slate-200 relative z-10 object-contain" />
            </div>

            {/* Controls */}
            <div className="flex gap-4 items-center bg-slate-100/50 p-4 rounded-xl border border-slate-200 backdrop-blur-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 w-16">Intensity</span>
                <div className="flex-1 relative h-6 flex items-center">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={glitchIntensity}
                        onChange={(e) => setGlitchIntensity(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={applyGlitch}
                        className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-bold uppercase text-[10px] tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                        <Zap size={14} fill="currentColor" /> Corrupt
                    </button>
                    <button
                        onClick={saveImage}
                        disabled={!image}
                        className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-3 py-2 rounded-lg disabled:opacity-50 transition-all hover:border-slate-300"
                        title="Save Image"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlitchStudio;
