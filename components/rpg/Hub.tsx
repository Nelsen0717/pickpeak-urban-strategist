'use client';

import React, { useState } from 'react';
import { useGameStore, ChapterId, CHAPTER_INFO } from '@/lib/store';
import { motion } from 'framer-motion';
import { Map, User, BarChart2, Coffee, Lock, CheckCircle, Play, Book, Search, FileText, Award, Eye, Share2, Globe, Crown, Database, Users, Briefcase, Building2, Footprints, Rocket, Sparkles, Target, TrendingUp, Network } from 'lucide-react';
import Character from './Character';
import AvatarEditor from './AvatarEditor';
import clsx from 'clsx';

// Chapter order for progression (8 chapters total)
const CHAPTER_ORDER: ChapterId[] = [
    'prologue',
    'chapter1-migration',
    'chapter2-moat',
    'chapter3-groundforce',
    'chapter4-pickpeak',
    'chapter5-ecosystem',
    'chapter6-negotiation',
    'epilogue'
];

export default function Hub() {
    const {
        employeeId, level, xp, avatar, department,
        completedChapters, setCurrentChapterId, setView,
        inventory, badges, knowledge, teamMembers,
        marketInsights, companyInsights, productInsights
    } = useGameStore();

    const [activeTab, setActiveTab] = useState<'missions' | 'barracks' | 'data' | 'codex'>('missions');
    const [codexSearch, setCodexSearch] = useState('');
    const [expandedKnowledge, setExpandedKnowledge] = useState<string | null>(null);

    const handleMissionSelect = (id: ChapterId) => {
        setCurrentChapterId(id);
        setView('chapter');
    };

    // Check if chapter is unlocked
    const isChapterUnlocked = (chapterId: ChapterId): boolean => {
        if (chapterId === 'prologue') return true; // Prologue is always unlocked
        const index = CHAPTER_ORDER.indexOf(chapterId);
        if (index <= 0) return false;
        return completedChapters.includes(CHAPTER_ORDER[index - 1]);
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
                    {department && (
                        <p className="text-[10px] text-slate-400 mt-1">{department.toUpperCase()}</p>
                    )}
                </div>

                {/* Insight Bars */}
                <div className="mb-4 px-2 space-y-2">
                    <InsightBar label="市場洞察" value={marketInsights} color="cyan" />
                    <InsightBar label="公司理解" value={companyInsights} color="purple" />
                    <InsightBar label="產品熟悉" value={productInsights} color="green" />
                </div>

                <NavButton icon={<Map />} label="任務中心" subLabel="Missions" active={activeTab === 'missions'} onClick={() => setActiveTab('missions')} />
                <NavButton icon={<User />} label="角色編輯" subLabel="Character" active={activeTab === 'barracks'} onClick={() => setActiveTab('barracks')} />
                <NavButton icon={<BarChart2 />} label="數據中心" subLabel="Progress" active={activeTab === 'data'} onClick={() => setActiveTab('data')} />
                <NavButton icon={<Book />} label="知識庫" subLabel="Codex" active={activeTab === 'codex'} onClick={() => setActiveTab('codex')} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-slate-900/50 backdrop-blur border border-slate-700 rounded-2xl p-8 overflow-y-auto relative">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {activeTab === 'missions' && (
                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Map className="text-cyan-400" /> 章節選擇
                            </h2>
                            <GuidanceBubble />
                        </div>

                        {/* PROLOGUE: 序章 */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-mono text-emerald-400 tracking-wider">PROLOGUE // 序章 - WELCOME</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <ChapterCard
                                    chapterId="prologue"
                                    isUnlocked={isChapterUnlocked('prologue')}
                                    isCompleted={completedChapters.includes('prologue')}
                                    onSelect={handleMissionSelect}
                                />
                            </div>
                        </div>

                        {/* ACT 1: 覺醒 */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-mono text-cyan-400 tracking-wider">ACT 1 // 覺醒 - WHY NOW</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <ChapterCard
                                    chapterId="chapter1-migration"
                                    isUnlocked={isChapterUnlocked('chapter1-migration')}
                                    isCompleted={completedChapters.includes('chapter1-migration')}
                                    onSelect={handleMissionSelect}
                                />
                            </div>
                        </div>

                        {/* ACT 2: 認知 */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-mono text-purple-400 tracking-wider">ACT 2 // 認知 - WHY US</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <ChapterCard
                                    chapterId="chapter2-moat"
                                    isUnlocked={isChapterUnlocked('chapter2-moat')}
                                    isCompleted={completedChapters.includes('chapter2-moat')}
                                    onSelect={handleMissionSelect}
                                />
                                <ChapterCard
                                    chapterId="chapter3-groundforce"
                                    isUnlocked={isChapterUnlocked('chapter3-groundforce')}
                                    isCompleted={completedChapters.includes('chapter3-groundforce')}
                                    onSelect={handleMissionSelect}
                                />
                                <ChapterCard
                                    chapterId="chapter4-pickpeak"
                                    isUnlocked={isChapterUnlocked('chapter4-pickpeak')}
                                    isCompleted={completedChapters.includes('chapter4-pickpeak')}
                                    onSelect={handleMissionSelect}
                                />
                            </div>
                        </div>

                        {/* ACT 3: 實戰 */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-mono text-green-400 tracking-wider">ACT 3 // 實戰 - HOW WE WIN</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <ChapterCard
                                    chapterId="chapter5-ecosystem"
                                    isUnlocked={isChapterUnlocked('chapter5-ecosystem')}
                                    isCompleted={completedChapters.includes('chapter5-ecosystem')}
                                    onSelect={handleMissionSelect}
                                />
                                <ChapterCard
                                    chapterId="chapter6-negotiation"
                                    isUnlocked={isChapterUnlocked('chapter6-negotiation')}
                                    isCompleted={completedChapters.includes('chapter6-negotiation')}
                                    onSelect={handleMissionSelect}
                                />
                            </div>
                        </div>

                        {/* Epilogue */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-mono text-yellow-400 tracking-wider">FINALE // 終章</h3>
                            <ChapterCard
                                chapterId="epilogue"
                                isUnlocked={isChapterUnlocked('epilogue')}
                                isCompleted={completedChapters.includes('epilogue')}
                                onSelect={handleMissionSelect}
                            />
                        </div>

                        {/* Certificate Access - Show after completing epilogue */}
                        {completedChapters.includes('epilogue') && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-6 bg-gradient-to-r from-amber-900/30 via-yellow-900/20 to-amber-900/30 rounded-xl border-2 border-yellow-500/50 relative overflow-hidden"
                            >
                                {/* Decorative stars */}
                                <div className="absolute top-2 right-2 text-yellow-500 animate-pulse">✦</div>
                                <div className="absolute bottom-2 left-4 text-yellow-500/50 animate-pulse delay-150">✦</div>
                                <div className="absolute top-4 left-8 text-yellow-500/30 animate-pulse delay-300">✦</div>

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                            <Award className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-yellow-400">🎉 恭喜完成訓練！</h3>
                                            <p className="text-amber-300/80 text-sm">你的銀河執照已準備就緒</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setView('certificate')}
                                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-500/30 transition-all flex items-center gap-2 hover:scale-105"
                                    >
                                        <Crown className="w-5 h-5" />
                                        領取銀河執照
                                    </button>
                                </div>
                            </motion.div>
                        )}
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
                            <BarChart2 className="text-cyan-400" /> 進度追蹤
                        </h2>

                        <div className="grid grid-cols-3 gap-4">
                            <StatCard label="等級" value={level.toString()} />
                            <StatCard label="總經驗值" value={xp.toString()} />
                            <StatCard label="完成章節" value={`${completedChapters.length}/8`} />
                        </div>

                        {/* Graduation Certificate Button */}
                        {completedChapters.includes('epilogue') && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl border border-cyan-500/50 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                        <Crown className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">訓練完成！</h3>
                                        <p className="text-cyan-300 text-sm">您已正式成為方睿艦隊成員</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setView('certificate')}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 hover:scale-105"
                                >
                                    <Award className="w-5 h-5" />
                                    查看銀河執照
                                </button>
                            </motion.div>
                        )}

                        {/* Team Members Unlocked */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-cyan-400" /> 認識的團隊成員
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {teamMembers.filter(m => m.unlocked).map(member => (
                                    <div key={member.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CompanyBadge company={member.company} />
                                            <span className="text-white font-bold text-sm">{member.name}</span>
                                        </div>
                                        <p className="text-xs text-slate-400">{member.role}</p>
                                        <p className="text-[10px] text-cyan-400 mt-1">{member.specialty}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Badges */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">獲得徽章</h3>
                            <div className="flex flex-wrap gap-4">
                                {badges.length === 0 && <p className="text-slate-500">暫無徽章</p>}
                                {badges.map(badge => (
                                    <BadgeItem key={badge} badge={badge} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'codex' && (
                    <div className="space-y-6 relative z-10">
                        {/* Header with Search */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Book className="text-cyan-400" /> 知識庫
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="搜尋知識..."
                                    value={codexSearch}
                                    onChange={(e) => setCodexSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm w-full md:w-64 focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Knowledge Stats */}
                        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 mb-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-cyan-400">{knowledge.filter(k => k.category === 'market').length}</p>
                                <p className="text-xs text-slate-400">市場洞察</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-400">{knowledge.filter(k => k.category === 'company').length}</p>
                                <p className="text-xs text-slate-400">公司認知</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-400">{knowledge.filter(k => k.category === 'product').length}</p>
                                <p className="text-xs text-slate-400">產品知識</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-400">{knowledge.filter(k => k.category === 'strategy').length}</p>
                                <p className="text-xs text-slate-400">策略思維</p>
                            </div>
                        </div>

                        {/* Knowledge Items by Category */}
                        {(['market', 'company', 'product', 'strategy'] as const).map(category => {
                            const categoryKnowledge = knowledge.filter(k => {
                                if (k.category !== category) return false;
                                if (!codexSearch) return true;
                                return k.title.toLowerCase().includes(codexSearch.toLowerCase()) ||
                                    k.content.toLowerCase().includes(codexSearch.toLowerCase());
                            });
                            if (categoryKnowledge.length === 0) return null;

                            const categoryLabels = {
                                market: { name: '市場洞察', icon: <BarChart2 className="w-5 h-5" />, color: 'cyan' },
                                company: { name: '公司認知', icon: <Building2 className="w-5 h-5" />, color: 'purple' },
                                product: { name: '產品知識', icon: <Database className="w-5 h-5" />, color: 'green' },
                                strategy: { name: '策略思維', icon: <Briefcase className="w-5 h-5" />, color: 'yellow' },
                            };

                            const label = categoryLabels[category];

                            return (
                                <div key={category}>
                                    <h3 className={`text-lg font-bold text-${label.color}-400 mb-3 flex items-center gap-2`}>
                                        {label.icon} {label.name}
                                        <span className="text-xs text-slate-500 font-normal ml-2">({categoryKnowledge.length})</span>
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {categoryKnowledge.map(item => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`bg-slate-800/50 rounded-lg border transition-all cursor-pointer ${
                                                    expandedKnowledge === item.id
                                                        ? `border-${label.color}-500/50 shadow-lg`
                                                        : 'border-slate-700 hover:border-slate-600'
                                                }`}
                                                onClick={() => setExpandedKnowledge(expandedKnowledge === item.id ? null : item.id)}
                                            >
                                                <div className="p-4 flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className={`text-${label.color}-400 font-bold`}>{item.title}</h4>
                                                        <p className={`text-slate-400 text-sm mt-1 ${
                                                            expandedKnowledge === item.id ? '' : 'line-clamp-2'
                                                        }`}>
                                                            {item.content}
                                                        </p>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: expandedKnowledge === item.id ? 180 : 0 }}
                                                        className="ml-3 text-slate-500"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </motion.div>
                                                </div>
                                                {expandedKnowledge === item.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="px-4 pb-4 pt-2 border-t border-slate-700"
                                                    >
                                                        <p className="text-xs text-slate-500">
                                                            解鎖於: {CHAPTER_INFO[item.unlockedAt as ChapterId]?.title || item.unlockedAt}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {knowledge.length === 0 && (
                            <div className="text-center text-slate-500 py-12">
                                <Book className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>完成章節以解鎖知識項目</p>
                            </div>
                        )}

                        {codexSearch && knowledge.filter(k =>
                            k.title.toLowerCase().includes(codexSearch.toLowerCase()) ||
                            k.content.toLowerCase().includes(codexSearch.toLowerCase())
                        ).length === 0 && knowledge.length > 0 && (
                            <div className="text-center text-slate-500 py-8">
                                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>沒有找到符合「{codexSearch}」的知識</p>
                            </div>
                        )}

                        {/* Static Codex Entries */}
                        <div className="border-t border-slate-800 pt-8">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-slate-400" />
                                基礎術語
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CodexEntry term="CoStar" def="全球最大的商用不動產資訊平台，市值 $350 億美元。FUNRAISE 的原型與對標對象。" />
                                <CodexEntry term="PropTech (房地產科技)" def="2025 關鍵字。大數據選址、AI 估價、VR 看屋等技術正在重塑傳統不動產顧問服務的價值鏈。" />
                                <CodexEntry term="Cap Rate (資本化率)" def="不動產投資報酬率的指標。計算公式：淨營業收入 (NOI) / 資產價值。數值越高，風險/報酬通常越高。" />
                                <CodexEntry term="Ziroom Model (自如模式)" def="從空間出發的 Total Solution —— 從找辦公室到裝潢、設備、服務的全週期管理。" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Chapter Card Component
function ChapterCard({
    chapterId,
    isUnlocked,
    isCompleted,
    onSelect
}: {
    chapterId: ChapterId;
    isUnlocked: boolean;
    isCompleted: boolean;
    onSelect: (id: ChapterId) => void;
}) {
    const info = CHAPTER_INFO[chapterId];

    return (
        <button
            disabled={!isUnlocked}
            onClick={() => onSelect(chapterId)}
            className={clsx(
                "p-5 rounded-xl border-2 text-left transition-all relative overflow-hidden group",
                !isUnlocked ? "bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed" :
                    isCompleted ? "bg-slate-800/80 border-green-500/50 hover:border-green-400" :
                        "bg-slate-800 border-cyan-500 hover:bg-slate-700 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-[10px] font-mono text-slate-500 mb-1">{info.subtitle}</p>
                    <h3 className={clsx("font-bold text-lg", isCompleted ? "text-green-400" : "text-white")}>{info.title}</h3>
                </div>
                {isCompleted ? <CheckCircle className="w-5 h-5 text-green-500" /> : !isUnlocked ? <Lock className="w-5 h-5 text-slate-600" /> : <Play className="w-5 h-5 text-cyan-400 animate-pulse" />}
            </div>
            <p className="text-slate-400 text-sm">{info.description}</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                <span className="px-2 py-0.5 bg-slate-900 rounded">ACT {info.act}</span>
                <span>{info.duration}</span>
            </div>
        </button>
    );
}

function GuidanceBubble() {
    const { completedChapters } = useGameStore();

    let message = "歡迎回來！選擇一個章節繼續你的旅程。";
    if (!completedChapters.includes('prologue')) {
        message = "先完成序章吧！";
    } else if (!completedChapters.includes('chapter1-migration')) {
        message = "第一章：了解為什麼現在是最佳時機。";
    } else if (!completedChapters.includes('chapter2-moat')) {
        message = "第二章：探索我們的數據優勢。";
    } else if (!completedChapters.includes('chapter3-groundforce')) {
        message = "第三章：認識我們的地面部隊。";
    } else if (!completedChapters.includes('chapter4-pickpeak')) {
        message = "第四章：親手操作 PickPeak！";
    } else if (!completedChapters.includes('chapter5-ecosystem')) {
        message = "第五章：生態系策略是關鍵。";
    } else if (!completedChapters.includes('chapter6-negotiation')) {
        message = "最終章：展現你學到的一切！";
    } else {
        message = "恭喜！你已經是方睿的正式成員了。";
    }

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

function InsightBar({ label, value, color }: { label: string; value: number; color: 'cyan' | 'purple' | 'green' }) {
    const colorClasses = {
        cyan: 'bg-cyan-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500',
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">{label}</span>
                <span className={`text-${color}-400`}>{value}%</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClasses[color]} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function CompanyBadge({ company }: { company: 'funraise' | 'yufeng' | 'xirui' | 'pi' }) {
    const badges = {
        funraise: { label: 'FR', bg: 'bg-cyan-600', title: '方睿科技' },
        yufeng: { label: 'YF', bg: 'bg-purple-600', title: '宇豐睿星' },
        xirui: { label: 'XR', bg: 'bg-green-600', title: '希睿置業' },
        pi: { label: 'PI', bg: 'bg-orange-600', title: 'Property Intelligence' },
    };

    const badge = badges[company];

    return (
        <div className={`w-6 h-6 ${badge.bg} rounded text-[10px] font-bold flex items-center justify-center text-white`} title={badge.title}>
            {badge.label}
        </div>
    );
}

// Badge definitions with Chinese descriptions, company concepts, and detailed explanations
const BADGE_CONFIG: Record<string, {
    nameZh: string;
    description: string;
    detailedDescription: string;
    companyInsight: string;
    color: string;
    bg: string;
    border: string;
    Icon: React.ComponentType<{ className?: string }>;
}> = {
    // === Badges matching CHAPTER_REWARDS in LevelCompleteOverlay.tsx ===
    'First Steps': {
        nameZh: '啟航先驅',
        description: '完成方睿入職流程',
        detailedDescription: '你已經完成了方睿科技的入職導覽，了解了公司的核心使命：用數據驅動商用不動產的未來。',
        companyInsight: '方睿科技的願景是成為亞太區最值得信賴的商用不動產數據平台，就像 CoStar 在美國市場的地位一樣。',
        color: "text-emerald-400",
        bg: "bg-emerald-900/20",
        border: "border-emerald-500/50",
        Icon: Footprints
    },
    'Market Navigator': {
        nameZh: '市場領航員',
        description: '掌握商用不動產大遷徙趨勢',
        detailedDescription: '你已經理解了為什麼 2024-2025 年是進入商用不動產的最佳時機。AI 產業爆發帶動的數據中心需求、企業總部遷移潮正在重塑市場版圖。',
        companyInsight: '方睿科技的核心競爭力之一就是「時機」——我們在市場轉型的關鍵時刻切入，當傳統業者還在用紙本名片經營時，我們已經建立了數據護城河。',
        color: "text-cyan-400",
        bg: "bg-cyan-900/20",
        border: "border-cyan-500/50",
        Icon: TrendingUp
    },
    'Data Hunter': {
        nameZh: '數據獵人',
        description: '探索市場趨勢與熱點識別',
        detailedDescription: '你已經學會如何從海量數據中識別市場熱點，理解 AI 產業、綠色建築、ESG 合規等趨勢如何影響商辦選址決策。',
        companyInsight: '方睿的 PickPeak 平台整合了超過 500 萬筆數據點，涵蓋 3,000+ 棟商用建築。這就是我們的「數據護城河」——競爭對手需要數年才能累積的資產。',
        color: "text-purple-400",
        bg: "bg-purple-900/20",
        border: "border-purple-500/50",
        Icon: Database
    },
    'Team Builder': {
        nameZh: '團隊建設者',
        description: '認識方睿地面部隊的戰力',
        detailedDescription: '你已經認識了方睿集團的核心團隊結構：方睿科技（技術核心）、宇豐睿星（商仲與估價）、希睿置業（建案代銷）、Property Intelligence（市場研究）。',
        companyInsight: '方睿的獨特優勢是「科技 + 地面部隊」的組合。我們不只是 SaaS 公司，我們有真正懂市場的專業團隊在前線驗證數據、執行交易。',
        color: "text-green-400",
        bg: "bg-green-900/20",
        border: "border-green-500/50",
        Icon: Users
    },
    'PickPeak Master': {
        nameZh: 'PickPeak 大師',
        description: '精通 PickPeak 決策平台操作',
        detailedDescription: '你已經親手操作過 PickPeak 選址決策平台，學會了如何設定篩選條件、分析租戶結構、評估交易歷史，為客戶找到最適合的辦公空間。',
        companyInsight: 'PickPeak 是方睿的旗艦產品，它將複雜的選址決策流程從「數週」縮短到「數小時」。2026.01.13 正式發表後，將成為台灣商辦市場的遊戲規則改變者。',
        color: "text-blue-400",
        bg: "bg-blue-900/20",
        border: "border-blue-500/50",
        Icon: Search
    },
    'Ecosystem Architect': {
        nameZh: '生態系建築師',
        description: '建立完整服務生態閉環',
        detailedDescription: '你已經理解了方睿的「Ziroom Model」——從找辦公室到裝潢、設備、服務的全週期管理。這不只是賣數據，而是建立完整的服務價值鏈。',
        companyInsight: '方睿的願景是從「空間」出發的 Total Solution。當客戶透過 PickPeak 找到理想辦公室後，我們的生態系夥伴可以提供設計、裝潢、傢俱、IT 設備等一站式服務。',
        color: "text-orange-400",
        bg: "bg-orange-900/20",
        border: "border-orange-500/50",
        Icon: Network
    },
    'Deal Closer': {
        nameZh: '成交達人',
        description: '用數據說服力贏得客戶信任',
        detailedDescription: '你已經完成了終極談判挑戰，學會如何用數據回應客戶的疑慮、用專業建立信任、用洞察創造價值。',
        companyInsight: '方睿的核心價值觀是「數據驅動決策」。當客戶說「租金太貴」時，我們不說「這是市場行情」，而是拿出同商圈、同等級建築的真實成交數據來佐證。',
        color: "text-rose-400",
        bg: "bg-rose-900/20",
        border: "border-rose-500/50",
        Icon: Crown
    },
    'FUNRAISE Certified': {
        nameZh: '方睿認證菁英',
        description: '完成方睿完整訓練旅程',
        detailedDescription: '恭喜！你已經完成了方睿科技的完整入職訓練，從市場趨勢到產品操作、從團隊認識到實戰談判，你已經具備了成為方睿正式成員的所有知識。',
        companyInsight: '歡迎加入方睿艦隊！我們的使命是「Always Raise Better」——永遠追求更好。無論是數據品質、客戶服務還是團隊成長，我們都在不斷精進。期待與你一起改變台灣商用不動產市場。',
        color: "text-yellow-400",
        bg: "bg-yellow-900/20",
        border: "border-yellow-500/50",
        Icon: Rocket
    },
    // === Legacy badges (kept for compatibility) ===
    'Market Seer': {
        nameZh: '市場預言家',
        description: '預測市場趨勢走向',
        detailedDescription: '你展現了敏銳的市場洞察力，能夠從數據中預見趨勢。',
        companyInsight: '方睿相信數據不只是記錄過去，更是預測未來的關鍵。',
        color: "text-indigo-400",
        bg: "bg-indigo-900/20",
        border: "border-indigo-500/50",
        Icon: Eye
    },
    'Network Weaver': {
        nameZh: '網絡編織者',
        description: '連結服務價值鏈',
        detailedDescription: '你理解了如何將不同服務串連成完整的價值網絡。',
        companyInsight: '方睿的生態系策略就是「編織」——將獨立的服務商串連成協同的服務網絡。',
        color: "text-pink-400",
        bg: "bg-pink-900/20",
        border: "border-pink-500/50",
        Icon: Share2
    },
    'Galactic Strategist': {
        nameZh: '銀河策略家',
        description: '制定完美選址策略',
        detailedDescription: '你展現了卓越的策略思維，能夠權衡多方因素制定最佳方案。',
        companyInsight: '選址不只是找空間，而是為企業找到最適合發展的「戰略據點」。',
        color: "text-violet-400",
        bg: "bg-violet-900/20",
        border: "border-violet-500/50",
        Icon: Target
    },
};

function BadgeItem({ badge }: { badge: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const config = BADGE_CONFIG[badge] || {
        nameZh: badge,
        description: '特殊成就',
        detailedDescription: '你獲得了一個特殊的成就徽章。',
        companyInsight: '方睿科技期待你繼續探索更多成就。',
        color: "text-yellow-400",
        bg: "bg-yellow-900/20",
        border: "border-yellow-500/50",
        Icon: Award
    };

    const { nameZh, description, detailedDescription, companyInsight, color, bg, border, Icon } = config;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`px-4 py-2 ${bg} rounded-lg border ${border} ${color} font-bold text-sm flex items-center gap-2 shadow-lg cursor-pointer group relative hover:scale-105 transition-transform`}
            >
                <Icon className="w-4 h-4" />
                <div className="flex flex-col text-left">
                    <span>{nameZh}</span>
                    <span className="text-[10px] opacity-60 font-normal">{badge}</span>
                </div>
                {/* Click hint */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    ?
                </div>
            </button>

            {/* Badge Detail Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Badge Icon */}
                        <div className={`w-16 h-16 mx-auto mb-4 ${bg} rounded-full flex items-center justify-center border-2 ${border}`}>
                            <Icon className={`w-8 h-8 ${color}`} />
                        </div>

                        {/* Badge Title */}
                        <div className="text-center mb-4">
                            <h3 className={`text-xl font-bold ${color}`}>{nameZh}</h3>
                            <p className="text-slate-500 text-xs font-mono">{badge}</p>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                    <Award className="w-3 h-3" />
                                    <span>獲得原因</span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{detailedDescription}</p>
                            </div>

                            <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                                <div className="flex items-center gap-2 text-xs text-cyan-400 mb-2">
                                    <Sparkles className="w-3 h-3" />
                                    <span>方睿洞察</span>
                                </div>
                                <p className="text-cyan-200 text-sm leading-relaxed">{companyInsight}</p>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                        >
                            關閉
                        </button>
                    </motion.div>
                </div>
            )}
        </>
    );
}
