/**
 * Wave Calculator Engine - Core Calculation Logic
 * 
 * SINGLE SOURCE OF TRUTH for all funnel calculations.
 * Implements master funnel formula with conservative rounding.
 * 
 * FÓRMULA-MESTRA (NON-NEGOTIABLE ORDER):
 * 1. IMPRESSIONS = (INVESTMENT / CPM) * 1000
 * 2. CLIQUES = IMPRESSIONS * CTR
 * 3. EVENTO_INTERMEDIARIO = CLIQUES * TAXA_EVENTO (Views or Conversas)
 * 4. LEADS = EVENTO_INTERMEDIARIO * TAXA_LEAD
 * 5. VENDAS_BRUTAS = LEADS * TAXA_VENDA
 * 6. VENDAS = floor(VENDAS_BRUTAS)  ← ONLY rounding point
 * 7. FATURAMENTO = VENDAS * TICKET_MEDIO
 * 8. LUCRO = FATURAMENTO - INVESTIMENTO
 * 9. ROAS = FATURAMENTO / INVESTIMENTO
 * 10. ROI = (LUCRO / INVESTIMENTO) * 100
 */

import { CalculationInput, CalculationOutput } from './types';

/**
 * Safe division that returns 0 instead of Infinity or NaN
 */
function safeDivide(numerator: number, denominator: number): number {
    if (denominator === 0 || !isFinite(denominator)) {
        return 0;
    }
    const result = numerator / denominator;
    return isFinite(result) ? result : 0;
}

/**
 * Calculate all funnel metrics based on inputs
 * 
 * @param input - Campaign parameters and conversion rates
 * @returns Complete calculation output with all metrics
 */
export function calculateFunnelMetrics(input: CalculationInput): CalculationOutput {
    const {
        campaignType,
        investment,
        cpm,
        ctr,
        connectRate,
        conversationRate,
        conversionRate,
        saleRate,
        ticketMedio,
    } = input;

    // STEP 1: IMPRESSIONS = (INVESTMENT / CPM) * 1000
    const impressions = safeDivide(investment, cpm) * 1000;

    // STEP 2: CLIQUES = IMPRESSIONS * CTR
    const clicks = impressions * (ctr / 100);

    // STEP 3: EVENTO_INTERMEDIARIO (conditional on campaign type)
    let pageViews: number;
    let conversations: number;
    let costPerConversation: number;
    let leads: number;

    if (campaignType === 'site') {
        // SITE MODE: Cliques → Views → Leads
        pageViews = clicks * (connectRate / 100);
        conversations = 0; // Not applicable
        costPerConversation = 0; // Not applicable

        // STEP 4: LEADS = VIEWS * CONVERSION_RATE
        leads = pageViews * (conversionRate / 100);
    } else {
        // WHATSAPP MODE: Cliques → Conversas → Leads
        pageViews = 0; // Not applicable
        conversations = clicks * (conversationRate / 100);

        // Cost per conversation is CALCULATED (not an input)
        costPerConversation = safeDivide(investment, conversations);

        // STEP 4: LEADS = CONVERSATIONS * CONVERSION_RATE
        leads = conversations * (conversionRate / 100);
    }

    // CPL = Cost Per Lead
    const cpl = safeDivide(investment, leads);

    // STEP 5: VENDAS_BRUTAS = LEADS * SALE_RATE
    const salesRaw = leads * (saleRate / 100);

    // STEP 6: VENDAS = floor(VENDAS_BRUTAS) ← ONLY ROUNDING POINT
    // Conservative rounding: "Não existe venda fracionada"
    const sales = Math.floor(salesRaw);

    // STEP 7: FATURAMENTO = VENDAS * TICKET_MEDIO
    // CRITICAL: Uses ROUNDED sales, not salesRaw
    const revenue = sales * ticketMedio;

    // Investment tracking (no additional costs in current model)
    const totalInvestment = investment;

    // STEP 8: LUCRO = FATURAMENTO - INVESTIMENTO
    const profit = revenue - totalInvestment;

    // STEP 9: ROAS = FATURAMENTO / INVESTIMENTO
    const roas = safeDivide(revenue, investment);

    // STEP 10: ROI = (LUCRO / INVESTIMENTO) * 100
    const roi = safeDivide(profit, investment) * 100;

    // CPA = Cost Per Acquisition (per sale)
    // When sales = 0, return 0 (not Infinity)
    const cpa = safeDivide(investment, sales);

    return {
        // Inputs (pass through)
        investment,
        cpm,
        ctr,
        connectRate,
        conversationRate,
        conversionRate,
        saleRate,
        ticketMedio,

        // Funnel metrics
        impressions,
        clicks,
        pageViews,
        conversations,
        costPerConversation,
        leads,
        cpl,

        // Sales (both raw and rounded)
        salesRaw,
        sales,

        // Financial metrics (all derived from ROUNDED sales)
        revenue,
        totalInvestment,
        profit,
        roas,
        roi,
        cpa,
    };
}
