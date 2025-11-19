'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelCompleteOverlayProps {
    levelId: string;
    onComplete: () => void;
}

export default function LevelCompleteOverlay({ levelId, onComplete }: LevelCompleteOverlayProps) {
    useEffect(() => {
        // Trigger confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#06b6d4', '#3b82f6', '#f43f5e']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#06b6d4', '#3b82f6', '#f43f5e']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="text-center space-y-8 p-12 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_100px_rgba(6,182,212,0.2)] max-w-2xl w-full mx-4"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50"
                >
                    <Trophy className="w-16 h-16 text-white" />
                </motion.div>

                <div className="space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-bold text-white tracking-tight"
                    >
                        MISSION ACCOMPLISHED
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-300 text-xl"
                    >
                        出色完成任務，Raiser！
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center gap-4"
                >
                    <div className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-xl border border-slate-700">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold">+1000 XP</span>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={onComplete}
                    className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-105"
                >
                    返回基地 (Return to Base)
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
