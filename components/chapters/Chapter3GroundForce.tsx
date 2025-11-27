'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building2, Calculator, Briefcase, ChevronRight, CheckCircle, Star, MapPin, Target } from 'lucide-react';
import DialogueOverlay from '../rpg/DialogueOverlay';

type Phase = 'intro' | 'yufeng' | 'xirui' | 'pi' | 'challenge' | 'synergy' | 'dialogue' | 'complete';

// Challenge scenarios for the matching game
const CHALLENGE_SCENARIOS = [
    {
        id: 1,
        scenario: '一家科技公司想知道他們目前租的辦公室市值多少，考慮是否要買下來。',
        correctTeam: 'yufeng',
        explanation: '宇豐睿星的專業估價師可以提供準確的資產價值評估。'
    },
    {
        id: 2,
        scenario: '某建商有一棟新完工的商辦大樓，需要協助銷售給企業租戶。',
        correctTeam: 'xirui',
        explanation: '希睿置業專注於建案代銷，是開發商與企業客戶之間的橋樑。'
    },
    {
        id: 3,
        scenario: '投資人想了解內湖科技園區的租金趨勢和空置率變化。',
        correctTeam: 'pi',
        explanation: 'Property Intelligence 團隊專門產出市場研究報告和數據分析。'
    },
    {
        id: 4,
        scenario: '一家外商企業要在台北設立總部，需要專人協助談判租賃條件。',
        correctTeam: 'yufeng',
        explanation: '宇豐睿星的商仲顧問擅長大型企業選址談判和交易撮合。'
    }
];

// Team data
const TEAMS = {
    yufeng: {
        name: '宇豐睿星',
        englishName: 'YuFeng RuiXing',
        tagline: '估價與商仲的雙引擎',
        description: '結合專業估價師團隊與商用不動產顧問，提供從資產評估到交易撮合的完整服務。',
        roles: [
            { title: '專業估價師', desc: '國家考試合格，具備銀行、保險、法院等鑑價經驗' },
            { title: '商仲顧問', desc: '深耕商辦市場多年，熟悉大型企業選址需求' },
        ],
        color: 'purple',
        icon: Calculator,
        stats: { experience: '15+ 年', cases: '500+', coverage: '全台' }
    },
    xirui: {
        name: '希睿置業',
        englishName: 'XiRui Property',
        tagline: '建案代銷的生力軍',
        description: '專注於建案銷售與企業辦公空間規劃，是開發商與企業客戶之間的橋樑。',
        roles: [
            { title: '專案經理', desc: '管理大型建案銷售，從定價策略到成交落地' },
            { title: '企業服務', desc: '協助企業客戶規劃辦公空間搬遷與升級' },
        ],
        color: 'green',
        icon: Building2,
        stats: { experience: '5+ 年', cases: '30+', coverage: '北台灣' }
    },
    pi: {
        name: 'Property Intelligence',
        englishName: 'PI Team',
        tagline: '五大行精英的數據軍團',
        description: '來自 CBRE、JLL、高力、世邦魏理仕等五大行的市場研究專家，專注於數據分析與市場洞察。',
        roles: [
            { title: '市場研究員', desc: '追蹤商用不動產市場動態，產出研究報告' },
            { title: '數據分析師', desc: '運用 AI 工具分析海量數據，發現市場趨勢' },
        ],
        color: 'orange',
        icon: Target,
        stats: { experience: '10+ 年', cases: '100+/年', coverage: '全台' }
    }
};

