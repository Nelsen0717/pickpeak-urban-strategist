'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AvatarState } from '@/lib/store';

interface CharacterProps {
    type: 'player' | 'mike' | 'bit';
    avatar?: AvatarState;
    expression?: 'neutral' | 'happy' | 'serious';
    className?: string;
}

export default function Character({ type, avatar, expression = 'neutral', className = '' }: CharacterProps) {

    const BitSVG = () => (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl animate-pulse">
            <defs>
                <radialGradient id="bitEye" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#0891b2" />
                </radialGradient>
            </defs>

            {/* Floating Body */}
            <circle cx="100" cy="100" r="60" fill="#1e293b" stroke="#334155" strokeWidth="4" />

            {/* Eye */}
            <circle cx="100" cy="100" r="25" fill="url(#bitEye)" />
            <circle cx="100" cy="100" r="10" fill="#fff" opacity="0.5" />

            {/* Antenna */}
            <line x1="100" y1="40" x2="100" y2="10" stroke="#334155" strokeWidth="4" />
            <circle cx="100" cy="10" r="5" fill="#ef4444" />

            {/* Wings/Thrusters */}
            <path d="M30,100 L10,80 L10,120 Z" fill="#475569" />
            <path d="M170,100 L190,80 L190,120 Z" fill="#475569" />
        </svg>
    );

    const MikeSVG = () => (
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            <defs>
                <linearGradient id="mikeSuit" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1e293b" /> {/* Dark Blue Suit */}
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(6,182,212,0.4)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
                </linearGradient>
            </defs>

            {/* Space Suit Body */}
            <path d="M40,200 L40,150 Q40,110 100,110 Q160,110 160,150 L160,200 Z" fill="url(#mikeSuit)" />

            {/* Shoulder Pads */}
            <path d="M30,160 Q40,130 60,140" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M170,160 Q160,130 140,140" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

            {/* Rank Insignia */}
            <rect x="80" y="160" width="40" height="5" fill="#f59e0b" rx="2" />
            <circle cx="100" cy="175" r="8" fill="#06b6d4" className="animate-pulse" />

            {/* Head */}
            <circle cx="100" cy="80" r="38" fill="#f1d5b5" />

            {/* Face Features */}
            <circle cx="85" cy="78" r="3" fill="#1e293b" />
            <circle cx="115" cy="78" r="3" fill="#1e293b" />

            {/* Holographic Visor (Mike's signature sci-fi look) */}
            <path d="M55,75 Q100,90 145,75 L145,70 Q100,85 55,70 Z" fill="#06b6d4" opacity="0.5" />
            <path d="M55,75 Q100,90 145,75" stroke="#06b6d4" strokeWidth="1" fill="none" />

            {/* Smile */}
            {expression === 'serious' ? (
                <path d="M90,100 Q100,95 110,100" stroke="#1e293b" strokeWidth="2" fill="none" />
            ) : (
                <path d="M85,95 Q100,110 115,95" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}

            {/* Hair - Grey/White Space Captain Style */}
            <path d="M55,75 Q50,40 80,30 Q100,20 120,30 Q150,40 145,75 Q150,60 145,50 Q130,20 100,20 Q70,20 55,50 Q50,60 55,75 Z" fill="#cbd5e1" />
        </svg>
    );

    const PlayerSVG = ({ data }: { data: AvatarState }) => {
        const suitColors = [
            '#06b6d4', // Cyan
            '#f43f5e', // Rose
            '#8b5cf6', // Violet
            '#10b981', // Emerald
            '#f59e0b', // Amber
            '#3b82f6', // Blue
            '#6366f1', // Indigo
            '#ec4899', // Pink
            '#e2e8f0'  // White Space Suit (Index 8)
        ];

        const hairColors = [
            '#1e293b', // Black
            '#f1c40f', // Blonde
            '#e74c3c', // Red
            '#ecf0f1', // White
            '#8d6e63', // Brown
            '#607d8b', // Grey
        ];

        return (
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                {/* Suit */}
                <path d="M40,200 L40,160 Q40,120 100,120 Q160,120 160,160 L160,200 Z" fill={suitColors[data.suit % suitColors.length]} />

                {/* Space Suit Details (if index 8) */}
                {(data.suit % suitColors.length === 8) && (
                    <>
                        <path d="M100,120 L100,200" stroke="#94a3b8" strokeWidth="2" />
                        <rect x="85" y="140" width="30" height="20" rx="5" fill="#334155" />
                        <circle cx="100" cy="150" r="5" fill="#06b6d4" className="animate-pulse" />
                        <path d="M40,160 Q60,160 60,200" stroke="#94a3b8" strokeWidth="4" fill="none" />
                        <path d="M160,160 Q140,160 140,200" stroke="#94a3b8" strokeWidth="4" fill="none" />
                    </>
                )}

                {/* Standard Suit Details */}
                {(data.suit % suitColors.length !== 8) && (
                    <path d="M100,120 L100,200" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                )}

                {/* Head */}
                <circle cx="100" cy="80" r="35" fill="#f1d5b5" />

                {/* Face */}
                <circle cx="85" cy="75" r="3" fill="#1e293b" />
                <circle cx="115" cy="75" r="3" fill="#1e293b" />

                {/* Expressions */}
                {data.face === 0 && <path d="M90,90 Q100,100 110,90" stroke="#1e293b" strokeWidth="2" fill="none" />}
                {data.face === 1 && <path d="M90,95 Q100,90 110,95" stroke="#1e293b" strokeWidth="2" fill="none" />}
                {data.face === 2 && <circle cx="100" cy="95" r="5" fill="#1e293b" />}
                {data.face === 3 && <path d="M85,95 L115,95" stroke="#1e293b" strokeWidth="2" />}

                {/* Hair */}
                {data.hair === 0 && <path d="M65,80 Q65,40 100,40 Q135,40 135,80" fill={hairColors[0]} />}
                {data.hair === 1 && <path d="M60,85 Q60,30 100,30 Q140,30 140,85 L140,60 Q100,20 60,60 Z" fill={hairColors[1]} />}
                {data.hair === 2 && <path d="M65,60 L135,60 L135,80 L65,80 Z" fill={hairColors[2]} />}
                {data.hair === 3 && <circle cx="100" cy="70" r="38" fill={hairColors[3]} clipPath="inset(0 0 50% 0)" />}
                {data.hair === 4 && <path d="M60,80 Q60,30 100,30 Q140,30 140,80 L140,100 L130,80 L70,80 L60,100 Z" fill={hairColors[4]} />}
                {data.hair === 5 && <path d="M65,80 Q65,20 100,20 Q135,20 135,80" fill={hairColors[5]} />}

                {/* Accessory */}
                {data.accessory === 1 && ( // Glasses
                    <g>
                        <circle cx="85" cy="75" r="8" stroke="#333" strokeWidth="2" fill="rgba(0,0,0,0.1)" />
                        <circle cx="115" cy="75" r="8" stroke="#333" strokeWidth="2" fill="rgba(0,0,0,0.1)" />
                        <line x1="93" y1="75" x2="107" y2="75" stroke="#333" strokeWidth="2" />
                    </g>
                )}
                {data.accessory === 2 && ( // Headset
                    <path d="M60,80 Q60,30 100,30 Q140,30 140,80 L140,90" stroke="#333" strokeWidth="4" fill="none" />
                )}
                {data.accessory === 3 && ( // Mask
                    <path d="M70,85 Q100,110 130,85 L130,100 Q100,120 70,100 Z" fill="#333" opacity="0.8" />
                )}
                {data.accessory === 4 && ( // Bubble Helmet
                    <g>
                        <circle cx="100" cy="80" r="50" fill="rgba(148, 163, 184, 0.2)" stroke="#94a3b8" strokeWidth="2" />
                        <path d="M70,60 Q80,50 90,60" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </g>
                )}
            </svg>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative ${className}`}
        >
            {type === 'mike' ? <MikeSVG /> : type === 'bit' ? <BitSVG /> : avatar ? <PlayerSVG data={avatar} /> : null}
        </motion.div>
    );
}
