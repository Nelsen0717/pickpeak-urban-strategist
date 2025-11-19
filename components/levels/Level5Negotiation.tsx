'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import Character from '../rpg/Character';
import { Shield, Zap, MessageSquare, Briefcase } from 'lucide-react';
import clsx from 'clsx';

interface Action {
    id: string;
    label: string;
    type: 'attack' | 'defend' | 'special';
    damage: number; // Influence points
    description: string;
    requiredItem?: string;
}

const ACTIONS: Action[] = [
    { id: 'a1', label: '展示市場數據', type: 'attack', damage: 20, description: '引用 PickPeak 的租金行情，證明開價合理。' },
    { id: 'a2', label: '強調 ESG 優勢', type: 'attack', damage: 25, description: '強調綠建築認證，符合企業永續目標。' },
    { id: 'a3', label: '傾聽需求', type: 'defend', damage: 0, description: '暫時退讓，了解對方的痛點，恢復 10 點耐心值。' },
    { id: 's1', label: 'Deep Scan (深層掃描)', type: 'special', damage: 35, description: '看穿 CEO 的財務壓力點。(需: 光譜掃描儀)', requiredItem: 'spectral_scanner' },
    { id: 's2', label: 'Strategic Leverage (戰略籌碼)', type: 'special', damage: 50, description: '揭露競爭對手的動向，一擊必殺。(需: 泰坦機密檔案)', requiredItem: 'titan_dossier' },
];

export default function Level5Negotiation() {
    const { avatar, inventory, addXp, completeLevel, unlockBadge, setView } = useGameStore();
    const [enemyHealth, setEnemyHealth] = useState(100); // CEO's Resistance
    const [playerHealth, setPlayerHealth] = useState(100); // Player's Patience
    const [turn, setTurn] = useState<'player' | 'enemy'>('player');
    const [log, setLog] = useState<string[]>(['談判開始！對手是科技巨頭 CEO。']);
    const [success, setSuccess] = useState(false);

    const handleAction = (action: Action) => {
        if (turn !== 'player') return;

        // Player Turn
        let damage = action.damage;
        let logMsg = `你使用了【${action.label}】。`;

        if (action.type === 'defend') {
            setPlayerHealth(h => Math.min(100, h + 10));
            logMsg += '耐心值恢復了！';
        } else {
            setEnemyHealth(h => Math.max(0, h - damage));
            logMsg += `對 CEO 造成了 ${damage} 點影響力！`;
        }

        setLog(prev => [logMsg, ...prev].slice(0, 3));
        setTurn('enemy');

        // Check Win
        if (enemyHealth - damage <= 0) {
            setTimeout(() => {
                setSuccess(true);
                addXp(1000);
                completeLevel('negotiation');
                unlockBadge('Master Negotiator');
                // setView('hub') handled by GameEngine overlay
            }, 1000);
            return;
        }

        // Enemy Turn (Simulated)
        setTimeout(() => {
            const enemyDamage = Math.floor(Math.random() * 15) + 10;
            setPlayerHealth(h => Math.max(0, h - enemyDamage));
            setLog(prev => [`CEO 提出了質疑，造成 ${enemyDamage} 點壓力！`, ...prev].slice(0, 3));
            setTurn('player');
        }, 1500);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center space-y-8 text-center h-full">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 1.5 }}
                    className="text-8xl filter drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                >
                    🤝
                </motion.div>
                <div className="space-y-2">
                    <h2 className="text-5xl font-bold text-white tracking-tight">NEGOTIATION COMPLETE</h2>
                    <p className="text-cyan-400 font-mono tracking-widest">CONTRACT SECURED</p>
                </div>
                <p className="text-slate-300 max-w-md leading-relaxed">
                    您成功說服了 CEO，簽下了這筆指標性合約。
                    <br />方睿艦隊以您為榮。
                </p>
                <div className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-900/20">
                    <p className="text-cyan-400 font-mono text-xs mb-2 tracking-widest">MISSION REWARD</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-2xl shadow-lg">👑</div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-white">Master Negotiator</h3>
                            <p className="text-xs text-slate-400">獲得「談判大師」徽章</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (playerHealth <= 0) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 text-center h-full">
                <h2 className="text-4xl font-bold text-red-500 tracking-widest">NEGOTIATION FAILED</h2>
                <p className="text-slate-400">對方失去了耐心，談判破裂。</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold tracking-wider transition-colors shadow-lg shadow-red-900/20"
                >
                    RETRY MISSION
                </button>
            </div>
        );
    }

    return (
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {action.type === 'attack' && <Zap className="w-4 h-4 text-yellow-400" />}
                                    {action.type === 'defend' && <Shield className="w-4 h-4 text-green-400" />}
                                    {action.type === 'special' && <MessageSquare className="w-4 h-4 text-purple-400" />}
                                    <span className="font-bold text-white text-lg">{action.label}</span>
                                </div>
                                <p className="text-xs text-slate-400">{action.description}</p>
                                {
        isLocked && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-red-400 font-bold">
                需裝備: {action.requiredItem}
            </div>
        )
    }
                            </button >
                        );
})}
                </div >
            </div >
        </div >
    );
}
