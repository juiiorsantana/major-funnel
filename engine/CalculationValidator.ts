/**
 * Calculation Validator - Automatic Consistency Checks
 * 
 * Failsafe system to detect calculation bugs and inconsistencies.
 * Validates that all derived metrics match the master formula.
 */

import { CalculationOutput, ValidationResult, ValidationError, ValidationWarning } from './types';

/**
 * Tolerance for floating-point comparison (0.01 = 1 cent)
 */
const EPSILON = 0.01;

/**
 * Check if two numbers are approximately equal (within epsilon)
 */
function areEqual(a: number, b: number, epsilon: number = EPSILON): boolean {
    return Math.abs(a - b) < epsilon;
}

/**
 * Validate calculation output for consistency
 * 
 * @param output - Calculation output to validate
 * @returns Validation result with errors and warnings
 */
export function validateCalculation(output: CalculationOutput): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // RULE 1: FATURAMENTO must equal VENDAS * TICKET_MEDIO
    const expectedRevenue = output.sales * output.ticketMedio;
    if (!areEqual(output.revenue, expectedRevenue)) {
        errors.push({
            code: 'REVENUE_INCONSISTENCY',
            message: 'Faturamento inconsistente com vendas × ticket médio',
            expected: expectedRevenue,
            actual: output.revenue,
        });
    }

    // RULE 2: ROAS must equal FATURAMENTO / INVESTIMENTO (when investment > 0)
    if (output.investment > 0) {
        const expectedRoas = output.revenue / output.investment;
        if (!areEqual(output.roas, expectedRoas)) {
            errors.push({
                code: 'ROAS_INCONSISTENCY',
                message: 'ROAS inconsistente com faturamento / investimento',
                expected: expectedRoas,
                actual: output.roas,
            });
        }
    }

    // RULE 3: CPA must equal INVESTIMENTO / VENDAS (when sales > 0)
    if (output.sales > 0) {
        const expectedCpa = output.investment / output.sales;
        if (!areEqual(output.cpa, expectedCpa)) {
            errors.push({
                code: 'CPA_INCONSISTENCY',
                message: 'CPA inconsistente com investimento / vendas',
                expected: expectedCpa,
                actual: output.cpa,
            });
        }
    } else if (output.cpa !== 0) {
        // When sales = 0, CPA must be 0 (not Infinity or any other value)
        errors.push({
            code: 'CPA_INVALID_ZERO_SALES',
            message: 'CPA deve ser 0 quando vendas = 0',
            expected: 0,
            actual: output.cpa,
        });
    }

    // RULE 4: VENDAS must be an integer (no fractions)
    if (!Number.isInteger(output.sales)) {
        errors.push({
            code: 'FRACTIONAL_SALES',
            message: 'Vendas deve ser um número inteiro (sem frações)',
            expected: Math.floor(output.sales),
            actual: output.sales,
        });
    }

    // RULE 5: PROFIT must equal REVENUE - INVESTMENT
    const expectedProfit = output.revenue - output.investment;
    if (!areEqual(output.profit, expectedProfit)) {
        errors.push({
            code: 'PROFIT_INCONSISTENCY',
            message: 'Lucro inconsistente com faturamento - investimento',
            expected: expectedProfit,
            actual: output.profit,
        });
    }

    // RULE 6: ROI must equal (PROFIT / INVESTMENT) * 100 (when investment > 0)
    if (output.investment > 0) {
        const expectedRoi = (output.profit / output.investment) * 100;
        if (!areEqual(output.roi, expectedRoi)) {
            errors.push({
                code: 'ROI_INCONSISTENCY',
                message: 'ROI inconsistente com (lucro / investimento) × 100',
                expected: expectedRoi,
                actual: output.roi,
            });
        }
    }

    // WARNING: Significant rounding impact
    if (output.salesRaw > 0) {
        const roundingLoss = output.salesRaw - output.sales;
        if (roundingLoss >= 0.5) {
            warnings.push({
                code: 'SIGNIFICANT_ROUNDING',
                message: 'Arredondamento conservador impactou resultados',
                details: `Vendas brutas: ${output.salesRaw.toFixed(2)}, Vendas finais: ${output.sales} (perda de ${roundingLoss.toFixed(2)} vendas)`,
            });
        }
    }

    // WARNING: Zero sales with investment
    if (output.sales === 0 && output.investment > 0 && output.leads > 0) {
        warnings.push({
            code: 'ZERO_SALES_WITH_LEADS',
            message: 'Funil gerou leads mas não converteu vendas',
            details: `${output.leads.toFixed(0)} leads gerados, mas taxa de conversão (${output.saleRate}%) resultou em < 1 venda`,
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validate and throw if critical errors found (for development mode)
 * 
 * @param output - Calculation output to validate
 * @throws Error if validation fails
 */
export function assertValidCalculation(output: CalculationOutput): void {
    const result = validateCalculation(output);

    if (!result.isValid) {
        const errorMessages = result.errors
            .map(e => `[${e.code}] ${e.message} (esperado: ${e.expected}, atual: ${e.actual})`)
            .join('\n');

        throw new Error(
            `Falha na validação de cálculos:\n${errorMessages}\n\n` +
            `Isso indica um bug na engine de cálculo. Verifique WaveCalculatorEngine.ts`
        );
    }
}
