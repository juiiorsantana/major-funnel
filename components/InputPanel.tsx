import React from 'react';
import { motion } from 'framer-motion';
import { FunnelState, MetricType, CampaignType } from '../types';
import { METRIC_CONFIGS } from '../constants';
import { MetricCard } from './MetricCard';
import { Accordion } from './Accordion';

interface InputPanelProps {
    state: FunnelState;
    onUpdate: (id: MetricType, value: number) => void;
    campaignType: CampaignType;
    onCampaignTypeChange: (type: CampaignType) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ state, onUpdate, campaignType, onCampaignTypeChange }) => {
    const getMetric = (id: MetricType) => METRIC_CONFIGS.find(m => m.id === id)!;

    const container = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { staggerChildren: 0.05, duration: 0.5 } }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    // Icons
    const MoneyIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const AdsIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
    );

    const FunnelIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
    );

    const LinkIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
    );

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="col-span-12 lg:col-span-3 flex flex-col gap-3 lg:gap-0 lg:bg-white/95 lg:backdrop-blur-sm lg:p-5 lg:rounded-3xl lg:border lg:border-slate-200/60 lg:shadow-xl lg:shadow-slate-200/40 lg:overflow-y-auto"
        >
            {/* Campaign Type Toggle - Always visible, not in accordion */}
            <motion.div variants={item} className="lg:mb-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/40 p-4 lg:bg-transparent lg:border-0 lg:shadow-none lg:p-0">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center mb-3">
                        <LinkIcon />
                        <span className="ml-2">Tipo de Campanha</span>
                    </label>
                    <div className="relative flex bg-slate-100 rounded-2xl p-1.5 gap-1.5 border border-slate-200 shadow-inner">
                        {(['site', 'whatsapp'] as const).map((type) => {
                            const isActive = campaignType === type;
                            return (
                                <motion.button
                                    key={type}
                                    onClick={() => onCampaignTypeChange(type)}
                                    whileHover={{ scale: isActive ? 1 : 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${isActive
                                        ? 'text-white shadow-lg'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={`absolute inset-0 rounded-xl ${type === 'site'
                                                ? 'bg-gradient-to-br from-tech-600 to-tech-700 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.6)]'
                                                : 'bg-gradient-to-br from-green-600 to-green-700 shadow-[0_4px_20px_-4px_rgba(34,197,94,0.6)]'
                                                }`}
                                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {type === 'site' ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        )}
                                        {type === 'site' ? 'Site' : 'WhatsApp'}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* Desktop: Traditional sections */}
            <div className="hidden lg:block">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-6 h-[2px] bg-gradient-to-r from-tech-500 to-cyan-500 rounded-full"></span>
                        Parâmetros
                    </h2>
                    <span className="w-2.5 h-2.5 bg-gradient-to-br from-tech-400 to-cyan-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(14,165,233,0.6)]"></span>
                </div>

                <div className="space-y-5">
                    {/* Agrupamento Financeiro */}
                    <motion.div variants={item} className="space-y-3">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center">
                            <MoneyIcon />
                            <span className="ml-2">Financeiro</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <MetricCard config={getMetric('investment')} value={state.investment} onChange={(v) => onUpdate('investment', v)} compact />
                            <MetricCard config={getMetric('ticketMedio')} value={state.ticketMedio} onChange={(v) => onUpdate('ticketMedio', v)} compact />
                        </div>
                    </motion.div>

                    {/* Agrupamento Ads */}
                    <motion.div variants={item} className="space-y-3">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center">
                            <AdsIcon />
                            <span className="ml-2">Anúncios</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <MetricCard config={getMetric('cpm')} value={state.cpm} onChange={(v) => onUpdate('cpm', v)} compact />
                            <MetricCard config={getMetric('ctr')} value={state.ctr} onChange={(v) => onUpdate('ctr', v)} compact />
                        </div>
                    </motion.div>

                    {/* Agrupamento Funil */}
                    <motion.div variants={item} className="space-y-3 pt-3 border-t border-slate-100">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center">
                            <FunnelIcon />
                            <span className="ml-2">Taxas de Conversão</span>
                        </label>
                        <div className="space-y-3">
                            {/* Connect Rate - Only visible for SITE campaign type */}
                            {campaignType === 'site' && (
                                <MetricCard config={getMetric('connectRate')} value={state.connectRate} onChange={(v) => onUpdate('connectRate', v)} compact />
                            )}

                            {/* WhatsApp specific fields */}
                            {campaignType === 'whatsapp' && (
                                <>
                                    <MetricCard config={getMetric('conversationRate')} value={state.conversationRate} onChange={(v) => onUpdate('conversationRate', v)} compact />
                                    <MetricCard config={getMetric('costPerConversation')} value={state.costPerConversation} compact />
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <MetricCard config={getMetric('conversionRate')} value={state.conversionRate} onChange={(v) => onUpdate('conversionRate', v)} compact />
                                <MetricCard config={getMetric('saleRate')} value={state.saleRate} onChange={(v) => onUpdate('saleRate', v)} compact />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Insight ROI - Desktop */}
                <motion.div variants={item} className="mt-auto pt-6">
                    <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-5 rounded-2xl text-white overflow-hidden border border-slate-700">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-tech-500/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl -ml-6 -mb-6"></div>

                        {/* Border gradient effect */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-tech-500/40 to-cyan-500/40 rounded-lg flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-tech-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                                    </svg>
                                </div>
                                <p className="text-[10px] font-black text-tech-300 uppercase tracking-[0.15em]">Insight de ROI</p>
                            </div>
                            <p className="text-[13px] leading-relaxed text-slate-300">
                                Com ROAS de <span className="font-black text-amber-400">{state.roas.toFixed(2)}x</span>, cada <span className="text-tech-300 font-bold">R$ 1,00</span> investido retorna <span className="font-black text-neon-400">R$ {state.roas.toFixed(2)}</span> em vendas brutas.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile: Accordion-based sections */}
            <div className="space-y-3 lg:hidden">
                <Accordion title="Financeiro" icon={<MoneyIcon />} defaultExpanded badge="2 campos">
                    <div className="grid grid-cols-2 gap-3">
                        <MetricCard config={getMetric('investment')} value={state.investment} onChange={(v) => onUpdate('investment', v)} compact />
                        <MetricCard config={getMetric('ticketMedio')} value={state.ticketMedio} onChange={(v) => onUpdate('ticketMedio', v)} compact />
                    </div>
                </Accordion>

                <Accordion title="Anúncios" icon={<AdsIcon />} badge="2 campos">
                    <div className="grid grid-cols-2 gap-3">
                        <MetricCard config={getMetric('cpm')} value={state.cpm} onChange={(v) => onUpdate('cpm', v)} compact />
                        <MetricCard config={getMetric('ctr')} value={state.ctr} onChange={(v) => onUpdate('ctr', v)} compact />
                    </div>
                </Accordion>

                <Accordion
                    title="Taxas de Conversão"
                    icon={<FunnelIcon />}
                    badge={campaignType === 'site' ? '3 campos' : '4 campos'}
                >
                    <div className="space-y-3">
                        {/* Connect Rate - Only visible for SITE campaign type */}
                        {campaignType === 'site' && (
                            <MetricCard config={getMetric('connectRate')} value={state.connectRate} onChange={(v) => onUpdate('connectRate', v)} compact />
                        )}

                        {/* WhatsApp specific fields */}
                        {campaignType === 'whatsapp' && (
                            <>
                                <MetricCard config={getMetric('conversationRate')} value={state.conversationRate} onChange={(v) => onUpdate('conversationRate', v)} compact />
                                <MetricCard config={getMetric('costPerConversation')} value={state.costPerConversation} compact />
                            </>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <MetricCard config={getMetric('conversionRate')} value={state.conversionRate} onChange={(v) => onUpdate('conversionRate', v)} compact />
                            <MetricCard config={getMetric('saleRate')} value={state.saleRate} onChange={(v) => onUpdate('saleRate', v)} compact />
                        </div>
                    </div>
                </Accordion>
            </div>
        </motion.section>
    );
};
