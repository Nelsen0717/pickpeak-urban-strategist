'use client';

import React, { useState } from 'react';
import { useGameStore, AvatarState } from '@/lib/store';
import Character from './Character';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function AvatarEditor({ onComplete }: { onComplete: () => void }) {
    const { setAvatar } = useGameStore();
    const [current, setCurrent] = useState<AvatarState>({ hair: 0, face: 0, suit: 0, accessory: 0 });

    const update = (key: keyof AvatarState, delta: number) => {
        const limits = { hair: 6, face: 4, suit: 8, accessory: 4 };
        setCurrent(prev => ({
            ...prev,
            [key]: Math.abs((prev[key] + delta + limits[key]) % limits[key])
        }));
    };

    const handleSave = () => {
        setAvatar(current);
        onComplete();
    };

    const Control = ({ label, field }: { label: string, field: keyof AvatarState }) => (
        <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-slate-300 font-mono text-sm">{label}</span>
            <div className="flex items-center gap-3">
                <button onClick={() => update(field, -1)} className="p-1 hover:bg-slate-700 rounded"><ChevronLeft className="w-4 h-4 text-cyan-400" /></button>
                <span className="w-4 text-center text-white font-bold">{current[field] + 1}</span>
                <button onClick={() => update(field, 1)} className="p-1 hover:bg-slate-700 rounded"><ChevronRight className="w-4 h-4 text-cyan-400" /></button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-900/90 rounded-2xl border border-cyan-500/30 backdrop-blur-xl max-w-4xl w-full">
            <div className="w-64 h-64 bg-gradient-to-b from-slate-800 to-slate-900 rounded-full border-4 border-slate-700 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2),transparent)]" />
                <Character type="player" avatar={current} className="w-full h-full transform translate-y-4" />
            </div>

            <div className="flex-1 space-y-6 w-full">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">建立您的 Raiser 形象</h2>
                    <p className="text-slate-400 text-sm">自訂您的外觀以加入艦隊。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Control label="髮型樣式" field="hair" />
                    <Control label="太空服配色" field="suit" />
                    <Control label="臉部特徵" field="face" />
                    <Control label="戰術配件" field="accessory" />
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                    <Check className="w-5 h-5" /> 確認形象並登入
                </button>
            </div>
        </div>
    );
}
