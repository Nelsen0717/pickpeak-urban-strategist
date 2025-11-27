'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Award, ChevronRight, BookOpen, Users, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChapterId, CHAPTER_INFO, useGameStore } from '@/lib/store';

interface LevelCompleteOverlayProps {
    levelId: ChapterId;
    onComplete: () => void;
}

// Chapter order for determining next chapter
const CHAPTER_ORDER: ChapterId[] = [
    'prologue',
    'chapter1-migration',
    'chapter2-moat',
    'chapter3-groundforce',
    'chapter4-pickpeak',
    'chapter5-ecosystem',
    'chapter6-negotiation',
    'epilogue'
];

// Define rewards for each chapter
const CHAPTER_REWARDS: Record<ChapterId, {
    xp: number;
    badge?: string;
    badgeIcon?: string;
    skills: string[];
    insights: { type: 'market' | 'company' | 'product'; amount: number }[];
}> = {
    'prologue': {
        xp: 100,
        badge: 'First Steps',
        badgeIcon: '🚀',
        skills: ['方睿艦隊認知'],
        insights: [{ type: 'company', amount: 10 }]
    },
    'chapter1-migration': {
        xp: 500,
        badge: 'Market Navigator',
        badgeIcon: '🧭',
        skills: ['商用 vs 住宅辨識', '資產分類能力'],
        insights: [{ type: 'market', amount: 20 }]
    },
    'chapter2-moat': {
        xp: 600,
        badge: 'Data Hunter',
        badgeIcon: '📊',
        skills: ['市場趨勢分析', '熱點識別'],
        insights: [{ type: 'market', amount: 25 }]
    },
    'chapter3-groundforce': {
        xp: 500,
        badge: 'Team Builder',
        badgeIcon: '👥',
        skills: ['組織結構認知', '團隊協作'],
        insights: [{ type: 'company', amount: 25 }]
    },
    'chapter4-pickpeak': {
        xp: 800,
        badge: 'PickPeak Master',
        badgeIcon: '🎯',
        skills: ['選址評估', '客戶需求分析', 'PickPeak 操作'],
        insights: [{ type: 'product', amount: 30 }]
    },
    'chapter5-ecosystem': {
        xp: 700,
        badge: 'Ecosystem Architect',
        badgeIcon: '🌐',
        skills: ['生態系佈局', 'Total Solution 思維'],
        insights: [{ type: 'company', amount: 20 }, { type: 'product', amount: 15 }]
    },
    'chapter6-negotiation': {
        xp: 1000,
        badge: 'Deal Closer',
        badgeIcon: '🤝',
        skills: ['談判技巧', '數據說服力', '客戶心理洞察'],
        insights: [{ type: 'market', amount: 15 }, { type: 'product', amount: 20 }]
    },
    'epilogue': {
        xp: 500,
        badge: 'FUNRAISE Certified',
        badgeIcon: '⭐',
        skills: ['方睿宇宙全貌'],
        insights: [{ type: 'company', amount: 10 }, { type: 'market', amount: 10 }, { type: 'product', amount: 10 }]
    },
};

