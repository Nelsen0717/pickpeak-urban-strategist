'use client';

import React, { useState } from 'react';
import { useGameStore, MARKET_DATA } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Building2, Home, Server, Zap, ChevronRight, CheckCircle, X, HelpCircle } from 'lucide-react';
import DialogueOverlay from '../rpg/DialogueOverlay';

type Phase = 'intro' | 'residential-cooling' | 'commercial-heating' | 'quiz' | 'dialogue' | 'complete';

interface QuizQuestion {
    id: string;
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'q1',
        question: '2025 年台灣住宅市場降溫的主要原因是什麼？',
        options: [
            { id: 'a', text: '人口減少', isCorrect: false },
            { id: 'b', text: '央行信用管制 + 囤房稅 2.0', isCorrect: true },
            { id: 'c', text: '建材價格上漲', isCorrect: false },
            { id: 'd', text: '利率下降', isCorrect: false },
        ],
        explanation: '央行的選擇性信用管制限制了投資客的槓桿，囤房稅 2.0 增加持有成本，雙重政策壓力導致住宅投資降溫。'
    },
    {
        id: 'q2',
        question: '2024-2025 年台灣商用不動產市場最強勁的驅動力是什麼？',
        options: [
            { id: 'a', text: '觀光旅館需求', isCorrect: false },
            { id: 'b', text: '傳統製造業擴廠', isCorrect: false },
            { id: 'c', text: 'AI 數據中心與科技業投資', isCorrect: true },
            { id: 'd', text: '政府辦公空間需求', isCorrect: false },
        ],
        explanation: '台積電、NVIDIA、Google 等科技巨頭大舉投資台灣，AI 數據中心投資金額達 2,400 億台幣，帶動商用不動產需求爆發。'
    },
    {
        id: 'q3',
        question: '為什麼「此消彼長」是商用不動產從業者的歷史性機會？',
        options: [
            { id: 'a', text: '住宅和商用市場總是相反', isCorrect: false },
            { id: 'b', text: '人才和資金正從住宅市場流向商用市場', isCorrect: true },
            { id: 'c', text: '商用不動產價格比較便宜', isCorrect: false },
            { id: 'd', text: '政府補貼商用不動產', isCorrect: false },
        ],
        explanation: '當住宅市場降溫，原本從事住宅仲介的人才、投資人的資金，都在尋找新出路。商用不動產正好提供了這個機會。'
    }
];

