'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore, MARKET_DATA } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, TrendingUp, TrendingDown, Building2, Server, ChevronRight, Sparkles, Target, Users } from 'lucide-react';
import DialogueOverlay from '../rpg/DialogueOverlay';
import AvatarEditor from '../rpg/AvatarEditor';
import Character from '../rpg/Character';

type Phase = 'intro' | 'market-storm' | 'why-now' | 'dialogue' | 'avatar' | 'department' | 'launch';

const DEPARTMENTS = [
    { id: 'engineering', name: 'Engineering', desc: '技術研發與系統架構', icon: '💻' },
    { id: 'product', name: 'Product Management', desc: 'PickPeak 產品規劃與設計', icon: '🎯' },
    { id: 'xdc', name: 'Experience Design Center', desc: '使用者體驗與視覺設計', icon: '🎨' },
    { id: 'pi', name: 'Property Intelligence', desc: '不動產市場分析專家', icon: '📊' },
    { id: 'bd', name: 'Business Strategy', desc: '商業開發與策略規劃', icon: '🚀' },
    { id: 'hr', name: 'Human Resources', desc: '人才招募與組織發展', icon: '👥' },
    { id: 'marketing', name: 'Marketing & PR', desc: '品牌行銷與公共關係', icon: '📢' },
    { id: 'finance', name: 'Finance & Accounting', desc: '財務規劃與會計', icon: '💰' },
];

