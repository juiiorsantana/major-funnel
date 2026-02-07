/**
 * CalculationValidator Tests
 * 
 * Test suite for validation system covering:
 * - Consistency checks (revenue, ROAS, CPA, profit, ROI)
 * - Error detection
 * - Fractional sales detection
 * - Warnings for edge cases
 */

import { describe, it, expect } from 'vitest';
import { validateCalculation, assertValidCalculation } from './CalculationValidator';
import { CalculationOutput } from './types';

describe('CalculationValidator', () => {
    describe('Revenue Consistency', () => {
        it('should pass when revenue equals sales × ticketMedio', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13662, // 46 × 297
                totalInvestment: 5000,
                profit: 8662,
                roas: 2.73,
                roi: 173.24,
                cpa: 108.7,
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should fail when revenue does not match sales × ticketMedio', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13860, // WRONG: should be 13662
                totalInvestment: 5000,
                profit: 8860,
                roas: 2.77,
                roi: 177.2,
                cpa: 108.7,
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.objectContaining({
                    code: 'REVENUE_INCONSISTENCY',
                })
            );
        });
    });

    describe('ROAS Consistency', () => {
        it('should pass when ROAS equals revenue / investment', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13662,
                totalInvestment: 5000,
                profit: 8662,
                roas: 2.7324, // 13662 / 5000
                roi: 173.24,
                cpa: 108.7,
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(true);
        });

        it('should fail when ROAS is incorrect', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13662,
                totalInvestment: 5000,
                profit: 8662,
                roas: 3.0, // WRONG
                roi: 173.24,
                cpa: 108.7,
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.objectContaining({
                    code: 'ROAS_INCONSISTENCY',
                })
            );
        });
    });

    describe('CPA Consistency', () => {
        it('should pass when CPA equals investment / sales', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13662,
                totalInvestment: 5000,
                profit: 8662,
                roas: 2.7324,
                roi: 173.24,
                cpa: 108.695652, // 5000 / 46
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(true);
        });

        it('should require CPA = 0 when sales = 0', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 0,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 0,
                sales: 0,
                revenue: 0,
                totalInvestment: 5000,
                profit: -5000,
                roas: 0,
                roi: -100,
                cpa: 0, // Must be 0, not Infinity
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(true);
        });

        it('should fail when CPA is not 0 with zero sales', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 0,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 0,
                sales: 0,
                revenue: 0,
                totalInvestment: 5000,
                profit: -5000,
                roas: 0,
                roi: -100,
                cpa: Infinity, // WRONG
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.objectContaining({
                    code: 'CPA_INVALID_ZERO_SALES',
                })
            );
        });
    });

    describe('Fractional Sales Detection', () => {
        it('should fail when sales is not an integer', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46.65, // WRONG: must be integer
                revenue: 13859,
                totalInvestment: 5000,
                profit: 8859,
                roas: 2.77,
                roi: 177.18,
                cpa: 107.18,
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.objectContaining({
                    code: 'FRACTIONAL_SALES',
                })
            );
        });
    });

    describe('Profit and ROI Consistency', () => {
        it('should pass when profit equals revenue - investment', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13662,
                totalInvestment: 5000,
                profit: 8662, // 13662 - 5000
                roas: 2.7324,
                roi: 173.24, // (8662 / 5000) × 100
                cpa: 108.7,
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(true);
        });

        it('should fail when profit calculation is wrong', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13662,
                totalInvestment: 5000,
                profit: 9000, // WRONG
                roas: 2.7324,
                roi: 180,
                cpa: 108.7,
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.objectContaining({
                    code: 'PROFIT_INCONSISTENCY',
                })
            );
        });

        it('should fail when ROI calculation is wrong', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13662,
                totalInvestment: 5000,
                profit: 8662,
                roas: 2.7324,
                roi: 200, // WRONG
                cpa: 108.7,
            };

            const result = validateCalculation(output);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual(
                expect.objectContaining({
                    code: 'ROI_INCONSISTENCY',
                })
            );
        });
    });

    describe('Warnings', () => {
        it('should warn when significant rounding occurs', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.9, // Lost 0.9 sales
                sales: 46,
                revenue: 13662,
                totalInvestment: 5000,
                profit: 8662,
                roas: 2.7324,
                roi: 173.24,
                cpa: 108.7,
            };

            const result = validateCalculation(output);
            expect(result.warnings).toContainEqual(
                expect.objectContaining({
                    code: 'SIGNIFICANT_ROUNDING',
                })
            );
        });

        it('should warn when leads exist but sales = 0', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 0.1, // Very low conversion
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 0.933, // < 1 sale
                sales: 0,
                revenue: 0,
                totalInvestment: 5000,
                profit: -5000,
                roas: 0,
                roi: -100,
                cpa: 0,
            };

            const result = validateCalculation(output);
            expect(result.warnings).toContainEqual(
                expect.objectContaining({
                    code: 'ZERO_SALES_WITH_LEADS',
                })
            );
        });
    });

    describe('assertValidCalculation', () => {
        it('should not throw when validation passes', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46,
                revenue: 13662,
                totalInvestment: 5000,
                profit: 8662,
                roas: 2.7324,
                roi: 173.24,
                cpa: 108.695652,
            };

            expect(() => assertValidCalculation(output)).not.toThrow();
        });

        it('should throw when validation fails', () => {
            const output: CalculationOutput = {
                investment: 5000,
                cpm: 15,
                ctr: 1.0,
                connectRate: 70,
                conversationRate: 80,
                conversionRate: 40,
                saleRate: 5,
                ticketMedio: 297,
                impressions: 333333,
                clicks: 3333,
                pageViews: 2333,
                conversations: 0,
                costPerConversation: 0,
                leads: 933,
                cpl: 5.36,
                salesRaw: 46.65,
                sales: 46.5, // WRONG: fractional
                revenue: 13809,
                totalInvestment: 5000,
                profit: 8809,
                roas: 2.76,
                roi: 176.18,
                cpa: 107.53,
            };

            expect(() => assertValidCalculation(output)).toThrow();
        });
    });
});
