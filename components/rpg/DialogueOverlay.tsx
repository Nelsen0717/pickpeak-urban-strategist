'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

    // Guard against empty lines array
    const currentLine = lines && lines.length > 0 ? lines[index] : null;

    const next = useCallback(() => {
        if (!lines || lines.length === 0) {
            onComplete();
            return;
        }
        if (index < lines.length - 1) {
            setIndex(i => i + 1);
        } else {
            onComplete();
        }
    }, [index, lines, onComplete]);

    // Keyboard support - Spacebar, Enter, or Arrow Right to continue
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight') {
                e.preventDefault();
                next();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [next]);

    // Don't render if no valid line
    if (!currentLine) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            {/* Backdrop - click anywhere to continue */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto cursor-pointer" onClick={next} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={next}
                    className="relative w-full max-w-3xl bg-slate-900/95 border-2 border-cyan-500/50 rounded-2xl p-8 shadow-2xl pointer-events-auto cursor-pointer hover:border-cyan-400/70 transition-colors"
                >
                    {/* Character Portrait - centered at top */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-cyan-500/30 overflow-hidden shadow-lg shadow-cyan-500/20">
                            <Character
                                type={currentLine.speaker === 'Mike' ? 'mike' : 'player'}
                                expression={currentLine.expression}
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        {/* Speaker name */}
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
                            <span className="text-cyan-400 font-bold font-mono uppercase tracking-wider text-lg">
                                {currentLine.speaker === 'Mike' ? 'Captain Mike' : 'Raiser'}
                            </span>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
                        </div>

                        {/* Dialogue text */}
                        <p className="text-white text-xl leading-relaxed px-4">
                            {currentLine.text}
                        </p>

                        {/* Progress and continue hint */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                            <span className="text-slate-600 text-xs font-mono">
                                {index + 1} / {lines.length}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 text-xs font-mono">
                                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 text-[10px] border border-slate-700">SPACE</kbd>
                                </span>
                                <motion.div
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-cyan-400 text-sm flex items-center gap-1"
                                >
                                    點擊繼續 <ChevronRight className="w-4 h-4" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