export default function Chapter1Migration() {
    const { completeChapter, addXp, updateInsights, unlockKnowledge, unlockBadge, setView } = useGameStore();
    const [phase, setPhase] = useState<Phase>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const handleIntroComplete = () => {
        setPhase('residential-cooling');
    };

    const handleResidentialComplete = () => {
        unlockKnowledge({
            id: 'residential-cooling',
            category: 'market',
            title: '住宅市場降溫',
            content: '央行信用管制限制投資槓桿，囤房稅 2.0 增加持有成本，使得住宅投資報酬率下降，市場明顯降溫。',
            unlockedAt: 'chapter1-migration'
        });
        updateInsights('market', 10);
        setPhase('commercial-heating');
    };

    const handleCommercialComplete = () => {
        unlockKnowledge({
            id: 'commercial-heating',
            category: 'market',
            title: '商用市場升溫',
            content: 'AI 浪潮帶來的數據中心投資、ESG 趨勢推動的綠建築需求，讓商用不動產成為最熱門的投資標的。',
            unlockedAt: 'chapter1-migration'
        });
        updateInsights('market', 10);
        setPhase('quiz');
    };

    const handleAnswerSelect = (answerId: string) => {
        if (showExplanation) return;
        setSelectedAnswer(answerId);
    };

    const handleAnswerConfirm = () => {
        if (!selectedAnswer) return;

        const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
        const isCorrect = currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            addXp(50);
        }

        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setPhase('dialogue');
        }
    };

    const handleDialogueComplete = () => {
        setPhase('complete');
    };

    const handleComplete = () => {
        completeChapter('chapter1-migration');
        unlockBadge('Market Navigator');
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
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.3em]">CHAPTER 1</p>
                            <h1 className="text-5xl font-bold text-white">大遷徙時代</h1>
                            <p className="text-2xl text-slate-300">The Great Migration</p>
                        </div>

                        <div className="max-w-2xl mx-auto space-y-4">
                            <p className="text-slate-300 text-lg leading-relaxed">
                                2025 年，台灣不動產市場正經歷一場前所未有的結構性轉變。
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                住宅市場因政策調控而降溫，商用市場卻因科技浪潮而升溫。
                                這種「此消彼長」的現象，正是 FUNRAISE 誕生的時代背景。
                            </p>
                        </div>

                        <button
                            onClick={handleIntroComplete}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-3 mx-auto"
                        >
                            了解市場變化
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Phase 2: Residential Cooling */}
                {phase === 'residential-cooling' && (
                    <motion.div
                        key="residential"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-red-400 font-mono text-sm tracking-[0.2em] mb-2">MARKET SHIFT #1</p>
                            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                                <Home className="text-red-400" />
                                住宅市場：政策降溫
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PolicyCard
                                icon={<TrendingDown className="w-8 h-8 text-red-400" />}
                                title="央行信用管制"
                                description="限制投資客貸款成數，從 8 成降至 5-6 成，大幅壓縮槓桿空間。"
                                impact="-30% 投資動能"
                            />
                            <PolicyCard
                                icon={<Building2 className="w-8 h-8 text-red-400" />}
                                title="囤房稅 2.0"
                                description="持有多屋的稅率從 1.5% 最高提升至 4.8%，增加持有成本。"
                                impact="+220% 持有成本"
                            />
                        </div>

                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-red-400 mb-3">市場影響</h3>
                            <ul className="space-y-2 text-slate-300">
                                <li className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-400" />
                                    住宅交易量較高峰期下滑約 25%
                                </li>
                                <li className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-400" />
                                    投資客觀望，首購族成為主力
                                </li>
                                <li className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-400" />
                                    傳統住宅仲介業績承壓
                                </li>
                            </ul>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleResidentialComplete}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                了解商用市場
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 3: Commercial Heating */}
                {phase === 'commercial-heating' && (
                    <motion.div
                        key="commercial"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="w-full max-w-4xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-green-400 font-mono text-sm tracking-[0.2em] mb-2">MARKET SHIFT #2</p>
                            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                                <Building2 className="text-green-400" />
                                商用市場：科技升溫
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PolicyCard
                                icon={<Server className="w-8 h-8 text-green-400" />}
                                title="AI 數據中心"
                                description="台積電、NVIDIA、Google 大舉投資，帶動資料中心與工業用地需求爆發。"
                                impact={`+${MARKET_DATA.taiwan.aiDataCenterInvestment}億 投資`}
                                positive
                            />
                            <PolicyCard
                                icon={<Zap className="w-8 h-8 text-green-400" />}
                                title="ESG 綠建築"
                                description="企業 ESG 要求推動辦公室升級潮，A 級綠建築租金溢價明顯。"
                                impact="+15% 租金溢價"
                                positive
                            />
                        </div>

                        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-green-400 mb-3">市場機會</h3>
                            <ul className="space-y-2 text-slate-300">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    A 級辦公室空置率僅 {MARKET_DATA.taiwan.vacancyRateA}%，供不應求
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    科技業擴張帶動大面積辦公需求
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    全球 CRE 市場規模達 ${MARKET_DATA.globalCRE.tam2024}T 美元
                                </li>
                            </ul>
                        </div>

                        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-cyan-400 mb-3">此消彼長的歷史機會</h3>
                            <p className="text-slate-300 leading-relaxed">
                                當住宅市場的人才和資金尋找新出路時，商用不動產正好提供了舞台。
                                這是 FUNRAISE 成立的時代背景 —— 我們要在這個轉型期，
                                用數據和科技重新定義商用不動產服務。
                            </p>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleCommercialComplete}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                            >
                                測試你的理解
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Phase 4: Quiz */}
                {phase === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-3xl space-y-8"
                    >
                        <div className="text-center">
                            <p className="text-cyan-400 font-mono text-sm tracking-[0.2em] mb-2">
                                KNOWLEDGE CHECK // {currentQuestionIndex + 1} OF {QUIZ_QUESTIONS.length}
                            </p>
                            <h2 className="text-2xl font-bold text-white">市場洞察測驗</h2>
                        </div>

                        <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <HelpCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                                <p className="text-xl text-white">{QUIZ_QUESTIONS[currentQuestionIndex].question}</p>
                            </div>

                            <div className="space-y-3">
                                {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option) => {
                                    const isSelected = selectedAnswer === option.id;
                                    const showResult = showExplanation;
                                    const isCorrect = option.isCorrect;

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleAnswerSelect(option.id)}
                                            disabled={showExplanation}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${showResult
                                                    ? isCorrect
                                                        ? 'bg-green-900/30 border-green-500'
                                                        : isSelected
                                                            ? 'bg-red-900/30 border-red-500'
                                                            : 'bg-slate-800/50 border-slate-700'
                                                    : isSelected
                                                        ? 'bg-cyan-900/30 border-cyan-500'
                                                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${showResult
                                                        ? isCorrect
                                                            ? 'bg-green-500 text-white'
                                                            : isSelected
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-slate-700 text-slate-400'
                                                        : isSelected
                                                            ? 'bg-cyan-500 text-white'
                                                            : 'bg-slate-700 text-slate-400'
                                                    }`}>
                                                    {option.id.toUpperCase()}
                                                </span>
                                                <span className={`text-lg ${showResult && isCorrect ? 'text-green-400' : 'text-slate-200'}`}>
                                                    {option.text}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {showExplanation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg"
                                >
                                    <p className="text-cyan-300 font-bold mb-2">解析</p>
                                    <p className="text-slate-300">{QUIZ_QUESTIONS[currentQuestionIndex].explanation}</p>
                                </motion.div>
                            )}
                        </div>

                        <div className="text-center">
                            {!showExplanation ? (
                                <button
                                    onClick={handleAnswerConfirm}
                                    disabled={!selectedAnswer}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-full font-bold transition-all shadow-lg"
                                >
                                    確認答案
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextQuestion}
                                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto"
                                >
                                    {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? '下一題' : '完成測驗'}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Phase 5: Dialogue */}
                {phase === 'dialogue' && (
                    <DialogueOverlay
                        onComplete={handleDialogueComplete}
                        lines={[
                            { speaker: 'Mike', text: `做得好！你答對了 ${correctAnswers}/${QUIZ_QUESTIONS.length} 題。`, expression: 'happy' },
                            { speaker: 'Mike', text: '現在你理解了為什麼我們選擇在 2025 年成立 FUNRAISE。', expression: 'neutral' },
                            { speaker: 'Mike', text: '住宅市場的降溫，為商用市場帶來了人才和資金。', expression: 'serious' },
                            { speaker: 'Mike', text: '而 AI 和 ESG 的浪潮，則為商用不動產創造了前所未有的需求。', expression: 'serious' },
                            { speaker: 'Mike', text: '這就是「Why Now」—— 為什麼是現在。', expression: 'happy' },
                            { speaker: 'Mike', text: '下一章，我們會深入了解「Why Us」—— 為什麼是我們。', expression: 'neutral' },
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
                        <div className="w-24 h-24 mx-auto bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white">第一章完成！</h2>
                            <p className="text-slate-300 text-xl">你已經理解了市場大遷徙的背景</p>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 p-6 max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-cyan-400 mb-4">獲得獎勵</h3>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-cyan-400">+200 XP</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-yellow-400">Market Navigator 徽章</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <span className="text-green-400">+20% 市場洞察</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-3 mx-auto"
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

function PolicyCard({
    icon,
    title,
    description,
    impact,
    positive = false
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    impact: string;
    positive?: boolean;
}) {
    return (
        <div className={`p-6 rounded-xl border ${positive ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
            <div className="flex items-center gap-3 mb-3">
                {icon}
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-slate-300 mb-4">{description}</p>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {impact}
            </div>
        </div>
    );
}
