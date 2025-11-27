'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function WarpTransition() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const centerX = width / 2;
        const centerY = height / 2;

        interface WarpStar {
            angle: number;
            speed: number;
            distance: number;
            size: number;
            color: string;
            trail: { x: number; y: number }[];
        }

        const stars: WarpStar[] = [];
        const numStars = 100;

        const colors = [
            '#ffffff',
            '#a7d8ff',
            '#06b6d4',
            '#22d3ee',
            '#c4b5fd',
        ];

        for (let i = 0; i < numStars; i++) {
            stars.push({
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 12 + 6,
                distance: Math.random() * 50,
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                trail: [],
            });
        }

        let frame = 0;
        const maxFrames = 45;

        const animate = () => {
            frame++;

            // Clear with fade
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, width, height);

            // Progress factor (0 to 1)
            const progress = Math.min(frame / maxFrames, 1);

            // Center glow - simpler
            const glowSize = 30 + progress * 150;
            const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
            centerGlow.addColorStop(0, `rgba(6, 182, 212, ${0.5 * (1 - progress * 0.5)})`);
            centerGlow.addColorStop(0.5, `rgba(34, 211, 238, ${0.2 * (1 - progress * 0.3)})`);
            centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = centerGlow;
            ctx.beginPath();
            ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // Draw warp streaks
            stars.forEach(star => {
                const acceleration = 1 + progress * 4;
                star.distance += star.speed * acceleration;

                const x = centerX + Math.cos(star.angle) * star.distance;
                const y = centerY + Math.sin(star.angle) * star.distance;

                star.trail.push({ x, y });
                if (star.trail.length > 10) {
                    star.trail.shift();
                }

                if (star.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(star.trail[0].x, star.trail[0].y);

                    for (let i = 1; i < star.trail.length; i++) {
                        ctx.lineTo(star.trail[i].x, star.trail[i].y);
                    }

                    const gradient = ctx.createLinearGradient(
                        star.trail[0].x, star.trail[0].y,
                        x, y
                    );
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
                    gradient.addColorStop(0.5, star.color.replace(')', ', 0.4)').replace('#', 'rgba(').replace(/([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, (_, r, g, b) => `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`));
                    gradient.addColorStop(1, star.color);

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = star.size * (1 + progress * 0.5);
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }

                // Draw star head
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(x, y, star.size * (1 + progress * 0.3), 0, Math.PI * 2);
                ctx.fill();

                // Reset when off screen
                if (star.distance > Math.max(width, height)) {
                    star.distance = 0;
                    star.angle = Math.random() * Math.PI * 2;
                    star.trail = [];
                }
            });

            // Vignette effect
            const vignette = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.7);
            vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignette.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
            vignette.addColorStop(1, `rgba(0, 0, 0, ${0.4 + progress * 0.4})`);
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, width, height);

            if (frame < 70) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] pointer-events-none"
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />

            {/* Subtle scan lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]" />

            {/* Flash at end */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0, 0.7, 0] }}
                transition={{ duration: 0.7, times: [0, 0.5, 0.7, 0.85, 1] }}
                className="absolute inset-0 bg-white"
            />
        </motion.div>
    );
}
