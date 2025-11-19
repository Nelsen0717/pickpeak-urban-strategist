'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Zap, Box, CheckCircle, BarChart2, Users, History, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface Building {
    id: string;
    name: string;
    power: number;
    load: number;
    location: string;
    suitable: boolean;
    tenants: string[]; // CoStar style data
    lastTransaction: string; // CoStar style data
    vacancyRate: number;
    specs: {
        area: string;
        floors: number;
        age: number;
        certification: string;
    };
    flaw: string;
}

const BUILDINGS: Building[] = [
    {
        id: 'b1',
        name: '台北 101',
        power: 3000,
        load: 500,
        location: '信義區',
        suitable: false,
        tenants: ['Google', 'KPMG', 'TWSE'],
        lastTransaction: '無交易紀錄 (只租不售)',
        vacancyRate: 2.5,
        specs: {
            area: '110,000 坪',
            floors: 101,
            age: 20,
            certification: 'LEED Platinum'
        },
        flaw: '租金過高，不符合成本效益'
    },
    {
        id: 'b2',
        name: '南港軟體園區 H棟',
        power: 6000,
        load: 1200,
        location: '南港區',
        suitable: true,
        tenants: ['Intel', 'AMD', 'Siemens'],
        lastTransaction: '2023 Q4 / 28億 TWD',
        vacancyRate: 5.2,
        specs: {
            area: '25,000 坪',
            floors: 20,
            age: 5,
            certification: 'EEWH Gold'
        },
        flaw: '無重大缺陷'
    },
    {
        id: 'b3',
        name: '內湖科技中心',
        power: 4000,
        load: 800,
        location: '內湖區',
        suitable: false,
        tenants: ['Nvidia', 'MediaTek', 'Dell'],
        lastTransaction: '2021 Q2 / 15億 TWD',
        vacancyRate: 12.0,
        specs: {
            area: '18,000 坪',
            floors: 12,
            age: 15,
            certification: 'None'
        },
        flaw: '電力供應不穩，需額外建置變電站'
    },
];

