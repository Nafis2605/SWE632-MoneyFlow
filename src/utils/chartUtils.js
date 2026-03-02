/**
 * Chart Data Transformation Utilities
 * 
 * Functions to prepare expense data for visualization
 */

/**
 * Color palette for expense charts
 * Used consistently across all visualization components
 */
export const CHART_COLORS = [
  '#5367AB', '#f9c74f', '#008000', '#ff6b6b',
  '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd'
]

/**
 * Transform expenses for pie chart
 * @param {Array} expenses - Array of expense objects (transactions)
 * @returns {Array} Data formatted for pie chart
 */
export const preparePieChartData = (expenses) => {
  return expenses.map((expense, index) => ({
    name: expense.title,
    value: expense.amount,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }))
}

/**
 * Transform expenses for bar chart (top 10)
 * @param {Array} expenses - Array of expense objects (transactions)
 * @returns {Array} Sorted data for bar chart, limited to 10 items
 */
export const prepareBarChartData = (expenses) => {
  const maxLength = 12 // Max characters before truncation

  return [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((expense) => ({
      name: expense.title.length > maxLength
        ? expense.title.substring(0, maxLength) + '...'
        : expense.title,
      amount: expense.amount,
      fullName: expense.title
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
