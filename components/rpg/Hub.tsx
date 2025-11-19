'use client';

import React, { useState } from 'react';
import { useGameStore, LevelId } from '@/lib/store';
import { motion } from 'framer-motion';
import { Map, User, BarChart2, Coffee, Lock, CheckCircle, Play, Book, Search, FileText, Award, Eye, Share2, Globe, Crown } from 'lucide-react';
import Character from './Character';
import AvatarEditor from './AvatarEditor';
import clsx from 'clsx';

export default function Hub() {
    const {
        employeeId, level, xp, avatar,
        completedLevels, setCurrentLevelId, setView,
        inventory, badges, companionUnlocked
    } = useGameStore();

    const [activeTab, setActiveTab] = useState<'missions' | 'barracks' | 'data' | 'lounge'>('missions');

    const levels: { id: LevelId; title: string; desc: string; req?: string }[] = [
        { id: 'basics', title: 'Level 1: 資產識別', desc: '學習商用與住宅資產的區別。' },
        { id: 'trends', title: 'Level 2: 市場趨勢', desc: '分析 2024 年市場數據異象。' },
        { id: 'ecosystem', title: 'Level 3: 生態系', desc: '掌握 Ziroom Model 資產全週期。' },
        { id: 'pickpeak', title: 'Level 4: 決策中樞', desc: '使用 CoStar Model 為客戶選址。' },
        { id: 'negotiation', title: 'Level 5: 終極談判', desc: '與科技巨頭 CEO 進行最終對決。' },
    ];

    const handleMissionSelect = (id: LevelId) => {
        setCurrentLevelId(id);
        setView('level');
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 h-[80vh] flex gap-6">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-4 flex flex-col gap-2">
                <div className="mb-6 text-center">
                    <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full overflow-hidden border-2 border-cyan-500 mb-2">
                        <Character type="player" avatar={avatar} className="w-full h-full transform translate-y-2" />
                    </div>
                    <h2 className="font-bold text-white">{employeeId}</h2>
                    <p className="text-xs text-cyan-400">LV.{level} RAISER</p>
                </div>

                <NavButton icon={<Map />} label="指揮中心" subLabel="Missions" active={activeTab === 'missions'} onClick={() => setActiveTab('missions')} />
                <NavButton icon={<User />} label="兵營" subLabel="Barracks" active={activeTab === 'barracks'} onClick={() => setActiveTab('barracks')} />
                <NavButton icon={<BarChart2 />} label="數據中心" subLabel="Data" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
                <NavButton icon={<Coffee />} label="休息室" subLabel="Lounge" active={activeTab === 'lounge'} onClick={() => setActiveTab('lounge')} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-slate-900/50 backdrop-blur border border-slate-700 rounded-2xl p-8 overflow-y-auto relative">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {activeTab === 'missions' && (
                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Map className="text-cyan-400" /> 任務選擇
                            </h2>
                            <GuidanceBubble />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {levels.map((lvl, index) => {
                                const isUnlocked = index === 0 || completedLevels.includes(levels[index - 1].id);
                                const isCompleted = completedLevels.includes(lvl.id);

                                return (
                                    <button
                                        key={lvl.id}
                                        disabled={!isUnlocked}
                                        onClick={() => handleMissionSelect(lvl.id)}
                                        className={clsx(
                                            "p-6 rounded-xl border-2 text-left transition-all relative overflow-hidden group",
                                            !isUnlocked ? "bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed" :
                                                isCompleted ? "bg-slate-800/80 border-green-500/50 hover:border-green-400" :
                                                    "bg-slate-800 border-cyan-500 hover:bg-slate-700 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={clsx("font-bold text-lg", isCompleted ? "text-green-400" : "text-white")}>{lvl.title}</h3>
                                            {isCompleted ? <CheckCircle className="w-5 h-5 text-green-500" /> : !isUnlocked ? <Lock className="w-5 h-5 text-slate-600" /> : <Play className="w-5 h-5 text-cyan-400 animate-pulse" />}
                                        </div>
                                        <p className="text-slate-400 text-sm">{lvl.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'barracks' && (
                    <div className="h-full flex flex-col relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <User className="text-cyan-400" /> 角色自訂
                        </h2>
                        <div className="flex-1 flex justify-center">
                            <AvatarEditor onComplete={() => { }} />
                        </div>
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="space-y-8 relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                            <BarChart2 className="text-cyan-400" /> 數據中心
                        </h2>

                        <div className="grid grid-cols-3 gap-4">
                            <StatCard label="等級" value={level.toString()} />
                            <StatCard label="總經驗值" value={xp.toString()} />
                            <StatCard label="總經驗值" value={xp.toString()} />
                            <StatCard label="完成任務" value={`${completedLevels.length}/5`} />
                        </div>

                        {/* Graduation Certificate Button */}
                        {completedLevels.length >= 5 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-500/50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                        <Crown className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">所有訓練已完成</h3>
                                        <p className="text-cyan-300 text-sm">您已具備銀河策略家資格</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setView('certificate')}
                                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                                >
                                    <Award className="w-5 h-5" />
                                    領取結業證書
                                </button>
                            </motion.div>
                        )}

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">持有物品</h3>
                            <div className="flex gap-4">
                                {inventory.length === 0 && <p className="text-slate-500">暫無物品</p>}
                                {inventory.map(item => {
                                    let Icon = Lock;
                                    let label = item;
                                    if (item === 'spectral_scanner') { Icon = Search; label = "光譜掃描儀"; }
                                    if (item === 'titan_dossier') { Icon = FileText; label = "泰坦機密檔案"; }

                                    return (
                                        <div key={item} className="group relative px-4 py-3 bg-slate-800 rounded-xl border border-slate-600 hover:border-cyan-500 transition-all flex items-center gap-3">
                                            <div className="p-2 bg-slate-900 rounded-lg">
                                                <Icon className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <span className="text-cyan-100 font-medium">{label}</span>
                                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">獲得徽章</h3>
                            <div className="flex flex-wrap gap-4">
                                {badges.length === 0 && <p className="text-slate-500">暫無徽章</p>}
                                {badges.map(badge => {
                                    let color = "text-yellow-400";
                                    let bg = "bg-yellow-900/20";
                                    let border = "border-yellow-500/50";
                                    let Icon = Award;

                                    if (badge === 'Rookie Analyst') { color = "text-blue-400"; bg = "bg-blue-900/20"; border = "border-blue-500/50"; }
                                    if (badge === 'Market Seer') { color = "text-purple-400"; bg = "bg-purple-900/20"; border = "border-purple-500/50"; Icon = Eye; }
                                    if (badge === 'Network Weaver') { color = "text-green-400"; bg = "bg-green-900/20"; border = "border-green-500/50"; Icon = Share2; }
                                    if (badge === 'Galactic Strategist') { color = "text-cyan-400"; bg = "bg-cyan-900/20"; border = "border-cyan-500/50"; Icon = Globe; }
                                    if (badge === 'Master Negotiator') { color = "text-rose-400"; bg = "bg-rose-900/20"; border = "border-rose-500/50"; Icon = Crown; }

                                    return (
                                        <div key={badge} className={`px-4 py-2 ${bg} rounded-lg border ${border} ${color} font-bold text-sm flex items-center gap-2 shadow-lg`}>
                                            <Icon className="w-4 h-4" />
                                            {badge}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Book className="w-5 h-5 text-cyan-400" /> 方睿小百科 (Codex)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CodexEntry term="AI Data Centers (AI 數據中心)" def="2024-2025 台灣商用不動產最強驅動力。受惠於台積電與全球 AI 巨頭投資，桃園、高雄等地的大型工業地產需求激增，租金與地價雙漲。" />
                                <CodexEntry term="ESG & Green Premium (綠色溢價)" def="全球趨勢。符合 ESG 標準的綠建築 (LEED/EEWH) 在 2025 年將享有更高的租金溢價與資產價值，非合規資產面臨「棕色折價」風險。" />
                                <CodexEntry term="Ziroom (自如)" def="源自中國的長租公寓模式，強調資產增值與標準化管理。在遊戲中代表「全週期資產管理」的能力。" />
                                <CodexEntry term="CoStar" def="全球最大的商用不動產資訊平台。PickPeak 的原型，提供市場數據、分析與交易資訊。" />
                                <CodexEntry term="Cap Rate (資本化率)" def="不動產投資報酬率的指標。計算公式：淨營業收入 (NOI) / 資產價值。數值越高，風險/報酬通常越高。" />
                                <CodexEntry term="PropTech (房地產科技)" def="2025 關鍵字。大數據選址、AI 估價、VR 看屋等技術正在重塑傳統不動產顧問服務的價值鏈。" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'lounge' && (
                    <div className="h-full flex flex-col items-center justify-center text-center relative z-10 space-y-6">
                        <div className="flex gap-8">
                            <div className="w-32 h-32">
                                <Character type="mike" expression="happy" className="w-full h-full" />
                            </div>
                            {companionUnlocked && (
                                <div className="w-32 h-32">
                                    <Character type="bit" className="w-full h-full" />
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 max-w-lg">
                            <p className="text-lg text-slate-300">
                                "休息是為了走更長遠的路，Raiser。這裡的咖啡是全宇宙最棒的。"
                            </p>
                            <p className="text-sm text-slate-500 mt-2">- Captain Mike</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function GuidanceBubble() {
    const { completedLevels } = useGameStore();

    let message = "Raiser，先去執行 Level 1 吧！";
    if (completedLevels.includes('basics')) message = "Level 2 的市場趨勢數據已經準備好了。";
    if (completedLevels.includes('trends')) message = "Level 3 需要你對生態系有深入的理解。";
    if (completedLevels.includes('ecosystem')) message = "Level 4 是關鍵。去 PickPeak 展現你的實力。";
    if (completedLevels.includes('pickpeak')) message = "Level 5 最終決戰。準備好面對 CEO 了嗎？";
    if (completedLevels.includes('negotiation')) message = "你已經是傳奇了，Raiser。隨時可以重玩關卡。";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-3 bg-cyan-900/30 border border-cyan-500/30 px-4 py-2 rounded-full"
        >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-cyan-500">
                <Character type="mike" expression="neutral" className="w-full h-full transform scale-150 translate-y-1" />
            </div>
            <span className="text-cyan-300 text-sm font-medium">{message}</span>
        </motion.div>
    );
}

function CodexEntry({ term, def }: { term: string, def: string }) {
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-colors">
            <h4 className="text-cyan-400 font-bold mb-2">{term}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{def}</p>
        </div>
    );
}

function NavButton({ icon, label, subLabel, active, onClick }: { icon: React.ReactNode, label: string, subLabel: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full p-3 rounded-xl flex items-center gap-3 transition-all",
                active ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
        >
            {icon}
            <div className="text-left">
                <div className="font-bold leading-none">{label}</div>
                <div className={clsx("text-[10px] font-mono mt-1", active ? "text-cyan-200" : "text-slate-500")}>{subLabel}</div>
            </div>
        </button>
    );
}

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );
}
