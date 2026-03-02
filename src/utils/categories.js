/**
 * Transaction Category Definitions
 * 
 * Centralized category options for income and expense transactions
 * Used across the app for filtering, reporting, and organization
 */

/**
 * Income category options
 * @type {Array<{value: string, label: string}>}
 */
export const INCOME_CATEGORIES = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'investment', label: 'Investment' },
  { value: 'gift', label: 'Gift' },
  { value: 'refund', label: 'Refund' },
  { value: 'side_hustle', label: 'Side Hustle' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'rental', label: 'Rental Income' },
  { value: 'other', label: 'Other Income' }
]

/**
 * Expense category options
 * @type {Array<{value: string, label: string}>}
 */
export const EXPENSE_CATEGORIES = [
  { value: 'rent', label: 'Rent' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'dining', label: 'Dining Out' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'education', label: 'Education' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other Expense' }
]

/**
 * Get category options by transaction type
 * @param {string} type - "income" or "expense"
 * @returns {Array<{value: string, label: string}>} Category options for the type
 */
export const getCategoryOptions = (type) => {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

/**
 * Get category label by value and type
 * @param {string} value - Category value
 * @param {string} type - "income" or "expense"
 * @returns {string} Category label or the value if not found
 */
export const getCategoryLabel = (value, type) => {
  const categories = getCategoryOptions(type)
  const category = categories.find((cat) => cat.value === value)
  return category ? category.label : value
}

/**
 * Validate that a category exists for the given type
 * @param {string} value - Category value to validate
 * @param {string} type - "income" or "expense"
 * @returns {boolean} True if category is valid
 */
export const isValidCategory = (value, type) => {
  const categories = getCategoryOptions(type)
  return categories.some((cat) => cat.value === value)
}
