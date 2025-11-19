'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Home, CheckCircle, XCircle, Info, Keyboard, ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

type PropertyType = 'commercial' | 'residential';

interface Card {
    id: string;
    title: string;
    type: PropertyType;
    description: string;
    subtext: string;
    icon: React.ReactNode;
}

const CARDS: Card[] = [
    {
        id: 'c1',
        title: '台北 101 大樓',
        type: 'commercial',
        description: '頂級 A 級商辦地標',
        subtext: '租金收益 / 企業總部',
        icon: <Building className="w-12 h-12" />
    },
    {
        id: 'r1',
        title: '陶朱隱園',
        type: 'residential',
        description: '信義區頂級豪宅',
        subtext: '私人居住 / 收藏價值',
        icon: <Home className="w-12 h-12" />
    },
    {
        id: 'c2',
        title: '南港軟體園區',
        type: 'commercial',
        description: '科技產業聚落',
        subtext: '廠辦 / 研發中心',
        icon: <Building className="w-12 h-12" />
    },
    {
        id: 'r2',
        title: '陽明山別墅',
        type: 'residential',
        description: '獨棟景觀住宅',
        subtext: '休閒 / 自用',
        icon: <Home className="w-12 h-12" />
    },
    {
        id: 'c3',
        title: '西門町店面',
        type: 'commercial',
        description: '高人流零售空間',
        subtext: '租金 / 商業活動',
        icon: <Building className="w-12 h-12" />
    },
];

