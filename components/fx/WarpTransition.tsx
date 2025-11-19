'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WarpTransition() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
        >
            <div className="relative w-full h-full overflow-hidden">
                {/* Stars */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: "50%", y: "50%", scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 20],
                            opacity: [0, 1, 0],
                            x: ["50%", `${Math.random() * 100}%`],
                            y: ["50%", `${Math.random() * 100}%`]
                        }}
                        transition={{
                            duration: 1,
                            ease: "easeIn",
                            delay: Math.random() * 0.2,
                            repeat: Infinity
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                    />
                ))}

                {/* Central Light */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 50], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"
                />

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-500 font-bold text-2xl tracking-[1em]"
                >
                    WARP DRIVE ACTIVE
                </motion.div>
            </div>
        </motion.div>
    );
}
