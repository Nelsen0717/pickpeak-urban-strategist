'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
    color: string;
    twinklePhase: number;
    twinkleSpeed: number;
}

interface Nebula {
    x: number;
    y: number;
    radius: number;
    color: string;
    opacity: number;
    drift: { x: number; y: number };
}

interface ShootingStar {
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    opacity: number;
    active: boolean;
}

export default function StarfieldBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const starsRef = useRef<Star[]>([]);
    const nebulaeRef = useRef<Nebula[]>([]);
    const shootingStarsRef = useRef<ShootingStar[]>([]);
    const timeRef = useRef(0);

    const STAR_COLORS = [
        '#ffffff',  // White
        '#a7d8ff',  // Light blue
        '#ffe4a7',  // Light yellow
        '#ffa7a7',  // Light red
        '#a7ffeb',  // Cyan tint
        '#c4b5fd',  // Light purple
    ];

    const NEBULA_COLORS = [
        'rgba(6, 182, 212, 0.03)',   // Cyan
        'rgba(139, 92, 246, 0.025)', // Purple
        'rgba(236, 72, 153, 0.02)',  // Pink
        'rgba(59, 130, 246, 0.025)', // Blue
    ];

    const initializeStars = useCallback((width: number, height: number) => {
        const stars: Star[] = [];
        const numStars = Math.floor((width * height) / 4000); // Density based on screen size

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * 3 + 0.5, // Depth layer (0.5 to 3.5)
                size: Math.random() * 1.5 + 0.3,
                color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
            });
        }
        starsRef.current = stars;
    }, []);

    const initializeNebulae = useCallback((width: number, height: number) => {
        const nebulae: Nebula[] = [];
        const numNebulae = 5;

        for (let i = 0; i < numNebulae; i++) {
            nebulae.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 400 + 200,
                color: NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)],
                opacity: Math.random() * 0.5 + 0.3,
                drift: {
                    x: (Math.random() - 0.5) * 0.1,
                    y: (Math.random() - 0.5) * 0.1,
                },
            });
        }
        nebulaeRef.current = nebulae;
    }, []);

    const initializeShootingStars = useCallback(() => {
        const shootingStars: ShootingStar[] = [];
        for (let i = 0; i < 3; i++) {
            shootingStars.push({
                x: 0,
                y: 0,
                length: 0,
                speed: 0,
                angle: 0,
                opacity: 0,
                active: false,
            });
        }
        shootingStarsRef.current = shootingStars;
    }, []);

    const spawnShootingStar = useCallback((width: number, height: number) => {
        const inactive = shootingStarsRef.current.find(s => !s.active);
        if (inactive && Math.random() < 0.002) { // Low probability per frame
            inactive.x = Math.random() * width;
            inactive.y = Math.random() * height * 0.5; // Upper half
            inactive.length = Math.random() * 80 + 50;
            inactive.speed = Math.random() * 15 + 10;
            inactive.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
            inactive.opacity = 1;
            inactive.active = true;
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        initializeStars(width, height);
        initializeNebulae(width, height);
        initializeShootingStars();

        const drawNebulae = () => {
            nebulaeRef.current.forEach(nebula => {
                const gradient = ctx.createRadialGradient(
                    nebula.x, nebula.y, 0,
                    nebula.x, nebula.y, nebula.radius
                );
                gradient.addColorStop(0, nebula.color);
                gradient.addColorStop(0.5, nebula.color.replace(/[\d.]+\)$/, '0.015)'));
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
                ctx.fill();

                // Drift nebulae slowly
                nebula.x += nebula.drift.x;
                nebula.y += nebula.drift.y;

                // Wrap around
                if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius;
                if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius;
                if (nebula.y < -nebula.radius) nebula.y = height + nebula.radius;
                if (nebula.y > height + nebula.radius) nebula.y = -nebula.radius;
            });
        };

        const drawStars = (time: number) => {
            starsRef.current.forEach(star => {
                // Twinkle effect
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
                const opacity = 0.3 + (twinkle + 1) * 0.35; // Range: 0.3 to 1.0

                // Size based on depth
                const sizeMultiplier = star.z;
                const currentSize = star.size * sizeMultiplier;

                // Glow for brighter stars
                if (currentSize > 1.2 && opacity > 0.7) {
                    const glowGradient = ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, currentSize * 3
                    );
                    glowGradient.addColorStop(0, star.color.replace(')', `, ${opacity * 0.3})`).replace('rgb', 'rgba'));
                    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = glowGradient;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, currentSize * 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Draw star
                ctx.fillStyle = star.color;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                // Parallax movement - deeper stars move slower
                const speed = 0.3 / star.z;
                star.y -= speed;

                // Reset star position when it goes off screen
                if (star.y < -5) {
                    star.y = height + 5;
                    star.x = Math.random() * width;
                }
            });
        };

        const drawShootingStars = () => {
            shootingStarsRef.current.forEach(star => {
                if (!star.active) return;

                const tailX = star.x - Math.cos(star.angle) * star.length;
                const tailY = star.y + Math.sin(star.angle) * star.length;

                const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
                gradient.addColorStop(0.5, `rgba(167, 216, 255, ${star.opacity * 0.5})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(star.x, star.y);
                ctx.stroke();

                // Glow at head
                const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
                glow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
                ctx.fill();

                // Move
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.opacity -= 0.01;

                // Deactivate when faded or off screen
                if (star.opacity <= 0 || star.x > width || star.y > height) {
                    star.active = false;
                }
            });
        };

        const drawGridOverlay = () => {
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
            ctx.lineWidth = 1;

            const gridSize = 60;
            const time = timeRef.current * 0.001;
            const offset = (time * 10) % gridSize;

            // Horizontal lines
            for (let y = -gridSize + offset; y < height + gridSize; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Vertical lines
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
        };

        const animate = (timestamp: number) => {
            timeRef.current = timestamp;

            // Clear with gradient background
            const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
            bgGradient.addColorStop(0, '#020617'); // slate-950
            bgGradient.addColorStop(0.5, '#0f172a'); // slate-900
            bgGradient.addColorStop(1, '#020617');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            drawNebulae();
            drawGridOverlay();
            drawStars(timestamp);
            spawnShootingStar(width, height);
            drawShootingStars();

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);

            initializeStars(width, height);
            initializeNebulae(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [initializeStars, initializeNebulae, initializeShootingStars, spawnShootingStar]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
