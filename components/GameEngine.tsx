'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useGameStore, LevelId } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import Prologue from './levels/Prologue';
import Level1Basics from './levels/Level1Basics';
import Level2Trends from './levels/Level2Trends';
import Level3Ecosystem from './levels/Level3Ecosystem';
import Level4PickPeak from './levels/Level4PickPeak';
import Level5Negotiation from './levels/Level5Negotiation';
import Character from './rpg/Character';
import LevelBriefing from './rpg/LevelBriefing';
import Hub from './rpg/Hub';
import WarpTransition from './fx/WarpTransition';
import LevelCompleteOverlay from './fx/LevelCompleteOverlay';
import GameClearSequence from './fx/GameClearSequence';
import Certificate from './Certificate';
import StarfieldBackground from './fx/StarfieldBackground';

export default function GameEngine() {
    const { currentLevelId, employeeId, level, xp, hp, maxHp, resetHp, avatar, completedLevels, companionUnlocked, view, setView } = useGameStore();
    const [mounted, setMounted] = useState(false);
    const [showBriefing, setShowBriefing] = useState(false);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [showGameClear, setShowGameClear] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const prevCompletedLevelsRef = useRef(completedLevels.length);

    const totalLevels = 5; // Basics, Trends, Ecosystem, PickPeak, Negotiation
    const progress = Math.min(100, (completedLevels.length / totalLevels) * 100);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle Level Completion Detection
    useEffect(() => {
        if (completedLevels.length > prevCompletedLevelsRef.current) {
            // Level just completed
            setShowLevelComplete(true);
        }
        prevCompletedLevelsRef.current = completedLevels.length;
    }, [completedLevels]);

    // Handle View Changes & Transitions
    useEffect(() => {
        if (view === 'level' && currentLevelId !== 'prologue') {
            setIsTransitioning(true);
            setTimeout(() => {
                setIsTransitioning(false);
                setShowBriefing(true);
            }, 1000);
        } else if (view === 'hub') {
            setIsTransitioning(true);
            setTimeout(() => setIsTransitioning(false), 1000);
        }
    }, [view, currentLevelId]);

    // Handle Game Over
    useEffect(() => {
        if (hp <= 0) {
            setShowGameOver(true);
        }
    }, [hp]);

    const handleLevelCompleteClose = () => {
        setShowLevelComplete(false);

        // Check for Game Clear (All 5 levels done)
        if (completedLevels.length >= 5) {
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
        // Ideally reset level state too, but for now just heal
    };

    if (!mounted) return null;

    const renderContent = () => {
        if (view === 'hub') {
            return <Hub />;
        }

        switch (currentLevelId) {
            case 'prologue': return <Prologue />;
            case 'basics': return <Level1Basics />;
            case 'trends': return <Level2Trends />;
            case 'ecosystem': return <Level3Ecosystem />;
            case 'pickpeak': return <Level4PickPeak />;
            case 'negotiation': return <Level5Negotiation />;
            case 'certificate': return <Certificate />;
            default: return <Prologue />;
        }
    };

    // ...

    // ...

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
                {showBriefing && view === 'level' && (
                    <div className="fixed inset-0 z-50">
                        <LevelBriefing
                            levelId={currentLevelId}
                            onComplete={() => setShowBriefing(false)}
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Level Complete Overlay */}
            <AnimatePresence>
                {showLevelComplete && (
                    <LevelCompleteOverlay
                        levelId={currentLevelId}
                        onComplete={handleLevelCompleteClose}
                    />
                )}
            </AnimatePresence>

            {/* Game Clear Sequence */}
            <AnimatePresence>
                {showGameClear && (
                    <GameClearSequence onClose={handleGameClearClose} />
                )}
            </AnimatePresence>

            {/* HUD (Only in Level View, not Prologue) */}
            {view === 'level' && currentLevelId !== 'prologue' && (
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
                                    {/* Grid pattern on empty bar */}
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_2px,#000_2px)] bg-[size:4px_100%] opacity-30" />

                                    <motion.div
                                        className={`h-full relative ${hp < 30 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(hp / maxHp) * 100}%` }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    >
                                        {/* Scanline effect */}
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
                                    {/* Online Status Dot */}
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 shadow-[0_0_5px_#22c55e]" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-mono tracking-wider">OPERATOR</div>
                                    <div className="text-sm font-bold text-white font-outfit tracking-wide">{employeeId || 'GUEST'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Center - Mission Status */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                            <div className="px-4 py-1 rounded-full bg-slate-950/50 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-[0.2em] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                {currentLevelId === 'hub' ? 'SYSTEM IDLE' : `MISSION: ${currentLevelId.toUpperCase()}`}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* XP Counter */}
                            <div className="text-right mr-4">
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
                        key={view === 'hub' ? 'hub' : currentLevelId}
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