export default function Prologue() {
    const { setEmployeeId, setDepartment, setStoryFlag, setView, updateInsights, unlockKnowledge, completeChapter, addXp, unlockBadge } = useGameStore();
    const [phase, setPhase] = useState<Phase>('intro');
    const [inputName, setInputName] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [marketDataIndex, setMarketDataIndex] = useState(0);

    // Auto-advance market data display
    useEffect(() => {
        if (phase === 'market-storm') {
            const timer = setInterval(() => {
                setMarketDataIndex(prev => {
                    if (prev >= 3) {
                        clearInterval(timer);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 2000);
            return () => clearInterval(timer);
        }
    }, [phase]);

    const handleStartJourney = () => {
        setPhase('market-storm');
    };

    const handleMarketComplete = () => {
        // Unlock first knowledge item
        unlockKnowledge({
            id: 'market-shift-2025',
            category: 'market',
            title: '2025 市場大遷徙',
            content: '住宅市場因央行管制與囤房稅 2.0 降溫，商用市場因 AI 浪潮升溫。這是歷史性的此消彼長。',
            unlockedAt: 'prologue'
        });
        updateInsights('market', 10);
        setPhase('why-now');
    };

    const handleWhyNowComplete = () => {
        unlockKnowledge({
            id: 'funraise-mission',
            category: 'company',
            title: 'FUNRAISE 的使命',
            content: '方睿科技致力於以數據驅動翻轉台灣商用不動產市場，成為亞洲的 CoStar。',
            unlockedAt: 'prologue'
        });
        updateInsights('company', 10);
        setPhase('dialogue');
    };

    const handleDialogueComplete = () => {
        setPhase('avatar');
    };

    const handleAvatarComplete = () => {
        setPhase('department');
    };

    const handleDepartmentSelect = (deptId: string) => {
        setSelectedDept(deptId);
    };

    const handleDepartmentConfirm = () => {
        if (!selectedDept) return;
        setDepartment(selectedDept);
        setPhase('launch');
    };

    const handleLaunch = () => {
        if (!inputName.trim()) return;
        setEmployeeId(inputName);
        setStoryFlag('prologue_complete', true);
        completeChapter('prologue');
        addXp(100);
        unlockBadge('First Steps');
        setView('hub');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-5xl mx-auto relative px-4">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_50%)]"
                />
            </div>

            <AnimatePresence mode="wait">
                {/* Phase 1: Intro */}
                {phase === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        className="text-center space-y-8 relative z-10"
                    >
                        <div className="relative inline-block">
                            <div className="absolute -inset-12 bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="relative z-10"
                            >
                                {/* FUNRAISE Logo */}
                                <img
                                    src="/funraise-logo-dark.png"
                                    alt="FUNRAISE"
                                    className="h-16 md:h-20 mx-auto drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                                />
                            </motion.div>
                        </div>

                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <p className="text-cyan-400 font-mono text-sm tracking-[0.3em] mb-4">WELCOME TO</p>
                                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                                    方睿科技
                                </h1>
                                <p className="text-lg mt-3 text-slate-400">
                                    FUNRAISE INC. | 商用不動產數據平台
                                </p>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto mt-6"
                            >
                                2025 年。商用不動產市場正迎來<span className="text-cyan-400 font-bold">歷史性的變革</span>。
                                <br />
                                <span className="text-slate-400">在開始你的旅程之前，讓我們先了解這場風暴。</span>
                            </motion.p>
                        </div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            onClick={handleStartJourney}
                            className="group mt-8 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold text-lg transition-all flex items-center gap-3 mx-auto shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50"
                        >
                            <Sparkles className="w-5 h-5" />
                            開始探索
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                )}

                {/* Phase 2: Market Storm - Showing Data Visuals */}
                {phase === 'market-storm' && (
                    <motion.div
                        key="market-storm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8 relative z-10"
                    >
                        <div className="text-center mb-8">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2"
                            >
                                MARKET ANALYSIS // 2025
                            </motion.p>
                            <h2 className="text-3xl font-bold text-white">市場風暴：此消彼長</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* 住宅市場 - 下降 */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: marketDataIndex >= 0 ? 1 : 0.3, x: 0 }}
                                className="p-6 bg-slate-900/80 rounded-2xl border border-red-500/30"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-red-900/50 rounded-xl">
                                        <TrendingDown className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">住宅市場</h3>
                                        <p className="text-red-400 text-sm">RESIDENTIAL</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">交易量變化</span>
                                        <span className="text-red-400 font-bold text-lg">-25%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">市場情緒</span>
                                        <span className="text-red-400 font-bold">冷卻</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                                    <p className="text-sm text-red-200">央行信用管制 + 囤房稅 2.0</p>
                                </div>
                            </motion.div>

                            {/* 商用市場 - 上升 */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: marketDataIndex >= 1 ? 1 : 0.3, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-6 bg-slate-900/80 rounded-2xl border border-green-500/30"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-green-900/50 rounded-xl">
                                        <TrendingUp className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">商用市場</h3>
                                        <p className="text-green-400 text-sm">COMMERCIAL</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">AI 數據中心投資</span>
                                        <span className="text-green-400 font-bold text-lg">2,400億</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">辦公需求</span>
                                        <span className="text-green-400 font-bold">上升</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-green-900/20 rounded-lg">
                                    <p className="text-sm text-green-200">AI 浪潮 + ESG 需求</p>
                                </div>
                            </motion.div>

                            {/* 全球 TAM */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: marketDataIndex >= 2 ? 1 : 0.3, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="p-6 bg-slate-900/80 rounded-2xl border border-cyan-500/30"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-cyan-900/50 rounded-xl">
                                        <Building2 className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">全球商用不動產</h3>
                                        <p className="text-cyan-400 text-sm">TOTAL ADDRESSABLE MARKET</p>
                                    </div>
                                </div>
                                <div className="text-center py-4">
                                    <p className="text-5xl font-bold text-cyan-400">${MARKET_DATA.globalCRE.tam2024}T</p>
                                    <p className="text-slate-400 mt-2">2024 年市場規模（美元）</p>
                                </div>
                            </motion.div>

                            {/* PropTech */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: marketDataIndex >= 3 ? 1 : 0.3, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="p-6 bg-slate-900/80 rounded-2xl border border-purple-500/30"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-900/50 rounded-xl">
                                        <Server className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">PropTech 成長</h3>
                                        <p className="text-purple-400 text-sm">不動產科技</p>
                                    </div>
                                </div>
                                <div className="text-center py-4">
                                    <p className="text-5xl font-bold text-purple-400">{MARKET_DATA.proptech.cagr}%</p>
                                    <p className="text-slate-400 mt-2">年複合成長率 (CAGR)</p>
                                </div>
                            </motion.div>
                        </div>

                        {marketDataIndex >= 3 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mt-8"
                            >
                                <button
                                    onClick={handleMarketComplete}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-3 mx-auto"
                                >
                                    我理解了這個趨勢
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Phase 3: Why Now - FUNRAISE's Opportunity */}
                {phase === 'why-now' && (
                    <motion.div
                        key="why-now"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8 relative z-10"
                    >
                        <div className="text-center mb-8">
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2">WHY NOW // WHY US</p>
                            <h2 className="text-3xl font-bold text-white">為什麼是方睿？為什麼是現在？</h2>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-cyan-500/30 p-8 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-6 items-start"
                            >
                                <div className="w-16 h-16 flex-shrink-0 bg-cyan-900/50 rounded-xl flex items-center justify-center">
                                    <Target className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">對標 CoStar：$350億美元的成功藍圖</h3>
                                    <p className="text-slate-300">CoStar Group 用數據建立了商用不動產資訊帝國。我們正在打造台灣版的 CoStar —— 但更本土、更深入。</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex gap-6 items-start"
                            >
                                <div className="w-16 h-16 flex-shrink-0 bg-purple-900/50 rounded-xl flex items-center justify-center">
                                    <Server className="w-8 h-8 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">數據護城河</h3>
                                    <p className="text-slate-300">我們擁有全台最完整的商用不動產數據 —— {MARKET_DATA.funraise.dataPoints} 數據點，涵蓋 {MARKET_DATA.funraise.buildingsCovered} 棟商辦大樓。</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex gap-6 items-start"
                            >
                                <div className="w-16 h-16 flex-shrink-0 bg-green-900/50 rounded-xl flex items-center justify-center">
                                    <Users className="w-8 h-8 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">地面部隊</h3>
                                    <p className="text-slate-300">不只是科技公司 —— 我們有宇豐睿星（估價師+商仲顧問）、希睿置業（代銷）、Property Intelligence（五大行精英）。</p>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-center"
                        >
                            <p className="text-slate-400 mb-4">2026.01.13，PickPeak 即將正式發表</p>
                            <button
                                onClick={handleWhyNowComplete}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-3 mx-auto"
                            >
                                我想加入這個使命
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Phase 4: Dialogue with Mike */}
                {phase === 'dialogue' && (
                    <DialogueOverlay
                        key="dialogue"
                        onComplete={handleDialogueComplete}
                        lines={[
                            { speaker: 'Mike', text: '歡迎加入方睿科技，新夥伴。我是 Mike，方睿的 CEO。', expression: 'happy' },
                            { speaker: 'Mike', text: '你剛剛看到的數據，正是我們成立這間公司的原因。', expression: 'neutral' },
                            { speaker: 'Mike', text: '住宅市場降溫，商用市場升溫。AI 浪潮帶來前所未有的機會。', expression: 'serious' },
                            { speaker: 'Mike', text: '而我們，正站在這個歷史性變革的浪尖上。', expression: 'serious' },
                            { speaker: 'Mike', text: '在接下來的旅程中，你會學習商用不動產的基礎，了解我們的產品 PickPeak，以及如何運用數據創造價值。', expression: 'neutral' },
                            { speaker: 'Mike', text: '但首先...讓我們認識一下你。', expression: 'happy' },
                        ]}
                    />
                )}

                {/* Phase 5: Avatar Editor */}
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

                {/* Phase 6: Department Selection */}
                {phase === 'department' && (
                    <motion.div
                        key="department"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-3xl space-y-6 relative z-10"
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">選擇你的部門</h2>
                            <p className="text-slate-400">你將在哪個團隊展開旅程？</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {DEPARTMENTS.map((dept) => (
                                <motion.button
                                    key={dept.id}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDepartmentSelect(dept.id)}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                                        selectedDept === dept.id
                                            ? 'bg-cyan-900/50 border-cyan-400 shadow-lg shadow-cyan-500/20'
                                            : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
                                    }`}
                                >
                                    <div className="text-3xl mb-2">{dept.icon}</div>
                                    <h3 className="text-sm font-bold text-white leading-tight">{dept.name}</h3>
                                    <p className="text-slate-500 text-[10px] mt-1 leading-tight">{dept.desc}</p>
                                </motion.button>
                            ))}
                        </div>

                        {selectedDept && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <button
                                    onClick={handleDepartmentConfirm}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold transition-all shadow-lg shadow-cyan-500/25"
                                >
                                    確認加入 {DEPARTMENTS.find(d => d.id === selectedDept)?.name}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Phase 7: Final Launch */}
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
                            <h2 className="text-2xl font-bold text-white">最後一步</h2>
                            <p className="text-slate-400">請輸入你的名字</p>
                        </div>

                        <input
                            type="text"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            placeholder="你的名字"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-center text-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
                        />

                        <button
                            onClick={handleLaunch}
                            disabled={!inputName.trim()}
                            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Rocket className="w-5 h-5" />
                            正式啟航
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
