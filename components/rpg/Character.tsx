'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AvatarState } from '@/lib/store';

interface CharacterProps {
    type: 'player' | 'mike' | 'bit' | 'ceo';
    avatar?: AvatarState;
    expression?: 'neutral' | 'happy' | 'serious' | 'angry' | 'thinking';
    className?: string;
    animated?: boolean;
}

// ===== COLOR PALETTES =====
const SUIT_COLORS = [
    { primary: '#06b6d4', secondary: '#0e7490', accent: '#67e8f9', dark: '#164e63', name: '星際藍' },
    { primary: '#f43f5e', secondary: '#be123c', accent: '#fda4af', dark: '#881337', name: '烈焰紅' },
    { primary: '#8b5cf6', secondary: '#6d28d9', accent: '#c4b5fd', dark: '#4c1d95', name: '量子紫' },
    { primary: '#10b981', secondary: '#047857', accent: '#6ee7b7', dark: '#064e3b', name: '翡翠綠' },
    { primary: '#f59e0b', secondary: '#d97706', accent: '#fcd34d', dark: '#92400e', name: '太陽金' },
    { primary: '#3b82f6', secondary: '#1d4ed8', accent: '#93c5fd', dark: '#1e3a8a', name: '深空藍' },
    { primary: '#ec4899', secondary: '#be185d', accent: '#f9a8d4', dark: '#831843', name: '星雲粉' },
    { primary: '#14b8a6', secondary: '#0d9488', accent: '#5eead4', dark: '#134e4a', name: '極光青' },
];

const HAIR_STYLES = [
    { color: '#1e293b', highlight: '#475569', name: '墨黑', type: 'short' },
    { color: '#78350f', highlight: '#a16207', name: '琥珀棕', type: 'medium' },
    { color: '#374151', highlight: '#9ca3af', name: '銀灰', type: 'spiky' },
    { color: '#e2e8f0', highlight: '#f8fafc', name: '鉑金白', type: 'slick' },
    { color: '#7c3aed', highlight: '#a78bfa', name: '電光紫', type: 'punk' },
    { color: '#0ea5e9', highlight: '#38bdf8', name: '冰川藍', type: 'wave' },
];

const SKIN_TONES = [
    '#fde4d3',
    '#f1d5b5',
    '#dbb89b',
    '#c19a6b',
    '#8d5524',
    '#5c3d2e',
];

const ACCESSORIES = [
    { id: 'none', name: '無', icon: '✨' },
    { id: 'glasses', name: '戰術眼鏡', icon: '👓' },
    { id: 'visor', name: '全息護目鏡', icon: '🥽' },
    { id: 'scar', name: '戰鬥傷疤', icon: '⚔️' },
    { id: 'earpiece', name: '通訊耳機', icon: '🎧' },
    { id: 'tattoo', name: '科技紋身', icon: '⚡' },
];

// ===== BIT COMPANION =====
const BitSVG: React.FC<{ animated?: boolean }> = ({ animated = true }) => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
            <radialGradient id="bitCore" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="70%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#164e63" />
            </radialGradient>
            <filter id="bitGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <linearGradient id="bitBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="10 5" opacity="0.5">
            {animated && <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />}
        </circle>
        <ellipse cx="100" cy="100" rx="50" ry="45" fill="url(#bitBody)" stroke="#475569" strokeWidth="3" />
        <ellipse cx="100" cy="100" rx="30" ry="28" fill="#0f172a" />
        <ellipse cx="100" cy="100" rx="22" ry="20" fill="url(#bitCore)" filter="url(#bitGlow)">
            {animated && <animate attributeName="rx" values="22;20;22" dur="2s" repeatCount="indefinite" />}
        </ellipse>
        <ellipse cx="92" cy="94" rx="6" ry="5" fill="white" opacity="0.6" />
        <path d="M100,55 L100,30 M90,35 L100,20 L110,35" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="100" cy="20" r="5" fill="#ef4444">
            {animated && <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />}
        </circle>
        <path d="M45,100 C30,85 30,115 45,100" fill="#475569" />
        <path d="M155,100 C170,85 170,115 155,100" fill="#475569" />
        <ellipse cx="35" cy="100" rx="5" ry="8" fill="#06b6d4" opacity="0.5">
            {animated && <animate attributeName="opacity" values="0.5;0.8;0.5" dur="0.5s" repeatCount="indefinite" />}
        </ellipse>
        <ellipse cx="165" cy="100" rx="5" ry="8" fill="#06b6d4" opacity="0.5">
            {animated && <animate attributeName="opacity" values="0.5;0.8;0.5" dur="0.5s" repeatCount="indefinite" />}
        </ellipse>
    </svg>
);

