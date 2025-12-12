import React from 'react';

const GAME_HTML = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>The Button That Hates You (Ultimate)</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap"
        rel="stylesheet">
    <style>
        :root {
            --bg-grad-1: #a18cd1;
            --bg-grad-2: #fbc2eb;
            --primary: #6c5ce7;
            --accent: #fd79a8;
            --white-glass: rgba(255, 255, 255, 0.25);
            --danger: #ff6b6b;
            --text: #2d3436;
        }

        body,
        html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: 'Nunito', sans-serif;
            background: #1a1a2e;
            /* Fallback */
            cursor: none;
            /* Custom cursor */
        }

        /* Canvas Background Layer */
        #bg-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            filter: blur(60px); /* Hardware accelerated blur */
            transform: scale(1.2); /* Remove edge bleeding */
        }

        /* Glassmorphism UI HUD */
        #hud {
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            z-index: 100;
        }

        .glass-panel {
            background: var(--white-glass);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 10px 25px;
            color: white;
            font-family: 'Fredoka One', cursive;
            font-size: 1.2rem;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        /* The Button */
        .game-btn {
            position: absolute;
            width: 180px;
            height: 70px;
            border: none;
            border-radius: 35px;
            background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
            color: var(--primary);
            font-family: 'Fredoka One', cursive;
            font-size: 1.4rem;
            letter-spacing: 1px;
            cursor: none;
            /* Handled by custom cursor */
            box-shadow:
                0 10px 25px rgba(0, 0, 0, 0.15),
                inset 0 -5px 0 rgba(0, 0, 0, 0.05),
                inset 0 2px 0 rgba(255, 255, 255, 0.5);
            transform-origin: center;
            will-change: transform;
            z-index: 10;
            transition: opacity 0.3s, filter 0.3s;
            /* Physics handled by JS */
        }

        .game-btn::after {
            content: '';
            position: absolute;
            top: 10%;
            left: 10%;
            width: 80%;
            height: 40%;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent);
            border-radius: 30px;
        }

        /* Ghost Mode Special Styling */
        .game-btn.ghost {
            background: rgba(255, 255, 255, 0.05) !important;
            backdrop-filter: blur(4px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: rgba(255, 255, 255, 0.6);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
            animation: ghostPulse 2s ease-in-out infinite alternate;
        }

        @keyframes ghostPulse {
            0% {
                opacity: 0.1;
                transform: scale(0.95);
            }

            100% {
                opacity: 0.6;
                transform: scale(1.05);
            }
        }

        /* Decoys */
        .decoy {
            position: absolute;
            padding: 15px 30px;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(5px);
            border-radius: 20px;
            border: none;
            font-family: 'Fredoka One';
            opacity: 0.6;
            transition: background 0.2s, transform 0.2s;
            z-index: 5;
            will-change: left, top;
        }

        /* Custom Cursor */
        #cursor-dot {
            position: fixed;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
            transition: width 0.15s, height 0.15s, background 0.15s;
        }

        #cursor-dot.active {
            width: 35px;
            height: 35px;
            background: var(--accent);
            opacity: 0.8;
        }

        /* Screens */
        .screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 500;
            background: rgba(20, 20, 30, 0.6);
            backdrop-filter: blur(20px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }

        .screen.visible {
            opacity: 1;
            pointer-events: auto;
        }

        h1 {
            font-family: 'Fredoka One', cursive;
            font-size: 4rem;
            color: white;
            text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            margin: 0;
            text-align: center;
        }

        .start-btn {
            margin-top: 40px;
            padding: 20px 60px;
            border-radius: 50px;
            border: none;
            background: var(--accent);
            color: white;
            font-family: 'Fredoka One';
            font-size: 2rem;
            cursor: pointer;
            box-shadow: 0 20px 40px rgba(253, 121, 168, 0.4);
            transition: transform 0.2s;
        }

        .start-btn:hover {
            transform: scale(1.05) rotate(-2deg);
        }

        .start-btn:active {
            transform: scale(0.95);
        }

        /* Taunt Text */
        .taunt {
            position: absolute;
            font-family: 'Fredoka One';
            font-size: 3rem;
            color: white;
            -webkit-text-stroke: 2px var(--text);
            pointer-events: none;
            z-index: 200;
            opacity: 0;
            animation: tauntPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes tauntPop {
            0% {
                transform: scale(0) rotate(-20deg);
                opacity: 0;
            }

            50% {
                transform: scale(1.2) rotate(10deg);
                opacity: 1;
            }

            100% {
                transform: scale(1) rotate(0deg);
                opacity: 0;
                top: -100px;
            }
        }
    </style>
</head>

<body>

    <div id="cursor-dot"></div>
    <canvas id="bg-canvas"></canvas>

    <div id="hud">
        <div class="glass-panel" id="level-display">LEVEL 1</div>
        <div class="glass-panel" id="msg-display">CATCH ME</div>
    </div>

    <!-- Game Elements -->
    <div id="game-layer" style="position:absolute; width:100%; height:100%; top:0; left:0;">
        <button class="game-btn" id="hero-btn">CLICK ME</button>
    </div>

    <!-- Start Screen -->
    <div id="start-screen" class="screen visible">
        <h1 style="color:#a29bfe">THE BUTTON<br><span style="font-size:2rem; color:white">THAT HATES YOU</span></h1>
        <button class="start-btn" onclick="startGame()">START</button>
    </div>

    <!-- Level Transition -->
    <div id="level-screen" class="screen">
        <h1 id="lvl-title">LEVEL 2</h1>
        <p style="color:white; font-size:1.5rem; opacity:0.8; font-family:'Nunito'">Get Ready...</p>
    </div>

    <!-- Win Screen -->
    <div id="win-screen" class="screen">
        <h1 style="color:var(--accent)">UNBELIEVABLE!</h1>
        <p style="color:white; font-size:1.5rem; margin-top:20px;">You actually caught it.</p>
        <button class="start-btn" onclick="location.reload()">AGAIN?</button>
    </div>

    <script>
        /**
         * V3 Logic: "Juice", Physics, and Canvas Background
         * [Fixed] Ghost Mode & Decoy Physics
         */

        // --- Configuration ---
        const LEVELS = [
            { id: 1, name: "Warm Up", color1: "#a18cd1", color2: "#fbc2eb", speed: 0.08, dist: 180 },
            { id: 2, name: "Too Slow", color1: "#84fab0", color2: "#8fd3f4", speed: 0.12, dist: 250 },
            { id: 3, name: "Ghost", color1: "#cfd9df", color2: "#e2ebf0", speed: 0.1, dist: 220, ghost: true },
            { id: 4, name: "Chaos", color1: "#fccb90", color2: "#d57eeb", speed: 0.1, dist: 150, decoys: 12 },
            { id: 5, name: "NIGHTMARE", color1: "#000000", color2: "#434343", speed: 0.2, dist: 300, boss: true }
        ];

        // --- Sound Manager ---
        const AudioSys = {
            ctx: null,
            init: function () {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            },
            play: function (type, freq, dur = 0.1, vol = 0.1) {
                if (!this.ctx) return;
                const o = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                o.type = type;
                o.frequency.setValueAtTime(freq, this.ctx.currentTime);
                g.gain.setValueAtTime(vol, this.ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
                o.connect(g); g.connect(this.ctx.destination);
                o.start(); o.stop(this.ctx.currentTime + dur);
            },
            sfxPop: () => AudioSys.play('sine', 600 + Math.random() * 200),
            sfxErr: () => AudioSys.play('sawtooth', 150, 0.2),
            sfxWin: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => AudioSys.play('square', f, 0.4), i * 80))
        };

        // --- Game State ---
        let state = {
            lvlIdx: 0,
            active: false,
            width: window.innerWidth,
            height: window.innerHeight,
            btnPos: { x: 0, y: 0 },
            targetPos: { x: 0, y: 0 },
            btnVel: { x: 0, y: 0 },
            mouse: { x: 0, y: 0 },
            decoys: [] // Stores decoy physics objects
        };

        // --- Canvas Background ---
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let blobs = [];

        class Blob {
            constructor() {
                this.x = Math.random() * state.width;
                this.y = Math.random() * state.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.r = 100 + Math.random() * 200;
                this.color = LEVELS[0].color1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > state.width) this.vx *= -1;
                if (this.y < 0 || this.y > state.height) this.vy *= -1;
            }
            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function initBG() {
            canvas.width = state.width; canvas.height = state.height;
            blobs = Array(5).fill().map(() => new Blob());
        }

        // --- Physics & Logic ---
        const heroBtn = document.getElementById('hero-btn');

        function gameLoop() {
            // Background Layer
            // Background Layer
            ctx.fillStyle = LEVELS[state.lvlIdx]?.color2 || '#333';
            ctx.fillRect(0, 0, state.width, state.height);
            // Draw blobs
            // OPTIMIZATION: Removed realtime canvas blur (killed FPS)
            // Blur is now handled by CSS on the canvas element
            blobs.forEach(b => {
                b.color = LEVELS[state.lvlIdx]?.color1 || '#fff'; // Sync color
                b.update(); b.draw(ctx);
            });

            if (state.active) {
                // Physics: Smooth Spring to Target
                const s = LEVELS[state.lvlIdx].speed;
                const prevX = state.btnPos.x;
                const prevY = state.btnPos.y;

                state.btnPos.x += (state.targetPos.x - state.btnPos.x) * s;
                state.btnPos.y += (state.targetPos.y - state.btnPos.y) * s;

                // Calculate Velocity for Squish
                const vx = state.btnPos.x - prevX;
                const vy = state.btnPos.y - prevY;
                const vel = Math.hypot(vx, vy);

                // Squash Logic: Stretch active axis, squash other
                // Ghost doesn't squash, it floats
                if (!LEVELS[state.lvlIdx].ghost) {
                    const stretch = 1 + Math.min(vel * 0.02, 0.4);
                    const squash = 1 - Math.min(vel * 0.02, 0.2);
                    const angle = Math.atan2(vy, vx);
                    heroBtn.style.transform = \`translate(-50%, -50%) rotate(\${angle}rad) scale(\${stretch}, \${squash})\`;
                    heroBtn.style.left = state.btnPos.x + 'px';
                    heroBtn.style.top = state.btnPos.y + 'px';
                } else {
                    // Ghost Movement
                    heroBtn.style.transform = 'translate(-50%, -50%)'; // Allow animation to take over
                    heroBtn.style.left = state.btnPos.x + 'px';
                    heroBtn.style.top = state.btnPos.y + 'px';
                }

                // Decoy Physics (Chaos Mode)
                state.decoys.forEach(d => {
                    d.x += d.vx;
                    d.y += d.vy;
                    // Bounce
                    if (d.x < 50 || d.x > state.width - 50) d.vx *= -1;
                    if (d.y < 50 || d.y > state.height - 50) d.vy *= -1;

                    d.el.style.left = d.x + 'px';
                    d.el.style.top = d.y + 'px';
                });
            }

            requestAnimationFrame(gameLoop);
        }

        // --- Interactions ---
        function handleInput(x, y) {
            state.mouse.x = x; state.mouse.y = y;

            // Cursor Follow
            const cur = document.getElementById('cursor-dot');
            cur.style.left = x + 'px'; cur.style.top = y + 'px';

            if (!state.active) return;

            const cfg = LEVELS[state.lvlIdx];
            const dx = x - state.btnPos.x;
            const dy = y - state.btnPos.y;
            const dist = Math.hypot(dx, dy);

            // Repulsion
            if (dist < cfg.dist) {
                const angle = Math.atan2(dy, dx);
                const push = 150 + (state.lvlIdx * 30);

                state.targetPos.x = state.btnPos.x - Math.cos(angle) * push;
                state.targetPos.y = state.btnPos.y - Math.sin(angle) * push;

                // Clamp
                state.targetPos.x = Math.max(100, Math.min(state.width - 100, state.targetPos.x));
                state.targetPos.y = Math.max(100, Math.min(state.height - 100, state.targetPos.y));

                // FX
                if (Math.random() < 0.08) {
                    AudioSys.sfxPop();
                    spawnTaunt(state.btnPos.x, state.btnPos.y);
                }
            }
        }

        // --- System ---
        function startGame() {
            AudioSys.init();
            document.getElementById('start-screen').classList.remove('visible');
            loadLevel(0);
        }

        function loadLevel(idx) {
            state.lvlIdx = idx;
            const cfg = LEVELS[idx];

            // UI
            document.getElementById('level-display').innerText = idx < 4 ? \`LEVEL \${idx + 1}\` : "FINAL";
            document.getElementById('msg-display').innerText = cfg.name;

            // Show Level Screen
            const screen = document.getElementById('level-screen');
            document.getElementById('lvl-title').innerText = cfg.name;
            screen.classList.add('visible');
            state.active = false;

            // Reset Btn
            state.btnPos = { x: state.width / 2, y: state.height / 2 };
            state.targetPos = { ...state.btnPos };
            heroBtn.style.transform = "scale(1)";

            // Clean up old
            document.querySelectorAll('.decoy').forEach(e => e.remove());
            state.decoys = [];

            // Apply Ghost Class
            if (cfg.ghost) {
                heroBtn.classList.add('ghost');
            } else {
                heroBtn.classList.remove('ghost');
            }

            setTimeout(() => {
                screen.classList.remove('visible');
                state.active = true;

                // Spawn Decoys
                if (cfg.decoys) {
                    for (let i = 0; i < cfg.decoys; i++) {
                        let el = document.createElement('button');
                        el.className = 'decoy';
                        el.innerText = "NOPE";
                        // Start pos
                        let startX = Math.random() * (state.width - 100);
                        let startY = Math.random() * (state.height - 50);
                        el.style.left = startX + 'px';
                        el.style.top = startY + 'px';

                        document.getElementById('game-layer').appendChild(el);

                        // Physics Object
                        let d = {
                            el: el,
                            x: startX,
                            y: startY,
                            vx: (Math.random() - 0.5) * 15, // Fast Speed
                            vy: (Math.random() - 0.5) * 15
                        };

                        el.onclick = () => {
                            AudioSys.sfxErr();
                            d.el.style.background = 'tomato';
                            d.el.innerText = "WRON"; // Typo intentional for chaos
                            d.vx *= 2; d.vy *= 2; // Angry Recoil
                        };

                        state.decoys.push(d);
                    }
                }

            }, 1500);
        }

        // Win Logic
        heroBtn.addEventListener('click', (e) => {
            if (!state.active) return;
            AudioSys.sfxWin();

            // Confetti
            for (let i = 0; i < 30; i++) {
                const p = document.createElement('div');
                p.style.position = 'absolute'; p.style.width = '8px'; p.style.height = '8px';
                p.style.background = LEVELS[state.lvlIdx].color2;
                p.style.left = e.clientX + 'px'; p.style.top = e.clientY + 'px';
                p.style.transition = 'all 0.8s ease-out';
                document.body.appendChild(p);
                setTimeout(() => {
                    const angle = Math.random() * 6.28;
                    const v = 100 + Math.random() * 200;
                    p.style.transform = \`translate(\${Math.cos(angle) * v}px, \${Math.sin(angle) * v}px)\`;
                    p.style.opacity = 0;
                }, 10);
            }

            if (state.lvlIdx < LEVELS.length - 1) {
                loadLevel(state.lvlIdx + 1);
            } else {
                document.getElementById('win-screen').classList.add('visible');
            }
        });

        const TAUNTS = ["TOO SLOW!", "NOPE!", "SKILL ISSUE", "HEHEHE", "ALMOST!", "TRY AGAIN"];
        function spawnTaunt(x, y) {
            const t = document.createElement('div');
            t.className = 'taunt';
            t.innerText = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
            t.style.left = (x + (Math.random() - 0.5) * 100) + 'px';
            t.style.top = (y - 50) + 'px';
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 600);
        }

        // Init
        window.addEventListener('resize', () => {
            state.width = window.innerWidth;
            state.height = window.innerHeight;
            canvas.width = state.width; canvas.height = state.height;
        });
        document.addEventListener('mousemove', e => handleInput(e.clientX, e.clientY));
        document.addEventListener('click', () => {
            document.getElementById('cursor-dot').classList.add('active');
            setTimeout(() => document.getElementById('cursor-dot').classList.remove('active'), 150);
        });

        initBG();
        requestAnimationFrame(gameLoop);

    </script>
</body>

</html>
`;

export const ImpossibleApp: React.FC = React.memo(() => {
    return (
        <div className="w-full h-full bg-black">
            <iframe
                srcDoc={GAME_HTML}
                className="w-full h-full border-0 block"
                title="The Impossible Button"
                sandbox="allow-scripts allow-same-origin allow-popups"
            />
        </div>
    );
});
