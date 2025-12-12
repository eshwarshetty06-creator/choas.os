import React, { useEffect, useRef } from 'react';

interface Blob {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
}

export const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Blobs configuration
        // Intense, large, deep colors to fill the screen
        const blobs: Blob[] = [
            { x: Math.random() * width, y: Math.random() * height, vx: 1, vy: 1, radius: 900, color: '#3B82F6' }, // Blue 500 (Vibrant)
            { x: Math.random() * width, y: Math.random() * height, vx: -1, vy: 0.5, radius: 1000, color: '#6366F1' }, // Indigo 500
            { x: Math.random() * width, y: Math.random() * height, vx: 0.5, vy: -1, radius: 800, color: '#8B5CF6' }, // Violet 500
            { x: Math.random() * width, y: Math.random() * height, vx: -0.5, vy: -0.5, radius: 1200, color: '#64748B' }, // Slate 500
        ];

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 0.005;
            ctx.clearRect(0, 0, width, height);

            // Base clean white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            blobs.forEach((blob, i) => {
                // Natural organic movement
                blob.x += Math.sin(time + i) * 1.5;
                blob.y += Math.cos(time + i * 1.5) * 1.5;

                // Mouse interaction (Parallax / Repulsion)
                const dx = mouseRef.current.x - width / 2;
                const dy = mouseRef.current.y - height / 2;

                // Shift based on mouse position from center (Parallax)
                const shiftX = dx * 0.05 * ((i % 2 === 0) ? 1 : -1);
                const shiftY = dy * 0.05 * ((i % 2 === 0) ? 1 : -1);

                const renderX = blob.x + shiftX;
                const renderY = blob.y + shiftY;

                // Wrap around screen
                if (blob.x < -blob.radius) blob.x = width + blob.radius;
                if (blob.x > width + blob.radius) blob.x = -blob.radius;
                if (blob.y < -blob.radius) blob.y = height + blob.radius;
                if (blob.y > height + blob.radius) blob.y = -blob.radius;

                // Draw Gradient
                const gradient = ctx.createRadialGradient(renderX, renderY, 0, renderX, renderY, blob.radius);
                gradient.addColorStop(0, blob.color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.fillStyle = gradient;

                // Blending for "Flowing" look
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 0.6; // High opacity for intense color wash

                ctx.beginPath();
                ctx.arc(renderX, renderY, blob.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1.0;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none -z-10"
        />
    );
};
