/**
 * Color palette constants for the MoneyFlow application
 * Semantic colors: Income = Green, Expense = Red
 */
export const COLORS = {
  primary: '#5367AB',      // Blue - brand color
  income: '#16a34a',       // Green - income transactions
  expense: '#dc2626',      // Red - expense transactions
  warning: '#dc2626',      // Red - warnings and expenses (changed from yellow)
  success: '#16a34a',      // Green - success and positive values
  light: '#ffffff',        // White
  background: '#ffffff'    // White Background
}

/**
 * API configuration constants
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api',
  timeout: 5000
}

/**
 * Local storage keys for the application
 */
export const STORAGE_KEYS = {
  user: 'moneyflow_user',
  transactions: 'moneyflow_transactions',
  preferences: 'moneyflow_preferences'
}
