'use client';

import React, { useState } from 'react';
import { useGameStore, MARKET_DATA } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Shield, TrendingUp, Building2, ChevronRight, CheckCircle, Lock, Eye, Layers, Target } from 'lucide-react';
import DialogueOverlay from '../rpg/DialogueOverlay';

type Phase = 'intro' | 'costar-story' | 'data-moat' | 'interactive' | 'dialogue' | 'complete';

// Data Moat Components
const DATA_LAYERS = [
    {
        id: 'buildings',
        name: '建物資料',
        count: '3,000+',
        description: '全台主要商辦大樓的完整資訊',
        icon: Building2,
        color: 'cyan'
    },
    {
        id: 'transactions',
        name: '交易記錄',
        count: '50,000+',
        description: '歷年商用不動產租賃與買賣資料',
        icon: TrendingUp,
        color: 'purple'
    },
    {
        id: 'market',
        name: '市場數據',
        count: '500萬+',
        description: '租金、空置率、市場趨勢等即時數據',
        icon: Database,
        color: 'green'
    },
    {
        id: 'proprietary',
        name: '獨家情報',
        count: '持續累積',
        description: '來自地面部隊的第一手市場情報',
        icon: Eye,
        color: 'orange'
    }
];

export default function Chapter2Moat() {
    const { completeChapter, addXp, updateInsights, unlockKnowledge, unlockBadge, setView } = useGameStore();
    const [phase, setPhase] = useState<Phase>('intro');
    const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
    const [showMoatComplete, setShowMoatComplete] = useState(false);

    const handleIntroComplete = () => {
        setPhase('costar-story');
    };

    const handleCostarComplete = () => {
        unlockKnowledge({
            id: 'costar-model',
            category: 'company',
            title: 'CoStar 成功模式',
            content: 'CoStar 用 37 年時間建立了商用不動產數據帝國，市值達 $350 億美元。關鍵是：數據的深度與廣度，加上持續投資。',
            unlockedAt: 'chapter2-moat'
        });
        updateInsights('company', 10);
        setPhase('data-moat');
    };

    const handleDataMoatComplete = () => {
        unlockKnowledge({
            id: 'funraise-data',
            category: 'company',
            title: 'FUNRAISE 數據優勢',
            content: '我們結合公開數據、獨家爬蟲、地面部隊情報，建立全台最完整的商用不動產資料庫。',
            unlockedAt: 'chapter2-moat'
        });
        updateInsights('company', 10);
        setPhase('interactive');
    };

    const handleLayerSelect = (layerId: string) => {
        if (selectedLayers.includes(layerId)) return;
        setSelectedLayers(prev => [...prev, layerId]);

        if (selectedLayers.length === DATA_LAYERS.length - 1) {
            setTimeout(() => {
                setShowMoatComplete(true);
                addXp(100);
            }, 500);
        }
    };

    const handleInteractiveComplete = () => {
        setPhase('dialogue');
    };

    const handleDialogueComplete = () => {
        setPhase('complete');
    };

    const handleComplete = () => {
        completeChapter('chapter2-moat');
        unlockBadge('Data Hunter');
        addXp(200);
        setView('hub');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-5xl mx-auto relative px-4">
            <AnimatePresence mode="wait">
                {/* Phase 1: Intro */}
                {phase === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <p className="text-purple-400 font-mono text-sm tracking-[0.3em]">CHAPTER 2</p>
                            <h1 className="text-5xl font-bold text-white">數據護城河</h1>
                            <p className="text-2xl text-slate-300">The Data Moat</p>
                        </div>

                        <div className="relative w-32 h-32 mx-auto">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-purple-500/30 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border-4 border-cyan-500/30 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shield className="w-16 h-16 text-purple-400" />
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto space-y-4">
                            <p className="text-slate-300 text-lg leading-relaxed">
                                在資訊時代，數據就是最深的護城河。
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                讓我們從全球最成功的商用不動產數據公司 CoStar 學習，
                                然後了解 FUNRAISE 如何在台灣建立自己的數據優勢。
                            </p>
                        </div>

                        <button
                            onClick={handleIntroComplete}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-purple-500/25 flex items-center gap-3 mx-auto"
                        >
                            探索數據的力量
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Phase 2: CoStar Story */}
                {phase === 'costar-story' && (
                    <motion.div
                        key="costar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2">BENCHMARK STUDY</p>
                            <h2 className="text-3xl font-bold text-white">CoStar：數據帝國的崛起</h2>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-cyan-500/30 p-8">
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-cyan-400">${MARKET_DATA.costar.marketCap}B</p>
                                    <p className="text-slate-400 text-sm">市值（美元）</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-purple-400">${MARKET_DATA.costar.annualRevenue}B</p>
                                    <p className="text-slate-400 text-sm">年營收（美元）</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-green-400">{2025 - MARKET_DATA.costar.foundedYear}</p>
                                    <p className="text-slate-400 text-sm">年累積</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-cyan-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Database className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">數據深度</h3>
                                        <p className="text-slate-300">CoStar 擁有全美最完整的商用不動產資料庫，涵蓋物件資訊、交易記錄、租戶資料、市場分析等。</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Layers className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">網路效應</h3>
                                        <p className="text-slate-300">越多人使用，數據越完整；數據越完整，越多人使用。形成正向循環的飛輪效應。</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">護城河</h3>
                                        <p className="text-slate-300">37 年的數據累積，形成了幾乎無法複製的競爭優勢。這就是數據護城河的力量。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-6 text-center">
                            <p className="text-cyan-300 text-lg">
                                「如果 CoStar 是美國的商用不動產數據霸主，
                                <br />
                                <span className="font-bold">FUNRAISE 要成為台灣的 CoStar。</span>」
                            </p>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleCostarComplete}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                了解我們的數據策略
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 3: Data Moat Explanation */}
                {phase === 'data-moat' && (
                    <motion.div
                        key="moat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-purple-400 font-mono text-sm tracking-[0.2em] mb-2">FUNRAISE DATA STRATEGY</p>
                            <h2 className="text-3xl font-bold text-white">我們如何建立數據護城河</h2>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-purple-500/30 p-8 space-y-6">
                            <div className="text-center mb-8">
                                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                    {MARKET_DATA.funraise.dataPoints}
                                </p>
                                <p className="text-slate-400 mt-2">數據點持續累積中</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <DataSourceCard
                                    title="公開資料整合"
                                    description="實價登錄、建照資訊、都市計畫等政府公開資料的深度清洗與整合"
                                    icon={<Database className="w-6 h-6" />}
                                    color="cyan"
                                />
                                <DataSourceCard
                                    title="智能爬蟲系統"
                                    description="24/7 自動化收集各大平台的物件資訊、租金行情、市場動態"
                                    icon={<Target className="w-6 h-6" />}
                                    color="purple"
                                />
                                <DataSourceCard
                                    title="地面部隊情報"
                                    description="來自宇豐睿星、希睿置業、PI 團隊的第一手市場情報與獨家資訊"
                                    icon={<Eye className="w-6 h-6" />}
                                    color="orange"
                                />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-purple-400" />
                                為什麼數據是最深的護城河？
                            </h3>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-white">時間壁壘：</strong>數據需要時間累積，競爭者無法一夜之間追上</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-white">網路效應：</strong>越多人使用，數據越完整，形成正向循環</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-white">獨家來源：</strong>地面部隊提供的情報，是任何競爭者都無法取得的</span>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleDataMoatComplete}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                探索數據層級
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 4: Interactive Data Layers */}
                {phase === 'interactive' && (
                    <motion.div
                        key="interactive"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2">INTERACTIVE // DATA LAYERS</p>
                            <h2 className="text-3xl font-bold text-white">點擊解鎖數據層級</h2>
                            <p className="text-slate-400 mt-2">點選每個數據層，了解我們的數據資產</p>
                        </div>

                        <div className="relative bg-slate-900/80 rounded-2xl border border-slate-700 p-8 min-h-[400px]">
                            {/* Data visualization */}
                            <div className="grid grid-cols-2 gap-6">
                                {DATA_LAYERS.map((layer, index) => {
                                    const isUnlocked = selectedLayers.includes(layer.id);
                                    const Icon = layer.icon;
                                    const colorClasses = {
                                        cyan: 'border-cyan-500 bg-cyan-900/30 text-cyan-400',
                                        purple: 'border-purple-500 bg-purple-900/30 text-purple-400',
                                        green: 'border-green-500 bg-green-900/30 text-green-400',
                                        orange: 'border-orange-500 bg-orange-900/30 text-orange-400',
                                    };

                                    return (
                                        <motion.button
                                            key={layer.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => handleLayerSelect(layer.id)}
                                            disabled={isUnlocked}
                                            className={`p-6 rounded-xl border-2 text-left transition-all ${isUnlocked
                                                    ? colorClasses[layer.color as keyof typeof colorClasses]
                                                    : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <Icon className={`w-8 h-8 ${isUnlocked ? '' : 'text-slate-500'}`} />
                                                <div>
                                                    <h3 className={`text-lg font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                                        {layer.name}
                                                    </h3>
                                                    <p className={`text-2xl font-bold ${isUnlocked ? `text-${layer.color}-400` : 'text-slate-600'}`}>
                                                        {layer.count}
                                                    </p>
                                                </div>
                                                {!isUnlocked && <Lock className="w-5 h-5 text-slate-600 ml-auto" />}
                                                {isUnlocked && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />}
                                            </div>
                                            <p className={`text-sm ${isUnlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {isUnlocked ? layer.description : '點擊解鎖'}
                                            </p>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Progress indicator */}
                            <div className="mt-6 flex items-center justify-center gap-2">
                                {DATA_LAYERS.map(layer => (
                                    <div
                                        key={layer.id}
                                        className={`w-3 h-3 rounded-full transition-all ${selectedLayers.includes(layer.id) ? 'bg-cyan-400' : 'bg-slate-600'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {showMoatComplete && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-4"
                            >
                                <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-cyan-500/30 rounded-xl p-6">
                                    <p className="text-cyan-300 text-lg mb-2">
                                        <CheckCircle className="w-5 h-5 inline mr-2" />
                                        所有數據層級已解鎖！
                                    </p>
                                    <p className="text-slate-400">
                                        這就是 FUNRAISE 的數據護城河 —— 多層次、持續累積、難以複製。
                                    </p>
                                </div>

                                <button
                                    onClick={handleInteractiveComplete}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                                >
                                    繼續
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Phase 5: Dialogue */}
                {phase === 'dialogue' && (
                    <DialogueOverlay
                        onComplete={handleDialogueComplete}
                        lines={[
                            { speaker: 'Mike', text: '你現在理解了數據護城河的概念。', expression: 'happy' },
                            { speaker: 'Mike', text: 'CoStar 花了 37 年建立他們的數據帝國。', expression: 'neutral' },
                            { speaker: 'Mike', text: '我們沒有 37 年，但我們有更聰明的方法。', expression: 'serious' },
                            { speaker: 'Mike', text: '公開數據整合、智能爬蟲、地面部隊情報 —— 三管齊下。', expression: 'serious' },
                            { speaker: 'Mike', text: '這就是「Why Us」的第一個答案：我們有數據。', expression: 'happy' },
                            { speaker: 'Mike', text: '但數據只是開始。下一章，我會介紹讓數據有生命的人。', expression: 'neutral' },
                        ]}
                    />
                )}

                {/* Phase 6: Complete */}
                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-24 h-24 mx-auto bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                            <Database className="w-12 h-12 text-white" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white">第二章完成！</h2>
                            <p className="text-slate-300 text-xl">你已經理解了數據護城河的力量</p>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl border border-purple-500/30 p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-purple-400 mb-4">獲得獎勵</h3>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-cyan-400">+200 XP</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-yellow-400">Data Hunter 徽章</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-purple-400">+20% 公司理解</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-purple-500/25 flex items-center gap-3 mx-auto"
                        >
                            返回基地
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DataSourceCard({
    title,
    description,
    icon,
    color
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: 'cyan' | 'purple' | 'orange';
}) {
    const colorClasses = {
        cyan: 'bg-cyan-900/30 border-cyan-500/30 text-cyan-400',
        purple: 'bg-purple-900/30 border-purple-500/30 text-purple-400',
        orange: 'bg-orange-900/30 border-orange-500/30 text-orange-400',
    };

    return (
        <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
            <div className="mb-3">{icon}</div>
            <h4 className="font-bold text-white mb-2">{title}</h4>
            <p className="text-slate-400 text-sm">{description}</p>
        </div>
    );
}
