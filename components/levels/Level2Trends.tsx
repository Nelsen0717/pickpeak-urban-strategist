'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Server, Home, Building2, ArrowRight, BarChart3, Layers } from 'lucide-react';
import clsx from 'clsx';

interface TrendPoint {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    // Optional fields for compatibility
    value?: string;
    trend?: 'up' | 'down' | 'stable';
    x?: number;
    y?: number;
    category?: 'commercial' | 'residential';
}

const TRENDS: TrendPoint[] = [
    {
        id: 't1',
        title: '商用不動產總交易',
        value: '2,764 億元',
        description: '2024年創歷史新高，年增 46%。企業自用需求強勁，科技業為主力。',
        trend: 'up',
        icon: <BarChart3 className="w-6 h-6" />,
        x: 50, y: 50,
        category: 'commercial'
    },
    {
        id: 't2',
        title: 'AI 數據中心需求',
        value: '爆發性成長',
        description: 'Nvidia 等科技巨頭擴廠，帶動工業地產與廠辦需求。',
        trend: 'up',
        icon: <Server className="w-6 h-6" />,
        x: 20, y: 30,
        category: 'commercial'
    },
    {
        id: 't3',
        title: '住宅市場交易',
        value: '量縮價盤整',
        description: '受央行信用管制與囤房稅 2.0 影響，投資客退場，市場進入冷靜期。',
        trend: 'down',
        icon: <Home className="w-6 h-6" />,
        x: 80, y: 20,
        category: 'residential'
    },
    {
        id: 't4',
        title: 'ESG 綠色商辦',
        value: '租金溢價 10-15%',
        description: '外商與大型企業優先選擇符合 ESG 標準之辦公大樓，舊商辦面臨淘汰。',
        trend: 'up',
        icon: <Building2 className="w-6 h-6" />,
    },
    {
        id: 'retail',
        title: '零售店面',
        description: '疫情後消費回歸實體，體驗式消費帶動商圈人潮，優質店面租金看漲。',
        icon: <BarChart3 className="w-6 h-6" />,
    },
    {
        id: 'residential',
        title: '住宅市場',
        description: '央行信用管制與囤房稅2.0影響，投資客退場，市場進入冷靜期。',
        icon: <Home className="w-6 h-6" />,
    },
];

export default function Level2Trends() {
    const { addXp, completeLevel, unlockBadge, takeDamage } = useGameStore();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [discovered, setDiscovered] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    const questions = [
        {
            id: 'q1',
            text: "Raiser，我們需要找到一個受惠於「AI 算力需求」爆發的板塊。它通常位於桃園或高雄，且具備高電力供應。",
            targetId: 'industrial',
            hint: "尋找「工業地產 (Industrial)」"
        },
        {
            id: 'q2',
            text: "很好。接下來，尋找一個因為「遠距辦公」興起而面臨轉型的板塊。企業現在更看重它的「協作功能」。",
            targetId: 'office',
            hint: "尋找「辦公室 (Office)」"
        },
        {
            id: 'q3',
            text: "最後，消費者的體驗正在回歸實體。哪個板塊正受益於「體驗式消費」的復甦？",
            targetId: 'retail',
            hint: "尋找「零售 (Retail)」"
        }
    ];

    const currentQuestion = questions[currentQuestionIndex];

    const handleNodeClick = (id: string) => {
        if (currentQuestionIndex >= questions.length) return;

        if (id === currentQuestion.targetId) {
            // Correct
            setFeedback({ msg: "目標確認！數據分析正確。", type: 'success' });
            setDiscovered(prev => [...prev, id]);
            addXp(200);

            setTimeout(() => {
                setFeedback(null);
                if (currentQuestionIndex + 1 < questions.length) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    completeLevel('trends');
                    unlockBadge('Market Seer');
                }
            }, 1500);
        } else {
            // Wrong
            setFeedback({ msg: "目標錯誤！這不是我們現在要找的板塊。護盾受損！", type: 'error' });
            takeDamage(20);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 max-w-6xl mx-auto">
            {/* Header & Question */}
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Level 2: 市場趨勢偵探</h2>
                        <p className="text-slate-400">根據 Captain Mike 的指令，鎖定正確的市場板塊。</p>
                    </div>
                    <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-cyan-400 font-mono">
                        Progress: {currentQuestionIndex}/{questions.length}
                    </div>
                </div>

                {/* Captain Mike's Dialogue Box */}
                <div className="bg-slate-800/80 border border-cyan-500/30 p-6 rounded-xl flex gap-6 items-start shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                    <div className="w-16 h-16 flex-shrink-0 bg-slate-900 rounded-full border border-slate-600 overflow-hidden">
                        <Character type="mike" expression="serious" className="w-full h-full transform scale-125 translate-y-1" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-cyan-400 font-bold mb-1 text-sm">CAPTAIN MIKE</h3>
                        <p className="text-white text-lg leading-relaxed">
                            "{currentQuestion ? currentQuestion.text : "任務完成！所有趨勢數據已鎖定。"}"
                        </p>
                    </div>
                </div>

                {/* Feedback Message */}
                {/* Interactive Map */}
                <div className="flex-1 relative bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Central Node */}
                        <div className="relative z-10 w-32 h-32 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center shadow-2xl">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">2025</div>
                                <div className="text-xs text-slate-400">MARKET</div>
                            </div>
                        </div>

                        {/* Orbiting Nodes */}
                        {TRENDS.map((trend, index) => {
                            const angle = (index / TRENDS.length) * 2 * Math.PI - Math.PI / 2;
                            const radius = 220;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            const isDiscovered = discovered.includes(trend.id);

                            return (
                                <motion.button
                                    key={trend.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1, x, y }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleNodeClick(trend.id)}
                                    className={`absolute w-40 h-40 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 group z-20
                                    ${isDiscovered
                                            ? 'bg-cyan-900/80 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                                            : 'bg-slate-800/80 border-slate-600 hover:border-cyan-400 hover:scale-110 hover:z-30 cursor-pointer'
                                        } border-2 backdrop-blur-sm`}
                                >
                                    <div className={isDiscovered ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}>
                                        {trend.icon}
                                    </div>
                                    <div className="text-center">
                                        <div className={`font-bold ${isDiscovered ? 'text-white' : 'text-slate-300'}`}>{trend.title}</div>
                                        {isDiscovered && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-cyan-200 mt-2"
                                            >
                                                {trend.description}
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}

                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            {TRENDS.map((trend, index) => {
                                const angle = (index / TRENDS.length) * 2 * Math.PI - Math.PI / 2;
                                const radius = 220;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                return (
                                    <line
                                        key={trend.id}
                                        x1="50%" y1="50%"
                                        x2={`calc(50% + ${x}px)`}
                                        y2={`calc(50% + ${y}px)`}
                                        stroke={discovered.includes(trend.id) ? "#06b6d4" : "#334155"}
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                    />
                                );
                            })}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
