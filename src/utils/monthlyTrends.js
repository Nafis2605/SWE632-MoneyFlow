/**
 * Monthly Trends Utility
 * 
 * Functions to aggregate transaction data by month and category
 * Used for generating month-by-month category comparison visualizations
 */

import { getCategoryLabel } from './categories'

/**
 * Format a date to "Mon YYYY" format (e.g., "Jan 2026")
 * @param {string} isoDate - Date in YYYY-MM-DD format
 * @returns {string} Formatted month-year string
 */
export const formatMonthYear = (isoDate) => {
  const [year, month] = isoDate.split('-')
  const date = new Date(year, parseInt(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * Extract year-month from ISO date for grouping
 * @param {string} isoDate - Date in YYYY-MM-DD format
 * @returns {string} Year-month in YYYY-MM format
 */
const getYearMonth = (isoDate) => {
  return isoDate.substring(0, 7)
}

/**
 * Get unique months from expenses sorted chronologically
 * @param {Array} expenses - Array of expense transactions
 * @returns {Array} Array of unique months in "Mon YYYY" format
 */
const getUniqueMonths = (expenses) => {
  const monthsSet = new Set()
  expenses.forEach(expense => {
    monthsSet.add(getYearMonth(expense.dateISO))
  })
  
  return Array.from(monthsSet)
    .sort()
    .map(ym => formatMonthYear(ym + '-01'))
}

/**
 * Get top N categories by total spending
 * @param {Array} expenses - Array of expense transactions
 * @param {number} topN - Number of top categories to return
 * @returns {Array} Array of category names (values, not labels)
 */
const getTopCategories = (expenses, topN = 3) => {
  const categoryTotals = new Map()
  
  expenses.forEach(expense => {
    const category = expense.category || 'other'
    const current = categoryTotals.get(category) || 0
    categoryTotals.set(category, current + expense.amount)
  })
  
  return Array.from(categoryTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([category]) => category)
}

/**
 * Aggregate expenses by month and category
 * Returns data structure ready for chart visualization
 * 
 * @param {Array} expenses - Array of expense transactions (already filtered)
 * @param {Array} selectedCategories - Category values to include (e.g., ['groceries', 'rent'])
 *                                    If empty, uses top 3 categories
 * @returns {Object} Monthly totals by category
 *   Structure: { "Groceries": { "Jan 2026": 600, "Feb 2026": 200 }, ... }
 */
export const getMonthlyCategoryTotals = (expenses, selectedCategories = []) => {
  if (!expenses || expenses.length === 0) {
    return {}
  }

  // Use selected categories or default to top 3
  const categoriesToShow = selectedCategories.length > 0 
    ? selectedCategories 
    : getTopCategories(expenses, 3)

  // Initialize data structure
  const result = {}
  categoriesToShow.forEach(category => {
    result[getCategoryLabel(category, 'expense')] = {}
  })

  // Get all unique months
  const months = getUniqueMonths(expenses)

  // Aggregate by month and category
  expenses.forEach(expense => {
    const category = expense.category || 'other'
    
    // Only include selected categories
    if (!categoriesToShow.includes(category)) {
      return
    }

    const label = getCategoryLabel(category, 'expense')
    const monthYear = formatMonthYear(expense.dateISO)

    if (!result[label][monthYear]) {
      result[label][monthYear] = 0
    }
    
    result[label][monthYear] += expense.amount
  })

  // Ensure all categories have entries for all months (fill with 0)
  months.forEach(month => {
    Object.keys(result).forEach(categoryLabel => {
      if (!result[categoryLabel][month]) {
        result[categoryLabel][month] = 0
      }
    })
  })

  return result
}

/**
 * Transform monthly category totals into line chart data format
 * 
 * @param {Object} monthlyTotals - Output from getMonthlyCategoryTotals
 *   Structure: { "Groceries": { "Jan 2026": 600, "Feb 2026": 200 }, ... }
 * @param {Function} getCategoryColor - Function to get color for category (e.g., getCategoryColor from categoryColors.js)
 * @returns {Array} Array of data points for line chart
 *   Structure: [
 *     { month: "Jan 2026", Groceries: 600, Rent: 1500, ... },
 *     { month: "Feb 2026", Groceries: 200, Rent: 1500, ... }
 *   ]
 */
export const transformToLineChartData = (monthlyTotals, getCategoryColor) => {
  if (Object.keys(monthlyTotals).length === 0) {
    return []
  }

  // Get all unique months from first category
  const firstCategory = Object.keys(monthlyTotals)[0]
  const months = Object.keys(monthlyTotals[firstCategory]).sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA - dateB
  })

  // Transform to chart format
  return months.map(month => {
    const dataPoint = { month }
    
    Object.entries(monthlyTotals).forEach(([categoryLabel, monthData]) => {
      dataPoint[categoryLabel] = monthData[month] || 0
    })
    
    return dataPoint
  })
}

/**
 * Get all available expense categories from transactions
 * Useful for populating category selector dropdown
 * 
 * @param {Array} expenses - Array of expense transactions
 * @returns {Array} Unique categories sorted by label
 *   Structure: [{ value: 'groceries', label: 'Groceries' }, ...]
 */
export const getAvailableCategories = (expenses) => {
  const categories = new Set()
  
  expenses.forEach(expense => {
    categories.add(expense.category || 'other')
  })

  return Array.from(categories)
    .map(category => ({
      value: category,
      label: getCategoryLabel(category, 'expense')
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

/**
 * Get all unique years from expenses
 * Useful for populating year selector dropdown
 * 
 * @param {Array} expenses - Array of expense transactions
 * @returns {Array} Unique years sorted in ascending order
 */
export const getAvailableYears = (expenses) => {
  const yearsSet = new Set()
  
  expenses.forEach(expense => {
    const year = expense.dateISO.substring(0, 4)
    yearsSet.add(parseInt(year))
  })
  
  return Array.from(yearsSet).sort((a, b) => a - b)
}

/**
 * Get all unique months in a specific year
 * Useful for populating month selector dropdown based on selected year
 * 
 * @param {Array} expenses - Array of expense transactions
 * @param {number} year - Year to filter by
 * @returns {Array} Unique months (1-12) for the given year sorted in ascending order
 */
export const getMonthsForYear = (expenses, year) => {
  const monthsSet = new Set()
  
  expenses.forEach(expense => {
    const expenseYear = expense.dateISO.substring(0, 4)
    if (parseInt(expenseYear) === year) {
      const month = parseInt(expense.dateISO.substring(5, 7))
      monthsSet.add(month)
    }
  })
  
  return Array.from(monthsSet).sort((a, b) => a - b)
}

/**
 * Filter chart data to only include months within a date range
 * 
 * @param {Array} chartData - Line chart data points with month field
 * @param {number} startMonth - Start month (1-12)
 * @param {number} startYear - Start year (YYYY)
 * @param {number} endMonth - End month (1-12)
 * @param {number} endYear - End year (YYYY)
 * @returns {Array} Filtered chart data containing only months in range
 */
export const filterChartDataByDateRange = (
  chartData,
  startMonth,
  startYear,
  endMonth,
  endYear
) => {
  if (!chartData || chartData.length === 0) {
    return []
  }

  return chartData.filter(dataPoint => {
    // Parse the month string (e.g., "Jan 2026")
    const monthParts = dataPoint.month.split(' ')
    const monthName = monthParts[0]
    const year = parseInt(monthParts[1])
    
    // Month name to number mapping
    const monthMap = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    }
    
    const month = monthMap[monthName]
    if (!month) return false
    
    // Check if month is within range
    const startDate = startYear * 100 + startMonth
    const endDate = endYear * 100 + endMonth
    const currentDate = year * 100 + month
    
    return currentDate >= startDate && currentDate <= endDate
  })
}

/**
 * Parse month-year string to get year
 * Used for extracting year from formatted month strings
 * 
 * @param {string} monthYearString - Month-year formatted string (e.g., "Jan 2026")
 * @returns {number} Year as number
 */
export const getYearFromMonthString = (monthYearString) => {
  const parts = monthYearString.split(' ')
  return parseInt(parts[1]) || new Date().getFullYear()
}

/**
 * Aggregate income and expenses by month
 * Returns monthly totals for both income and expenses, useful for comparison charts
 * 
 * @param {Array} transactions - Array of all transactions (both income and expense)
 * @returns {Array} Monthly totals ready for line/bar chart
 *   Structure: [
 *     { month: "Jan 2026", income: 5000, expense: 3200, net: 1800 },
 *     { month: "Feb 2026", income: 5000, expense: 2800, net: 2200 },
 *     ...
 *   ]
 */
export const getMonthlyIncomeVsExpense = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return []
  }

  // Create a map of months with their income/expense totals
  const monthMap = new Map()

  transactions.forEach(transaction => {
    const monthYear = formatMonthYear(transaction.dateISO)
    
    if (!monthMap.has(monthYear)) {
      monthMap.set(monthYear, {
        month: monthYear,
        income: 0,
        expense: 0
      })
    }

    const monthData = monthMap.get(monthYear)
    
    if (transaction.type === 'income') {
      monthData.income += transaction.amount
    } else if (transaction.type === 'expense') {
      monthData.expense += transaction.amount
    }
  })

  // Convert to sorted array and calculate net
  return Array.from(monthMap.values())
    .sort((a, b) => {
      const dateA = new Date(a.month)
      const dateB = new Date(b.month)
      return dateA - dateB
    })
    .map(item => ({
      ...item,
      net: item.income - item.expense
    }))
}

