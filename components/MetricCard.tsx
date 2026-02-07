import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetricConfig } from '../types';

interface MetricCardProps {
  config: MetricConfig;
  value: number;
  onChange?: (value: number) => void;
  isResult?: boolean;
  compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ config, value, onChange, isResult, compact }) => {
  const formatValue = (val: number) => {
    if (isNaN(val) || !isFinite(val)) return '0';

    if (config.id === 'cpm' || config.id === 'investment' || config.id === 'cpl' || config.id === 'ticketMedio' || config.id === 'revenue' || config.id === 'cpa') {
      return val.toLocaleString('pt-BR', { minimumFractionDigits: config.isInput ? 0 : 2, maximumFractionDigits: 2 });
    }
    if (config.id === 'ctr' || config.id === 'connectRate' || config.id === 'conversionRate' || config.id === 'saleRate') {
      return val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    return Math.floor(val).toLocaleString('pt-BR');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valStr = e.target.value.replace(',', '.');
    const val = parseFloat(valStr);
    if (onChange) onChange(isNaN(val) ? 0 : val);
  };

  const getCardStyle = () => {
    if (isResult) {
      return 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-300/60 ring-1 ring-amber-200/50 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.25)]';
    }
    if (config.isInput) {
      return 'bg-white border-slate-200/60 shadow-sm hover:border-tech-300 hover:shadow-lg hover:shadow-tech-100/50 focus-within:ring-2 focus-within:ring-tech-400/30 focus-within:border-tech-400';
    }
    return 'bg-gradient-to-br from-slate-50 to-white border-slate-200/40 hover:border-cyan-200 hover:shadow-md';
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative flex flex-col transition-all duration-300 ${compact ? 'p-2.5' : 'p-3.5'
        } rounded-xl border backdrop-blur-sm ${getCardStyle()}`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isResult ? 'bg-gradient-to-br from-amber-400/5 to-transparent' :
          config.isInput ? 'bg-gradient-to-br from-tech-400/5 to-transparent' :
            'bg-gradient-to-br from-cyan-400/5 to-transparent'
        }`}></div>

      <div className="relative z-10 flex items-center justify-between mb-1">
        <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${isResult ? 'text-amber-700' : config.isInput ? 'text-slate-500' : 'text-slate-400'
          }`}>
          {config.label}
        </span>
        {config.isInput && !compact && (
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-tech-400 animate-pulse"></div>
            <span className="text-[8px] text-tech-500 font-bold uppercase">Edit</span>
          </div>
        )}
        {isResult && (
          <div className="flex items-center gap-1 bg-amber-200/50 px-1.5 py-0.5 rounded-full">
            <svg className="w-2.5 h-2.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-baseline space-x-0.5 overflow-hidden">
        {config.prefix && (
          <span className={`text-[10px] font-bold shrink-0 ${isResult ? 'text-amber-500' : 'text-slate-400'}`}>
            {config.prefix}
          </span>
        )}

        {config.isInput ? (
          <input
            type="number"
            step="any"
            value={value || ''}
            onChange={handleChange}
            className={`w-full font-black bg-transparent border-none outline-none focus:ring-0 text-slate-800 p-0 placeholder:text-slate-300 ${compact ? 'text-base' : 'text-lg'}`}
            placeholder="0"
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: 8, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`font-black truncate ${isResult ? 'bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent' : 'text-slate-800'
                } ${compact ? 'text-base' : 'text-lg'}`}
            >
              {formatValue(value)}
            </motion.span>
          </AnimatePresence>
        )}

        {config.suffix && (
          <span className={`text-[10px] font-bold shrink-0 ${isResult ? 'text-amber-500' : 'text-slate-400'}`}>
            {config.suffix}
          </span>
        )}
      </div>
    </motion.div>
  );
};