export default function LevelCompleteOverlay({ levelId, onComplete }: LevelCompleteOverlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setCurrentChapterId, setView, completedChapters } = useGameStore();

    const chapterInfo = CHAPTER_INFO[levelId];
    const rewards = CHAPTER_REWARDS[levelId] || CHAPTER_REWARDS['prologue'];

    // Determine next chapter
    const currentIndex = CHAPTER_ORDER.indexOf(levelId);
    const nextChapterId = currentIndex < CHAPTER_ORDER.length - 1 ? CHAPTER_ORDER[currentIndex + 1] : null;
    const nextChapterInfo = nextChapterId ? CHAPTER_INFO[nextChapterId] : null;
    const isLastChapter = levelId === 'epilogue';

    const handleContinueToNext = () => {
        if (nextChapterId) {
            setCurrentChapterId(nextChapterId);
            setView('chapter');
            onComplete();
        }
    };

    useEffect(() => {
        // Confetti burst
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 30 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#06b6d4', '#22d3ee', '#3b82f6', '#8b5cf6', '#fbbf24'],
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#06b6d4', '#22d3ee', '#3b82f6', '#8b5cf6', '#fbbf24'],
            });
        }, 300);

        // Initial burst
        confetti({
            particleCount: 80,
            spread: 80,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#06b6d4', '#fbbf24'],
        });

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
        >
            {/* Background */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-lg"
            />

            {/* Radial glow */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.4, 0.2] }}
                transition={{ duration: 0.8 }}
                className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl"
            />

            {/* Content */}
            <motion.div
                initial={{ scale: 0.8, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.3, delay: 0.1 }}
                className="relative z-20 text-center max-w-2xl w-full mx-4"
            >
                {/* Trophy icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.4, delay: 0.2 }}
                    className="relative mx-auto mb-6"
                >
                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30" />
                        <Trophy className="w-12 h-12 text-white relative z-10" />
                    </div>

                    {/* Glow ring */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -inset-3 rounded-full border-2 border-amber-400/50"
                    />
                </motion.div>

                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2 mb-6"
                >
                    <div className="text-cyan-400 font-mono text-sm tracking-[0.3em]">
                        MISSION COMPLETE
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        {chapterInfo?.title || '任務完成'}
                    </h2>
                    <p className="text-slate-400 text-sm">{chapterInfo?.subtitle}</p>
                </motion.div>

                {/* Rewards Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6 mb-6 space-y-4"
                >
                    <div className="text-xs font-mono text-slate-500 tracking-wider mb-3">獲得獎勵</div>

                    {/* XP and Badge Row */}
                    <div className="flex justify-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-cyan-300 font-bold">+{rewards.xp} XP</span>
                        </div>

                        {rewards.badge && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/30">
                                <span className="text-lg">{rewards.badgeIcon}</span>
                                <span className="text-purple-300 font-bold">{rewards.badge}</span>
                            </div>
                        )}
                    </div>

                    {/* Skills Learned */}
                    {rewards.skills.length > 0 && (
                        <div className="pt-3 border-t border-slate-700/50">
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-2">
                                <Lightbulb className="w-3 h-3" />
                                <span>習得技能</span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {rewards.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Insights Gained */}
                    {rewards.insights.length > 0 && (
                        <div className="pt-3 border-t border-slate-700/50">
                            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-2">
                                <BookOpen className="w-3 h-3" />
                                <span>洞察提升</span>
                            </div>
                            <div className="flex justify-center gap-4">
                                {rewards.insights.map((insight, i) => (
                                    <div key={i} className="flex items-center gap-1 text-xs">
                                        <span className={
                                            insight.type === 'market' ? 'text-cyan-400' :
                                            insight.type === 'company' ? 'text-purple-400' :
                                            'text-green-400'
                                        }>
                                            {insight.type === 'market' ? '市場' :
                                             insight.type === 'company' ? '公司' : '產品'}
                                        </span>
                                        <span className="text-slate-500">+{insight.amount}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    {/* Continue to Next Chapter button (primary) */}
                    {nextChapterId && !isLastChapter && (
                        <button
                            onClick={handleContinueToNext}
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-105 overflow-hidden"
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                            <span className="relative flex items-center gap-2">
                                <span className="flex flex-col text-left">
                                    <span className="text-xs opacity-70">繼續挑戰</span>
                                    <span>{nextChapterInfo?.title.replace(/第.章：/, '')}</span>
                                </span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    )}

                    {/* Return to Hub button (secondary or primary if last chapter) */}
                    <button
                        onClick={onComplete}
                        className={`group relative px-8 py-4 rounded-full font-bold transition-all overflow-hidden ${
                            isLastChapter || !nextChapterId
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-105 text-lg'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 hover:border-slate-500'
                        }`}
                    >
                        <span className="relative flex items-center gap-2">
                            {isLastChapter ? '查看畢業證書' : '返回基地'}
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
