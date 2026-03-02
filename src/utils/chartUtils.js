/**
 * Chart Data Transformation Utilities
 * 
 * Functions to prepare expense data for visualization
 * Color scheme: Income = Green (#16a34a), Expense = Red (#dc2626)
 */

import { groupExpensesByCategory } from './aggregate'

/**
 * Semantic transaction colors for consistency across the app
 * Used when displaying transaction types (income vs expense)
 */
export const TRANSACTION_COLORS = {
  income: '#16a34a',    // Green
  expense: '#dc2626'    // Red
}

/**
 * Color palette for expense category charts
 * Used for pie charts showing expense category breakdown
 */
export const CHART_COLORS = [
  '#5367AB', '#dc2626', '#16a34a', '#ff6b6b',
  '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd',
  '#a29bfe', '#74b9ff', '#81ecec', '#fab1a0'
]

/**
 * Transform expenses for pie chart - grouped by category
 * @param {Array} expenses - Array of expense objects (transactions)
 * @returns {Array} Data formatted for pie chart, aggregated by category
 */
export const preparePieChartData = (expenses) => {
  const aggregated = groupExpensesByCategory(expenses)
  
  return aggregated.map((item, index) => ({
    name: item.label,
    value: item.amount,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }))
}

/**
 * Transform expenses for bar chart - grouped by category
 * @param {Array} expenses - Array of expense objects (transactions)
 * @returns {Array} Sorted data for bar chart by category, limited to top 10 categories
 */
export const prepareBarChartData = (expenses) => {
  const aggregated = groupExpensesByCategory(expenses)
  const maxLength = 15 // Max characters before truncation

  return aggregated
    .slice(0, 10)
    .map((item) => ({
      name: item.label.length > maxLength
        ? item.label.substring(0, maxLength) + '...'
        : item.label,
      amount: item.amount,
      fullName: item.label,
      count: item.count
    }))
}

/**
 * Calculate expense statistics
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Statistics including total, average, highest
 */
export const calculateExpenseStats = (expenses) => {
  if (expenses.length === 0) {
    return { total: 0, average: 0, highest: 0, count: 0 }
  }

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const average = total / expenses.length
  const highest = Math.max(...expenses.map(exp => exp.amount))

  return {
    total,
    average,
    highest,
    count: expenses.length
  }
}
