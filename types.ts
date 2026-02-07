
export type CampaignType = 'site' | 'whatsapp';

export interface FunnelState {
  investment: number;
  cpm: number;
  impressions: number;
  ctr: number;
  clicks: number;
  connectRate: number;
  pageViews: number;
  // WhatsApp specific metrics
  conversationRate: number; // Taxa de conversão: Cliques → Conversas Iniciadas
  conversations: number; // Conversas iniciadas no WhatsApp
  costPerConversation: number; // Custo por conversa iniciada (WhatsApp Business API)
  // Generic conversion
  conversionRate: number;
  leads: number;
  cpl: number;
  // Financial metrics
  ticketMedio: number;
  saleRate: number;
  sales: number;
  revenue: number;
  totalInvestment: number; // Investimento total (Ads + Custos de Conversas)
  roas: number;
  cpa: number;
}

export type MetricType = keyof FunnelState;

export interface MetricConfig {
  id: MetricType;
  label: string;
  symbol: string;
  isInput: boolean;
  prefix?: string;
  suffix?: string;
  description: string;
}