// ===== MIKE (Image-based) =====
const MIKE_DEFAULT_IMAGE = '/characters/mike.jpg';

const MikeImage: React.FC<{ expression: string }> = () => (
    <div className="w-full h-full relative overflow-hidden rounded-full">
        <img src={MIKE_DEFAULT_IMAGE} alt="Captain Mike" className="w-full h-full object-cover object-top" />
    </div>
);

// ===== CEO CHARACTER =====
const CeoSVG: React.FC<{ expression: string }> = ({ expression }) => (
    <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
            <linearGradient id="ceoSuit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f2937" />
                <stop offset="100%" stopColor="#111827" />
            </linearGradient>
        </defs>
        <path d="M40,200 L40,150 Q40,115 100,115 Q160,115 160,150 L160,200 Z" fill="url(#ceoSuit)" />
        <path d="M100,115 L95,140 L100,200 L105,140 Z" fill="#991b1b" />
        <path d="M95,115 L100,125 L105,115" fill="#7f1d1d" />
        <path d="M80,115 L100,125 L120,115 L115,120 L100,130 L85,120 Z" fill="white" />
        <ellipse cx="100" cy="75" rx="38" ry="40" fill="#f1d5b5" />
        <path d="M58,70 Q55,30 100,25 Q145,30 142,70 Q145,45 130,30 Q100,20 70,30 Q55,45 58,70 Z" fill="#1e293b" />
        <path d="M70,65 L88,68" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        <path d="M130,65 L112,68" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="82" cy="78" rx="7" ry="5" fill="white" />
        <ellipse cx="118" cy="78" rx="7" ry="5" fill="white" />
        <circle cx="82" cy="78" r="3" fill="#1e293b" />
        <circle cx="118" cy="78" r="3" fill="#1e293b" />
        {expression === 'angry' ? (
            <path d="M90,100 L110,100" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
        ) : (
            <path d="M88,98 Q100,102 112,98" stroke="#7c2d12" strokeWidth="2" fill="none" />
        )}
        <rect x="155" y="180" width="8" height="15" rx="2" fill="#fbbf24" />
    </svg>
);

// ===== PLAYER SVG - Q版可愛風格 =====
interface PlayerSVGProps {
    data: AvatarState;
    animated?: boolean;
}

