'use client';

import React, { useRef, useState } from 'react';
import { useGameStore } from '@/lib/store';
// motion removed - not currently used but kept for future animations
import html2canvas from 'html2canvas';
import { Download, Award, Shield, Star } from 'lucide-react';
import Character from './rpg/Character';

export default function Certificate() {
    const { avatar, badges, xp, completedChapters, level, marketInsights, companyInsights, productInsights } = useGameStore();
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // High resolution
                backgroundColor: '#0f172a', // Match slate-900
                logging: false,
                useCORS: true // For external images if any
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'Funraise_Galactic_License.png';
            link.click();
        } catch (err) {
            console.error('Failed to generate certificate:', err);
            alert('證書生成失敗，請稍後再試。');
        } finally {
            setIsGenerating(false);
        }
    };

    const totalInsights = Math.round((marketInsights + companyInsights + productInsights) / 3);
    const rank = totalInsights >= 90 ? '傳奇策略長'
        : totalInsights >= 70 ? '資深特務'
        : totalInsights >= 50 ? '專業顧問'
        : totalInsights >= 30 ? '見習探員'
        : '新進成員';
    const rankEn = totalInsights >= 90 ? 'LEGENDARY STRATEGIST'
        : totalInsights >= 70 ? 'SENIOR AGENT'
        : totalInsights >= 50 ? 'PROFESSIONAL'
        : totalInsights >= 30 ? 'JUNIOR SCOUT'
        : 'RECRUIT';
    const date = new Date().toLocaleDateString('zh-TW');

    return (
        <div className="flex flex-col items-center gap-8 p-4 w-full max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">恭喜你！🎉</h2>
                <p className="text-slate-400">您已完成方睿宇宙的全部冒險，這是您的銀河執照。</p>
            </div>

            {/* Certificate Card - This part will be captured */}
            <div
                ref={certificateRef}
                className="relative w-full aspect-[1.58/1] bg-slate-900 rounded-xl overflow-hidden border-4 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 p-8 flex flex-col justify-between"
                style={{ minHeight: '500px' }}
            >
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden p-2">
                            <img src="/funraise-logo-dark.png" alt="FUNRAISE" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-wide">方睿銀河執照</h1>
                            <p className="text-cyan-400 text-sm tracking-wide">FUNRAISE CRE 戰略指揮部</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500">執照編號</div>
                        <div className="text-lg text-white font-mono">FR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex gap-8 relative z-10 mt-8 flex-1">
                    {/* Avatar Section */}
                    <div className="w-1/3 flex flex-col gap-4">
                        <div className="aspect-square rounded-xl bg-slate-800 border-2 border-slate-600 overflow-hidden relative shadow-inner">
                            <Character type="player" avatar={avatar} className="w-full h-full transform scale-125 translate-y-4" />
                            <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur py-1 text-center text-xs text-white font-bold">
                                官方肖像
                            </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                            <div className="text-xs text-slate-400 mb-1">頭銜</div>
                            <div className="text-lg font-bold text-yellow-400">{rank}</div>
                            <div className="text-xs text-slate-500 font-mono">{rankEn}</div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <Star className="w-4 h-4 text-yellow-500" /> 總經驗值
                                </div>
                                <div className="text-2xl font-bold text-white">{xp.toLocaleString()}</div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                    <Shield className="w-4 h-4 text-green-500" /> 完成章節
                                </div>
                                <div className="text-2xl font-bold text-white">{completedChapters.length} / 8</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                                <Award className="w-4 h-4" /> 獲得徽章
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {badges.length > 0 ? badges.map((badge) => (
                                    <div key={badge} className="px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 rounded-full text-xs text-cyan-300">
                                        {badge}
                                    </div>
                                )) : (
                                    <div className="text-slate-600 text-sm italic">尚未獲得徽章</div>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto border-t border-slate-700 pt-4 flex justify-between items-end">
                            <div>
                                <div className="text-xs text-slate-500">發證日期</div>
                                <div className="text-white font-mono">{date}</div>
                            </div>
                            <div className="text-right">
                                <div className="h-10 w-28 flex items-center justify-center text-cyan-400 text-sm font-bold italic">Mike Wu</div>
                                <div className="text-xs text-slate-500">艦長簽名</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>生成中...</>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            下載證書
                        </>
                    )}
                </button>
                <button
                    onClick={() => useGameStore.getState().setView('hub')}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all"
                >
                    返回基地
                </button>
            </div>
        </div>
    );
}
