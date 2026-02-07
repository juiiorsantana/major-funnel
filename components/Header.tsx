import React from 'react';
import { motion } from 'framer-motion';
import { FunnelState } from '../types';

interface HeaderProps {
    state: FunnelState;
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onReset }) => {
    return (
        <header className="bg-gradient-to-r from-white via-slate-50 to-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-30">
            {/* Logo Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 lg:space-x-4"
            >
                <div className="relative group">
                    {/* Glow effect behind logo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-tech-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-tech-600 to-cyan-600 rounded-2xl shadow-lg shadow-tech-500/25">
                        <span className="text-xl lg:text-2xl font-black text-white tracking-tighter">M</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs lg:text-sm font-black text-slate-800 uppercase tracking-[0.15em]">Major Pro</span>
                    <span className="text-[8px] lg:text-[9px] text-slate-400 font-bold uppercase tracking-widest">Wave Calculator</span>
                </div>
            </motion.div>

            {/* KPI Section - Responsive */}
            <div className="flex items-center gap-2 lg:gap-3">
                {/* MOBILE: Only ROAS visible, compact size */}
                <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`relative px-3 py-2 lg:px-5 lg:py-3 rounded-xl border-2 transition-all duration-300 ${state.roas >= 1
                        ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-lg shadow-emerald-100'
                        : 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-300 shadow-lg shadow-rose-100'
                        }`}
                >
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className={`relative hidden sm:block ${state.roas >= 1 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-current block animate-pulse"></span>
                            <span className="absolute inset-0 w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-current animate-ping opacity-50"></span>
                        </div>
                        <div>
                            <p className={`text-[8px] lg:text-[9px] font-black uppercase tracking-widest ${state.roas >= 1 ? 'text-emerald-600' : 'text-rose-600'}`}>ROAS</p>
                            <p className={`text-base lg:text-xl font-black tracking-tight leading-none ${state.roas >= 1 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {state.roas.toFixed(2)}x
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CPL Card - Hidden on mobile, visible on tablet+ */}
                <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="hidden md:flex px-4 py-2 lg:px-5 lg:py-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-lg shadow-slate-100"
                >
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-7 h-7 lg:w-8 lg:h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-.1283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[8px] lg:text-[9px] font-black text-slate-500 uppercase tracking-widest">CPL</p>
                            <p className="text-base lg:text-xl font-black text-slate-700 tracking-tight leading-none">
                                R$ {state.cpl.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* CPA Card - Hidden on mobile, visible on tablet+ */}
                <motion.div
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="hidden md:flex px-4 py-2 lg:px-5 lg:py-3 rounded-xl bg-gradient-to-br from-tech-50 to-cyan-50 border-2 border-tech-200 shadow-lg shadow-tech-100"
                >
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-7 h-7 lg:w-8 lg:h-8 bg-tech-100 rounded-lg flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-tech-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[8px] lg:text-[9px] font-black text-tech-600 uppercase tracking-widest">CPA</p>
                            <p className="text-base lg:text-xl font-black text-tech-700 tracking-tight leading-none">
                                R$ {state.cpa.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Reset Button */}
                <motion.button
                    whileHover={{ scale: 1.05, rotate: -15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    className="p-2.5 lg:p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all border-2 border-slate-200 hover:border-slate-300 shadow-sm"
                    title="Reset to Defaults"
                >
                    <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </motion.button>
            </div>
        </header>
    );
};
