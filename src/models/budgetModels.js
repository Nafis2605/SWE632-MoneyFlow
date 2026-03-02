/**
 * Budget Planner Data Models
 * 
 * Defines the core data structures for the MoneyFlow application
 * Uses a unified transaction-based system for both income and expenses
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique identifier for the transaction
 * @property {string} type - Transaction type: "income" or "expense"
 * @property {string} description - Name/description of the transaction
 * @property {string} category - Category of the transaction (e.g., 'salary', 'groceries')
 * @property {number} amount - Transaction amount (in dollars)
 * @property {string} dateISO - ISO date string (YYYY-MM-DD) to avoid timezone issues
 */

/**
 * @typedef {Object} BudgetState
 * @property {Transaction[]} transactions - List of all transactions (income and expenses)
 */

/**
 * Create a new transaction object
 * @param {string} type - Transaction type: "income" or "expense"
 * @param {string} description - Name/description of the transaction
 * @param {string} category - Category of the transaction
 * @param {number} amount - Amount of the transaction
 * @param {string|Date} dateISO - Date of the transaction as ISO string (YYYY-MM-DD) or Date object (defaults to today)
 * @returns {Transaction} New transaction object
 */
export const createTransaction = (type, description, category, amount, dateISO) => {
  let isoDate = dateISO
  
  // Convert Date object to ISO string if needed
  if (dateISO instanceof Date) {
    const year = dateISO.getFullYear()
    const month = String(dateISO.getMonth() + 1).padStart(2, '0')
    const day = String(dateISO.getDate()).padStart(2, '0')
    isoDate = `${year}-${month}-${day}`
  }
  // If no date provided, use today
  else if (!dateISO) {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    isoDate = `${year}-${month}-${day}`
  }
  
  return {
    id: generateId(),
    type: type.toLowerCase(),
    description: description.trim(),
    category: category.toLowerCase(),
    amount: Math.max(0, parseFloat(amount)),
    dateISO: isoDate
  }
}

/**
 * Create a new expense transaction (convenience function)
 * @param {string} description - Name/description of the expense
 * @param {string} category - Category of the expense
 * @param {number} amount - Amount of the expense
 * @returns {Transaction} New expense transaction object
 */
export const createExpense = (description, category, amount) => {
  return createTransaction('expense', description, category, amount)
}

/**
 * Create a new income transaction (convenience function)
 * @param {string} description - Name/description of the income
 * @param {string} category - Category of the income
 * @param {number} amount - Amount of the income
 * @returns {Transaction} New income transaction object
 */
export const createIncome = (description, category, amount) => {
  return createTransaction('income', description, category, amount)
}

/**
 * Generate a unique ID for transactions
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Filter transactions by type
 * @param {Transaction[]} transactions - Array of transactions
 * @param {string} type - Type to filter by: "income" or "expense"
 * @returns {Transaction[]} Filtered transactions
 */
export const filterTransactionsByType = (transactions, type) => {
  return transactions.filter(transaction => transaction.type === type.toLowerCase())
}

/**
 * Calculate total income from transactions
 * @param {Transaction[]} transactions - Array of transactions
 * @returns {number} Total income amount
 */
export const calculateTotalIncome = (transactions) => {
  return filterTransactionsByType(transactions, 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)
}

/**
 * Calculate total expenses from transactions
 * @param {Transaction[]} transactions - Array of transactions
 * @returns {number} Total expenses amount
 */
export const calculateTotalExpenses = (transactions) => {
  return filterTransactionsByType(transactions, 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)
}

/**
 * Calculate net budget (income - expenses)
 * @param {Transaction[]} transactions - Array of transactions
 * @returns {number} Net budget amount
 */
export const calculateNetBudget = (transactions) => {
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  return totalIncome - totalExpenses
}

/**
 * Validate transaction data
 * @param {string} title - Transaction title
 * @param {number} amount - Transaction amount
 * @returns {Object} Validation result with isValid flag and error messages
 */
export const validateTransaction = (title, amount) => {
  const errors = []
  
  if (!title || title.trim().length === 0) {
    errors.push('Transaction title is required')
  }
  
  if (title && title.trim().length > 100) {
    errors.push('Transaction title cannot exceed 100 characters')
  }
  
  if (isNaN(amount) || amount < 0) {
    errors.push('Transaction amount must be a positive number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate expense data (uses transaction validation)
 * @param {string} title - Expense title
 * @param {number} amount - Expense amount
 * @returns {Object} Validation result with isValid flag and error messages
 */
export const validateExpense = (title, amount) => {
  return validateTransaction(title, amount)
}

/**
 * Validate income data (uses transaction validation)
 * @param {string} title - Income title
 * @param {number} amount - Income amount
 * @returns {Object} Validation result with isValid flag and error messages
 */
export const validateIncome = (title, amount) => {
  return validateTransaction(title, amount)
}