export default function Chapter3GroundForce() {
    const { completeChapter, addXp, updateInsights, unlockKnowledge, unlockBadge, unlockTeamMember, setView } = useGameStore();
    const [phase, setPhase] = useState<Phase>('intro');
    const [currentScenario, setCurrentScenario] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showFeedback, setShowFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);

    const handleIntroComplete = () => {
        setPhase('yufeng');
    };

    const handleYufengComplete = () => {
        unlockTeamMember('yufeng-appraiser');
        unlockTeamMember('yufeng-consultant');
        unlockKnowledge({
            id: 'yufeng-team',
            category: 'company',
            title: '宇豐睿星團隊',
            content: '專業估價師 + 商仲顧問的組合，提供從資產評估到交易撮合的一站式服務，是 FUNRAISE 最有經驗的地面部隊。',
            unlockedAt: 'chapter3-groundforce'
        });
        updateInsights('company', 10);
        addXp(50);
        setPhase('xirui');
    };

    const handleXiruiComplete = () => {
        unlockTeamMember('xirui-sales');
        unlockKnowledge({
            id: 'xirui-team',
            category: 'company',
            title: '希睿置業團隊',
            content: '建案代銷專家，專注於新建案銷售與企業客戶服務，是開發商與企業之間的重要橋樑。',
            unlockedAt: 'chapter3-groundforce'
        });
        updateInsights('company', 10);
        addXp(50);
        setPhase('pi');
    };

    const handlePiComplete = () => {
        unlockTeamMember('pi-lead');
        unlockKnowledge({
            id: 'pi-team',
            category: 'company',
            title: 'Property Intelligence 團隊',
            content: '來自五大行的市場研究精英，運用數據分析產出市場洞察，是 PickPeak 產品的智囊團。',
            unlockedAt: 'chapter3-groundforce'
        });
        updateInsights('company', 10);
        addXp(50);
        setPhase('challenge');
    };

    const handleTeamSelect = (teamId: string) => {
        const scenario = CHALLENGE_SCENARIOS[currentScenario];
        const isCorrect = teamId === scenario.correctTeam;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            addXp(25);
        }

        setShowFeedback({
            correct: isCorrect,
            explanation: scenario.explanation
        });
    };

    const handleNextScenario = () => {
        setShowFeedback(null);
        if (currentScenario < CHALLENGE_SCENARIOS.length - 1) {
            setCurrentScenario(prev => prev + 1);
        } else {
            // Challenge complete
            if (correctAnswers >= 3) {
                addXp(100); // Bonus for good performance
            }
            setPhase('synergy');
        }
    };

    const handleSynergyComplete = () => {
        unlockKnowledge({
            id: 'ground-force-synergy',
            category: 'strategy',
            title: '地面部隊協同效應',
            content: '估價師提供資產價值判斷，商仲顧問促成交易，代銷團隊連結開發商，PI 團隊提供數據支持 —— 四位一體的完整服務鏈。',
            unlockedAt: 'chapter3-groundforce'
        });
        setPhase('dialogue');
    };

    const handleDialogueComplete = () => {
        setPhase('complete');
    };

    const handleComplete = () => {
        completeChapter('chapter3-groundforce');
        unlockBadge('Team Builder');
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
                            <p className="text-green-400 font-mono text-sm tracking-[0.3em]">CHAPTER 3</p>
                            <h1 className="text-5xl font-bold text-white">地面部隊</h1>
                            <p className="text-2xl text-slate-300">Ground Forces</p>
                        </div>

                        <div className="relative w-40 h-40 mx-auto">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Users className="w-24 h-24 text-green-400" />
                            </motion.div>
                            {/* Orbiting icons */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                                    <Calculator className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
                                    <Building2 className="w-6 h-6 text-green-400" />
                                </div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                                    <Target className="w-6 h-6 text-orange-400" />
                                </div>
                            </motion.div>
                        </div>

                        <div className="max-w-2xl mx-auto space-y-4">
                            <p className="text-slate-300 text-lg leading-relaxed">
                                數據是護城河，但數據需要人來收集、驗證、詮釋。
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                FUNRAISE 不只是科技公司 —— 我們有真正在第一線作戰的地面部隊：
                                宇豐睿星、希睿置業、Property Intelligence。
                            </p>
                        </div>

                        <button
                            onClick={handleIntroComplete}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-green-500/25 flex items-center gap-3 mx-auto"
                        >
                            認識團隊
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Phase 2: YuFeng */}
                {phase === 'yufeng' && (
                    <TeamShowcase
                        team={TEAMS.yufeng}
                        onComplete={handleYufengComplete}
                        teamNumber={1}
                        totalTeams={3}
                    />
                )}

                {/* Phase 3: XiRui */}
                {phase === 'xirui' && (
                    <TeamShowcase
                        team={TEAMS.xirui}
                        onComplete={handleXiruiComplete}
                        teamNumber={2}
                        totalTeams={3}
                    />
                )}

                {/* Phase 4: PI */}
                {phase === 'pi' && (
                    <TeamShowcase
                        team={TEAMS.pi}
                        onComplete={handlePiComplete}
                        teamNumber={3}
                        totalTeams={3}
                    />
                )}

                {/* Phase 5: Challenge - Team Matching Game */}
                {phase === 'challenge' && (
                    <motion.div
                        key="challenge"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2">
                                CHALLENGE // 團隊配對
                            </p>
                            <h2 className="text-3xl font-bold text-white">測試你的理解</h2>
                            <p className="text-slate-400 mt-2">
                                每個場景，選擇最適合的團隊來處理
                            </p>
                        </div>

                        {/* Progress indicator */}
                        <div className="flex justify-center gap-2">
                            {CHALLENGE_SCENARIOS.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        index < currentScenario ? 'bg-green-500' :
                                        index === currentScenario ? 'bg-cyan-400 scale-125' :
                                        'bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-cyan-500/30 p-8">
                            {/* Scenario */}
                            <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold">{currentScenario + 1}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-cyan-400 font-mono mb-2">場景 {currentScenario + 1} / {CHALLENGE_SCENARIOS.length}</p>
                                        <p className="text-white text-lg leading-relaxed">
                                            {CHALLENGE_SCENARIOS[currentScenario].scenario}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Team Options */}
                            {!showFeedback ? (
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => handleTeamSelect('yufeng')}
                                        className="p-4 rounded-xl bg-purple-900/30 border-2 border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/50 transition-all group"
                                    >
                                        <Calculator className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="font-bold text-white">宇豐睿星</p>
                                        <p className="text-xs text-slate-400 mt-1">估價 + 商仲</p>
                                    </button>

                                    <button
                                        onClick={() => handleTeamSelect('xirui')}
                                        className="p-4 rounded-xl bg-green-900/30 border-2 border-green-500/30 hover:border-green-400 hover:bg-green-900/50 transition-all group"
                                    >
                                        <Building2 className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="font-bold text-white">希睿置業</p>
                                        <p className="text-xs text-slate-400 mt-1">代銷 + 企業服務</p>
                                    </button>

                                    <button
                                        onClick={() => handleTeamSelect('pi')}
                                        className="p-4 rounded-xl bg-orange-900/30 border-2 border-orange-500/30 hover:border-orange-400 hover:bg-orange-900/50 transition-all group"
                                    >
                                        <Target className="w-8 h-8 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="font-bold text-white">PI Team</p>
                                        <p className="text-xs text-slate-400 mt-1">數據 + 研究</p>
                                    </button>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <div className={`p-4 rounded-xl border-2 ${
                                        showFeedback.correct
                                            ? 'bg-green-900/30 border-green-500/50'
                                            : 'bg-red-900/30 border-red-500/50'
                                    }`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            {showFeedback.correct ? (
                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">✗</div>
                                            )}
                                            <span className={`font-bold ${showFeedback.correct ? 'text-green-400' : 'text-red-400'}`}>
                                                {showFeedback.correct ? '正確！+25 XP' : '不太對...'}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 text-sm">{showFeedback.explanation}</p>
                                    </div>

                                    <button
                                        onClick={handleNextScenario}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        {currentScenario < CHALLENGE_SCENARIOS.length - 1 ? '下一題' : '查看結果'}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* Score display */}
                        <div className="text-center text-slate-400">
                            目前答對：<span className="text-cyan-400 font-bold">{correctAnswers}</span> / {currentScenario + (showFeedback ? 1 : 0)}
                        </div>
                    </motion.div>
                )}

                {/* Phase 6: Synergy */}
                {phase === 'synergy' && (
                    <motion.div
                        key="synergy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2">SYNERGY // 協同效應</p>
                            <h2 className="text-3xl font-bold text-white">三支部隊，一個使命</h2>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-cyan-500/30 p-8">
                            {/* Synergy diagram */}
                            <div className="relative h-80">
                                {/* Center: FUNRAISE */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="w-24 h-24 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                        <span className="text-white font-bold">FUNRAISE</span>
                                    </div>
                                </div>

                                {/* YuFeng - Top */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-4 left-1/2 -translate-x-1/2"
                                >
                                    <TeamBubble
                                        name="宇豐睿星"
                                        icon={<Calculator className="w-5 h-5" />}
                                        color="purple"
                                        role="估價 + 商仲"
                                    />
                                </motion.div>

                                {/* XiRui - Bottom Left */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute bottom-4 left-8"
                                >
                                    <TeamBubble
                                        name="希睿置業"
                                        icon={<Building2 className="w-5 h-5" />}
                                        color="green"
                                        role="代銷 + 企業服務"
                                    />
                                </motion.div>

                                {/* PI - Bottom Right */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="absolute bottom-4 right-8"
                                >
                                    <TeamBubble
                                        name="PI Team"
                                        icon={<Target className="w-5 h-5" />}
                                        color="orange"
                                        role="數據 + 研究"
                                    />
                                </motion.div>

                                {/* Connection lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <motion.line
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 0.6 }}
                                        x1="50%" y1="25%" x2="50%" y2="42%"
                                        stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2"
                                    />
                                    <motion.line
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 0.8 }}
                                        x1="25%" y1="75%" x2="42%" y2="55%"
                                        stroke="rgba(34, 197, 94, 0.5)" strokeWidth="2"
                                    />
                                    <motion.line
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 1 }}
                                        x1="75%" y1="75%" x2="58%" y2="55%"
                                        stroke="rgba(249, 115, 22, 0.5)" strokeWidth="2"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SynergyCard
                                title="資訊流通"
                                description="地面部隊收集的市場情報，即時回饋到數據庫"
                                icon={<Target className="w-5 h-5" />}
                            />
                            <SynergyCard
                                title="服務整合"
                                description="客戶需要估價？商仲？代銷？一站式解決"
                                icon={<Briefcase className="w-5 h-5" />}
                            />
                            <SynergyCard
                                title="數據驗證"
                                description="真實交易回饋，讓數據更準確、更可信"
                                icon={<CheckCircle className="w-5 h-5" />}
                            />
                        </div>

                        <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-xl p-6 text-center">
                            <p className="text-green-300 text-lg">
                                「這就是 FUNRAISE 的獨特之處：
                                <br />
                                <span className="font-bold">我們不只有數據，我們有能讓數據活起來的人。</span>」
                            </p>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleSynergyComplete}
                                className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                繼續
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 6: Dialogue */}
                {phase === 'dialogue' && (
                    <DialogueOverlay
                        onComplete={handleDialogueComplete}
                        lines={[
                            { speaker: 'Mike', text: '現在你認識了我們的三支地面部隊。', expression: 'happy' },
                            { speaker: 'Mike', text: '宇豐睿星帶來估價與商仲的專業。', expression: 'neutral' },
                            { speaker: 'Mike', text: '希睿置業連結了開發商與企業客戶。', expression: 'neutral' },
                            { speaker: 'Mike', text: 'PI 團隊則是數據分析的核心引擎。', expression: 'neutral' },
                            { speaker: 'Mike', text: '這就是「Why Us」的第二個答案：我們有人。', expression: 'serious' },
                            { speaker: 'Mike', text: '數據加上人，才能創造真正的價值。', expression: 'happy' },
                            { speaker: 'Mike', text: '下一章，你將親手操作我們的旗艦產品 —— PickPeak。', expression: 'happy' },
                        ]}
                    />
                )}

                {/* Phase 7: Complete */}
                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                            <Users className="w-12 h-12 text-white" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white">第三章完成！</h2>
                            <p className="text-slate-300 text-xl">你已經認識了所有地面部隊</p>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl border border-green-500/30 p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-green-400 mb-4">獲得獎勵</h3>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-cyan-400">+350 XP</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-yellow-400">Team Builder 徽章</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-green-400">+30% 公司理解</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-purple-400">解鎖 4 位團隊成員</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-green-500/25 flex items-center gap-3 mx-auto"
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

// Team Showcase Component
function TeamShowcase({
    team,
    onComplete,
    teamNumber,
    totalTeams
}: {
    team: typeof TEAMS.yufeng;
    onComplete: () => void;
    teamNumber: number;
    totalTeams: number;
}) {
    const Icon = team.icon;
    const colorClasses = {
        purple: { bg: 'from-purple-600 to-purple-800', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/50' },
        green: { bg: 'from-green-600 to-green-800', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/50' },
        orange: { bg: 'from-orange-600 to-orange-800', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/50' },
    };
    const colors = colorClasses[team.color as keyof typeof colorClasses];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-4xl space-y-8"
        >
            <div className="text-center">
                <p className={`${colors.text} font-mono text-sm tracking-[0.2em] mb-2`}>
                    TEAM {teamNumber} OF {totalTeams}
                </p>
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <Icon className={colors.text} />
                    {team.name}
                </h2>
                <p className="text-slate-400 mt-1">{team.englishName}</p>
            </div>

            <div className={`bg-slate-900/80 rounded-2xl border ${colors.border} p-8 space-y-6`}>
                <div className="text-center">
                    <p className={`text-2xl font-bold ${colors.text} mb-2`}>{team.tagline}</p>
                    <p className="text-slate-300">{team.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {team.roles.map((role, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className={`p-4 rounded-xl bg-slate-800/50 border ${colors.border}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Star className={`w-4 h-4 ${colors.text}`} />
                                <h4 className="font-bold text-white">{role.title}</h4>
                            </div>
                            <p className="text-slate-400 text-sm">{role.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                    {Object.entries(team.stats).map(([key, value], index) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-center"
                        >
                            <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
                            <p className="text-slate-500 text-xs uppercase">{key}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onComplete}
                    className={`px-8 py-4 bg-gradient-to-r ${colors.bg} hover:opacity-90 text-white rounded-full font-bold transition-all shadow-lg ${colors.glow} flex items-center gap-3 mx-auto`}
                >
                    {teamNumber < totalTeams ? '認識下一支團隊' : '了解協同效應'}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}

function TeamBubble({ name, icon, color, role }: { name: string; icon: React.ReactNode; color: string; role: string }) {
    const colorClasses = {
        purple: 'bg-purple-900/50 border-purple-500/50 text-purple-400',
        green: 'bg-green-900/50 border-green-500/50 text-green-400',
        orange: 'bg-orange-900/50 border-orange-500/50 text-orange-400',
    };

    return (
        <div className={`px-4 py-3 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="font-bold text-white text-sm">{name}</span>
            </div>
            <p className="text-xs text-slate-400">{role}</p>
        </div>
    );
}

function SynergyCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
    return (
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
                {icon}
                <h4 className="font-bold text-white">{title}</h4>
            </div>
            <p className="text-slate-400 text-sm">{description}</p>
        </div>
    );
}
