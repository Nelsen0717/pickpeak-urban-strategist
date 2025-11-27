'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Building2, Sofa, Wifi, Shield, ChevronRight, CheckCircle, Link, Zap, Users, Home } from 'lucide-react';
import DialogueOverlay from '../rpg/DialogueOverlay';

type Phase = 'intro' | 'ziroom-model' | 'ecosystem-map' | 'interactive' | 'dialogue' | 'complete';

// Ecosystem partners
const ECOSYSTEM_LAYERS = [
    {
        id: 'space',
        name: '空間',
        description: '辦公室選址與租賃',
        icon: Building2,
        color: 'cyan',
        partners: ['商辦大樓', '共享空間', '產業園區']
    },
    {
        id: 'design',
        name: '設計裝潢',
        description: '空間規劃與施工',
        icon: Sofa,
        color: 'purple',
        partners: ['室內設計', '裝潢工程', '家具廠商']
    },
    {
        id: 'infra',
        name: '基礎設施',
        description: 'IT 與辦公設備',
        icon: Wifi,
        color: 'green',
        partners: ['網路服務', '電話系統', '辦公設備']
    },
    {
        id: 'services',
        name: '企業服務',
        description: '營運支援服務',
        icon: Shield,
        color: 'orange',
        partners: ['物業管理', '保全服務', '清潔服務']
    }
];

