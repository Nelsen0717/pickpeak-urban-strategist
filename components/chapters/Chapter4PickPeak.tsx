'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, MapPin, DollarSign, Users, ChevronRight, CheckCircle, Star, Filter, BarChart2, TrendingUp, Clock, Zap } from 'lucide-react';
import DialogueOverlay from '../rpg/DialogueOverlay';

type Phase = 'intro' | 'product-intro' | 'simulation' | 'results' | 'dialogue' | 'complete';

// Simulated office buildings for the demo
const BUILDINGS = [
    {
        id: 'nangang-tech',
        name: '南港軟體園區 A 棟',
        district: '南港區',
        rentPerPing: 1800,
        size: 500,
        floor: '15F',
        vacancy: 2,
        grade: 'A',
        features: ['捷運站直達', '智慧辦公', 'ESG認證'],
        score: 92
    },
    {
        id: 'xinyi-tower',
        name: '信義商業大樓',
        district: '信義區',
        rentPerPing: 2200,
        size: 350,
        floor: '22F',
        vacancy: 1,
        grade: 'A+',
        features: ['地標建築', '高級大廳', '景觀樓層'],
        score: 88
    },
    {
        id: 'neihu-tech',
        name: '內湖科技中心',
        district: '內湖區',
        rentPerPing: 1400,
        size: 800,
        floor: '8F',
        vacancy: 5,
        grade: 'B+',
        features: ['停車充足', '廠辦混合', '租金實惠'],
        score: 78
    },
    {
        id: 'zhongshan-office',
        name: '中山商務中心',
        district: '中山區',
        rentPerPing: 1600,
        size: 400,
        floor: '12F',
        vacancy: 3,
        grade: 'A-',
        features: ['交通便利', '餐飲豐富', '成熟商圈'],
        score: 85
    }
];

// Client requirements
const CLIENT = {
    name: 'TechVision 科技',
    industry: 'AI 軟體開發',
    employees: 80,
    budget: '150萬/月',
    requirements: ['至少 400 坪', '捷運 10 分鐘內', 'A級以上'],
    preferences: ['ESG認證優先', '智慧辦公設施']
};

