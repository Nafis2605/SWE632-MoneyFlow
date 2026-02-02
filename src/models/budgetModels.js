/**
 * Budget Planner Data Models
 * 
 * Defines the core data structures for the MoneyFlow application
 */

/**
 * @typedef {Object} Expense
 * @property {string} id - Unique identifier for the expense (UUID or similar)
 * @property {string} name - Name/description of the expense
 * @property {number} amount - Amount spent (in dollars)
 */

/**
 * @typedef {Object} BudgetState
 * @property {number} income - Monthly income amount
 * @property {Expense[]} expenses - List of expenses
 */

/**
 * Create a new expense object
 * @param {string} name - Name/description of the expense
 * @param {number} amount - Amount of the expense
 * @returns {Expense} New expense object
 */
export const createExpense = (name, amount) => {
  return {
    id: generateId(),
    name: name.trim(),
    amount: Math.max(0, parseFloat(amount))
  }
}

/**
 * Generate a unique ID for expenses
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Calculate total expenses
 * @param {Expense[]} expenses - List of expenses
 * @returns {number} Total amount of all expenses
 */
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0)
}

/**
 * Calculate remaining budget
 * @param {number} income - Monthly income
 * @param {number} totalExpenses - Total expenses
 * @returns {number} Remaining budget amount
 */
export const calculateRemainingBudget = (income, totalExpenses) => {
  return income - totalExpenses
}

/**
 * Calculate expense percentage of income
 * @param {number} expenseAmount - Amount of single expense
 * @param {number} income - Monthly income
 * @returns {number} Percentage (0-100)
 */
export const calculateExpensePercentage = (expenseAmount, income) => {
  if (income === 0) return 0
  return (expenseAmount / income) * 100
}

/**
 * Validate expense data
 * @param {string} name - Expense name
 * @param {number} amount - Expense amount
 * @returns {Object} Validation result with isValid flag and error messages
 */
export const validateExpense = (name, amount) => {
  const errors = []
  
  if (!name || name.trim().length === 0) {
    errors.push('Expense name is required')
  }
  
  if (name && name.trim().length > 100) {
    errors.push('Expense name cannot exceed 100 characters')
  }
  
  if (isNaN(amount) || amount < 0) {
    errors.push('Expense amount must be a positive number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate income data
 * @param {number} income - Monthly income amount
 * @returns {Object} Validation result with isValid flag and error messages
 */
export const validateIncome = (income) => {
  const errors = []
  
  if (isNaN(income) || income < 0) {
    errors.push('Income must be a positive number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
