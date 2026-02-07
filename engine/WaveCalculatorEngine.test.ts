/**
 * WaveCalculatorEngine Tests
 * 
 * Comprehensive test suite covering:
 * - Basic funnel calculations
 * - Rounding behavior
 * - Edge cases (zero investment, zero sales)
 * - Campaign type differences
 * - Division by zero safety
 */

import { describe, it, expect } from 'vitest';
import { calculateFunnelMetrics } from './WaveCalculatorEngine';
import { CalculationInput } from './types';

describe('WaveCalculatorEngine', () => {
    describe('Basic Funnel Calculations (SITE mode)', () => {
        it('should calculate correct funnel metrics with standard inputs', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 5000,
                ticketMedio: 297,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 5.0,
            };

            const result = calculateFunnelMetrics(input);

            // Verify formula sequence
            expect(result.impressions).toBe((5000 / 15) * 1000); // 333,333.33...
            expect(result.clicks).toBe(result.impressions * 0.01); // CTR 1%
            expect(result.pageViews).toBe(result.clicks * 0.7); // Connect 70%
            expect(result.leads).toBe(result.pageViews * 0.4); // Conversion 40%

            // Verify raw sales calculation
            const expectedSalesRaw = result.leads * 0.05; // Sale Rate 5%
            expect(result.salesRaw).toBeCloseTo(expectedSalesRaw, 2);

            // Verify rounding
            expect(result.sales).toBe(Math.floor(result.salesRaw));

            // Verify financial metrics derived from ROUNDED sales
            expect(result.revenue).toBe(result.sales * 297);
            expect(result.profit).toBe(result.revenue - 5000);
            expect(result.roas).toBeCloseTo(result.revenue / 5000, 2);
            expect(result.roi).toBeCloseTo((result.profit / 5000) * 100, 2);
        });

        it('should not use conversations in SITE mode', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 5000,
                ticketMedio: 297,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 5.0,
            };

            const result = calculateFunnelMetrics(input);

            expect(result.conversations).toBe(0);
            expect(result.costPerConversation).toBe(0);
            expect(result.pageViews).toBeGreaterThan(0);
        });
    });

    describe('Basic Funnel Calculations (WHATSAPP mode)', () => {
        it('should calculate correct funnel metrics with WhatsApp flow', () => {
            const input: CalculationInput = {
                campaignType: 'whatsapp',
                investment: 5000,
                ticketMedio: 297,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 5.0,
            };

            const result = calculateFunnelMetrics(input);

            // Verify WhatsApp-specific flow
            expect(result.conversations).toBe(result.clicks * 0.8); // Conversation 80%
            expect(result.leads).toBe(result.conversations * 0.4); // Conversion 40%
            expect(result.costPerConversation).toBeCloseTo(5000 / result.conversations, 2);

            // pageViews should not be used
            expect(result.pageViews).toBe(0);
        });
    });

    describe('Rounding Behavior', () => {
        it('should round down 2.1 sales to 2', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 1000,
                ticketMedio: 100,
                cpm: 10,
                ctr: 1.0,
                connectRate: 50.0,
                conversationRate: 80.0,
                conversionRate: 50.0,
                saleRate: 0.84, // Will produce ~2.1 sales
            };

            const result = calculateFunnelMetrics(input);

            expect(result.salesRaw).toBeGreaterThan(2.0);
            expect(result.salesRaw).toBeLessThan(2.2);
            expect(result.sales).toBe(2);
        });

        it('should round down 2.9 sales to 2', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 1000,
                ticketMedio: 100,
                cpm: 10,
                ctr: 1.0,
                connectRate: 50.0,
                conversationRate: 80.0,
                conversionRate: 50.0,
                saleRate: 1.16, // Will produce ~2.9 sales
            };

            const result = calculateFunnelMetrics(input);

            expect(result.salesRaw).toBeGreaterThan(2.8);
            expect(result.salesRaw).toBeLessThan(3.0);
            expect(result.sales).toBe(2);
        });

        it('should round down 0.9 sales to 0', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 1000,
                ticketMedio: 100,
                cpm: 10,
                ctr: 1.0,
                connectRate: 50.0,
                conversationRate: 80.0,
                conversionRate: 50.0,
                saleRate: 0.36, // Will produce ~0.9 sales
            };

            const result = calculateFunnelMetrics(input);

            expect(result.salesRaw).toBeGreaterThan(0.8);
            expect(result.salesRaw).toBeLessThan(1.0);
            expect(result.sales).toBe(0);
        });

        it('should keep integer sales unchanged', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 1000,
                ticketMedio: 100,
                cpm: 10,
                ctr: 2.0,
                connectRate: 50.0,
                conversationRate: 80.0,
                conversionRate: 50.0,
                saleRate: 2.0, // Should produce exactly 10 sales
            };

            const result = calculateFunnelMetrics(input);

            expect(result.salesRaw).toBe(10);
            expect(result.sales).toBe(10);
        });
    });

    describe('Edge Cases - Zero Investment', () => {
        it('should return all zeros when investment is 0', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 0,
                ticketMedio: 297,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 5.0,
            };

            const result = calculateFunnelMetrics(input);

            expect(result.impressions).toBe(0);
            expect(result.clicks).toBe(0);
            expect(result.pageViews).toBe(0);
            expect(result.leads).toBe(0);
            expect(result.sales).toBe(0);
            expect(result.revenue).toBe(0);
            expect(result.profit).toBe(0);
            expect(result.roas).toBe(0);
            expect(result.roi).toBe(0);
            expect(result.cpa).toBe(0);
        });
    });

    describe('Edge Cases - Zero CPM', () => {
        it('should return all zeros when CPM is 0', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 5000,
                ticketMedio: 297,
                cpm: 0,
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 5.0,
            };

            const result = calculateFunnelMetrics(input);

            // Division by zero should be handled safely
            expect(result.impressions).toBe(0);
            expect(result.clicks).toBe(0);
            expect(result.sales).toBe(0);
        });
    });

    describe('Edge Cases - Zero Sales', () => {
        it('should handle zero sales correctly (CPA = 0, ROAS = 0)', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 5000,
                ticketMedio: 297,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 0, // Zero sales
            };

            const result = calculateFunnelMetrics(input);

            expect(result.sales).toBe(0);
            expect(result.revenue).toBe(0);
            expect(result.profit).toBe(-5000); // Only investment cost
            expect(result.cpa).toBe(0); // Not Infinity!
            expect(result.roas).toBe(0);
            expect(result.roi).toBe(-100); // -100% ROI
        });

        it('should handle leads > 0 but sales = 0', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 5000,
                ticketMedio: 297,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 0.01, // Very low, might round to 0 sales
            };

            const result = calculateFunnelMetrics(input);

            expect(result.leads).toBeGreaterThan(0);

            if (result.sales === 0) {
                expect(result.revenue).toBe(0);
                expect(result.cpa).toBe(0);
            }
        });
    });

    describe('Division by Zero Safety', () => {
        it('should never return Infinity', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 5000,
                ticketMedio: 297,
                cpm: 0, // Will cause division by zero
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 0,
            };

            const result = calculateFunnelMetrics(input);

            // Check that no value is Infinity
            Object.values(result).forEach((value) => {
                if (typeof value === 'number') {
                    expect(isFinite(value)).toBe(true);
                }
            });
        });

        it('should never return NaN', () => {
            const input: CalculationInput = {
                campaignType: 'whatsapp',
                investment: 0,
                ticketMedio: 0,
                cpm: 0,
                ctr: 0,
                connectRate: 0,
                conversationRate: 0,
                conversionRate: 0,
                saleRate: 0,
            };

            const result = calculateFunnelMetrics(input);

            // Check that no value is NaN
            Object.values(result).forEach((value) => {
                if (typeof value === 'number') {
                    expect(isNaN(value)).toBe(false);
                }
            });
        });
    });

    describe('Financial Metrics Derivation', () => {
        it('should derive all financial metrics from ROUNDED sales', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 2000,
                ticketMedio: 500,
                cpm: 10,
                ctr: 2.0,
                connectRate: 50.0,
                conversationRate: 80.0,
                conversionRate: 50.0,
                saleRate: 5.5, // Will produce fractional sales
            };

            const result = calculateFunnelMetrics(input);

            // Verify that revenue MUST use rounded sales
            const expectedRevenue = result.sales * 500;
            expect(result.revenue).toBe(expectedRevenue);

            // ROAS and ROI also use rounded sales indirectly
            expect(result.roas).toBe(result.revenue / 2000);
            expect(result.profit).toBe(result.revenue - 2000);
        });
    });

    describe('Pass-through Values', () => {
        it('should pass through all input values unchanged', () => {
            const input: CalculationInput = {
                campaignType: 'site',
                investment: 5000,
                ticketMedio: 297,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70.0,
                conversationRate: 80.0,
                conversionRate: 40.0,
                saleRate: 5.0,
            };

            const result = calculateFunnelMetrics(input);

            expect(result.investment).toBe(input.investment);
            expect(result.ticketMedio).toBe(input.ticketMedio);
            expect(result.cpm).toBe(input.cpm);
            expect(result.ctr).toBe(input.ctr);
            expect(result.connectRate).toBe(input.connectRate);
            expect(result.conversationRate).toBe(input.conversationRate);
            expect(result.conversionRate).toBe(input.conversionRate);
            expect(result.saleRate).toBe(input.saleRate);
        });
    });
});
