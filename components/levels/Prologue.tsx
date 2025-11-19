'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Stars } from 'lucide-react';
import DialogueOverlay from '../rpg/DialogueOverlay';
import AvatarEditor from '../rpg/AvatarEditor';
import Character from '../rpg/Character';

export default function Prologue() {
    const { setEmployeeId, setCurrentLevelId, setStoryFlag, setView } = useGameStore();
    const [phase, setPhase] = useState<'intro' | 'dialogue' | 'avatar' | 'launch'>('intro');
    const [inputName, setInputName] = useState('');

    const handleStartDialogue = () => {
        setPhase('dialogue');
    };

    const handleDialogueComplete = () => {
        setPhase('avatar');
    };

    const handleAvatarComplete = () => {
        setPhase('launch');
    };

    const handleLaunch = () => {
        if (!inputName.trim()) return;
        setEmployeeId(inputName);
        setStoryFlag('prologue_complete', true);
        setView('hub');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-5xl mx-auto relative">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_50%)]"
                />
            </div>

            <AnimatePresence mode="wait">
                {phase === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        className="text-center space-y-8 relative z-10"
                    >
                        <div className="relative inline-block">
                            <div className="absolute -inset-6 bg-cyan-500/30 blur-2xl rounded-full animate-pulse" />
                            <Rocket className="w-24 h-24 text-cyan-400 relative z-10 mx-auto transform -rotate-45" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl font-bold text-white tracking-tight">
                                方睿宇宙艦隊
                                <span className="block text-2xl mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">FUNRAISE FLEET</span>
                            </h1>
                            <p className="text-slate-300 text-xl leading-relaxed max-w-xl mx-auto">
                                商用不動產的市場浩瀚如星海。<br />
                                每一棟大樓，都是一顆等待被發掘的恆星。
                            </p>
                        </div>

                        <button
                            onClick={handleStartDialogue}
                            className="group mt-8 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-cyan-500 text-white rounded-full font-medium transition-all flex items-center gap-3 mx-auto shadow-lg hover:shadow-cyan-500/25"
                        >
                            <Stars className="w-5 h-5 text-yellow-400" />
                            開啟通訊頻道
                        </button>
                    </motion.div>
                )}

                {phase === 'dialogue' && (
                    <DialogueOverlay
                        key="dialogue"
                        onComplete={handleDialogueComplete}
                        lines={[
                            { speaker: 'Mike', text: '歡迎歸隊，Raiser。我是艦長 Mike。', expression: 'serious' },
                            { speaker: 'Mike', text: '你眼前這片無盡的星空，就是我們每天面對的市場。變幻莫測，卻充滿機遇。', expression: 'neutral' },
                            { speaker: 'Mike', text: '我們偵測到 2024 年的市場引力波出現劇烈震盪，AI 產業正在重塑整個星系的版圖。', expression: 'serious' },
                            { speaker: 'Mike', text: '我需要你立即前往 PickPeak 決策中樞，協助我們導航這場風暴。', expression: 'serious' },
                            { speaker: 'Mike', text: '但在那之前，先去裝備室整理一下你的儀容。我們可是全宇宙最專業的顧問團隊。', expression: 'happy' },
                        ]}
                    />
                )}

                {phase === 'avatar' && (
                    <motion.div
                        key="avatar"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full flex justify-center relative z-10"
                    >
                        <AvatarEditor onComplete={handleAvatarComplete} />
                    </motion.div>
                )}

                {phase === 'launch' && (
                    <motion.div
                        key="launch"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md space-y-8 mx-auto relative z-10 text-center"
                    >
                        <div className="w-32 h-32 mx-auto mb-6">
                            <Character type="player" avatar={useGameStore.getState().avatar} className="w-full h-full" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">最後確認</h2>
                            <p className="text-slate-400">請輸入您的艦隊代號 (員工編號)</p>
                        </div>

                        <input
                            type="text"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder="例如：FR-001"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-center text-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
                        />

                        <button
                            onClick={handleLaunch}
                            disabled={!inputName.trim()}
                            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all"
                        >
                            啟動引擎 (Launch)
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
