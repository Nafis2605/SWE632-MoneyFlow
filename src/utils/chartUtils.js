/**
 * Chart Data Transformation Utilities
 * 
 * Functions to prepare expense data for visualization
 * Color scheme: Income = Green (#16a34a), Expense = Red (#dc2626)
 */

import { groupExpensesByCategory } from './aggregate'
import { getCategoryColor } from './categoryColors'

/**
 * Semantic transaction colors for consistency across the app
 * Used when displaying transaction types (income vs expense)
 */
export const TRANSACTION_COLORS = {
  income: '#16a34a',    // Green
  expense: '#dc2626'    // Red
}

/**
 * Transform expenses for pie chart - grouped by category with smart "Other" aggregation
 * Shows all categories above 2% threshold, groups smaller ones into "Other"
 * @param {Array} expenses - Array of expense objects (transactions)
 * @returns {Array} Data formatted for pie chart, aggregated by category
 */
export const preparePieChartData = (expenses) => {
  const aggregated = groupExpensesByCategory(expenses)
  
  // Calculate total for percentage calculation
  const total = aggregated.reduce((sum, item) => sum + item.amount, 0)
  if (total === 0) return []
  
  // Threshold for grouping into "Other" (2%)
  const thresholdPercent = 2
  const thresholdAmount = (total * thresholdPercent) / 100
  
  // Separate categories into significant (>= 2%) and small (< 2%)
  const significantCategories = []
  const smallCategories = []
  
  aggregated.forEach(item => {
    const percentage = (item.amount / total) * 100
    if (percentage >= thresholdPercent) {
      significantCategories.push(item)
    } else {
      smallCategories.push(item)
    }
  })
  
  // Transform significant categories
  const result = significantCategories.map((item) => ({
    name: item.label,
    value: item.amount,
    color: getCategoryColor(item.category, 'expense'),
    category: item.category,
    percentage: ((item.amount / total) * 100).toFixed(1),
    count: item.count
  }))
  
  // Group small categories into "Other"
  const otherTotal = smallCategories.reduce((sum, item) => sum + item.amount, 0)
  if (otherTotal > 0) {
    // Create breakdown for "Other" tooltip
    const otherBreakdown = smallCategories.map(item => ({
      label: item.label,
      amount: item.amount,
      percentage: ((item.amount / total) * 100).toFixed(1)
    }))
    
    result.push({
      name: 'Other',
      value: otherTotal,
      color: '#9ca3af', // Neutral gray for "Other"
      category: 'other',
      percentage: ((otherTotal / total) * 100).toFixed(1),
      breakdown: otherBreakdown,
      isOther: true
    })
  }
  
  return result
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
      count: item.count,
      color: getCategoryColor(item.category, 'expense')
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