export default function Level4PickPeak() {
    const { addXp, completeLevel, setCurrentLevelId, unlockBadge, addItem, setView, resetProgress } = useGameStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'specs' | 'tenants' | 'history'>('specs');
    const [success, setSuccess] = useState(false);
    const [scannedBuildings, setScannedBuildings] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false); // Added for scan animation

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleScan = () => {
        if (!selectedBuilding) return;

        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            if (!scannedBuildings.includes(selectedBuilding.id)) {
                setScannedBuildings(prev => [...prev, selectedBuilding.id]);
            }
        }, 1500);
    };

    const handleConfirm = () => {
        const building = BUILDINGS.find(b => b.id === selectedId);
        if (!building) return;

        // Check if scanned
        if (!scannedBuildings.includes(building.id)) {
            alert("請先使用光譜掃描儀檢測潛在風險，以避免未知的缺陷！");
            return; // Prevent confirmation without scanning
        }

        if (building.suitable) {
            setSuccess(true);
            addXp(2000);
            completeLevel('pickpeak');
            unlockBadge('Galactic Strategist');
            addItem('titan_dossier');
            // setView('hub') handled by GameEngine overlay
        } else {
            alert("此標的規格不符合 Titan Tech 的高算力需求，請重新評估。");
        }
    };

    const selectedBuilding = BUILDINGS.find(b => b.id === selectedId);

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-2xl mx-auto">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50"
                >
                    <CheckCircle className="w-16 h-16 text-white" />
                </motion.div>

                <div className="space-y-4">
                    <h2 className="text-5xl font-bold text-white tracking-tight">任務圓滿達成！</h2>
                    <p className="text-slate-300 text-xl">
                        恭喜您！您已成功運用 <span className="text-cyan-400 font-bold">PickPeak</span> 的深度數據，
                        <br />為客戶做出了最精準的決策。
                    </p>
                </div>

                <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 w-full">
                    <div className="text-center">
                        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-green-400">決策正確！</h2>
                        <p className="text-slate-300 mt-2">南港軟體園區完全符合 Titan Tech 的需求。</p>
                        <div className="mt-4 px-4 py-2 bg-purple-900/50 border border-purple-500 rounded-lg text-purple-400 text-sm font-bold animate-pulse inline-block">
                            獲得物品: Titan Dossier (泰坦機密檔案)
                        </div>
                    </div>

                    <p className="text-cyan-400 font-mono text-sm mb-2">NEW RANK ACHIEVED</p>
                    <h3 className="text-3xl font-bold text-white">Galactic Strategist (銀河策略長)</h3>
                </div>

                <button
                    onClick={() => resetProgress()}
                    className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-colors"
                >
                    返回艦橋 (重新開始)
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 w-full max-w-5xl h-[600px]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">PickPeak 智能決策中樞</h2>
                    <p className="text-slate-400">客戶: <span className="text-cyan-400 font-bold">Titan Tech</span> | 需求: 高電力 (&gt;5000kW) & 高載重 (&gt;1000kg)</p>
                </div>
            </div>

            <div className="flex gap-6 h-full">
                {/* List View */}
                <div className="w-1/3 space-y-4 overflow-y-auto pr-2">
                    {BUILDINGS.map((building) => (
                        <motion.div
                            key={building.id}
                            className={clsx(
                                "p-4 rounded-xl border-2 cursor-pointer transition-all",
                                selectedId === building.id ? "bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/10" : "bg-slate-900 border-slate-700 hover:border-slate-500"
                            )}
                            onClick={() => handleSelect(building.id)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{building.name}</h3>
                                <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{building.location}</span>
                            </div>
                            <div className="text-sm text-slate-400 flex gap-4">
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {building.power}kW</span>
                                <span className="flex items-center gap-1"><Box className="w-3 h-3" /> {building.load}kg</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Detail View (Dashboard) */}
                <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex flex-col">
                    {selectedBuilding ? (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-slate-800 bg-slate-800/30">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-bold text-white">{selectedBuilding.name}</h2>
                                    <button
                                        onClick={handleConfirm}
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-cyan-500/20"
                                    >
                                        確認選址
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-slate-800">
                                <button onClick={() => setActiveTab('specs')} className={clsx("flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2", activeTab === 'specs' ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50" : "text-slate-500 hover:text-white")}>
                                    <FileText className="w-4 h-4" /> 建物規格
                                </button>
                                <button onClick={() => setActiveTab('tenants')} className={clsx("flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2", activeTab === 'tenants' ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50" : "text-slate-500 hover:text-white")}>
                                    <Users className="w-4 h-4" /> 租戶分析
                                </button>
                                <button onClick={() => setActiveTab('history')} className={clsx("flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2", activeTab === 'history' ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50" : "text-slate-500 hover:text-white")}>
                                    <History className="w-4 h-4" /> 交易歷史
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 min-h-[300px]">
                                {activeTab === 'specs' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                                                <div className="text-slate-500 text-xs">總樓地板面積</div>
                                                <div className="text-white font-mono">{selectedBuilding.specs.area}</div>
                                            </div>
                                            <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                                                <div className="text-slate-500 text-xs">樓層</div>
                                                <div className="text-white font-mono">{selectedBuilding.specs.floors}F</div>
                                            </div>
                                            <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                                                <div className="text-slate-500 text-xs">屋齡</div>
                                                <div className="text-white font-mono">{selectedBuilding.specs.age}年</div>
                                            </div>
                                            <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                                                <div className="text-slate-500 text-xs">認證</div>
                                                <div className="text-cyan-400 font-mono">{selectedBuilding.specs.certification}</div>
                                            </div>
                                        </div>

                                        {/* Hidden Flaws (Only visible after scan) */}
                                        {scannedBuildings.includes(selectedBuilding.id) ? (
                                            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg animate-pulse">
                                                <div className="flex items-center gap-2 text-red-400 mb-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    <span className="font-bold text-sm">結構掃描報告</span>
                                                </div>
                                                <p className="text-red-200 text-sm">{selectedBuilding.flaw}</p>
                                            </div>
                                        ) : (
                                            <div className="mt-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 gap-2">
                                                <Search className="w-6 h-6 opacity-50" />
                                                <span className="text-xs">使用光譜掃描儀檢測潛在風險</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'tenants' && (
                                    <div className="space-y-3">
                                        {selectedBuilding.tenants.map((tenant, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-700">
                                                <span className="text-slate-300">{tenant}</span>
                                                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">租約至 2028</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="w-24 text-slate-500">2020 Q4</div>
                                            <div className="text-white">交易金額 $28.5億</div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="w-24 text-slate-500">2015 Q2</div>
                                            <div className="text-white">交易金額 $22.1億</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
