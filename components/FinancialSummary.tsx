import React from 'react';
import { motion } from 'framer-motion';
import { FunnelState } from '../types';

interface FinancialSummaryProps {
    state: FunnelState;
    campaignType?: 'site' | 'whatsapp';
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ state, campaignType = 'site' }) => {
    const isProfit = state.revenue - state.investment >= 0;
    const profitMargin = state.revenue > 0 ? ((state.revenue - state.investment) / state.revenue * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900 via-dark-950 to-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/5"
        >
            {/* Background grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), 
                                     linear-gradient(to bottom, white 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            ></div>

            {/* Decorative glow spots */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-tech-500/15 rounded-full blur-[80px] -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px] -ml-12 -mb-12"></div>
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-neon-500/5 rounded-full blur-[40px]"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-tech-400 uppercase tracking-[0.3em]">Projeção Final</h3>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isProfit
                            ? 'bg-neon-500/20 text-neon-400 ring-1 ring-neon-500/30'
                            : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30'
                            }`}
                    >
                        {isProfit ? '↑ Lucro' : '↓ Prejuízo'}
                    </motion.div>
                </div>

                <div className="space-y-6">
                    {/* Faturamento Bruto */}
                    <div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-slate-700"></span>
                            Faturamento Bruto
                        </p>
                        <motion.p
                            key={state.revenue}
                            initial={{ opacity: 0.5, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black tracking-tighter leading-none"
                        >
                            <span className="text-slate-400 text-2xl mr-1">R$</span>
                            <span className="bg-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-transparent">
                                {state.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                        </motion.p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                            <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Investimento</span>
                            <span className="text-base font-black text-slate-300">
                                R$ {state.investment.toLocaleString('pt-BR')}
                            </span>
                        </div>
                        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                            <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Ticket Médio</span>
                            <span className="text-base font-black text-slate-300">
                                R$ {state.ticketMedio.toLocaleString('pt-BR')}
                            </span>
                        </div>
                    </div>

                    {/* Resultado Líquido */}
                    <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-slate-700"></span>
                                Resultado Líquido
                            </p>
                            <span className={`text-[10px] font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {profitMargin.toFixed(1)}% margem
                            </span>
                        </div>
                        <motion.p
                            key={state.revenue - state.investment}
                            initial={{ scale: 0.95, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-5xl font-black tracking-tighter leading-none ${isProfit
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                                }`}
                        >
                            <span className="text-2xl mr-1 opacity-60">R$</span>
                            {(state.revenue - state.totalInvestment).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Alocação de Verba - Enhanced Progress Bar */}
            <div className="mt-6 relative z-10">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Alocação de Verba</span>
                    </div>
                    <span className="text-[11px] font-black bg-gradient-to-r from-tech-400 to-cyan-400 bg-clip-text text-transparent">
                        {(state.revenue > 0 ? (state.investment / state.revenue * 100).toFixed(1) : 0)}%
                    </span>
                </div>
                <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <motion.div
                        className="h-full rounded-full relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(90deg, #0369a1 0%, #0ea5e9 30%, #06b6d4 60%, #10b981 100%)'
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (state.investment / (state.revenue || 1)) * 100)}%` }}
                        transition={{ duration: 1, type: "spring" }}
                    >
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
