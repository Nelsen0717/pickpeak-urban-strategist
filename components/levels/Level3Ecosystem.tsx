'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, Reorder } from 'framer-motion';
import { ArrowRight, CheckCircle, Building, Paintbrush, Key, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

interface ServiceItem {
    id: string;
    label: string;
    description: string;
    stage: 'acquisition' | 'renovation' | 'leasing' | 'management';
    icon: React.ReactNode;
}

const SERVICES: ServiceItem[] = [
    { id: 's1', label: '資產收購評估', description: '評估潛力標的，計算投報率', stage: 'acquisition', icon: <Building className="w-5 h-5" /> },
    { id: 's2', label: '空間設計與裝修', description: '提升資產價值，符合市場需求', stage: 'renovation', icon: <Paintbrush className="w-5 h-5" /> },
    { id: 's3', label: '招商與租賃', description: '尋找優質租戶，簽訂合約', stage: 'leasing', icon: <Key className="w-5 h-5" /> },
    { id: 's4', label: '物業與設施管理', description: '維護營運，提供租戶服務', stage: 'management', icon: <ShieldCheck className="w-5 h-5" /> },
];

const STAGES = [
    { id: 'acquisition', label: '1. 獲取資產 (Acquire)' },
    { id: 'renovation', label: '2. 增值改造 (Enhance)' },
    { id: 'leasing', label: '3. 招商運營 (Operate)' },
    { id: 'management', label: '4. 永續管理 (Manage)' },
];

export default function Level3Ecosystem() {
    const { addXp, completeLevel, setCurrentLevelId, setView, unlockBadge } = useGameStore();
    const [items, setItems] = useState<ServiceItem[]>([...SERVICES].sort(() => Math.random() - 0.5)); // Shuffle initially
    const [isCorrect, setIsCorrect] = useState(false);

    const checkOrder = (currentItems: ServiceItem[]) => {
        const correctOrder = ['acquisition', 'renovation', 'leasing', 'management'];
        const currentOrder = currentItems.map(i => i.stage);

        const isMatch = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
        if (isMatch && !isCorrect) {
            setIsCorrect(true);
            addXp(300);
            completeLevel('ecosystem');
            unlockBadge('Network Weaver');
            // setView('hub') handled by GameEngine overlay
        }
    };

    useEffect(() => {
        checkOrder(items);
    }, [items]);

    return (
        <div className="flex flex-col items-center space-y-8 w-full max-w-4xl">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">Level 3: 方睿服務生態系 (The Ziroom Model)</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    如同 <span className="text-cyan-400 font-bold">Ziroom (自如)</span> 的全鏈條資產管理模式，
                    <br />
                    方睿不僅提供數據，更深入資產的完整生命週期。
                    <br />
                    <span className="text-white font-bold mt-2 block">請拖曳下方服務卡片，將其排列成正確的「資產價值鏈」順序。</span>
                </p>
            </div>

            <div className="flex gap-4 w-full overflow-x-auto pb-4 justify-center">
                <Reorder.Group axis="x" values={items} onReorder={setItems} className="flex gap-4">
                    {items.map((item) => (
                        <Reorder.Item key={item.id} value={item}>
                            <div className={clsx(
                                "w-56 h-72 rounded-xl p-6 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing border-2 transition-colors shadow-xl",
                                isCorrect ? "bg-slate-800 border-green-500" : "bg-slate-800 border-slate-600 hover:border-cyan-500"
                            )}>
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-cyan-400">
                                    {item.icon}
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-bold text-white">{item.label}</h3>
                                    <p className="text-sm text-slate-400">{item.description}</p>
                                </div>
                                <div className="text-xs font-mono text-slate-600 uppercase">
                                    DRAG TO REORDER
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>

            {/* Stage Indicators (Static Reference) */}
            <div className="flex justify-between w-full max-w-3xl px-8 pt-8 border-t border-slate-800">
                {STAGES.map((stage, index) => (
                    <div key={stage.id} className="flex flex-col items-center gap-2 opacity-50">
                        <div className="w-4 h-4 rounded-full bg-slate-600" />
                        <span className="text-xs font-mono text-slate-400">{stage.label}</span>
                    </div>
                ))}
            </div>

            {isCorrect && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 bg-slate-900/90 p-8 rounded-2xl border border-green-500/30 shadow-2xl backdrop-blur-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <div>
                        <h3 className="text-2xl font-bold text-white">生態系閉環達成！</h3>
                        <p className="text-slate-300 mt-2">
                            您已掌握從「獲取」到「管理」的全價值鏈服務。
                            <br />這就是方睿科技為客戶創造價值的核心引擎。
                        </p>
                    </div>
                    <button
                        onClick={() => setCurrentLevelId('pickpeak')}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                    >
                        進入最終試煉：PickPeak <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </div>
    );
}
