import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface CharacterShimmerProps {
    text: string;
    className?: string;
    isMia?: boolean;
}

export const CharacterShimmer: React.FC<CharacterShimmerProps> = ({ text, className, isMia }) => {
    return (
        <span className={cn("relative inline-block", className)}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0.8, filter: "brightness(1) contrast(1)", textShadow: "0px 0px 0px rgba(0,0,0,0)" }}
                    animate={{
                        opacity: [0.8, 1, 0.8],
                        filter: ["brightness(1) contrast(1)", "brightness(1.5) contrast(1.2)", "brightness(1) contrast(1)"],
                        textShadow: [
                            "0px 0px 0px rgba(0,0,0,0)",
                            isMia ? "0px 0px 15px rgba(59,130,246,0.8)" : "0px 0px 15px rgba(249,115,22,0.8)",
                            "0px 0px 0px rgba(0,0,0,0)"
                        ]
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                        delay: index * 0.1,
                        ease: "easeInOut"
                    }}
                    className="inline-block transition-all"
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};
