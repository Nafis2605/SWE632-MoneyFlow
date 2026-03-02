/**
 * Filter Model and Utilities
 * 
 * Centralized filtering logic used consistently across Dashboard, Transactions, and Reports pages
 * Ensures all pages apply filters in the same way
 */

import { getTodayISO } from './date'
import { filterByDateRange, filterByMonthYear } from './helpers'

/**
 * Get default filter state
 * Returns: All transactions (no filter applied)
 * @returns {Object} Default filters object
 */
export const getDefaultFilters = () => {
  return {
    type: 'all', // 'all', 'dateRange', 'monthYear'
    startDate: null,
    endDate: null,
    year: null,
    month: null
  }
}

/**
 * Apply filters to transactions consistently across all pages
 * Handles: All Transactions, Date Range, Month/Year filtering
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} filters - Filter configuration object
 *   - type: 'all' | 'dateRange' | 'monthYear'
 *   - startDate: ISO string for date range start (e.g., "2026-01-15")
 *   - endDate: ISO string for date range end (e.g., "2026-03-02")
 *   - year: number for month/year filter (e.g., 2026)
 *   - month: number for month/year filter (1-12, e.g., 3)
 * @returns {Array} Filtered transactions
 */
export const applyFilters = (transactions, filters) => {
  if (!transactions || transactions.length === 0) {
    return transactions
  }

  // No filter applied - return all transactions
  if (!filters || filters.type === 'all' || filters.type === undefined) {
    return transactions
  }

  // Date range filter
  if (filters.type === 'dateRange' && filters.startDate && filters.endDate) {
    return filterByDateRange(transactions, filters.startDate, filters.endDate)
  }

  // Month/Year filter
  if (filters.type === 'monthYear' && filters.year && filters.month) {
    return filterByMonthYear(transactions, filters.year, filters.month)
  }

  // Invalid filter - return all
  return transactions
}

/**
 * Create a filter object from individual parameters
 * Helper function to build filters in a cleaner way
 * @param {string} type - Filter type: 'all', 'dateRange', or 'monthYear'
 * @param {Object} params - Type-specific parameters
 * @returns {Object} Filter configuration object
 */
export const createFilters = (type, params = {}) => {
  const base = getDefaultFilters()
  base.type = type

  if (type === 'dateRange' && params.startDate && params.endDate) {
    base.startDate = params.startDate
    base.endDate = params.endDate
  } else if (type === 'monthYear' && params.year && params.month) {
    base.year = params.year
    base.month = params.month
  }

  return base
}

/**
 * Check if filters are active (not the default "all" state)
 * @param {Object} filters - Filter configuration object
 * @returns {boolean} True if filters are actively applied
 */
export const isFilterActive = (filters) => {
  return filters && filters.type !== 'all' && filters.type !== undefined
}