export default function Chapter5Ecosystem() {
    const { completeChapter, addXp, updateInsights, unlockKnowledge, unlockBadge, setView } = useGameStore();
    const [phase, setPhase] = useState<Phase>('intro');
    const [activatedLayers, setActivatedLayers] = useState<string[]>([]);
    const [showComplete, setShowComplete] = useState(false);

    const handleIntroComplete = () => {
        setPhase('ziroom-model');
    };

    const handleZiroomComplete = () => {
        unlockKnowledge({
            id: 'ziroom-model',
            category: 'strategy',
            title: '自如模式 (Ziroom Model)',
            content: '自如從租屋平台發展成一站式居住服務商，涵蓋找房、裝潢、家具、保潔。我們要做的是「商用版自如」—— 從空間出發的 Total Solution。',
            unlockedAt: 'chapter5-ecosystem'
        });
        updateInsights('company', 10);
        setPhase('ecosystem-map');
    };

    const handleEcosystemComplete = () => {
        unlockKnowledge({
            id: 'ecosystem-strategy',
            category: 'strategy',
            title: '生態系策略',
            content: '不只是找辦公室，而是提供從空間到設計、設備、服務的完整解決方案。每一個環節都是商業機會，每一個合作夥伴都是價值共創者。',
            unlockedAt: 'chapter5-ecosystem'
        });
        updateInsights('company', 10);
        setPhase('interactive');
    };

    const handleLayerActivate = (layerId: string) => {
        if (activatedLayers.includes(layerId)) return;
        setActivatedLayers(prev => [...prev, layerId]);
        addXp(25);

        if (activatedLayers.length === ECOSYSTEM_LAYERS.length - 1) {
            setTimeout(() => setShowComplete(true), 500);
        }
    };

    const handleInteractiveComplete = () => {
        setPhase('dialogue');
    };

    const handleDialogueComplete = () => {
        setPhase('complete');
    };

    const handleComplete = () => {
        completeChapter('chapter5-ecosystem');
        unlockBadge('Ecosystem Architect');
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
                            <p className="text-orange-400 font-mono text-sm tracking-[0.3em]">CHAPTER 5</p>
                            <h1 className="text-5xl font-bold text-white">生態系佈局</h1>
                            <p className="text-2xl text-slate-300">Ecosystem Strategy</p>
                        </div>

                        <div className="relative w-40 h-40 mx-auto">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                {[0, 90, 180, 270].map((angle, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-4 h-4 bg-orange-400 rounded-full"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: `rotate(${angle}deg) translateY(-60px) translateX(-50%)`
                                        }}
                                    />
                                ))}
                            </motion.div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Network className="w-20 h-20 text-orange-400" />
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto space-y-4">
                            <p className="text-slate-300 text-lg leading-relaxed">
                                找到辦公室只是開始。
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                真正的價值在於——從空間出發，連結設計、設備、服務，
                                打造完整的企業辦公解決方案。這就是我們的生態系策略。
                            </p>
                        </div>

                        <button
                            onClick={handleIntroComplete}
                            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-orange-500/25 flex items-center gap-3 mx-auto"
                        >
                            了解生態系
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Phase 2: Ziroom Model */}
                {phase === 'ziroom-model' && (
                    <motion.div
                        key="ziroom"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-orange-400 font-mono text-sm tracking-[0.2em] mb-2">BENCHMARK // ZIROOM MODEL</p>
                            <h2 className="text-3xl font-bold text-white">自如模式：從空間到服務</h2>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-orange-500/30 p-8">
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <Home className="w-8 h-8 text-orange-400" />
                                <span className="text-2xl font-bold text-white">自如 Ziroom</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-slate-800/50 rounded-xl p-5">
                                    <h3 className="text-lg font-bold text-orange-400 mb-3">住宅版自如</h3>
                                    <ul className="space-y-2 text-slate-300 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-orange-400" />
                                            找房：智能推薦租屋
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-orange-400" />
                                            裝潢：統一標準化裝修
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-orange-400" />
                                            家具：配套家具租賃
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-orange-400" />
                                            服務：保潔、維修、管家
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-cyan-900/30 rounded-xl p-5 border border-cyan-500/30">
                                    <h3 className="text-lg font-bold text-cyan-400 mb-3">商用版自如 (FUNRAISE)</h3>
                                    <ul className="space-y-2 text-slate-300 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                                            選址：PickPeak 智能選址
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                                            設計：辦公空間規劃
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                                            設備：IT、家具整合
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                                            服務：物業、保全、清潔
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-900/30 to-cyan-900/30 rounded-xl p-6 text-center">
                                <p className="text-lg text-slate-300">
                                    「自如把租房變成一站式服務，
                                    <br />
                                    <span className="text-cyan-400 font-bold">我們要把商辦租賃變成企業辦公的 Total Solution。</span>」
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleZiroomComplete}
                                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                探索生態系架構
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 3: Ecosystem Map */}
                {phase === 'ecosystem-map' && (
                    <motion.div
                        key="ecosystem"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2">ECOSYSTEM ARCHITECTURE</p>
                            <h2 className="text-3xl font-bold text-white">從空間出發的 Total Solution</h2>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-8">
                            {/* Ecosystem Diagram */}
                            <div className="relative">
                                {/* Center: Client */}
                                <div className="flex justify-center mb-8">
                                    <div className="w-24 h-24 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <p className="text-center text-slate-400 text-sm mb-8">企業客戶</p>

                                {/* Four quadrants */}
                                <div className="grid grid-cols-2 gap-6">
                                    {ECOSYSTEM_LAYERS.map((layer, index) => {
                                        const Icon = layer.icon;
                                        const colorClasses = {
                                            cyan: 'border-cyan-500/50 bg-cyan-900/20',
                                            purple: 'border-purple-500/50 bg-purple-900/20',
                                            green: 'border-green-500/50 bg-green-900/20',
                                            orange: 'border-orange-500/50 bg-orange-900/20',
                                        };

                                        return (
                                            <motion.div
                                                key={layer.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.15 }}
                                                className={`p-5 rounded-xl border-2 ${colorClasses[layer.color as keyof typeof colorClasses]}`}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Icon className={`w-6 h-6 text-${layer.color}-400`} />
                                                    <h3 className="text-lg font-bold text-white">{layer.name}</h3>
                                                </div>
                                                <p className="text-slate-400 text-sm mb-3">{layer.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {layer.partners.map((partner, i) => (
                                                        <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">
                                                            {partner}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Connection lines */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-dashed border-slate-600 rounded-full pointer-events-none" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                生態系的價值
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-cyan-400 mb-1">4x</p>
                                    <p className="text-slate-400 text-sm">客戶生命週期價值</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-purple-400 mb-1">60%</p>
                                    <p className="text-slate-400 text-sm">交叉銷售轉換率</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-400 mb-1">100+</p>
                                    <p className="text-slate-400 text-sm">生態系夥伴</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleEcosystemComplete}
                                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                親手建構生態系
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 4: Interactive - Build Ecosystem */}
                {phase === 'interactive' && (
                    <motion.div
                        key="interactive"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2">INTERACTIVE // BUILD YOUR ECOSYSTEM</p>
                            <h2 className="text-3xl font-bold text-white">點擊啟動生態系夥伴</h2>
                            <p className="text-slate-400 mt-2">為客戶組建完整的服務網絡</p>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-8">
                            {/* Central hub */}
                            <div className="relative h-[400px]">
                                {/* Center */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <motion.div
                                        animate={{
                                            boxShadow: activatedLayers.length === ECOSYSTEM_LAYERS.length
                                                ? '0 0 60px rgba(6, 182, 212, 0.5)'
                                                : '0 0 30px rgba(6, 182, 212, 0.3)'
                                        }}
                                        className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center"
                                    >
                                        <span className="text-white font-bold text-sm">客戶</span>
                                    </motion.div>
                                </div>

                                {/* Ecosystem nodes */}
                                {ECOSYSTEM_LAYERS.map((layer, index) => {
                                    const Icon = layer.icon;
                                    const isActivated = activatedLayers.includes(layer.id);
                                    const positions = [
                                        { top: '10%', left: '50%', transform: 'translateX(-50%)' },
                                        { top: '50%', right: '10%', transform: 'translateY(-50%)' },
                                        { bottom: '10%', left: '50%', transform: 'translateX(-50%)' },
                                        { top: '50%', left: '10%', transform: 'translateY(-50%)' },
                                    ];
                                    const colorClasses = {
                                        cyan: { active: 'bg-cyan-600 border-cyan-400', inactive: 'bg-slate-800 border-slate-600' },
                                        purple: { active: 'bg-purple-600 border-purple-400', inactive: 'bg-slate-800 border-slate-600' },
                                        green: { active: 'bg-green-600 border-green-400', inactive: 'bg-slate-800 border-slate-600' },
                                        orange: { active: 'bg-orange-600 border-orange-400', inactive: 'bg-slate-800 border-slate-600' },
                                    };
                                    const colors = colorClasses[layer.color as keyof typeof colorClasses];

                                    return (
                                        <motion.button
                                            key={layer.id}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => handleLayerActivate(layer.id)}
                                            disabled={isActivated}
                                            className="absolute"
                                            style={positions[index]}
                                        >
                                            <motion.div
                                                animate={isActivated ? { scale: [1, 1.1, 1] } : {}}
                                                transition={{ duration: 0.3 }}
                                                className={`w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isActivated ? colors.active : colors.inactive
                                                    } ${!isActivated ? 'hover:border-slate-500 cursor-pointer' : ''}`}
                                            >
                                                <Icon className={`w-8 h-8 ${isActivated ? 'text-white' : 'text-slate-400'}`} />
                                                <span className={`text-xs mt-1 ${isActivated ? 'text-white' : 'text-slate-400'}`}>
                                                    {layer.name}
                                                </span>
                                                {isActivated && (
                                                    <CheckCircle className="w-4 h-4 text-white absolute -top-1 -right-1" />
                                                )}
                                            </motion.div>
                                        </motion.button>
                                    );
                                })}

                                {/* Connection lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    {activatedLayers.map((layerId, index) => {
                                        const positions = [
                                            { x1: '50%', y1: '30%', x2: '50%', y2: '42%' },
                                            { x1: '70%', y1: '50%', x2: '58%', y2: '50%' },
                                            { x1: '50%', y1: '70%', x2: '50%', y2: '58%' },
                                            { x1: '30%', y1: '50%', x2: '42%', y2: '50%' },
                                        ];
                                        const layerIndex = ECOSYSTEM_LAYERS.findIndex(l => l.id === layerId);
                                        const pos = positions[layerIndex];

                                        return (
                                            <motion.line
                                                key={layerId}
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.5 }}
                                                {...pos}
                                                stroke="rgba(6, 182, 212, 0.5)"
                                                strokeWidth="2"
                                            />
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* Progress */}
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {ECOSYSTEM_LAYERS.map(layer => (
                                    <div
                                        key={layer.id}
                                        className={`w-4 h-4 rounded-full transition-all ${activatedLayers.includes(layer.id)
                                                ? `bg-${layer.color}-500`
                                                : 'bg-slate-600'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {showComplete && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-4"
                            >
                                <div className="bg-gradient-to-r from-cyan-900/30 to-orange-900/30 border border-cyan-500/30 rounded-xl p-6">
                                    <p className="text-cyan-300 text-lg mb-2">
                                        <CheckCircle className="w-5 h-5 inline mr-2" />
                                        生態系建構完成！
                                    </p>
                                    <p className="text-slate-400">
                                        你已經為客戶組建了完整的服務網絡。這就是 FUNRAISE 的差異化優勢。
                                    </p>
                                </div>

                                <button
                                    onClick={handleInteractiveComplete}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
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
                            { speaker: 'Mike', text: '你已經理解了生態系策略的精髓。', expression: 'happy' },
                            { speaker: 'Mike', text: '我們不只是幫客戶找辦公室。', expression: 'neutral' },
                            { speaker: 'Mike', text: '我們提供從空間到設計、設備、服務的完整解決方案。', expression: 'serious' },
                            { speaker: 'Mike', text: '每一個環節都是商機，每一個夥伴都是價值共創者。', expression: 'neutral' },
                            { speaker: 'Mike', text: '這就是「How We Win」的答案：生態系策略。', expression: 'happy' },
                            { speaker: 'Mike', text: '最後一章，你將運用所有學到的知識，進行一場終極談判。', expression: 'serious' },
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
                        <div className="w-24 h-24 mx-auto bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                            <Network className="w-12 h-12 text-white" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white">第五章完成！</h2>
                            <p className="text-slate-300 text-xl">你已經掌握了生態系策略</p>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl border border-orange-500/30 p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-orange-400 mb-4">獲得獎勵</h3>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-cyan-400">+300 XP</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-yellow-400">Ecosystem Architect 徽章</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-orange-400">+20% 公司理解</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-orange-500/25 flex items-center gap-3 mx-auto"
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