export default function Chapter4PickPeak() {
    const { completeChapter, addXp, updateInsights, unlockKnowledge, unlockBadge, setView } = useGameStore();
    const [phase, setPhase] = useState<Phase>('intro');
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [filterApplied, setFilterApplied] = useState(false);

    const handleIntroComplete = () => {
        setPhase('product-intro');
    };

    const handleProductIntroComplete = () => {
        unlockKnowledge({
            id: 'pickpeak-intro',
            category: 'product',
            title: 'PickPeak 產品概念',
            content: 'PickPeak 是 FUNRAISE 的旗艦產品，用數據驅動的方式幫助企業找到理想辦公空間。結合 AI 演算法與市場數據，秒速配對最佳選項。',
            unlockedAt: 'chapter4-pickpeak'
        });
        updateInsights('product', 15);
        setPhase('simulation');
    };

    const handleApplyFilter = () => {
        setFilterApplied(true);
        addXp(30);
    };

    const handleBuildingSelect = (buildingId: string) => {
        setSelectedBuilding(buildingId);
        setShowAnalysis(true);
    };

    const handleConfirmSelection = () => {
        const building = BUILDINGS.find(b => b.id === selectedBuilding);
        if (building) {
            unlockKnowledge({
                id: 'pickpeak-matching',
                category: 'product',
                title: 'PickPeak 智能配對',
                content: `你成功為客戶配對到 ${building.name}！PickPeak 的 AI 演算法考量了位置、價格、規格、ESG 等多維度因素，為客戶找到最佳選項。`,
                unlockedAt: 'chapter4-pickpeak'
            });
            updateInsights('product', 15);
            addXp(100);
        }
        setPhase('results');
    };

    const handleResultsComplete = () => {
        setPhase('dialogue');
    };

    const handleDialogueComplete = () => {
        setPhase('complete');
    };

    const handleComplete = () => {
        completeChapter('chapter4-pickpeak');
        unlockBadge('PickPeak Master');
        addXp(200);
        setView('hub');
    };

    const selectedBuildingData = BUILDINGS.find(b => b.id === selectedBuilding);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-6xl mx-auto relative px-4">
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
                            <p className="text-blue-400 font-mono text-sm tracking-[0.3em]">CHAPTER 4</p>
                            <h1 className="text-5xl font-bold text-white">PickPeak 深度體驗</h1>
                            <p className="text-2xl text-slate-300">PickPeak Deep Dive</p>
                        </div>

                        <div className="relative w-40 h-40 mx-auto">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-blue-500/30 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Search className="w-20 h-20 text-blue-400" />
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto space-y-4">
                            <p className="text-slate-300 text-lg leading-relaxed">
                                歡迎來到 PickPeak —— FUNRAISE 的旗艦產品。
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                在這個章節，你將親手操作 PickPeak 系統，
                                為一位真實的科技公司客戶找到理想的辦公空間。
                            </p>
                        </div>

                        <button
                            onClick={handleIntroComplete}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-500/25 flex items-center gap-3 mx-auto"
                        >
                            開始體驗
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Phase 2: Product Introduction */}
                {phase === 'product-intro' && (
                    <motion.div
                        key="product-intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-blue-400 font-mono text-sm tracking-[0.2em] mb-2">PRODUCT OVERVIEW</p>
                            <h2 className="text-3xl font-bold text-white">PickPeak：數據驅動的選址決策</h2>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-blue-500/30 p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <FeatureCard icon={<Search className="w-6 h-6" />} title="智能搜尋" desc="多維度篩選" color="blue" />
                                <FeatureCard icon={<BarChart2 className="w-6 h-6" />} title="市場分析" desc="即時數據" color="purple" />
                                <FeatureCard icon={<Zap className="w-6 h-6" />} title="AI 配對" desc="秒速推薦" color="cyan" />
                                <FeatureCard icon={<TrendingUp className="w-6 h-6" />} title="趨勢預測" desc="租金走向" color="green" />
                            </div>

                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-blue-400 mb-4">產品核心價值</h3>
                                <ul className="space-y-3 text-slate-300">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <span><strong className="text-white">節省時間：</strong>傳統選址需要數週，PickPeak 只需數分鐘</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <span><strong className="text-white">數據透明：</strong>所有推薦都有數據支持，不再憑感覺決策</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <span><strong className="text-white">最佳匹配：</strong>AI 演算法考量多維度需求，找到最適合的空間</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleProductIntroComplete}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                開始模擬選址
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 3: Simulation */}
                {phase === 'simulation' && (
                    <motion.div
                        key="simulation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full space-y-6"
                    >
                        <div className="text-center">
                            <p className="text-blue-400 font-mono text-sm tracking-[0.2em] mb-2">PICKPEAK SIMULATION</p>
                            <h2 className="text-2xl font-bold text-white">為 {CLIENT.name} 找到理想辦公室</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Client Brief Panel */}
                            <div className="lg:col-span-1 space-y-4">
                                <div className="bg-slate-900/80 rounded-xl border border-slate-700 p-5">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-400" />
                                        客戶資訊
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">公司名稱</span>
                                            <span className="text-white font-medium">{CLIENT.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">產業</span>
                                            <span className="text-white">{CLIENT.industry}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">員工人數</span>
                                            <span className="text-white">{CLIENT.employees} 人</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">預算</span>
                                            <span className="text-cyan-400 font-bold">{CLIENT.budget}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/80 rounded-xl border border-slate-700 p-5">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-purple-400" />
                                        需求條件
                                    </h3>
                                    <div className="space-y-2">
                                        {CLIENT.requirements.map((req, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-slate-300">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-700">
                                        <p className="text-xs text-slate-500 mb-2">偏好條件</p>
                                        <div className="flex flex-wrap gap-2">
                                            {CLIENT.preferences.map((pref, i) => (
                                                <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">
                                                    {pref}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {!filterApplied && (
                                    <button
                                        onClick={handleApplyFilter}
                                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Filter className="w-4 h-4" />
                                        套用篩選條件
                                    </button>
                                )}
                            </div>

                            {/* Buildings List */}
                            <div className="lg:col-span-2 space-y-4">
                                {!filterApplied ? (
                                    <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-12 text-center">
                                        <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-400">請先套用篩選條件以搜尋物件</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-slate-400">
                                                找到 <span className="text-cyan-400 font-bold">{BUILDINGS.length}</span> 個符合條件的物件
                                            </p>
                                            <span className="text-xs text-slate-500">按匹配度排序</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {BUILDINGS.map((building, index) => (
                                                <motion.div
                                                    key={building.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <BuildingCard
                                                        building={building}
                                                        isSelected={selectedBuilding === building.id}
                                                        onClick={() => handleBuildingSelect(building.id)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Analysis Panel */}
                        <AnimatePresence>
                            {showAnalysis && selectedBuildingData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="bg-slate-900/80 rounded-xl border border-cyan-500/30 p-6"
                                >
                                    <h3 className="text-lg font-bold text-cyan-400 mb-4">AI 分析報告：{selectedBuildingData.name}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-slate-400 text-sm mb-2">匹配度評分</p>
                                            <div className="flex items-center gap-3">
                                                <div className="text-4xl font-bold text-cyan-400">{selectedBuildingData.score}</div>
                                                <div className="text-slate-500 text-sm">/100</div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm mb-2">月租金估算</p>
                                            <div className="text-2xl font-bold text-white">
                                                ${(selectedBuildingData.rentPerPing * selectedBuildingData.size).toLocaleString()}
                                            </div>
                                            <p className="text-xs text-slate-500">{selectedBuildingData.rentPerPing} 元/坪 × {selectedBuildingData.size} 坪</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm mb-2">建議</p>
                                            <p className="text-slate-300 text-sm">
                                                {selectedBuildingData.score >= 90 ? '強烈推薦！完美符合客戶需求。' :
                                                    selectedBuildingData.score >= 80 ? '優質選項，值得安排看屋。' :
                                                        '可作為備選方案考慮。'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={handleConfirmSelection}
                                            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold transition-all shadow-lg flex items-center gap-2 mx-auto"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            確認推薦此物件
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Phase 4: Results */}
                {phase === 'results' && selectedBuildingData && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-3xl space-y-8 text-center"
                    >
                        <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-white">選址成功！</h2>
                            <p className="text-slate-300 text-lg">
                                你為 {CLIENT.name} 推薦了 <span className="text-cyan-400 font-bold">{selectedBuildingData.name}</span>
                            </p>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl border border-green-500/30 p-6">
                            <h3 className="text-lg font-bold text-green-400 mb-4">成果摘要</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-left">
                                    <p className="text-slate-400">物件等級</p>
                                    <p className="text-white font-bold">{selectedBuildingData.grade}</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-slate-400">匹配度</p>
                                    <p className="text-cyan-400 font-bold">{selectedBuildingData.score}%</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-slate-400">預估月租</p>
                                    <p className="text-white font-bold">${(selectedBuildingData.rentPerPing * selectedBuildingData.size).toLocaleString()}</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-slate-400">省下的時間</p>
                                    <p className="text-green-400 font-bold">3-4 週</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                            <p className="text-blue-300">
                                這就是 PickPeak 的威力 —— 用數據讓選址決策更快、更準、更透明。
                                <br />
                                <span className="text-sm text-slate-400 mt-2 block">發表日期：2026.01.13</span>
                            </p>
                        </div>

                        <button
                            onClick={handleResultsComplete}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                        >
                            繼續
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Phase 5: Dialogue */}
                {phase === 'dialogue' && (
                    <DialogueOverlay
                        onComplete={handleDialogueComplete}
                        lines={[
                            { speaker: 'Mike', text: '太棒了！你成功完成了第一次 PickPeak 選址模擬。', expression: 'happy' },
                            { speaker: 'Mike', text: '這就是我們產品的核心 —— 讓複雜的選址決策變得簡單。', expression: 'neutral' },
                            { speaker: 'Mike', text: '傳統方式需要數週甚至數月，我們只需要幾分鐘。', expression: 'serious' },
                            { speaker: 'Mike', text: '而且每一個推薦都有數據支撐，不是憑感覺。', expression: 'neutral' },
                            { speaker: 'Mike', text: '這就是「Why Us」的第三個答案：我們有產品。', expression: 'happy' },
                            { speaker: 'Mike', text: '數據 + 人 + 產品。下一章，我們來看看更大的圖景 —— 生態系策略。', expression: 'happy' },
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
                        <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                            <Search className="w-12 h-12 text-white" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white">第四章完成！</h2>
                            <p className="text-slate-300 text-xl">你已經體驗了 PickPeak 的核心功能</p>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl border border-blue-500/30 p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-blue-400 mb-4">獲得獎勵</h3>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-cyan-400">+330 XP</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-yellow-400">PickPeak Master 徽章</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-blue-400">+30% 產品熟悉</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-500/25 flex items-center gap-3 mx-auto"
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

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
    const colorClasses: Record<string, string> = {
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        cyan: 'text-cyan-400',
        green: 'text-green-400',
    };

    return (
        <div className="text-center p-4 rounded-xl bg-slate-800/50">
            <div className={`${colorClasses[color]} mb-2 flex justify-center`}>{icon}</div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
            <p className="text-slate-400 text-xs">{desc}</p>
        </div>
    );
}

function BuildingCard({
    building,
    isSelected,
    onClick
}: {
    building: typeof BUILDINGS[0];
    isSelected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected
                    ? 'bg-cyan-900/30 border-cyan-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-white">{building.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {building.district}
                    </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${building.grade.startsWith('A') ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-600/50 text-slate-300'
                    }`}>
                    {building.grade}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                    <p className="text-slate-500 text-xs">租金</p>
                    <p className="text-white font-medium">${building.rentPerPing}/坪</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs">面積</p>
                    <p className="text-white font-medium">{building.size} 坪</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-1">
                {building.features.slice(0, 2).map((feature, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                        {feature}
                    </span>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-500">匹配度</span>
                <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cyan-500 transition-all"
                            style={{ width: `${building.score}%` }}
                        />
                    </div>
                    <span className="text-cyan-400 font-bold text-sm">{building.score}%</span>
                </div>
            </div>
        </button>
    );
}
