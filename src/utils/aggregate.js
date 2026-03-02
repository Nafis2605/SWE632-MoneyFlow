/**
 * Transaction Aggregation Utilities
 * 
 * Functions to group and aggregate transactions by category
 * Used for dashboard charts and reports
 */

import { getCategoryLabel } from './categories'

/**
 * Group expenses by category and sum amounts
 * @param {Array} expenses - Array of expense transactions
 * @returns {Array} Aggregated data with category labels and summed amounts
 */
export const groupExpensesByCategory = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return []
  }

  // Create a map to group expenses by category
  const categoryMap = new Map()

  expenses.forEach((expense) => {
    const category = expense.category || 'other'
    
    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category)
      existing.amount += expense.amount
      existing.count += 1
    } else {
      categoryMap.set(category, {
        category,
        label: getCategoryLabel(category, 'expense'),
        amount: expense.amount,
        count: 1
      })
    }
  })

  // Convert map to sorted array (by amount descending)
  return Array.from(categoryMap.values())
    .sort((a, b) => b.amount - a.amount)
}

/**
 * Group transactions by category for any type
 * @param {Array} transactions - Array of transactions
 * @param {string} transactionType - 'income' or 'expense'
 * @returns {Array} Aggregated data with category labels and summed amounts
 */
export const groupTransactionsByCategory = (transactions, transactionType) => {
  if (!transactions || transactions.length === 0) {
    return []
  }

  // Filter by transaction type
  const filtered = transactions.filter((t) => t.type === transactionType)

  // Create a map to group by category
  const categoryMap = new Map()

  filtered.forEach((transaction) => {
    const category = transaction.category || 'other'
    
    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category)
      existing.amount += transaction.amount
      existing.count += 1
    } else {
      categoryMap.set(category, {
        category,
        label: getCategoryLabel(category, transactionType),
        amount: transaction.amount,
        count: 1
      })
    }
  })

  // Convert map to sorted array (by amount descending)
  return Array.from(categoryMap.values())
    .sort((a, b) => b.amount - a.amount)
}
