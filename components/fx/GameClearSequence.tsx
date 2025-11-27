'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Star, Crown, Sparkles, Award, Trophy, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/lib/store';

interface GameClearSequenceProps {
    onClose: () => void;
}

export default function GameClearSequence({ onClose }: GameClearSequenceProps) {
    const [step, setStep] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setView } = useGameStore();

    // Canvas animation for aurora effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let time = 0;

        const animate = () => {
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Aurora waves
            for (let i = 0; i < 5; i++) {
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                const hue1 = (time * 50 + i * 30) % 360;
                const hue2 = (time * 50 + i * 30 + 60) % 360;

                gradient.addColorStop(0, `hsla(${hue1}, 80%, 60%, 0)`);
                gradient.addColorStop(0.3, `hsla(${hue1}, 80%, 60%, 0.05)`);
                gradient.addColorStop(0.5, `hsla(${hue2}, 80%, 60%, 0.08)`);
                gradient.addColorStop(0.7, `hsla(${hue2}, 80%, 60%, 0.05)`);
                gradient.addColorStop(1, `hsla(${hue1}, 80%, 60%, 0)`);

                ctx.fillStyle = gradient;

                ctx.beginPath();
                ctx.moveTo(0, canvas.height);

                for (let x = 0; x <= canvas.width; x += 10) {
                    const y = canvas.height * 0.3 +
                        Math.sin(x * 0.003 + time * 2 + i) * 100 +
                        Math.sin(x * 0.007 + time * 1.5 + i * 2) * 50;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.closePath();
                ctx.fill();
            }

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animId);
    }, []);

    useEffect(() => {
        // Sequence timing - more dramatic pacing
        const timers = [
            setTimeout(() => setStep(1), 500),   // Crown appears
            setTimeout(() => setStep(2), 2000),  // Title
            setTimeout(() => setStep(3), 4000),  // Message
            setTimeout(() => setStep(4), 6500),  // Stats
            setTimeout(() => setStep(5), 9000),  // Buttons
        ];

        // Grand Finale Confetti - more elaborate
        const launchConfetti = () => {
            const duration = 8000;
            const animationEnd = Date.now() + duration;

            // Star shapes
            const starShape = confetti.shapeFromText({ text: '★', scalar: 2 });

            const frame = () => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return;

                // Golden rain from sides
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#FFD700', '#FFA500', '#FF6B00', '#FFEC8B'],
                    shapes: ['circle', 'square'],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#FFD700', '#FFA500', '#FF6B00', '#FFEC8B'],
                    shapes: ['circle', 'square'],
                });

                // Occasional big burst from center
                if (Math.random() < 0.02) {
                    confetti({
                        particleCount: 50,
                        spread: 100,
                        origin: { x: 0.5, y: 0.5 },
                        colors: ['#FFD700', '#FFA500', '#06b6d4', '#8b5cf6'],
                        shapes: [starShape, 'circle'],
                        scalar: 1.5,
                    });
                }

                requestAnimationFrame(frame);
            };

            // Initial massive burst
            confetti({
                particleCount: 200,
                spread: 180,
                origin: { x: 0.5, y: 0.6 },
                colors: ['#FFD700', '#FFA500', '#FF6B00', '#FFEC8B', '#ffffff'],
                shapes: [starShape, 'circle', 'square'],
                scalar: 1.2,
            });

            frame();
        };

        launchConfetti();

        return () => timers.forEach(clearTimeout);
    }, []);

    const handleViewCertificate = () => {
        setView('certificate');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Aurora canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />

            {/* Deep space background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950" />

            {/* Background Stars with depth */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(80)].map((_, i) => {
                    const size = Math.random() > 0.9 ? 2 : 1;
                    const delay = Math.random() * 5;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, Math.random() * 0.8 + 0.2, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay,
                            }}
                            className="absolute bg-white rounded-full"
                            style={{
                                width: size,
                                height: size,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                boxShadow: size > 1 ? '0 0 6px rgba(255,255,255,0.8)' : 'none',
                            }}
                        />
                    );
                })}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center space-y-8 p-8 max-w-4xl">
                {/* Crown Icon */}
                <AnimatePresence>
                    {step >= 1 && (
                        <motion.div
                            initial={{ scale: 0, rotate: -360, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ type: 'spring', duration: 1.5, bounce: 0.4 }}
                            className="relative w-48 h-48 mx-auto mb-4"
                        >
                            {/* Radiating rings */}
                            {[1, 2, 3].map((ring) => (
                                <motion.div
                                    key={ring}
                                    initial={{ scale: 0, opacity: 0.8 }}
                                    animate={{
                                        scale: [1, 2, 2.5],
                                        opacity: [0.6, 0.3, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: ring * 0.3,
                                    }}
                                    className="absolute inset-0 rounded-full border-2 border-yellow-400/50"
                                />
                            ))}

                            {/* Sparkle particles */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                                        scale: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                                    }}
                                    className="absolute inset-0"
                                    style={{ transform: `rotate(${i * 45}deg)` }}
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-6 left-1/2 -translate-x-1/2" />
                                </motion.div>
                            ))}

                            {/* Main crown container */}
                            <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(255,215,0,0.6),0_0_200px_rgba(255,165,0,0.3)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40" />
                                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-300/50 to-transparent" />
                                <Crown className="w-24 h-24 text-white relative z-10 drop-shadow-lg" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Title */}
                <AnimatePresence>
                    {step >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4"
                        >
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-yellow-400/80 font-mono text-sm tracking-[0.5em]"
                            >
                                ACHIEVEMENT UNLOCKED
                            </motion.div>
                            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-500 tracking-tight drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                                LEGENDARY
                            </h1>
                            <div className="flex items-center justify-center gap-4">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.1 * i, type: 'spring' }}
                                    >
                                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Message */}
                <AnimatePresence>
                    {step >= 3 && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                        >
                            你已經征服了商用不動產的星系。<br />
                            <span className="text-cyan-400">從基礎設施到談判桌</span>，你的名字將被刻在<br />
                            <span className="text-yellow-400 font-semibold">方睿宇宙的歷史</span>中。
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Stats */}
                <AnimatePresence>
                    {step >= 4 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mt-8"
                        >
                            {[
                                { label: '總經驗值', value: 'MAX', color: 'text-cyan-400', icon: Sparkles },
                                { label: '獲得徽章', value: '5/5', color: 'text-yellow-400', icon: Award },
                                { label: '頭銜', value: '宇宙策略長', color: 'text-purple-400', icon: Trophy },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    className="group relative p-5 md:p-6 bg-slate-900/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-slate-600 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <stat.icon className={`w-6 h-6 ${stat.color} mb-2 mx-auto`} />
                                    <div className="text-slate-400 text-xs md:text-sm mb-1">{stat.label}</div>
                                    <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Buttons */}
                <AnimatePresence>
                    {step >= 5 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleViewCertificate}
                                className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white rounded-full font-bold text-lg shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] transition-all flex items-center gap-3"
                            >
                                <Award className="w-5 h-5" />
                                查看證書
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="group px-10 py-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 hover:border-slate-500 text-white rounded-full font-bold text-lg transition-all flex items-center gap-3"
                            >
                                <Rocket className="w-5 h-5" />
                                繼續探索宇宙
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Corner decorations */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                className="absolute top-6 left-6 text-yellow-500/50 font-mono text-xs space-y-1"
            >
                <div>CAMPAIGN: COMPLETED</div>
                <div>RANK: LEGENDARY</div>
                <div>STATUS: ELITE_OPERATOR</div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 right-6 text-yellow-500/50 font-mono text-xs text-right space-y-1"
            >
                <div>MISSIONS: 5/5</div>
                <div>BADGES: ALL_UNLOCKED</div>
                <div>CERTIFICATE: AVAILABLE</div>
            </motion.div>
        </motion.div>
    );
}
