
import { MetricConfig } from './types';

export const METRIC_CONFIGS: MetricConfig[] = [
  {
    id: 'investment',
    label: 'Investimento',
    symbol: 'R$',
    isInput: true,
    prefix: 'R$',
    description: 'Verba total da campanha'
  },
  {
    id: 'cpm',
    label: 'CPM',
    symbol: 'R$',
    isInput: true,
    prefix: 'R$',
    description: 'Custo por mil'
  },
  {
    id: 'ctr',
    label: 'CTR',
    symbol: '%',
    isInput: true,
    suffix: '%',
    description: 'Cliques / Impressões'
  },
  {
    id: 'connectRate',
    label: 'Connect',
    symbol: '%',
    isInput: true,
    suffix: '%',
    description: 'Cliques que viram Views'
  },
  {
    id: 'conversationRate',
    label: 'Conversa %',
    symbol: '%',
    isInput: true,
    suffix: '%',
    description: 'Cliques que iniciam conversas (WhatsApp)'
  },
  {
    id: 'costPerConversation',
    label: 'Custo/Conversa',
    symbol: 'R$',
    isInput: false,
    prefix: 'R$',
    description: 'Custo por conversa iniciada (WhatsApp API)'
  },
  {
    id: 'conversionRate',
    label: 'Lead %',
    symbol: '%',
    isInput: true,
    suffix: '%',
    description: 'Conversas/Views que viram Leads'
  },
  {
    id: 'saleRate',
    label: 'Venda %',
    symbol: '%',
    isInput: true,
    suffix: '%',
    description: 'Leads que viram Vendas'
  },
  {
    id: 'ticketMedio',
    label: 'Ticket Médio',
    symbol: 'R$',
    isInput: true,
    prefix: 'R$',
    description: 'Valor médio por venda'
  },
  {
    id: 'impressions',
    label: 'Alcance',
    symbol: '#',
    isInput: false,
    description: 'Total de impressões'
  },
  {
    id: 'clicks',
    label: 'Cliques',
    symbol: '#',
    isInput: false,
    description: 'Volume de cliques'
  },
  {
    id: 'pageViews',
    label: 'Views',
    symbol: '#',
    isInput: false,
    description: 'Visualizações reais'
  },
  {
    id: 'conversations',
    label: 'Conversas',
    symbol: '#',
    isInput: false,
    description: 'Conversas iniciadas no WhatsApp'
  },
  {
    id: 'leads',
    label: 'Leads',
    symbol: '#',
    isInput: false,
    description: 'Volume final de leads'
  },
  {
    id: 'sales',
    label: 'Vendas',
    symbol: '#',
    isInput: false,
    description: 'Total de conversões de venda'
  },
  {
    id: 'cpl',
    label: 'CPL',
    symbol: 'R$',
    isInput: false,
    prefix: 'R$',
    description: 'Custo por Lead'
  },
  {
    id: 'cpa',
    label: 'CPA',
    symbol: 'R$',
    isInput: false,
    prefix: 'R$',
    description: 'Custo por Aquisição (Venda)'
  },
  {
    id: 'totalInvestment',
    label: 'Invest. Total',
    symbol: 'R$',
    isInput: false,
    prefix: 'R$',
    description: 'Investimento total (Ads + Conversas WhatsApp)'
  },
  {
    id: 'revenue',
    label: 'Faturamento',
    symbol: 'R$',
    isInput: false,
    prefix: 'R$',
    description: 'Faturamento bruto total'
  }
];
