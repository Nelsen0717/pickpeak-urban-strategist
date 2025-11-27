'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore, AvatarState } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import Character, { SUIT_COLORS, HAIR_STYLES, SKIN_TONES, ACCESSORIES } from './Character';
import { ChevronLeft, ChevronRight, Check, RotateCcw, Sparkles, User, Shirt, Palette, Star } from 'lucide-react';
import clsx from 'clsx';

type EditorTab = 'gender' | 'face' | 'hair' | 'suit' | 'accessory';

const TABS: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'gender', label: '性別', icon: <User className="w-5 h-5" /> },
    { id: 'face', label: '膚色', icon: <Palette className="w-5 h-5" /> },
    { id: 'hair', label: '髮型', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'suit', label: '制服', icon: <Shirt className="w-5 h-5" /> },
    { id: 'accessory', label: '配件', icon: <Star className="w-5 h-5" /> },
];

export default function AvatarEditor({ onComplete }: { onComplete: () => void }) {
    const { setAvatar, avatar: savedAvatar } = useGameStore();
    const [current, setCurrent] = useState<AvatarState>(
        savedAvatar.hair || savedAvatar.suit ? savedAvatar : { hair: 1, face: 1, suit: 0, accessory: 0, gender: 'male' }
    );
    const [activeTab, setActiveTab] = useState<EditorTab>('gender');
    const [isRotating, setIsRotating] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        // Trigger rotation animation on change
        setIsRotating(true);
        const timer = setTimeout(() => setIsRotating(false), 300);
        return () => clearTimeout(timer);
    }, [current]);

    const update = (key: 'hair' | 'face' | 'suit' | 'accessory', value: number) => {
        const limits = {
            hair: HAIR_STYLES.length,
            face: SKIN_TONES.length,
            suit: SUIT_COLORS.length,
            accessory: ACCESSORIES.length
        };
        setCurrent(prev => ({
            ...prev,
            [key]: Math.abs(value % limits[key])
        }));
    };

    const handleReset = () => {
        setCurrent({ hair: 1, face: 1, suit: 0, accessory: 0, gender: 'male' });
    };

    const handleGenderChange = (gender: 'male' | 'female') => {
        setCurrent(prev => ({ ...prev, gender }));
    };

    const handleSave = () => {
        setShowConfirmation(true);
        setTimeout(() => {
            setAvatar(current);
            onComplete();
        }, 1500);
    };

    const renderSelector = () => {
        switch (activeTab) {
            case 'gender':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleGenderChange('male')}
                            className={clsx(
                                "relative p-6 rounded-xl border-2 transition-all",
                                current.gender === 'male'
                                    ? "border-cyan-400 bg-cyan-900/30 shadow-lg shadow-cyan-500/20"
                                    : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                            )}
                        >
                            <div className="text-center">
                                <div className="text-5xl mb-3">👨‍💼</div>
                                <p className="text-white font-bold text-lg">男性</p>
                                <p className="text-slate-400 text-sm">Male</p>
                            </div>
                            {current.gender === 'male' && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3"
                                >
                                    <Star className="w-6 h-6 text-cyan-400 fill-cyan-400" />
                                </motion.div>
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleGenderChange('female')}
                            className={clsx(
                                "relative p-6 rounded-xl border-2 transition-all",
                                current.gender === 'female'
                                    ? "border-pink-400 bg-pink-900/30 shadow-lg shadow-pink-500/20"
                                    : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                            )}
                        >
                            <div className="text-center">
                                <div className="text-5xl mb-3">👩‍💼</div>
                                <p className="text-white font-bold text-lg">女性</p>
                                <p className="text-slate-400 text-sm">Female</p>
                            </div>
                            {current.gender === 'female' && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3"
                                >
                                    <Star className="w-6 h-6 text-pink-400 fill-pink-400" />
                                </motion.div>
                            )}
                        </motion.button>
                    </div>
                );

            case 'face':
                return (
                    <div className="grid grid-cols-3 gap-3">
                        {SKIN_TONES.map((color, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => update('face', index)}
                                className={clsx(
                                    "relative aspect-square rounded-xl border-2 transition-all overflow-hidden",
                                    current.face === index
                                        ? "border-cyan-400 shadow-lg shadow-cyan-500/30"
                                        : "border-slate-700 hover:border-slate-500"
                                )}
                            >
                                <div
                                    className="absolute inset-2 rounded-lg"
                                    style={{ backgroundColor: color }}
                                />
                                {current.face === index && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-1 right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center"
                                    >
                                        <Check className="w-3 h-3 text-white" />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                );

            case 'hair':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {HAIR_STYLES.map((style, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => update('hair', index)}
                                className={clsx(
                                    "relative p-4 rounded-xl border-2 transition-all",
                                    current.hair === index
                                        ? "border-cyan-400 bg-cyan-900/30 shadow-lg shadow-cyan-500/20"
                                        : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-slate-600 relative overflow-hidden"
                                        style={{ backgroundColor: style.color }}
                                    >
                                        {/* Highlight effect */}
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                background: `linear-gradient(135deg, ${(style as { highlight?: string }).highlight || style.color} 0%, transparent 60%)`
                                            }}
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-bold">{style.name}</p>
                                        <p className="text-slate-400 text-xs">{
                                            style.type === 'professional' ? '專業俐落' :
                                            style.type === 'side-swept' ? '側分時尚' :
                                            style.type === 'textured' ? '層次紋理' :
                                            style.type === 'slicked' ? '後梳油頭' :
                                            style.type === 'undercut' ? '削邊漸層' :
                                            style.type === 'pompadour' ? '蓬巴杜' : style.type
                                        }</p>
                                    </div>
                                </div>
                                {current.hair === index && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2"
                                    >
                                        <Star className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                );

            case 'suit':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {SUIT_COLORS.map((suit, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => update('suit', index)}
                                className={clsx(
                                    "relative p-4 rounded-xl border-2 transition-all overflow-hidden",
                                    current.suit === index
                                        ? "border-cyan-400 shadow-lg shadow-cyan-500/20"
                                        : "border-slate-700 hover:border-slate-500"
                                )}
                            >
                                {/* Color Preview */}
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{ background: `linear-gradient(135deg, ${suit.primary}, ${suit.secondary})` }}
                                />
                                <div className="relative flex items-center gap-3">
                                    <div className="flex -space-x-1">
                                        <div
                                            className="w-6 h-6 rounded-full border border-white/20"
                                            style={{ backgroundColor: suit.primary }}
                                        />
                                        <div
                                            className="w-6 h-6 rounded-full border border-white/20"
                                            style={{ backgroundColor: suit.secondary }}
                                        />
                                        <div
                                            className="w-6 h-6 rounded-full border border-white/20"
                                            style={{ backgroundColor: suit.accent }}
                                        />
                                    </div>
                                    <p className="text-white font-bold">{suit.name}</p>
                                </div>
                                {current.suit === index && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2"
                                    >
                                        <Star className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                );

            case 'accessory':
                return (
                    <div className="grid grid-cols-2 gap-3">
                        {ACCESSORIES.map((acc, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => update('accessory', index)}
                                className={clsx(
                                    "relative p-4 rounded-xl border-2 transition-all",
                                    current.accessory === index
                                        ? "border-cyan-400 bg-cyan-900/30 shadow-lg shadow-cyan-500/20"
                                        : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl">
                                        {(acc as { icon?: string }).icon || '✨'}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-bold">{acc.name}</p>
                                        <p className="text-slate-400 text-xs">{
                                            acc.id === 'none' ? '原始風格' :
                                            acc.id === 'glasses' ? '專業形象' :
                                            acc.id === 'visor' ? '科技感十足' :
                                            acc.id === 'scar' ? '歷戰老兵' :
                                            acc.id === 'earpiece' ? '隨時待命' :
                                            acc.id === 'tattoo' ? '前衛風格' : acc.id
                                        }</p>
                                    </div>
                                </div>
                                {current.accessory === index && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2"
                                    >
                                        <Star className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Confirmation Overlay */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="text-center"
                        >
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                                <Check className="w-16 h-16 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">IDENTITY CONFIRMED</h2>
                            <p className="text-cyan-400 font-mono tracking-widest">身份已確認</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-900/20 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-8 py-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                角色創建系統
                            </h2>
                            <p className="text-slate-400 mt-1">自訂您的 Raiser 形象，加入方睿艦隊</p>
                        </div>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            重置
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Character Preview */}
                    <div className="lg:w-2/5 p-8 flex flex-col items-center justify-center bg-gradient-to-b from-slate-800/50 to-transparent">
                        {/* Preview Stage */}
                        <div className="relative">
                            {/* Background Glow */}
                            <div
                                className="absolute inset-0 blur-3xl opacity-30 rounded-full"
                                style={{
                                    background: `radial-gradient(circle, ${SUIT_COLORS[current.suit % SUIT_COLORS.length].primary}, transparent)`
                                }}
                            />

                            {/* Platform */}
                            <div className="relative">
                                <div className="w-72 h-72 relative">
                                    {/* Rotating Ring */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full"
                                    />

                                    {/* Character */}
                                    <motion.div
                                        animate={isRotating ? { rotateY: [0, 10, 0] } : {}}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-4"
                                    >
                                        <Character
                                            type="player"
                                            avatar={current}
                                            className="w-full h-full drop-shadow-2xl"
                                        />
                                    </motion.div>
                                </div>

                                {/* Platform Base */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent rounded-full blur-sm" />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
                            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 text-center">
                                <p className="text-slate-400 text-xs">髮型</p>
                                <p className="text-white font-bold">{HAIR_STYLES[current.hair % HAIR_STYLES.length].name}</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 text-center">
                                <p className="text-slate-400 text-xs">制服</p>
                                <p className="text-white font-bold">{SUIT_COLORS[current.suit % SUIT_COLORS.length].name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customization Panel */}
                    <div className="lg:w-3/5 p-8 border-l border-slate-800">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all",
                                        activeTab === tab.id
                                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                                            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                                    )}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Selector Content */}
                        <div className="min-h-[320px] mb-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderSelector()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Quick Navigation */}
                        <div className="flex items-center justify-between mb-6 py-4 border-t border-slate-800">
                            <button
                                onClick={() => {
                                    const currentIndex = TABS.findIndex(t => t.id === activeTab);
                                    const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
                                    setActiveTab(TABS[prevIndex].id);
                                }}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                上一步
                            </button>
                            <div className="flex gap-2">
                                {TABS.map((tab, i) => (
                                    <div
                                        key={tab.id}
                                        className={clsx(
                                            "w-2 h-2 rounded-full transition-all",
                                            activeTab === tab.id ? "bg-cyan-400 w-6" : "bg-slate-600"
                                        )}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    const currentIndex = TABS.findIndex(t => t.id === activeTab);
                                    const nextIndex = (currentIndex + 1) % TABS.length;
                                    setActiveTab(TABS[nextIndex].id);
                                }}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                下一步
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Confirm Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            className="w-full py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-size-200 hover:bg-right text-white font-bold text-lg rounded-2xl shadow-2xl shadow-cyan-500/30 flex items-center justify-center gap-3 transition-all duration-500"
                            style={{ backgroundSize: '200% 100%' }}
                        >
                            <Check className="w-6 h-6" />
                            確認形象並加入艦隊
                            <Sparkles className="w-6 h-6" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
