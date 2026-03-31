/**
 * Category Color Mapping System
 * 
 * Provides high-contrast, accessibility-friendly colors for all categories
 * Ensures consistent coloring across all visualizations
 * 
 * Color Selection Principles:
 * - High contrast between adjacent categories
 * - Accessible for common color vision deficiencies
 * - Consistent with app theme
 * - Distinguishable in both light and dark contexts
 */

/**
 * Direct color mapping for expense categories
 * High-contrast colors specifically chosen for visual distinction
 */
const EXPENSE_CATEGORY_COLORS = {
  rent: '#4F46E5',           // Deep Indigo - primary, important
  groceries: '#10B981',      // Emerald Green - natural, food
  utilities: '#F59E0B',      // Amber - energy, warm
  transportation: '#EF4444', // Red - urgent, necessary
  dining: '#EC4899',         // Pink - leisure, social
  healthcare: '#06B6D4',     // Cyan - health, care
  entertainment: '#8B5CF6',  // Violet - fun, leisure
  education: '#3B82F6',      // Sky Blue - learning
  shopping: '#F97316',       // Orange - spending
  travel: '#6366F1',         // Indigo - adventure
  other: '#64748B'           // Slate - catch-all
}

/**
 * Direct color mapping for income categories
 * High-contrast colors specifically chosen for visual distinction
 */
const INCOME_CATEGORY_COLORS = {
  salary: '#059669',         // Teal Green - main income
  freelance: '#0891B2',      // Cyan - flexible income
  bonus: '#FBBF24',          // Amber-Gold - special income
  investment: '#6366F1',     // Indigo - financial growth
  gift: '#DB2777',           // Rose - special occasion
  refund: '#10B981',         // Emerald - return
  side_hustle: '#EA580C',    // Orange-Red - extra income
  scholarship: '#7C3AED',    // Violet - education income
  rental: '#92400E',         // Brown - property income
  other: '#64748B'           // Slate - catch-all
}

/**
 * Fallback color palette for unknown categories
 * Used when a category is not in the predefined mappings
 * Ordered for maximum contrast
 */
const FALLBACK_PALETTE = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#8B5CF6', // Violet
  '#F97316', // Orange
  '#3B82F6', // Sky Blue
  '#6366F1', // Another Indigo
  '#64748B'  // Slate
]

/**
 * Get a consistent color for a category name
 * Uses direct mapping for known categories, falls back to hash-based assignment
 * Same category name always returns the same color
 *
 * @param {string} categoryValue - The category value (lowercase, e.g., 'groceries')
 * @param {string} type - Optional: "income" or "expense" (helps with correct mapping)
 * @returns {string} Hex color code
 */
export const getCategoryColor = (categoryValue, type = 'expense') => {
  if (!categoryValue) return FALLBACK_PALETTE[0]

  const value = String(categoryValue).toLowerCase().trim()

  // Try direct mapping first based on type
  if (type === 'income' && INCOME_CATEGORY_COLORS[value]) {
    return INCOME_CATEGORY_COLORS[value]
  }
  if (type === 'expense' && EXPENSE_CATEGORY_COLORS[value]) {
    return EXPENSE_CATEGORY_COLORS[value]
  }

  // Try both mappings as fallback
  if (EXPENSE_CATEGORY_COLORS[value]) {
    return EXPENSE_CATEGORY_COLORS[value]
  }
  if (INCOME_CATEGORY_COLORS[value]) {
    return INCOME_CATEGORY_COLORS[value]
  }

  // Fall back to hash-based assignment for unknown categories
  return FALLBACK_PALETTE[hashString(value) % FALLBACK_PALETTE.length]
}

/**
 * Hash a string to get a consistent numeric value
 * Used for fallback color assignment to unknown categories
 *
 * @param {string} str - The string to hash
 * @returns {number} Hash value
 */
const hashString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Get colors for multiple categories, ensuring no duplicates when possible
 * Returns a mapping of category name to color
 *
 * @param {array} categoryValues - Array of category values
 * @param {string} type - Optional: "income" or "expense"
 * @returns {object} Mapping of category value to color
 */
export const getCategoryColorMap = (categoryValues, type = 'expense') => {
  const colorMap = {}
  categoryValues.forEach((value) => {
    colorMap[value] = getCategoryColor(value, type)
  })
  return colorMap
}

/**
 * Get all category colors for a specific type
 *
 * @param {string} type - "income" or "expense"
 * @returns {object} Complete color mapping for that type
 */
export const getAllCategoryColors = (type = 'expense') => {
  return type === 'income' ? INCOME_CATEGORY_COLORS : EXPENSE_CATEGORY_COLORS
}

/**
 * Export color mappings for testing/reference
 */
export const CATEGORY_COLOR_PALETTE = FALLBACK_PALETTE
export const EXPENSE_COLORS = EXPENSE_CATEGORY_COLORS
export const INCOME_COLORS = INCOME_CATEGORY_COLORS

/**
 * Get all available colors in the fallback palette
 * @returns {array} Array of hex color codes
 */
export const getColorPalette = () => FALLBACK_PALETTE
