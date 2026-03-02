/**
 * Category Color Mapping Utility
 * Provides deterministic color assignment for expense categories
 * Ensures the same category always gets the same color across all visualizations
 */

/**
 * Color palette for expense categories
 * Carefully selected for visual distinction and accessibility
 */
const CATEGORY_COLORS = [
  '#5367AB', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#ff6b6b', // Light Red
  '#4ecdc4', // Teal
  '#45b7d1', // Cyan
  '#f7b731', // Yellow
  '#5f27cd', // Purple
  '#a29bfe', // Light Purple
  '#74b9ff', // Light Blue
  '#81ecec', // Light Cyan
  '#fab1a0'  // Light Coral
]

/**
 * Hash a string to get a consistent numeric value
 * Used to deterministically map category names to colors
 *
 * @param {string} str - The string to hash (category name)
 * @returns {number} Hash value
 */
const hashString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Get a consistent color for a category name
 * Same category name always returns the same color
 *
 * @param {string} categoryName - The category name
 * @returns {string} Hex color code
 */
export const getCategoryColor = (categoryName) => {
  if (!categoryName) return CATEGORY_COLORS[0]
  const hash = hashString(categoryName)
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length]
}

/**
 * Get colors for multiple categories, ensuring no duplicates when possible
 * Falls back to repeated colors if more categories than colors available
 *
 * @param {array} categoryNames - Array of category names
 * @returns {object} Mapping of category name to color
 */
export const getCategoryColorMap = (categoryNames) => {
  const colorMap = {}
  categoryNames.forEach((name) => {
    colorMap[name] = getCategoryColor(name)
  })
  return colorMap
}

/**
 * Export the color palette for reference
 */
export const CATEGORY_COLOR_PALETTE = CATEGORY_COLORS

/**
 * Get all available colors in the palette
 * @returns {array} Array of hex color codes
 */
export const getColorPalette = () => CATEGORY_COLORS
