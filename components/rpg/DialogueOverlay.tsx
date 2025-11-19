'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Character from './Character';
import { ChevronRight } from 'lucide-react';

interface DialogueLine {
    speaker: 'Mike' | 'Player';
    text: string;
    expression?: 'neutral' | 'happy' | 'serious';
}

interface DialogueOverlayProps {
    lines: DialogueLine[];
    onComplete: () => void;
}

export default function DialogueOverlay({ lines, onComplete }: DialogueOverlayProps) {
    const [index, setIndex] = useState(0);
    const currentLine = lines[index];

    const next = () => {
        if (index < lines.length - 1) {
            setIndex(i => i + 1);
        } else {
            onComplete();
        }
    };

    // Auto-advance or keyboard support could be added here

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-12 px-4 pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={next} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl bg-slate-900/95 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl pointer-events-auto flex gap-6 items-end"
                >
                    {/* Character Portrait */}
                    <div className="hidden md:block w-32 h-32 -ml-10 -mb-10 flex-shrink-0">
                        <Character
                            type={currentLine.speaker === 'Mike' ? 'mike' : 'player'}
                            expression={currentLine.expression}
                            className="w-full h-full drop-shadow-xl"
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-cyan-400 font-bold font-mono uppercase tracking-wider">
                                {currentLine.speaker === 'Mike' ? 'Captain Mike' : 'Raiser'}
                            </span>
                            <span className="text-slate-600 text-xs font-mono">
                                MSG {index + 1}/{lines.length}
                            </span>
                        </div>

                        <p className="text-white text-lg leading-relaxed">
                            {currentLine.text}
                        </p>

                        <div className="flex justify-end mt-2">
                            <button
                                onClick={next}
                                className="text-slate-400 hover:text-white text-sm flex items-center gap-1 animate-pulse"
                            >
                                點擊繼續 <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