const PlayerSVG: React.FC<PlayerSVGProps> = ({ data, animated = true }) => {
    const suit = SUIT_COLORS[data.suit % SUIT_COLORS.length];
    const hair = HAIR_STYLES[data.hair % HAIR_STYLES.length];
    const skin = SKIN_TONES[data.face % SKIN_TONES.length];
    const accessory = ACCESSORIES[data.accessory % ACCESSORIES.length];
    const isFemale = data.gender === 'female';

    // 臉部區域的設計：
    // - 臉部只顯示眼睛到下巴的區域
    // - 頭髮完全覆蓋額頭和頭頂
    // - Q版風格：大眼睛、小嘴巴、可愛比例

    const renderHairBack = () => {
        if (!isFemale) return null;
        const c = hair.color;

        // 女性長髮後層 - 垂落到肩膀
        return (
            <g>
                <path d="M45,60 Q35,100 45,160 Q55,170 65,155 Q55,100 60,65 Z" fill={c} />
                <path d="M155,60 Q165,100 155,160 Q145,170 135,155 Q145,100 140,65 Z" fill={c} />
            </g>
        );
    };

    const renderHair = () => {
        const c = hair.color;
        const h = hair.highlight;

        // 所有髮型都必須完全覆蓋頭頂到眉毛上方
        // 臉部橢圓中心在 (100, 75)，眉毛在 y~58
        // 頭髮必須覆蓋到 y~55，完全遮住額頭

        if (isFemale) {
            switch (hair.type) {
                case 'short':
                    return (
                        <g>
                            {/* 主要頭髮 - 完全覆蓋頭頂到眉毛 */}
                            <ellipse cx="100" cy="35" rx="52" ry="35" fill={c} />
                            {/* 瀏海 - 覆蓋額頭到眉毛上方 */}
                            <path d="M48,50 Q50,58 60,60 Q75,52 90,58 Q100,50 110,58 Q125,52 140,60 Q150,58 152,50 Q152,35 100,30 Q48,35 48,50 Z" fill={c} />
                            {/* 側邊頭髮 */}
                            <path d="M48,50 Q40,70 48,100 Q52,105 58,95 Q50,70 55,55 Z" fill={c} />
                            <path d="M152,50 Q160,70 152,100 Q148,105 142,95 Q150,70 145,55 Z" fill={c} />
                            {/* 高光 */}
                            <ellipse cx="80" cy="32" rx="15" ry="8" fill={h} opacity="0.3" />
                        </g>
                    );
                case 'medium':
                    return (
                        <g>
                            {/* 主要頭髮圓頂 */}
                            <ellipse cx="100" cy="32" rx="55" ry="35" fill={c} />
                            {/* 斜瀏海 */}
                            <path d="M45,55 Q42,35 70,25 Q100,20 130,25 Q155,35 155,55 Q145,48 120,55 Q100,45 75,55 Q55,62 45,55 Z" fill={c} />
                            {/* 左側長髮 */}
                            <path d="M45,55 Q32,90 42,140 Q50,150 60,135 Q48,90 52,60 Z" fill={c} />
                            {/* 右側長髮 */}
                            <path d="M155,55 Q168,90 158,140 Q150,150 140,135 Q152,90 148,60 Z" fill={c} />
                            <ellipse cx="75" cy="30" rx="18" ry="10" fill={h} opacity="0.25" />
                        </g>
                    );
                case 'spiky':
                case 'punk':
                    return (
                        <g>
                            {/* 蓬鬆頭頂 */}
                            <ellipse cx="100" cy="30" rx="55" ry="38" fill={c} />
                            {/* 刺刺的瀏海 */}
                            <path d="M45,55 L50,45 L60,58 L70,42 L82,55 L95,40 L105,55 L118,42 L130,58 L140,45 L150,55 Q155,35 100,22 Q45,35 45,55 Z" fill={c} />
                            {/* 側邊 */}
                            <path d="M45,55 Q35,85 45,130 Q55,140 62,120 Q48,85 52,60 Z" fill={c} />
                            <path d="M155,55 Q165,85 155,130 Q145,140 138,120 Q152,85 148,60 Z" fill={c} />
                            <path d="M70,25 Q100,15 130,25" stroke={h} strokeWidth="4" fill="none" opacity="0.3" />
                        </g>
                    );
                default: // wave, slick 等
                    return (
                        <g>
                            {/* 波浪長髮 */}
                            <ellipse cx="100" cy="32" rx="55" ry="36" fill={c} />
                            {/* 波浪瀏海 */}
                            <path d="M45,55 Q48,45 60,50 Q72,42 85,52 Q95,42 105,52 Q115,42 128,50 Q140,45 152,55 Q155,35 100,22 Q45,35 45,55 Z" fill={c} />
                            {/* 波浪側髮 */}
                            <path d="M45,55 Q30,75 35,100 Q32,125 42,150 Q52,160 60,145 Q50,120 55,95 Q48,75 52,58 Z" fill={c} />
                            <path d="M155,55 Q170,75 165,100 Q168,125 158,150 Q148,160 140,145 Q150,120 145,95 Q152,75 148,58 Z" fill={c} />
                            <ellipse cx="78" cy="30" rx="16" ry="9" fill={h} opacity="0.25" />
                        </g>
                    );
            }
        } else {
            // 男性髮型
            switch (hair.type) {
                case 'short':
                    return (
                        <g>
                            {/* 短髮頭頂 - 完整覆蓋 */}
                            <ellipse cx="100" cy="38" rx="50" ry="32" fill={c} />
                            {/* 前額髮際線 - 覆蓋到眉毛上 */}
                            <path d="M50,55 Q52,48 65,52 Q80,45 100,50 Q120,45 135,52 Q148,48 150,55 Q152,38 100,30 Q48,38 50,55 Z" fill={c} />
                            {/* 鬢角 */}
                            <rect x="48" y="55" width="8" height="25" rx="4" fill={c} />
                            <rect x="144" y="55" width="8" height="25" rx="4" fill={c} />
                            <ellipse cx="85" cy="35" rx="12" ry="7" fill={h} opacity="0.25" />
                        </g>
                    );
                case 'medium':
                    return (
                        <g>
                            {/* 中長髮頭頂 */}
                            <ellipse cx="100" cy="35" rx="52" ry="35" fill={c} />
                            {/* 側分瀏海 */}
                            <path d="M48,55 Q45,40 60,35 Q85,28 100,32 Q130,28 150,40 Q155,50 150,58 Q135,50 100,55 Q70,48 48,55 Z" fill={c} />
                            {/* 側邊頭髮 */}
                            <path d="M48,55 Q42,75 50,95 Q54,100 60,90 Q52,75 55,58 Z" fill={c} />
                            <path d="M152,55 Q158,75 150,95 Q146,100 140,90 Q148,75 145,58 Z" fill={c} />
                            <ellipse cx="75" cy="33" rx="14" ry="8" fill={h} opacity="0.25" />
                        </g>
                    );
                case 'spiky':
                    return (
                        <g>
                            {/* 刺蝟頭基底 */}
                            <ellipse cx="100" cy="38" rx="50" ry="32" fill={c} />
                            {/* 尖刺 */}
                            <path d="M60,30 L55,8 L70,28" fill={c} />
                            <path d="M80,25 L78,0 L90,22" fill={c} />
                            <path d="M100,22 L100,-5 L108,20" fill={c} />
                            <path d="M120,25 L125,0 L115,22" fill={c} />
                            <path d="M140,30 L148,8 L135,28" fill={c} />
                            {/* 前額 */}
                            <path d="M50,55 Q55,45 75,50 Q100,42 125,50 Q145,45 150,55 Q152,40 100,32 Q48,40 50,55 Z" fill={c} />
                            <path d="M78,5 L80,18" stroke={h} strokeWidth="3" opacity="0.4" />
                            <path d="M100,0 L100,15" stroke={h} strokeWidth="3" opacity="0.4" />
                        </g>
                    );
                case 'slick':
                    return (
                        <g>
                            {/* 油頭後梳 */}
                            <ellipse cx="100" cy="35" rx="52" ry="33" fill={c} />
                            {/* 後梳紋理 */}
                            <path d="M50,55 Q55,45 100,40 Q145,45 150,55 Q150,38 100,28 Q50,38 50,55 Z" fill={c} />
                            {/* 光澤線條 */}
                            <path d="M60,38 Q100,30 140,38" stroke={h} strokeWidth="3" fill="none" opacity="0.4" />
                            <path d="M65,48 Q100,42 135,48" stroke={h} strokeWidth="2" fill="none" opacity="0.3" />
                        </g>
                    );
                case 'punk':
                    return (
                        <g>
                            {/* 龐克莫霍克 */}
                            <ellipse cx="100" cy="40" rx="48" ry="30" fill={c} />
                            {/* 中間高聳 */}
                            <path d="M70,35 Q75,5 100,-10 Q125,5 130,35 Q120,20 100,15 Q80,20 70,35 Z" fill={c} />
                            {/* 兩側剃短（用較淺色表示） */}
                            <ellipse cx="55" cy="55" rx="10" ry="15" fill={c} opacity="0.4" />
                            <ellipse cx="145" cy="55" rx="10" ry="15" fill={c} opacity="0.4" />
                            {/* 前額 */}
                            <path d="M55,58 Q65,48 100,45 Q135,48 145,58 Q145,45 100,38 Q55,45 55,58 Z" fill={c} />
                            <path d="M85,10 Q100,-5 115,10" stroke={h} strokeWidth="4" fill="none" opacity="0.4" />
                        </g>
                    );
                case 'wave':
                    return (
                        <g>
                            {/* 波浪捲髮 */}
                            <ellipse cx="100" cy="35" rx="53" ry="35" fill={c} />
                            {/* 波浪紋理 */}
                            <path d="M48,55 Q52,42 65,48 Q78,38 92,48 Q105,38 118,48 Q132,38 145,48 Q152,42 152,55 Q152,35 100,25 Q48,35 48,55 Z" fill={c} />
                            {/* 側邊小捲 */}
                            <path d="M48,55 Q42,70 50,85 Q55,90 60,80 Q52,68 55,58 Z" fill={c} />
                            <path d="M152,55 Q158,70 150,85 Q145,90 140,80 Q148,68 145,58 Z" fill={c} />
                            <ellipse cx="80" cy="32" rx="14" ry="9" fill={h} opacity="0.25" />
                        </g>
                    );
                default:
                    return (
                        <g>
                            <ellipse cx="100" cy="38" rx="50" ry="32" fill={c} />
                            <path d="M50,55 Q55,45 100,42 Q145,45 150,55 Q150,38 100,30 Q50,38 50,55 Z" fill={c} />
                        </g>
                    );
            }
        }
    };

    const renderAccessory = () => {
        switch (accessory.id) {
            case 'glasses':
                return (
                    <g>
                        <circle cx="78" cy="72" r="14" fill="none" stroke="#374151" strokeWidth="2.5" />
                        <circle cx="122" cy="72" r="14" fill="none" stroke="#374151" strokeWidth="2.5" />
                        <circle cx="78" cy="72" r="12" fill={suit.primary} opacity="0.15" />
                        <circle cx="122" cy="72" r="12" fill={suit.primary} opacity="0.15" />
                        <path d="M92,72 L108,72" stroke="#374151" strokeWidth="2.5" />
                        <path d="M64,70 L48,68" stroke="#374151" strokeWidth="2.5" />
                        <path d="M136,70 L152,68" stroke="#374151" strokeWidth="2.5" />
                    </g>
                );
            case 'visor':
                return (
                    <g>
                        <path d="M48,70 Q100,85 152,70 L152,62 Q100,76 48,62 Z" fill={suit.primary} opacity="0.5">
                            {animated && <animate attributeName="opacity" values="0.4;0.6;0.4" dur="2s" repeatCount="indefinite" />}
                        </path>
                        <path d="M48,66 Q100,80 152,66" stroke={suit.accent} strokeWidth="2" fill="none" />
                    </g>
                );
            case 'scar':
                return (
                    <path d="M128,58 L142,92" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                );
            case 'earpiece':
                return (
                    <g>
                        <path d="M152,72 Q165,72 165,85 Q165,98 152,98" stroke="#1e293b" strokeWidth="6" fill="none" />
                        <circle cx="165" cy="85" r="5" fill={suit.primary}>
                            {animated && <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />}
                        </circle>
                    </g>
                );
            case 'tattoo':
                return (
                    <g>
                        <path d="M135,62 L145,52 L152,68 L142,80" stroke={suit.primary} strokeWidth="1.5" fill="none" opacity="0.6" />
                        <circle cx="142" cy="66" r="2.5" fill={suit.accent} opacity="0.8" />
                    </g>
                );
            default:
                return null;
        }
    };

    return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
                <linearGradient id={`suit-${data.suit}`} x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0%" stopColor={suit.accent} />
                    <stop offset="30%" stopColor={suit.primary} />
                    <stop offset="70%" stopColor={suit.secondary} />
                    <stop offset="100%" stopColor={suit.dark} />
                </linearGradient>
                <radialGradient id={`skin-${data.face}`} cx="0.4" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor={skin} />
                    <stop offset="100%" stopColor={skin} />
                </radialGradient>
                <filter id="softShadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                </filter>
            </defs>

            {/* ===== 1. 女性長髮後層 ===== */}
            {renderHairBack()}

            {/* ===== 2. 身體 / 太空服 ===== */}
            <path d="M50,200 L50,145 Q50,120 80,112 L120,112 Q150,120 150,145 L150,200 Z" fill={`url(#suit-${data.suit})`} />

            {/* 衣領 */}
            <path d="M80,112 Q100,122 120,112 L116,105 Q100,113 84,105 Z" fill={suit.dark} />

            {/* 中線 */}
            <path d="M100,115 L100,200" stroke={suit.dark} strokeWidth="2" opacity="0.4" />

            {/* 肩章 */}
            <ellipse cx="62" cy="125" rx="15" ry="10" fill={suit.primary} />
            <ellipse cx="62" cy="123" rx="7" ry="4" fill={suit.accent} opacity="0.4" />
            <ellipse cx="138" cy="125" rx="15" ry="10" fill={suit.primary} />
            <ellipse cx="138" cy="123" rx="7" ry="4" fill={suit.accent} opacity="0.4" />

            {/* 胸章 */}
            <circle cx="100" cy="145" r="12" fill={suit.dark} stroke={suit.accent} strokeWidth="2" />
            <path d="M100,137 L106,145 L100,153 L94,145 Z" fill={suit.accent}>
                {animated && <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />}
            </path>

            {/* ===== 3. 脖子 ===== */}
            <path d="M88,105 Q100,112 112,105 L112,98 Q100,105 88,98 Z" fill={skin} />

            {/* ===== 4. 耳朵（在頭後面） ===== */}
            <ellipse cx="50" cy="75" rx="6" ry="10" fill={skin} />
            <ellipse cx="150" cy="75" rx="6" ry="10" fill={skin} />

            {/* ===== 5. 臉部（只有下半部露出，額頭被頭髮蓋住） ===== */}
            {/* 臉部橢圓 - 中心在 (100, 75)，這樣額頭區域可以被頭髮覆蓋 */}
            <ellipse cx="100" cy="75" rx="45" ry="45" fill={skin} filter="url(#softShadow)" />

            {/* 腮紅 */}
            <ellipse cx="62" cy="85" rx="10" ry="6" fill="#fca5a5" opacity="0.25" />
            <ellipse cx="138" cy="85" rx="10" ry="6" fill="#fca5a5" opacity="0.25" />

            {/* ===== 6. 頭髮（覆蓋頭頂和額頭）===== */}
            {renderHair()}

            {/* ===== 7. 臉部特徵 ===== */}
            {/* 眼睛 - Q版大眼睛 */}
            <ellipse cx="78" cy="72" rx="14" ry="12" fill="white" />
            <ellipse cx="122" cy="72" rx="14" ry="12" fill="white" />

            {/* 虹膜 */}
            <ellipse cx="78" cy="74" rx="9" ry="10" fill="#1e3a5f" />
            <ellipse cx="122" cy="74" rx="9" ry="10" fill="#1e3a5f" />

            {/* 瞳孔 */}
            <ellipse cx="78" cy="75" rx="5" ry="6" fill="#0f172a" />
            <ellipse cx="122" cy="75" rx="5" ry="6" fill="#0f172a" />

            {/* 眼睛高光 - 大的可愛風格 */}
            <circle cx="74" cy="70" r="4" fill="white" opacity="0.95" />
            <circle cx="118" cy="70" r="4" fill="white" opacity="0.95" />
            <circle cx="82" cy="78" r="2" fill="white" opacity="0.6" />
            <circle cx="126" cy="78" r="2" fill="white" opacity="0.6" />

            {/* 女性睫毛 */}
            {isFemale && (
                <g>
                    <path d="M64,64 Q68,60 72,64" stroke="#374151" strokeWidth="1.5" fill="none" />
                    <path d="M84,64 Q88,60 92,64" stroke="#374151" strokeWidth="1.5" fill="none" />
                    <path d="M108,64 Q112,60 116,64" stroke="#374151" strokeWidth="1.5" fill="none" />
                    <path d="M128,64 Q132,60 136,64" stroke="#374151" strokeWidth="1.5" fill="none" />
                </g>
            )}

            {/* 眉毛 */}
            {isFemale ? (
                <g>
                    <path d="M64,58 Q78,54 92,58" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M108,58 Q122,54 136,58" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>
            ) : (
                <g>
                    <path d="M62,57 Q78,51 94,57" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M106,57 Q122,51 138,57" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round" />
                </g>
            )}

            {/* 鼻子 */}
            <ellipse cx="100" cy="88" rx="3" ry="2" fill="#00000015" />

            {/* 嘴巴 - 可愛微笑 */}
            <path d="M90,98 Q100,106 110,98" stroke="#b45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* ===== 8. 配件 ===== */}
            {renderAccessory()}
        </svg>
    );
};

// ===== MAIN COMPONENT =====
export default function Character({ type, avatar, expression = 'neutral', className = '', animated = true }: CharacterProps) {
    const renderCharacter = () => {
        switch (type) {
            case 'mike':
                return <MikeImage expression={expression} />;
            case 'bit':
                return <BitSVG animated={animated} />;
            case 'ceo':
                return <CeoSVG expression={expression} />;
            case 'player':
                return avatar ? <PlayerSVG data={avatar} animated={animated} /> : null;
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`relative ${className}`}
        >
            {renderCharacter()}
        </motion.div>
    );
}

export { SUIT_COLORS, HAIR_STYLES, SKIN_TONES, ACCESSORIES };
