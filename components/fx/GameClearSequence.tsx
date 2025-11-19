'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Star, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameClearSequenceProps {
    onClose: () => void;
}

export default function GameClearSequence({ onClose }: GameClearSequenceProps) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Sequence timing
        const timers = [
            setTimeout(() => setStep(1), 1000), // Title
            setTimeout(() => setStep(2), 3000), // Message
            setTimeout(() => setStep(3), 6000), // Stats
            setTimeout(() => setStep(4), 9000), // Button
        ];

        // Grand Finale Confetti
        const duration = 5000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FFA500', '#FF4500']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#FFA500', '#FF4500']
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Stars */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 1000 }}
                        animate={{ opacity: Math.random(), y: -100 }}
                        transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            <div className="relative z-10 text-center space-y-8 p-8">
                {step >= 1 && (
                    <motion.div
                        initial={{ scale: 0, rotate: -360 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 1.5 }}
                        className="w-40 h-40 mx-auto bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(255,215,0,0.5)]"
                    >
                        <Crown className="w-20 h-20 text-white" />
                    </motion.div>
                )}

                {step >= 1 && (
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 tracking-tight"
                    >
                        LEGENDARY
                    </motion.h1>
                )}

                {step >= 2 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        你已經征服了商用不動產的星系。<br />
                        從基礎設施到談判桌，你的名字將被刻在方睿宇宙的歷史中。
                    </motion.p>
                )}

                {step >= 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-12"
                    >
                        <div className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl backdrop-blur-sm">
                            <div className="text-slate-400 text-sm mb-2">總經驗值</div>
                            <div className="text-3xl font-bold text-cyan-400">MAX</div>
                        </div>
                        <div className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl backdrop-blur-sm">
                            <div className="text-slate-400 text-sm mb-2">獲得徽章</div>
                            <div className="text-3xl font-bold text-yellow-400">5/5</div>
                        </div>
                        <div className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl backdrop-blur-sm">
                            <div className="text-slate-400 text-sm mb-2">頭銜</div>
                            <div className="text-3xl font-bold text-purple-400">宇宙策略長</div>
                        </div>
                    </motion.div>
                )}

                {step >= 4 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="mt-12 px-12 py-4 bg-white text-slate-950 rounded-full font-bold text-xl shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] transition-all flex items-center gap-3 mx-auto"
                    >
                        <Rocket className="w-6 h-6" />
                        繼續探索宇宙
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
