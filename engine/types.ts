/**
 * Wave Calculator Engine - Type Definitions
 * 
 * Single Source of Truth for calculation types
 */

import { CampaignType } from '../types';

/**
 * Input parameters for funnel calculation
 */
export interface CalculationInput {
    // Campaign configuration
    campaignType: CampaignType;

    // Financial inputs
    investment: number;
    ticketMedio: number;

    // Traffic inputs
    cpm: number;
    ctr: number;

    // Conversion rates
    connectRate: number;        // SITE: Cliques → Views
    conversationRate: number;   // WHATSAPP: Cliques → Conversas
    conversionRate: number;     // Views/Conversas → Leads
    saleRate: number;           // Leads → Vendas
}

/**
 * Complete calculation output with all funnel metrics
 */
export interface CalculationOutput {
    // Inputs (passed through)
    investment: number;
    cpm: number;
    ctr: number;
    connectRate: number;
    conversationRate: number;
    conversionRate: number;
    saleRate: number;
    ticketMedio: number;

    // Funnel metrics
    impressions: number;
    clicks: number;
    pageViews: number;          // SITE only
    conversations: number;      // WHATSAPP only
    costPerConversation: number; // WHATSAPP only (calculated)
    leads: number;
    cpl: number;

    // Sales (with rounding)
    salesRaw: number;           // Fractional value BEFORE rounding
    sales: number;              // Integer value AFTER floor rounding

    // Financial metrics (all derived from rounded sales)
    revenue: number;            // sales * ticketMedio
    totalInvestment: number;    // investment (no additional costs)
    profit: number;             // revenue - investment
    roas: number;               // revenue / investment
    roi: number;                // (profit / investment) * 100
    cpa: number;                // investment / sales
}

/**
 * Validation result from CalculationValidator
 */
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    code: string;
    message: string;
    expected: number;
    actual: number;
}

export interface ValidationWarning {
    code: string;
    message: string;
    details?: string;
}
