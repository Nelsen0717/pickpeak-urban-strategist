'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import html2canvas from 'html2canvas';
import { Download, Award, Shield, Star, ArrowLeft, Sparkles } from 'lucide-react';
import Character from './rpg/Character';

// Badge configuration with Chinese names and icons
const BADGE_CONFIG: Record<string, { chinese: string; icon: string; description: string }> = {
    'First Steps': { chinese: '初入宇宙', icon: '🚀', description: '完成入職序章' },
    'Market Navigator': { chinese: '市場領航員', icon: '🧭', description: '掌握大遷徙趨勢' },
    'Data Hunter': { chinese: '數據獵人', icon: '📊', description: '解鎖數據護城河' },
    'Team Builder': { chinese: '團隊建築師', icon: '👥', description: '認識地面部隊' },
    'PickPeak Master': { chinese: 'PickPeak 大師', icon: '🎯', description: '精通產品操作' },
    'Ecosystem Architect': { chinese: '生態系建築師', icon: '🌐', description: '建立合作網絡' },
    'Deal Closer': { chinese: '交易終結者', icon: '🤝', description: '完成終極談判' },
    'FUNRAISE Certified': { chinese: '方睿認證', icon: '⭐', description: '正式成為艦隊成員' },
};

export default function Certificate() {
    const { avatar, badges, xp, completedChapters, employeeId, marketInsights, companyInsights, productInsights, setView } = useGameStore();
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [licenseNumber, setLicenseNumber] = useState('');

    // Generate stable license number on mount
    useEffect(() => {
        setLicenseNumber(`FR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    }, []);

    const handleDownload = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);

        try {
            // Wait for fonts to load
            if (document.fonts) {
                await document.fonts.ready;
            }
            // Additional delay for rendering
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: '#0f172a',
                logging: false,
                useCORS: true,
                allowTaint: true,
                imageTimeout: 15000,
                onclone: (clonedDoc) => {
                    // Ensure signature font is applied in cloned document
                    const signatureEl = clonedDoc.querySelector('.signature-text');
                    if (signatureEl) {
                        (signatureEl as HTMLElement).style.fontFamily = '"Great Vibes", cursive';
                        (signatureEl as HTMLElement).style.fontSize = '2rem';
                    }
                    // Force styles to be applied
                    const certificateEl = clonedDoc.querySelector('[data-certificate]');
                    if (certificateEl) {
                        (certificateEl as HTMLElement).style.transform = 'none';
                    }
                }
            });

            const image = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.href = image;
            link.download = `FUNRAISE_Certificate_${employeeId || 'Agent'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Failed to generate certificate:', err);
            // Fallback: try without font waiting
            try {
                const canvas = await html2canvas(certificateRef.current!, {
                    scale: 2,
                    backgroundColor: '#0f172a',
                    logging: false,
                });
                const image = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.href = image;
                link.download = `FUNRAISE_Certificate_${employeeId || 'Agent'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (fallbackErr) {
                console.error('Fallback also failed:', fallbackErr);
                alert('證書生成失敗，請稍後再試。');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const totalInsights = Math.round((marketInsights + companyInsights + productInsights) / 3);
    // Unified grade calculation (same as GameClearSequence and Epilogue)
    const rank = (totalInsights >= 90 && badges.length >= 6) ? '傳奇策略長'
        : (totalInsights >= 75 && badges.length >= 5) ? '資深特務'
        : (totalInsights >= 60 && badges.length >= 4) ? '專業顧問'
        : totalInsights >= 40 ? '見習探員'
        : '新進成員';
    const rankEn = (totalInsights >= 90 && badges.length >= 6) ? 'LEGENDARY STRATEGIST'
        : (totalInsights >= 75 && badges.length >= 5) ? 'SENIOR AGENT'
        : (totalInsights >= 60 && badges.length >= 4) ? 'PROFESSIONAL'
        : totalInsights >= 40 ? 'JUNIOR SCOUT'
        : 'RECRUIT';
    const date = new Date().toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex flex-col items-center gap-6 p-4 w-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm font-mono tracking-widest mb-2">
                    <Sparkles className="w-4 h-4" />
                    CERTIFICATION COMPLETE
                    <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-3xl font-bold text-white">恭喜你，{employeeId || '特務'}！</h2>
                <p className="text-slate-400">您已完成方睿宇宙的全部訓練，這是您的銀河執照。</p>
            </div>

            {/* Certificate Card */}
            <div
                ref={certificateRef}
                data-certificate="true"
                className="relative w-full bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-8"
                style={{ aspectRatio: '1.6/1', minHeight: '480px' }}
            >
                {/* Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl" />

                    {/* Glow effects */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 blur-[120px] rounded-full" />

                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>

                {/* Header Row */}
                <div className="relative z-10 flex justify-between items-start mb-6">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-lg overflow-hidden">
                            <img
                                src="/funraise-logo-dark.png"
                                alt="FUNRAISE"
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">方睿銀河執照</h1>
                            <p className="text-cyan-400/80 text-xs tracking-widest font-mono">GALACTIC LICENSE</p>
                        </div>
                    </div>

                    {/* License Number */}
                    <div className="text-right">
                        <div className="text-[10px] text-slate-500 tracking-wider">LICENSE NO.</div>
                        <div className="text-sm text-white/80 font-mono">{licenseNumber}</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex gap-6">
                    {/* Left: Avatar & Title */}
                    <div className="w-1/3 flex flex-col gap-4">
                        {/* Avatar */}
                        <div className="aspect-square rounded-xl bg-slate-800/80 border border-slate-700 overflow-hidden relative shadow-inner">
                            <Character type="player" avatar={avatar} className="w-full h-full transform scale-125 translate-y-4" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent py-2 text-center">
                                <div className="text-xs text-slate-400">AGENT</div>
                                <div className="text-sm font-bold text-white">{employeeId || 'GUEST'}</div>
                            </div>
                        </div>

                        {/* Title/Rank */}
                        <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-xl p-3 border border-amber-500/20">
                            <div className="text-[10px] text-amber-400/60 tracking-wider mb-1">RANK ACHIEVED</div>
                            <div className="text-lg font-bold text-amber-400">{rank}</div>
                            <div className="text-[10px] text-amber-500/60 font-mono tracking-wider">{rankEn}</div>
                        </div>
                    </div>

                    {/* Right: Stats & Badges */}
                    <div className="flex-1 flex flex-col gap-4">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                                    <Star className="w-3 h-3 text-yellow-500" /> TOTAL XP
                                </div>
                                <div className="text-xl font-bold text-white">{xp.toLocaleString()}</div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                                    <Shield className="w-3 h-3 text-green-500" /> CHAPTERS
                                </div>
                                <div className="text-xl font-bold text-white">{completedChapters.length}/8</div>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1">
                                    <Award className="w-3 h-3 text-purple-500" /> BADGES
                                </div>
                                <div className="text-xl font-bold text-white">{badges.length}/8</div>
                            </div>
                        </div>

                        {/* Badges Section */}
                        <div className="flex-1">
                            <div className="text-[10px] text-slate-500 tracking-wider mb-2">EARNED BADGES</div>
                            <div className="flex flex-wrap gap-2">
                                {badges.length > 0 ? badges.map((badge) => {
                                    const config = BADGE_CONFIG[badge] || { chinese: badge, icon: '🏅', description: '' };
                                    return (
                                        <div
                                            key={badge}
                                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg"
                                        >
                                            <span className="text-sm">{config.icon}</span>
                                            <span className="text-xs text-cyan-300 font-medium">{config.chinese}</span>
                                        </div>
                                    );
                                }) : (
                                    <div className="text-slate-600 text-sm italic">尚未獲得徽章</div>
                                )}
                            </div>
                        </div>

                        {/* Footer: Date & Signature */}
                        <div className="flex justify-between items-end pt-4 border-t border-slate-700/50 mt-auto">
                            <div>
                                <div className="text-[10px] text-slate-500 tracking-wider">ISSUED ON</div>
                                <div className="text-white text-sm">{date}</div>
                            </div>
                            <div className="text-right">
                                <div className="signature-text font-signature text-3xl text-cyan-400 leading-none mb-1" style={{ fontFamily: 'var(--font-signature), cursive' }}>
                                    Mike Wu
                                </div>
                                <div className="text-[10px] text-slate-500 tracking-wider">CAPTAIN • FUNRAISE</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom watermark */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 tracking-widest">
                    FUNRAISE © 2025 • CRE STRATEGIC COMMAND
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            生成中...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            下載證書
                        </>
                    )}
                </button>
                <button
                    onClick={() => setView('hub')}
                    className="flex items-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl font-bold transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    返回基地
                </button>
            </div>
        </div>
    );
}
