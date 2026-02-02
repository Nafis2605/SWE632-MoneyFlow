/**
 * Budget Calculation Utilities
 * 
 * Utility functions for budget-related calculations
 * Used by components to maintain single responsibility principle
 */

/**
 * Calculate budget usage percentage
 * @param {number} totalExpenses - Total amount of expenses
 * @param {number} income - Monthly income
 * @returns {number} Percentage of budget used (0-100+)
 */
export const calculateBudgetPercentage = (totalExpenses, income) => {
  if (income <= 0) return 0
  return (totalExpenses / income) * 100
}

/**
 * Determine if budget is exceeded
 * @param {number} remainingBudget - Remaining budget amount
 * @returns {boolean} True if over budget (remaining < 0)
 */
export const isOverBudget = (remainingBudget) => {
  return remainingBudget < 0
}

/**
 * Get amount exceeded over budget
 * @param {number} remainingBudget - Remaining budget amount
 * @returns {number} Absolute amount over budget, or 0 if under budget
 */
export const getOverBudgetAmount = (remainingBudget) => {
  return Math.max(0, Math.abs(remainingBudget))
}
