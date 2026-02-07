import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionProps {
    title: string;
    icon?: ReactNode;
    badge?: string;
    defaultExpanded?: boolean;
    children: ReactNode;
    className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
    title,
    icon,
    badge,
    defaultExpanded = false,
    children,
    className = '',
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className={`bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/40 overflow-hidden ${className}`}>
            {/* Header - Touch optimized (min-height 48px) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 active:bg-slate-100/50 transition-colors touch-manipulation"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="text-tech-500 flex-shrink-0">
                            {icon}
                        </div>
                    )}
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide text-left">
                        {title}
                    </h3>
                    {badge && (
                        <span className="px-2 py-0.5 bg-tech-100 text-tech-700 text-[10px] font-bold rounded-full">
                            {badge}
                        </span>
                    )}
                </div>

                {/* Chevron indicator */}
                <motion.svg
                    className="w-5 h-5 text-slate-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            {/* Content - Animated */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t border-slate-100">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
