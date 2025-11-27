'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Building2, TrendingUp, Users, ChevronRight, CheckCircle, X, AlertTriangle, Trophy, Shield } from 'lucide-react';
import Character from '../rpg/Character';

type Phase = 'intro' | 'briefing' | 'negotiation' | 'result' | 'complete';

interface NegotiationChoice {
    id: string;
    text: string;
    impact: 'positive' | 'negative' | 'neutral';
    points: number;
    response: string;
}

interface NegotiationRound {
    id: string;
    situation: string;
    speakerLine: string;
    choices: NegotiationChoice[];
}

const NEGOTIATION_ROUNDS: NegotiationRound[] = [
    {
        id: 'round1',
        situation: '科技巨頭的 CEO 對你的數據準確性提出質疑',
        speakerLine: '「你們的數據來源是什麼？我怎麼知道這些資訊是準確的？」',
        choices: [
            {
                id: 'a',
                text: '我們結合公開數據、智能爬蟲和地面部隊的第一手情報，並有專業估價師團隊驗證。',
                impact: 'positive',
                points: 30,
                response: '「三重驗證機制...這確實比我們之前接觸的平台更可靠。」'
            },
            {
                id: 'b',
                text: '我們的數據庫有超過 500 萬筆數據點，是市場上最完整的。',
                impact: 'neutral',
                points: 15,
                response: '「數據量大不代表準確...還有其他保證嗎？」'
            },
            {
                id: 'c',
                text: '我們是新創公司，數據還在持續優化中。',
                impact: 'negative',
                points: 0,
                response: '「所以目前還不成熟？這讓我有些擔心。」'
            }
        ]
    },
    {
        id: 'round2',
        situation: 'CEO 質疑你們與傳統商仲的差異',
        speakerLine: '「傳統商仲也能幫我們找辦公室，你們有什麼不同？」',
        choices: [
            {
                id: 'a',
                text: '傳統商仲需要數週，我們用 PickPeak 只需要幾分鐘就能配對最佳選項，而且提供完整的生態系服務。',
                impact: 'positive',
                points: 30,
                response: '「效率加上一站式服務...這確實是不同的價值主張。」'
            },
            {
                id: 'b',
                text: '我們有更多科技，比傳統商仲更先進。',
                impact: 'neutral',
                points: 10,
                response: '「科技只是工具，關鍵是能解決什麼問題。」'
            },
            {
                id: 'c',
                text: '其實差不多，只是我們更年輕更有活力。',
                impact: 'negative',
                points: 0,
                response: '「年輕不是優勢，解決問題才是。」'
            }
        ]
    },
    {
        id: 'round3',
        situation: 'CEO 詢問你們的市場經驗',
        speakerLine: '「FUNRAISE 成立不到一年，你們有什麼資格服務我們這樣的企業？」',
        choices: [
            {
                id: 'a',
                text: '我們的團隊來自宇豐睿星的資深估價師、希睿的代銷專家、以及五大行的 PI 菁英，累積超過 50 年的產業經驗。',
                impact: 'positive',
                points: 30,
                response: '「原來是老將新創...這個組合確實有說服力。」'
            },
            {
                id: 'b',
                text: '雖然公司新，但我們的創辦人有豐富的產業背景。',
                impact: 'neutral',
                points: 15,
                response: '「創辦人背景不等於執行力，還需要更多證明。」'
            },
            {
                id: 'c',
                text: '我們正在快速學習和成長。',
                impact: 'negative',
                points: 0,
                response: '「我的企業不是你們的學習對象。」'
            }
        ]
    },
    {
        id: 'round4',
        situation: 'CEO 要求你展示具體價值',
        speakerLine: '「說了這麼多，具體能為我們省多少錢、節省多少時間？」',
        choices: [
            {
                id: 'a',
                text: '根據類似規模客戶的數據，平均節省 3-4 週選址時間，租金談判空間增加 5-10%，加上生態系服務整合省下的協調成本。',
                impact: 'positive',
                points: 30,
                response: '「數據說話...這是我想聽的。可以安排詳細提案嗎？」'
            },
            {
                id: 'b',
                text: '這很難量化，但我們的服務品質是一流的。',
                impact: 'neutral',
                points: 10,
                response: '「無法量化的價值很難說服董事會。」'
            },
            {
                id: 'c',
                text: '每個案例不同，要看具體情況。',
                impact: 'negative',
                points: 0,
                response: '「這種回答太模糊了。」'
            }
        ]
    }
];

