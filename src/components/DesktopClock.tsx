import React, { useState, useEffect } from 'react';

export const DesktopClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace('AM', '').replace('PM', ''); // Minimalist, remove AM/PM
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col items-center justify-center select-none pointer-events-none p-8">
            {/* Main Time Display */}
            <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 drop-shadow-2xl opacity-90 backdrop-blur-sm">
                {formatTime(time)}
            </h1>

            {/* Date Display */}
            <p className="text-xl md:text-2xl font-medium text-slate-500 tracking-widest uppercase mt-2 drop-shadow-sm">
                {formatDate(time)}
            </p>

            {/* Decorative Line */}
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-6 opacity-80" />
        </div>
    );
};
