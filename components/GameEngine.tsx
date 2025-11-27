'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useGameStore, ChapterId, CHAPTER_INFO } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Prologue from './levels/Prologue';
import Chapter1Migration from './chapters/Chapter1Migration';
import Chapter2Moat from './chapters/Chapter2Moat';
import Chapter3GroundForce from './chapters/Chapter3GroundForce';
import Chapter4PickPeak from './chapters/Chapter4PickPeak';
import Chapter5Ecosystem from './chapters/Chapter5Ecosystem';
import Chapter6Negotiation from './chapters/Chapter6Negotiation';
import Epilogue from './chapters/Epilogue';
import Character from './rpg/Character';
import LevelBriefing from './rpg/LevelBriefing';
import Hub from './rpg/Hub';
import WarpTransition from './fx/WarpTransition';
import LevelCompleteOverlay from './fx/LevelCompleteOverlay';
import GameClearSequence from './fx/GameClearSequence';
import Certificate from './Certificate';
import StarfieldBackground from './fx/StarfieldBackground';

export default function GameEngine() {
    const {
        currentChapterId,
        employeeId,
        xp,
        hp,
        maxHp,
        resetHp,
        avatar,
        completedChapters,
        badges,
        view,
        setView,
        marketInsights,
        companyInsights,
        productInsights
    } = useGameStore();

    // Bit is unlocked after completing prologue (First Steps badge)
    const hasBit = badges.includes('First Steps') || completedChapters.length > 0;

    const [mounted, setMounted] = useState(false);
    const [showBriefing, setShowBriefing] = useState(false);
    const [showChapterComplete, setShowChapterComplete] = useState(false);
    const [showGameClear, setShowGameClear] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const prevCompletedChaptersRef = useRef(completedChapters.length);

    const totalChapters = 7; // 6 chapters + epilogue
    const progress = Math.min(100, (completedChapters.length / totalChapters) * 100);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle Chapter Completion Detection
    useEffect(() => {
        if (completedChapters.length > prevCompletedChaptersRef.current) {
            setShowChapterComplete(true);
        }
        prevCompletedChaptersRef.current = completedChapters.length;
    }, [completedChapters]);

    // Handle View Changes & Transitions
    useEffect(() => {
        if (view === 'chapter' && currentChapterId !== 'prologue') {
            setIsTransitioning(true);
            setTimeout(() => {
                setIsTransitioning(false);
                setShowBriefing(true);
            }, 1000);
        } else if (view === 'hub') {
            setIsTransitioning(true);
            setTimeout(() => setIsTransitioning(false), 1000);
        }
    }, [view, currentChapterId]);

    // Handle Game Over
    useEffect(() => {
        if (hp <= 0) {
            setShowGameOver(true);
        }
    }, [hp]);

    const handleChapterCompleteClose = () => {
        setShowChapterComplete(false);

        // Check for Game Clear (All chapters done including epilogue)
        if (completedChapters.length >= totalChapters) {
            setShowGameClear(true);
        } else {
            setView('hub');
        }
    };

    const handleGameClearClose = () => {
        setShowGameClear(false);
        setView('hub');
    };

    const handleRetry = () => {
        resetHp();
        setShowGameOver(false);
    };

    if (!mounted) return null;

    const renderContent = () => {
        if (view === 'hub') {
            return <Hub />;
        }

        if (view === 'certificate') {
            return <Certificate />;
        }

        // Render the appropriate chapter
        switch (currentChapterId) {
            case 'prologue': return <Prologue />;
            case 'chapter1-migration': return <Chapter1Migration />;
            case 'chapter2-moat': return <Chapter2Moat />;
            case 'chapter3-groundforce': return <Chapter3GroundForce />;
            case 'chapter4-pickpeak': return <Chapter4PickPeak />;
            case 'chapter5-ecosystem': return <Chapter5Ecosystem />;
            case 'chapter6-negotiation': return <Chapter6Negotiation />;
            case 'epilogue': return <Epilogue />;
            default: return <Prologue />;
        }
    };

    const currentChapterInfo = CHAPTER_INFO[currentChapterId];

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
            {/* AAA Visuals: Dynamic Starfield */}
            <StarfieldBackground />

            {/* Grid Overlay for Sci-Fi Feel */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Transitions */}
            <AnimatePresence>
                {isTransitioning && <WarpTransition />}
            </AnimatePresence>

            {/* Game Over Overlay */}
            <AnimatePresence>
                {showGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-md flex items-center justify-center"
                    >
                        <div className="text-center space-y-8 p-12 rounded-3xl bg-slate-900 border border-red-500/50 shadow-[0_0_100px_rgba(239,68,68,0.3)] max-w-2xl w-full mx-4">
                            <AlertTriangle className="w-24 h-24 text-red-500 mx-auto animate-pulse" />
                            <h2 className="text-5xl font-bold text-red-500 tracking-tight">MISSION FAILED</h2>
                            <p className="text-slate-300 text-xl">
                                護盾能量耗盡。你的決策導致了嚴重的市場虧損。
                            </p>
                            <button
                                onClick={handleRetry}
                                className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/50 flex items-center gap-3 mx-auto"
                            >
                                <RefreshCw className="w-5 h-5" />
                                重啟系統 (Retry)
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Briefing Overlay */}
            <AnimatePresence>
                {showBriefing && view === 'chapter' && (
                    <div className="fixed inset-0 z-50">
                        <LevelBriefing
                            levelId={currentChapterId}
                            onComplete={() => setShowBriefing(false)}
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Chapter Complete Overlay */}
            <AnimatePresence>
                {showChapterComplete && (
                    <LevelCompleteOverlay
                        levelId={currentChapterId}
                        onComplete={handleChapterCompleteClose}
                    />
                )}
            </AnimatePresence>

            {/* Game Clear Sequence */}
            <AnimatePresence>
                {showGameClear && (
                    <GameClearSequence onClose={handleGameClearClose} />
                )}
            </AnimatePresence>

            {/* HUD (Only in Chapter View, not Prologue) */}
            {view === 'chapter' && currentChapterId !== 'prologue' && (
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="fixed top-0 left-0 right-0 z-50 p-4"
                >
                    <div className="max-w-7xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-cyan-900/10 p-4 flex justify-between items-center relative overflow-hidden">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] animate-shine pointer-events-none" />

                        <div className="flex items-center gap-6">
                            {/* HP Bar - Sci-Fi Style */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px] font-mono text-cyan-400 tracking-widest">
                                    <span>SHIELD INTEGRITY</span>
                                    <span>{Math.round((hp / maxHp) * 100)}%</span>
                                </div>
                                <div className="w-48 h-3 bg-slate-950/80 rounded-sm border border-slate-700/50 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_2px,#000_2px)] bg-[size:4px_100%] opacity-30" />
                                    <motion.div
                                        className={`h-full relative ${hp < 30 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(hp / maxHp) * 100}%` }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Level Info */}
                            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                                <div className="relative group cursor-pointer" onClick={() => setView('hub')}>
                                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-cyan-500/30 overflow-hidden ring-2 ring-transparent group-hover:ring-cyan-400/50 transition-all">
                                        <Character type="player" avatar={avatar} className="w-full h-full transform scale-110 translate-y-1" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 shadow-[0_0_5px_#22c55e]" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-mono tracking-wider">OPERATOR</div>
                                    <div className="text-sm font-bold text-white font-outfit tracking-wide">{employeeId || 'GUEST'}</div>
                                </div>

                                {/* Bit AI Companion */}
                                {hasBit && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex items-center gap-2 pl-3 border-l border-white/10"
                                    >
                                        <div className="relative">
                                            <motion.div
                                                animate={{ y: [0, -2, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border border-cyan-300/50 overflow-hidden shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                            >
                                                <Character type="bit" className="w-full h-full" />
                                            </motion.div>
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]"
                                            />
                                        </div>
                                        <div className="hidden sm:block">
                                            <div className="text-[10px] text-cyan-400 font-mono tracking-wider">AI ASSIST</div>
                                            <div className="text-xs font-bold text-cyan-300">Bit</div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Center - Mission Status */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                            <div className="px-4 py-1 rounded-full bg-slate-950/50 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-[0.2em] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                {currentChapterInfo?.subtitle || 'MISSION'}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Insights Progress */}
                            <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono">
                                <InsightMeter label="MARKET" value={marketInsights} color="cyan" />
                                <InsightMeter label="COMPANY" value={companyInsights} color="purple" />
                                <InsightMeter label="PRODUCT" value={productInsights} color="green" />
                            </div>

                            {/* XP Counter */}
                            <div className="text-right mr-4 pl-4 border-l border-white/10">
                                <div className="text-[10px] text-slate-400 font-mono tracking-wider">EXPERIENCE</div>
                                <div className="text-lg font-bold text-cyan-400 font-mono leading-none shadow-cyan-500/20 drop-shadow-sm">
                                    {xp.toLocaleString()} <span className="text-xs text-cyan-600">XP</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setView('hub')}
                                className="group relative px-4 py-2 bg-slate-800/50 hover:bg-cyan-900/30 border border-slate-600 hover:border-cyan-400/50 rounded-lg text-xs text-slate-300 hover:text-cyan-300 transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center gap-2">
                                    <span className="w-1 h-1 bg-current rounded-full" />
                                    RETURN TO BASE
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.header>
            )}

            {/* Main Content Area */}
            <main className="relative z-10 min-h-screen flex flex-col pt-24 pb-12 px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view === 'hub' ? 'hub' : currentChapterId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full flex-1 flex justify-center"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

// Insight Meter Component
function InsightMeter({ label, value, color }: { label: string; value: number; color: 'cyan' | 'purple' | 'green' }) {
    const colorClasses = {
        cyan: 'bg-cyan-500 shadow-cyan-500/50',
        purple: 'bg-purple-500 shadow-purple-500/50',
        green: 'bg-green-500 shadow-green-500/50',
    };

    return (
        <div className="flex flex-col gap-1">
            <span className="text-slate-500">{label}</span>
            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClasses[color]} shadow-sm transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
