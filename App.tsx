import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FunnelState, MetricType, CampaignType } from './types';
import { METRIC_CONFIGS } from './constants';
import { MetricCard } from './components/MetricCard';
import { WaveFunnel } from './components/WaveFunnel';
import { InputPanel } from './components/InputPanel';
import { FinancialSummary } from './components/FinancialSummary';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [campaignType, setCampaignType] = useState<CampaignType>('site');
  const [inputs, setInputs] = useState({
    investment: 5000,
    cpm: 15,
    ctr: 1.0,
    connectRate: 70.0,
    conversationRate: 80.0, // WhatsApp: % de cliques que viram conversas
    conversionRate: 40.0,
    saleRate: 5.0,
    ticketMedio: 297,
  });

  const state: FunnelState = useMemo(() => {
    const { investment, cpm, ctr, connectRate, conversationRate, conversionRate, saleRate, ticketMedio } = inputs;

    const impressions = cpm > 0 ? (investment / cpm) * 1000 : 0;
    const clicks = impressions * (ctr / 100);

    // Conditional calculation based on campaign type
    let pageViews: number;
    let conversations: number;
    let costPerConversation: number;
    let leads: number;

    if (campaignType === 'site') {
      // SITE: Cliques → Views → Leads
      pageViews = clicks * (connectRate / 100);
      conversations = 0; // Não aplicável para SITE
      costPerConversation = 0; // Não aplicável para SITE
      leads = pageViews * (conversionRate / 100);
    } else {
      // WHATSAPP: Cliques → Conversas Iniciadas → Leads
      pageViews = 0; // Não aplicável para WhatsApp
      conversations = clicks * (conversationRate / 100);
      // Custo por conversa é CALCULADO: investimento / conversas
      costPerConversation = conversations > 0 ? investment / conversations : 0;
      leads = conversations * (conversionRate / 100);
    }

    const cpl = leads > 0 ? investment / leads : 0;

    const sales = leads * (saleRate / 100);
    const revenue = sales * ticketMedio;
    const roas = investment > 0 ? revenue / investment : 0;
    const cpa = sales > 0 ? investment / sales : 0;

    return {
      ...inputs,
      impressions,
      clicks,
      pageViews,
      conversations,
      costPerConversation, // Agora é calculado, não input
      leads,
      cpl,
      sales,
      revenue,
      totalInvestment: investment, // totalInvestment = investment (sem custo adicional)
      roas,
      cpa
    };
  }, [inputs, campaignType]);

  const handleUpdate = (id: MetricType, value: number) => {
    if (id in inputs) {
      setInputs(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleReset = () => {
    setCampaignType('site');
    setInputs({
      investment: 5000,
      cpm: 15,
      ctr: 1.0,
      connectRate: 70.0,
      conversationRate: 80.0,
      conversionRate: 40.0,
      saleRate: 5.0,
      ticketMedio: 297,
    });
  };

  const waveData = useMemo(() => {
    const baseData = [
      { name: 'Alcance', value: state.impressions, label: 'IMPRESSÕES' },
      { name: 'Cliques', value: state.clicks, label: 'INTERAÇÃO' },
    ];

    if (campaignType === 'site') {
      baseData.push({ name: 'Views', value: state.pageViews, label: 'TRÁFEGO' });
    } else {
      // WhatsApp: adicionar etapa de Conversas
      baseData.push({ name: 'Conversas', value: state.conversations, label: 'WHATSAPP' });
    }

    baseData.push(
      { name: 'Leads', value: state.leads, label: 'POTENCIAIS' },
      { name: 'Vendas', value: state.sales, label: 'CONVERSÃO' }
    );

    return baseData;
  }, [state, campaignType]);

  const getMetric = (id: MetricType) => METRIC_CONFIGS.find(m => m.id === id)!;
  const intermediateMetrics = useMemo(() => {
    const metricIds = campaignType === 'site'
      ? ['impressions', 'clicks', 'pageViews', 'leads', 'sales']
      : ['impressions', 'clicks', 'conversations', 'leads', 'sales'];
    return metricIds.map(id => getMetric(id as MetricType));
  }, [campaignType]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 overflow-hidden font-sans text-slate-900 selection:bg-tech-200">
      <Header state={state} onReset={handleReset} />

      {/* Main Layout */}
      <main className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden">

        <InputPanel
          state={state}
          onUpdate={handleUpdate}
          campaignType={campaignType}
          onCampaignTypeChange={setCampaignType}
        />

        {/* Dashboard Content */}
        <section className="col-span-12 lg:col-span-9 flex flex-col gap-4 overflow-hidden">

          {/* Quick Metrics (Row) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className={`grid gap-3 ${campaignType === 'site' ? 'grid-cols-5' : 'grid-cols-4'}`}
          >
            {intermediateMetrics.map((config) => (
              <MetricCard
                key={config.id}
                config={config}
                value={state[config.id as keyof FunnelState]}
                isResult={config.id === 'sales'}
                compact
              />
            ))}
          </motion.div>

          {/* Visual Canvas Area */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
            {/* The Wave Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="md:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 flex flex-col shadow-xl shadow-slate-200/50 relative overflow-hidden group"
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #0ea5e9 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }}></div>

              <div className="absolute top-6 left-8 z-20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-[2px] bg-gradient-to-r from-tech-500 to-cyan-500 rounded-full"></span>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Fluxo Orgânico</h3>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-8">Conceito Wave Flow • Volume Proporcional</p>
              </div>
              <div className="flex-1 min-h-0 relative z-10">
                <WaveFunnel data={waveData} />
              </div>
            </motion.div>

            <FinancialSummary state={state} campaignType={campaignType} />
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="px-8 py-3 bg-white/80 backdrop-blur-sm border-t border-slate-200/60 flex justify-between items-center shrink-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="w-2 h-2 bg-neon-500 rounded-full animate-pulse block"></span>
            <span className="absolute inset-0 w-2 h-2 bg-neon-500 rounded-full animate-ping opacity-50"></span>
          </div>
          <span className="text-[9px] text-slate-500 font-black tracking-[0.2em] uppercase">Major Conversion Engine</span>
          <span className="text-[9px] text-slate-300">•</span>
          <span className="text-[9px] bg-gradient-to-r from-tech-500 to-cyan-500 bg-clip-text text-transparent font-black tracking-wider">v2.6 Pro</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600 cursor-pointer transition-colors">Relatório de Performance</span>
          <div className="flex items-center gap-2 bg-gradient-to-r from-tech-50 to-cyan-50 px-4 py-1.5 rounded-full border border-tech-200/50">
            <span className="w-1.5 h-1.5 bg-tech-500 rounded-full"></span>
            <span className="text-[9px] text-tech-600 font-black uppercase tracking-wider">Real-time Analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
