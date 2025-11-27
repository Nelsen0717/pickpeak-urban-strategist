'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore, MARKET_DATA, CHAPTER_INFO } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket,
    Star,
    Award,
    TrendingUp,
    Building2,
    Users,
    Database,
    Calendar,
    ChevronRight,
    Sparkles,
    Trophy,
    Target,
    Heart
} from 'lucide-react';
import DialogueOverlay from '../rpg/DialogueOverlay';

type Phase =
    | 'intro'
    | 'journey-recap'
    | 'achievements'
    | 'vision'
    | 'final-dialogue'
    | 'certificate';

export default function Epilogue() {
    const [phase, setPhase] = useState<Phase>('intro');
    const [showDialogue, setShowDialogue] = useState(false);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [showStats, setShowStats] = useState(false);
    const [revealedBadges, setRevealedBadges] = useState<number>(0);

    const {
        xp,
        level,
        badges,
        knowledge,
        teamMembers,
        marketInsights,
        companyInsights,
        productInsights,
        completedChapters,
        completeChapter,
        unlockBadge,
        addXp,
        setView,
        employeeId
    } = useGameStore();

    const totalInsights = Math.round((marketInsights + companyInsights + productInsights) / 3);
    const unlockedTeam = teamMembers.filter(m => m.unlocked).length;
    const knowledgeCount = knowledge.length;

    // Determine player's performance grade
    const getGrade = () => {
        if (totalInsights >= 90 && badges.length >= 6) return { grade: 'S', title: '傳奇戰略家', color: 'text-yellow-400' };
        if (totalInsights >= 75 && badges.length >= 5) return { grade: 'A', title: '資深特務', color: 'text-cyan-400' };
        if (totalInsights >= 60 && badges.length >= 4) return { grade: 'B', title: '專業顧問', color: 'text-green-400' };
        if (totalInsights >= 40) return { grade: 'C', title: '見習探員', color: 'text-blue-400' };
        return { grade: 'D', title: '新進成員', color: 'text-slate-400' };
    };

    const gradeInfo = getGrade();

    // Intro dialogues - 符合 DialogueLine interface
    const introDialogues: Array<{ speaker: 'Mike' | 'Player'; text: string; expression?: 'neutral' | 'happy' | 'serious' }> = [
        {
            speaker: 'Mike',
            text: `${employeeId || '新夥伴'}，你做到了。從 2025 市場風暴開始，你已經完成了整個旅程。`,
            expression: 'happy'
        },
        {
            speaker: 'Mike',
            text: '現在，讓我們一起回顧這段不可思議的冒險，看看你收穫了什麼。',
            expression: 'neutral'
        }
    ];

    // Final dialogues - 符合 DialogueLine interface
    const finalDialogues: Array<{ speaker: 'Mike' | 'Player'; text: string; expression?: 'neutral' | 'happy' | 'serious' }> = [
        {
            speaker: 'Mike',
            text: '這不是結束，這是新的開始。2026 年 1 月 13 日，PickPeak 將正式發表。',
            expression: 'serious'
        },
        {
            speaker: 'Mike',
            text: `你現在已經是 FUNRAISE 的正式成員。你的等級：${gradeInfo.title}。`,
            expression: 'happy'
        },
        {
            speaker: 'Mike',
            text: '歡迎加入艦隊。讓我們一起改變台灣的商用不動產產業！',
            expression: 'happy'
        },
        {
            speaker: 'Player',
            text: '以團隊之力，我們能做到任何事。期待與大家並肩作戰！',
            expression: 'happy'
        }
    ];

    // Chapter recaps
    const chapterRecaps = [
        { id: 'prologue', emoji: '🌟', insight: '認識了方睿科技的使命與願景' },
        { id: 'chapter1-migration', emoji: '🔄', insight: '理解了住宅到商用的市場大遷徙' },
        { id: 'chapter2-moat', emoji: '🏰', insight: '學會了數據護城河的核心價值' },
        { id: 'chapter3-groundforce', emoji: '⚔️', insight: '認識了地面部隊的強大陣容' },
        { id: 'chapter4-pickpeak', emoji: '🎯', insight: '掌握了 PickPeak 的產品力' },
        { id: 'chapter5-ecosystem', emoji: '🌐', insight: '理解了生態系的戰略佈局' },
        { id: 'chapter6-negotiation', emoji: '🤝', insight: '完成了終極談判的挑戰' },
    ];

    // Auto-advance intro animation
    useEffect(() => {
        if (phase === 'intro') {
            const timer = setTimeout(() => {
                setShowDialogue(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Badge reveal animation
    useEffect(() => {
        if (phase === 'achievements' && revealedBadges < badges.length) {
            const timer = setTimeout(() => {
                setRevealedBadges(prev => prev + 1);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [phase, revealedBadges, badges.length]);

    const handleDialogueComplete = () => {
        setShowDialogue(false);
        if (phase === 'intro') {
            setPhase('journey-recap');
        } else if (phase === 'final-dialogue') {
            // Award final badge and complete
            if (!badges.includes('FUNRAISE Certified')) {
                unlockBadge('FUNRAISE Certified');
                addXp(500);
            }
            completeChapter('epilogue');
            setPhase('certificate');
        }
    };

    const handleNextPhase = () => {
        switch (phase) {
            case 'journey-recap':
                setShowStats(true);
                setTimeout(() => setPhase('achievements'), 1500);
                break;
            case 'achievements':
                setPhase('vision');
                break;
            case 'vision':
                setDialogueIndex(0);
                setShowDialogue(true);
                setPhase('final-dialogue');
                break;
            case 'certificate':
                setView('certificate');
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                {/* Stars */}
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
                {/* Glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {/* INTRO PHASE */}
                    {phase === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30"
                            >
                                <Trophy className="w-16 h-16 text-white" />
                            </motion.div>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-5xl font-bold"
                            >
                                終章
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.3 }}
                                className="text-2xl text-cyan-400"
                            >
                                方睿宇宙的未來
                            </motion.p>
                        </motion.div>
                    )}

                    {/* JOURNEY RECAP PHASE */}
                    {phase === 'journey-recap' && (
                        <motion.div
                            key="journey"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-4xl space-y-8"
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold mb-4">你的旅程</h2>
                                <p className="text-slate-400">從市場風暴到終極談判，回顧你的冒險歷程</p>
                            </div>

                            <div className="grid gap-4">
                                {chapterRecaps.map((chapter, index) => {
                                    const isCompleted = completedChapters.includes(chapter.id as any);
                                    const info = CHAPTER_INFO[chapter.id as keyof typeof CHAPTER_INFO];
                                    return (
                                        <motion.div
                                            key={chapter.id}
                                            initial={{ x: -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.15 }}
                                            className={`p-4 rounded-xl border ${
                                                isCompleted
                                                    ? 'bg-slate-800/50 border-cyan-500/30'
                                                    : 'bg-slate-900/50 border-slate-700/30 opacity-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl">{chapter.emoji}</span>
                                                <div className="flex-1">
                                                    <div className="font-bold text-lg">{info?.title || chapter.id}</div>
                                                    <div className="text-sm text-slate-400">{chapter.insight}</div>
                                                </div>
                                                {isCompleted && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                                                    >
                                                        <Star className="w-4 h-4 text-white" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: showStats ? 1 : 0 }}
                                className="text-center"
                            >
                                <p className="text-xl text-cyan-400">
                                    完成 {completedChapters.length} / 7 個章節
                                </p>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextPhase}
                                className="mx-auto flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/30"
                            >
                                查看成就
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* ACHIEVEMENTS PHASE */}
                    {phase === 'achievements' && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-5xl space-y-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-bold mb-4">你的成就</h2>
                                <div className={`text-6xl font-black ${gradeInfo.color}`}>
                                    GRADE {gradeInfo.grade}
                                </div>
                                <p className="text-2xl text-slate-300 mt-2">{gradeInfo.title}</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-2xl border border-yellow-500/30"
                                >
                                    <Star className="w-10 h-10 text-yellow-400 mb-3" />
                                    <div className="text-4xl font-bold text-yellow-400">{xp.toLocaleString()}</div>
                                    <div className="text-sm text-slate-400">Total XP</div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-500/30"
                                >
                                    <TrendingUp className="w-10 h-10 text-purple-400 mb-3" />
                                    <div className="text-4xl font-bold text-purple-400">LV.{level}</div>
                                    <div className="text-sm text-slate-400">Level</div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-6 rounded-2xl border border-cyan-500/30"
                                >
                                    <Database className="w-10 h-10 text-cyan-400 mb-3" />
                                    <div className="text-4xl font-bold text-cyan-400">{knowledgeCount}</div>
                                    <div className="text-sm text-slate-400">知識點</div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-green-500/30"
                                >
                                    <Users className="w-10 h-10 text-green-400 mb-3" />
                                    <div className="text-4xl font-bold text-green-400">{unlockedTeam}</div>
                                    <div className="text-sm text-slate-400">團隊成員</div>
                                </motion.div>
                            </div>

                            {/* Insights Bar */}
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-cyan-400" />
                                    洞察力總覽
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: '市場洞察', value: marketInsights, color: 'cyan' },
                                        { label: '公司洞察', value: companyInsights, color: 'purple' },
                                        { label: '產品洞察', value: productInsights, color: 'green' }
                                    ].map((insight, idx) => (
                                        <div key={insight.label}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-400">{insight.label}</span>
                                                <span className={`text-${insight.color}-400 font-bold`}>{insight.value}%</span>
                                            </div>
                                            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${insight.value}%` }}
                                                    transition={{ delay: 0.5 + idx * 0.2, duration: 1 }}
                                                    className={`h-full bg-gradient-to-r ${
                                                        insight.color === 'cyan' ? 'from-cyan-600 to-cyan-400' :
                                                        insight.color === 'purple' ? 'from-purple-600 to-purple-400' :
                                                        'from-green-600 to-green-400'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-600 text-center">
                                    <span className="text-slate-400">總體理解度：</span>
                                    <span className="text-2xl font-bold text-white ml-2">{totalInsights}%</span>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-400" />
                                    獲得的徽章
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {badges.map((badge, idx) => (
                                        <motion.div
                                            key={badge}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{
                                                scale: idx < revealedBadges ? 1 : 0,
                                                rotate: idx < revealedBadges ? 0 : -180
                                            }}
                                            className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-yellow-300 flex items-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            {badge}
                                        </motion.div>
                                    ))}
                                    {badges.length === 0 && (
                                        <p className="text-slate-500 italic">尚未獲得徽章</p>
                                    )}
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextPhase}
                                className="mx-auto flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30"
                            >
                                展望未來
                                <Rocket className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* VISION PHASE */}
                    {phase === 'vision' && (
                        <motion.div
                            key="vision"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-4xl text-center space-y-12"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.3 }}
                                className="relative"
                            >
                                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 relative">
                                    <Building2 className="w-20 h-20 text-white" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-0 border-4 border-dashed border-white/20 rounded-2xl"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4"
                            >
                                <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    PickPeak 即將到來
                                </h2>
                                <div className="flex items-center justify-center gap-4 text-3xl text-white">
                                    <Calendar className="w-8 h-8 text-cyan-400" />
                                    <span className="font-mono font-bold">{MARKET_DATA.funraise.pickpeakLaunch}</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="grid grid-cols-3 gap-6"
                            >
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                    <Database className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{MARKET_DATA.funraise.dataPoints}</div>
                                    <div className="text-sm text-slate-400">數據點</div>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                    <Building2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{MARKET_DATA.funraise.buildingsCovered}</div>
                                    <div className="text-sm text-slate-400">物件覆蓋</div>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                    <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">100+</div>
                                    <div className="text-sm text-slate-400">夥伴網絡</div>
                                </div>
                            </motion.div>

                            <motion.p
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                            >
                                你已經準備好了。
                                <br />
                                現在，讓我們一起改變台灣商用不動產的未來。
                            </motion.p>

                            <motion.button
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextPhase}
                                className="mx-auto flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30"
                            >
                                <Heart className="w-5 h-5" />
                                加入艦隊
                            </motion.button>
                        </motion.div>
                    )}

                    {/* CERTIFICATE PHASE */}
                    {phase === 'certificate' && (
                        <motion.div
                            key="certificate"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(34, 211, 238, 0.3)',
                                        '0 0 60px rgba(34, 211, 238, 0.5)',
                                        '0 0 20px rgba(34, 211, 238, 0.3)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-40 h-40 mx-auto bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center"
                            >
                                <Trophy className="w-20 h-20 text-white" />
                            </motion.div>

                            <div className="space-y-2">
                                <h2 className="text-4xl font-bold">恭喜！</h2>
                                <p className="text-xl text-cyan-400">你已正式加入 FUNRAISE 艦隊</p>
                                <div className={`text-3xl font-bold ${gradeInfo.color}`}>
                                    {gradeInfo.title}
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextPhase}
                                className="mx-auto flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-xl shadow-2xl shadow-cyan-500/30"
                            >
                                <Award className="w-6 h-6" />
                                領取結業證書
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dialogue Overlay */}
            {showDialogue && (
                <DialogueOverlay
                    lines={phase === 'intro' ? introDialogues : finalDialogues}
                    onComplete={handleDialogueComplete}
                />
            )}
        </div>
    );
}