export default function Chapter6Negotiation() {
    const { completeChapter, addXp, updateInsights, unlockKnowledge, unlockBadge, setView, hp, takeDamage, heal } = useGameStore();
    const [phase, setPhase] = useState<Phase>('intro');
    const [currentRound, setCurrentRound] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [showResponse, setShowResponse] = useState(false);
    const [roundResults, setRoundResults] = useState<Array<{ round: number; impact: string; points: number }>>([]);

    const handleIntroComplete = () => {
        setPhase('briefing');
    };

    const handleBriefingComplete = () => {
        unlockKnowledge({
            id: 'negotiation-prep',
            category: 'strategy',
            title: '談判準備',
            content: '成功的談判建立在對自身優勢的深刻理解：數據護城河、地面部隊、產品實力、生態系策略。用數據說話，用案例證明。',
            unlockedAt: 'chapter6-negotiation'
        });
        setPhase('negotiation');
    };

    const handleChoiceSelect = (choiceId: string) => {
        if (showResponse) return;
        setSelectedChoice(choiceId);
    };

    const handleConfirmChoice = () => {
        if (!selectedChoice) return;

        const round = NEGOTIATION_ROUNDS[currentRound];
        const choice = round.choices.find(c => c.id === selectedChoice);

        if (choice) {
            setTotalScore(prev => prev + choice.points);
            setRoundResults(prev => [...prev, { round: currentRound + 1, impact: choice.impact, points: choice.points }]);

            if (choice.impact === 'negative') {
                takeDamage(15);
            } else if (choice.impact === 'positive') {
                addXp(50);
            }

            setShowResponse(true);
        }
    };

    const handleNextRound = () => {
        if (currentRound < NEGOTIATION_ROUNDS.length - 1) {
            setCurrentRound(prev => prev + 1);
            setSelectedChoice(null);
            setShowResponse(false);
        } else {
            setPhase('result');
        }
    };

    const handleComplete = () => {
        const success = totalScore >= 80;

        if (success) {
            unlockKnowledge({
                id: 'negotiation-win',
                category: 'strategy',
                title: '談判勝利',
                content: '你成功展示了 FUNRAISE 的核心價值：數據準確性、差異化優勢、團隊實力、量化價值。這就是用所學知識創造實際成果的方式。',
                unlockedAt: 'chapter6-negotiation'
            });
            unlockBadge('Deal Closer');
        }

        completeChapter('chapter6-negotiation');
        addXp(success ? 300 : 150);
        updateInsights('company', 10);
        setPhase('complete');
    };

    const getResultGrade = () => {
        if (totalScore >= 100) return { grade: 'S', label: '完美談判', color: 'text-yellow-400' };
        if (totalScore >= 80) return { grade: 'A', label: '出色表現', color: 'text-cyan-400' };
        if (totalScore >= 60) return { grade: 'B', label: '良好溝通', color: 'text-green-400' };
        if (totalScore >= 40) return { grade: 'C', label: '尚可', color: 'text-orange-400' };
        return { grade: 'D', label: '需要改進', color: 'text-red-400' };
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
                            <p className="text-rose-400 font-mono text-sm tracking-[0.3em]">FINAL CHAPTER</p>
                            <h1 className="text-5xl font-bold text-white">終極談判</h1>
                            <p className="text-2xl text-slate-300">The Final Negotiation</p>
                        </div>

                        <div className="relative w-40 h-40 mx-auto">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Swords className="w-24 h-24 text-rose-400" />
                            </motion.div>
                        </div>

                        <div className="max-w-2xl mx-auto space-y-4">
                            <p className="text-slate-300 text-lg leading-relaxed">
                                最終考驗來了。
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                一位科技巨頭的 CEO 正在考慮與 FUNRAISE 合作。
                                你需要運用這段旅程中學到的所有知識，說服他選擇我們。
                            </p>
                        </div>

                        <button
                            onClick={handleIntroComplete}
                            className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-rose-500/25 flex items-center gap-3 mx-auto"
                        >
                            進入談判室
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Phase 2: Briefing */}
                {phase === 'briefing' && (
                    <motion.div
                        key="briefing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-rose-400 font-mono text-sm tracking-[0.2em] mb-2">MISSION BRIEFING</p>
                            <h2 className="text-3xl font-bold text-white">談判準備</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900/80 rounded-xl border border-slate-700 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-rose-400" />
                                    對手資訊
                                </h3>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li><strong>身份：</strong>TechGiant Corp. CEO</li>
                                    <li><strong>需求：</strong>尋找新總部辦公室 (2,000坪)</li>
                                    <li><strong>預算：</strong>每月 400 萬以內</li>
                                    <li><strong>態度：</strong>理性、數據導向、略帶懷疑</li>
                                </ul>
                            </div>

                            <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 p-6">
                                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    你的武器庫
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                                        數據護城河：500萬+ 數據點
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-purple-400" />
                                        地面部隊：宇豐 + 希睿 + PI
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-blue-400" />
                                        產品實力：PickPeak 智能選址
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-orange-400" />
                                        生態系：一站式解決方案
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-rose-900/20 border border-rose-500/30 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-bold text-rose-400 mb-2">注意事項</h3>
                                    <p className="text-slate-300 text-sm">
                                        CEO 會提出 4 個關鍵問題。每個問題有 3 個選項，選擇最能展現 FUNRAISE 價值的回答。
                                        錯誤的回答會降低你的護盾值，優秀的回答能累積談判分數。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleBriefingComplete}
                                className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                開始談判
                                <Swords className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 3: Negotiation */}
                {phase === 'negotiation' && (
                    <motion.div
                        key="negotiation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-4xl space-y-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-rose-400 font-mono text-sm tracking-[0.2em]">
                                    ROUND {currentRound + 1} OF {NEGOTIATION_ROUNDS.length}
                                </p>
                                <h2 className="text-2xl font-bold text-white">談判進行中</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-xs">談判分數</p>
                                <p className="text-3xl font-bold text-cyan-400">{totalScore}</p>
                            </div>
                        </div>

                        {/* Situation */}
                        <div className="bg-slate-900/80 rounded-xl border border-slate-700 p-6">
                            <p className="text-slate-400 text-sm mb-4">
                                {NEGOTIATION_ROUNDS[currentRound].situation}
                            </p>

                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-rose-500">
                                    <Users className="w-8 h-8 text-rose-400" />
                                </div>
                                <div className="flex-1 bg-slate-800 rounded-xl p-4">
                                    <p className="text-slate-500 text-xs mb-1">CEO</p>
                                    <p className="text-white text-lg">
                                        {NEGOTIATION_ROUNDS[currentRound].speakerLine}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Choices */}
                        <div className="space-y-3">
                            <p className="text-slate-400 text-sm">選擇你的回應：</p>
                            {NEGOTIATION_ROUNDS[currentRound].choices.map((choice) => {
                                const isSelected = selectedChoice === choice.id;
                                const showResult = showResponse && isSelected;

                                return (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleChoiceSelect(choice.id)}
                                        disabled={showResponse}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${showResult
                                                ? choice.impact === 'positive'
                                                    ? 'bg-green-900/30 border-green-500'
                                                    : choice.impact === 'negative'
                                                        ? 'bg-red-900/30 border-red-500'
                                                        : 'bg-yellow-900/30 border-yellow-500'
                                                : isSelected
                                                    ? 'bg-cyan-900/30 border-cyan-500'
                                                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                                            }`}
                                    >
                                        <p className={`text-sm ${showResult && choice.impact === 'positive' ? 'text-green-300' : 'text-slate-200'}`}>
                                            {choice.text}
                                        </p>
                                        {showResult && (
                                            <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-2">
                                                {choice.impact === 'positive' && <CheckCircle className="w-4 h-4 text-green-400" />}
                                                {choice.impact === 'negative' && <X className="w-4 h-4 text-red-400" />}
                                                {choice.impact === 'neutral' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                                                <span className={`text-xs ${choice.impact === 'positive' ? 'text-green-400' : choice.impact === 'negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                                                    {choice.impact === 'positive' ? `+${choice.points} 分` : choice.impact === 'negative' ? '談判受挫' : `+${choice.points} 分`}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Response */}
                        {showResponse && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/80 rounded-xl border border-slate-700 p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-rose-500">
                                        <Users className="w-6 h-6 text-rose-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-500 text-xs mb-1">CEO 回應</p>
                                        <p className="text-slate-300">
                                            {NEGOTIATION_ROUNDS[currentRound].choices.find(c => c.id === selectedChoice)?.response}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="text-center">
                            {!showResponse ? (
                                <button
                                    onClick={handleConfirmChoice}
                                    disabled={!selectedChoice}
                                    className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white rounded-full font-bold transition-all shadow-lg"
                                >
                                    確認回答
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextRound}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                                >
                                    {currentRound < NEGOTIATION_ROUNDS.length - 1 ? '下一輪' : '查看結果'}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Phase 4: Result */}
                {phase === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-3xl space-y-8 text-center"
                    >
                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-lg ${totalScore >= 80 ? 'bg-yellow-500 shadow-yellow-500/50' : totalScore >= 60 ? 'bg-cyan-500 shadow-cyan-500/50' : 'bg-slate-600'
                                    }`}
                            >
                                <span className={`text-6xl font-bold ${getResultGrade().color}`}>
                                    {getResultGrade().grade}
                                </span>
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold text-white">談判結束</h2>
                            <p className={`text-2xl font-bold ${getResultGrade().color}`}>{getResultGrade().label}</p>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl border border-slate-700 p-6">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-cyan-400">{totalScore}</p>
                                    <p className="text-slate-400 text-sm">總分</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-green-400">
                                        {roundResults.filter(r => r.impact === 'positive').length}
                                    </p>
                                    <p className="text-slate-400 text-sm">優秀回答</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-white">{NEGOTIATION_ROUNDS.length}</p>
                                    <p className="text-slate-400 text-sm">總回合</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {roundResults.map((result, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                        <span className="text-slate-400">第 {result.round} 輪</span>
                                        <span className={`font-bold ${result.impact === 'positive' ? 'text-green-400' : result.impact === 'negative' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            +{result.points} 分
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {totalScore >= 80 ? (
                            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                                <p className="text-green-300 text-lg">
                                    恭喜！CEO 決定與 FUNRAISE 合作！
                                    <br />
                                    你成功展示了數據、團隊、產品和生態系的價值。
                                </p>
                            </div>
                        ) : (
                            <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-6">
                                <p className="text-orange-300 text-lg">
                                    CEO 表示需要再考慮。
                                    <br />
                                    回顧學到的知識，下次會做得更好！
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleComplete}
                            className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                        >
                            完成章節
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Phase 5: Complete */}
                {phase === 'complete' && (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-24 h-24 mx-auto bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50">
                            <Swords className="w-12 h-12 text-white" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white">最終章完成！</h2>
                            <p className="text-slate-300 text-xl">你已經完成了所有核心訓練</p>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl border border-rose-500/30 p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-rose-400 mb-4">獲得獎勵</h3>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-cyan-400">+{totalScore >= 80 ? 300 : 150} XP</span>
                                </li>
                                {totalScore >= 80 && (
                                    <li className="flex items-center gap-3 text-slate-300">
                                        <span className="text-yellow-400">Deal Closer 徽章</span>
                                    </li>
                                )}
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-rose-400">+10% 公司理解</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setView('hub')}
                            className="px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-rose-500/25 flex items-center gap-3 mx-auto"
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