export default function Level1Basics() {
    const { addXp, completeLevel, setCurrentLevelId, addItem, unlockCompanion, setView } = useGameStore();
    const [cards, setCards] = useState<Card[]>(CARDS);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const checkAnswer = useCallback((card: Card, selection: PropertyType) => {
        if (card.type === selection) {
            setFeedback('correct');
            setScore(s => s + 1);
            addXp(100);
        } else {
            setFeedback('wrong');
        }

        setTimeout(() => {
            setCards(prev => prev.filter(c => c.id !== card.id));
            setFeedback(null);
        }, 500);
    }, [addXp]);

    // Keyboard Support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (cards.length === 0 || feedback) return;

            if (e.key === 'ArrowLeft') {
                checkAnswer(cards[0], 'commercial');
            } else if (e.key === 'ArrowRight') {
                checkAnswer(cards[0], 'residential');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cards, feedback, checkAnswer]);

    const handleDragEnd = (event: any, info: any, card: Card) => {
        const x = info.offset.x;
        const threshold = 100;

        if (x < -threshold) {
            checkAnswer(card, 'commercial');
        } else if (x > threshold) {
            checkAnswer(card, 'residential');
        }
    };

    useEffect(() => {
        if (cards.length === 0) {
            completeLevel('basics');
            addItem('spectral_scanner');
            unlockCompanion();
            // setView('hub') handled by GameEngine overlay
        }
    }, [cards, completeLevel, addItem, unlockCompanion, setView]);

    const currentCard = cards[0];

    if (!currentCard) {
        return (
            <div className="text-center space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl"
                >
                    🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-white">基礎訓練完成！</h2>
                <p className="text-slate-400">您已具備分辨資產屬性的能力。</p>
                <div className="flex flex-col gap-2 items-center">
                    <div className="px-4 py-2 bg-cyan-900/50 border border-cyan-500 rounded-lg text-cyan-400 text-sm font-bold animate-pulse">
                        獲得物品: Spectral Scanner (光譜掃描儀)
                    </div>
                    <div className="px-4 py-2 bg-blue-900/50 border border-blue-500 rounded-lg text-blue-400 text-sm font-bold animate-bounce">
                        夥伴解鎖: AI 助手 "Bit" 已上線
                    </div>
                </div>
                <p className="text-slate-500 text-sm mt-4">即將進入：市場趨勢分析</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-8 w-full max-w-6xl">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Level 1: 資產識別</h2>
                <p className="text-slate-400">分辨 <span className="text-cyan-400 font-bold">商用 (收益)</span> 與 <span className="text-rose-400 font-bold">住宅 (自用)</span> 不動產。</p>
            </div>

            <div className="flex items-center justify-between w-full gap-12">
                {/* Left Drop Zone (Desktop) */}
                <div className="hidden md:flex flex-col items-center justify-center w-64 h-96 border-4 border-dashed border-cyan-500/30 rounded-3xl bg-cyan-900/10">
                    <Building className="w-16 h-16 text-cyan-500/50 mb-4" />
                    <h3 className="text-2xl font-bold text-cyan-500/50">COMMERCIAL</h3>
                    <div className="mt-4 flex items-center gap-2 text-cyan-500/50 font-mono">
                        <Keyboard className="w-4 h-4" />
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                </div>

                {/* Card Area */}
                <div className="relative w-full max-w-sm h-[450px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCard.id}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(e, info) => handleDragEnd(e, info, currentCard)}
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: -50, rotate: feedback === 'correct' ? 0 : 45 }}
                            whileDrag={{ scale: 1.05, rotate: 2 }}
                            className={clsx(
                                "w-80 h-[420px] bg-slate-800 rounded-3xl p-8 flex flex-col items-center justify-between shadow-2xl border-4 cursor-grab active:cursor-grabbing relative overflow-hidden z-20",
                                feedback === 'correct' ? "border-green-500" : feedback === 'wrong' ? "border-red-500" : "border-slate-600"
                            )}
                        >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                            <div className="w-full flex justify-between items-center z-10">
                                <span className="text-xs font-mono text-slate-500">ASSET ID: {currentCard.id.toUpperCase()}</span>
                                <Info className="text-slate-500 w-5 h-5" />
                            </div>

                            <div className={clsx(
                                "p-8 rounded-full bg-slate-700/50 mb-4 ring-4 ring-slate-700/30",
                                currentCard.type === 'commercial' ? "text-cyan-400" : "text-rose-400"
                            )}>
                                {currentCard.icon}
                            </div>

                            <div className="text-center space-y-3 z-10">
                                <h3 className="text-3xl font-bold text-white tracking-tight">{currentCard.title}</h3>
                                <div className="space-y-1">
                                    <p className="text-slate-300 font-medium">{currentCard.description}</p>
                                    <p className="text-slate-500 text-sm">{currentCard.subtext}</p>
                                </div>
                            </div>

                            <div className="flex justify-between w-full mt-4 z-10 md:hidden">
                                <div className="flex items-center gap-1 text-cyan-500 text-xs font-bold">
                                    <Keyboard className="w-4 h-4" /> ← 商用
                                </div>
                                <div className="flex items-center gap-1 text-rose-500 text-xs font-bold">
                                    住宅 → <Keyboard className="w-4 h-4" />
                                </div>
                            </div>

                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm z-20"
                                >
                                    {feedback === 'correct' ? (
                                        <div className="text-center">
                                            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                                            <p className="text-green-400 font-bold text-xl">分析正確</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
                                            <p className="text-red-400 font-bold text-xl">分析錯誤</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Drop Zone (Desktop) */}
                <div className="hidden md:flex flex-col items-center justify-center w-64 h-96 border-4 border-dashed border-rose-500/30 rounded-3xl bg-rose-900/10">
                    <Home className="w-16 h-16 text-rose-500/50 mb-4" />
                    <h3 className="text-2xl font-bold text-rose-500/50">RESIDENTIAL</h3>
                    <div className="mt-4 flex items-center gap-2 text-rose-500/50 font-mono">
                        <ArrowRight className="w-4 h-4" />
                        <Keyboard className="w-4 h-4" />
                    </div>
                </div>
            </div>

            <div className="text-slate-500 font-mono text-sm">
                進度: {score} / {CARDS.length}
            </div>
        </div>
    );
}
