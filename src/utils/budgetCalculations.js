/**
 * Budget Calculation Utilities
 * 
 * Utility functions for budget-related calculations
 * Used by components to maintain single responsibility principle
 */

import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBudget
} from '../models/budgetModels'

/**
 * Calculate complete budget summary from transactions
 * Provides all summary metrics in one call
 * @param {Transaction[]} transactions - Array of all transactions
 * @returns {Object} Summary object with income, expenses, remaining, and percentage
 */
export const calculateBudgetSummary = (transactions) => {
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const remainingBudget = calculateNetBudget(transactions)
  const budgetPercentage = calculateBudgetPercentage(totalExpenses, totalIncome)
  
  return {
    totalIncome,
    totalExpenses,
    remainingBudget,
    budgetPercentage,
    isOverBudget: remainingBudget < 0,
    overBudgetAmount: Math.max(0, Math.abs(remainingBudget))
  }
}

/**
 * Calculate budget usage percentage
 * @param {number} totalExpenses - Total amount of expenses
 * @param {number} totalIncome - Total income
 * @returns {number} Percentage of budget used (0-100+)
 */
export const calculateBudgetPercentage = (totalExpenses, totalIncome) => {
  if (totalIncome <= 0) return 0
  return (totalExpenses / totalIncome) * 100
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
