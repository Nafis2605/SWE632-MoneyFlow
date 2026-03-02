/**
 * Timezone-safe date utilities
 * All dates stored as ISO strings (YYYY-MM-DD) to avoid timezone drift
 */

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 * Safe: No timezone interpretation, uses local date
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayISO = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse an ISO date string safely without timezone drift
 * @param {string} isoString - Date in YYYY-MM-DD format
 * @returns {Date} Date object representing midnight in local timezone of that date
 */
export const parseISODate = (isoString) => {
  // Split the date string to avoid Date constructor timezone issues
  const [year, month, day] = isoString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Format an ISO date string to user-friendly format
 * @param {string} isoString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date (e.g., "Mar 2, 2026")
 */
export const formatISODate = (isoString) => {
  return parseISODate(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format a date (ISO string or Date object) to user-friendly format
 * Handles both ISO strings and Date objects
 * @param {string|Date} date - Date as ISO string or Date object
 * @returns {string} Formatted date (e.g., "Mar 2, 2026")
 */
export const formatDate = (date) => {
  if (typeof date === 'string') {
    return formatISODate(date)
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Convert a Date object to ISO string (YYYY-MM-DD)
 * @param {Date} dateObj - JavaScript Date object
 * @returns {string} ISO date string in YYYY-MM-DD format
 */
export const dateToISO = (dateObj) => {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Compare two ISO date strings
 * @param {string} isoA - First date (YYYY-MM-DD)
 * @param {string} isoB - Second date (YYYY-MM-DD)
 * @returns {number} -1 if A < B, 0 if equal, 1 if A > B
 */
export const compareISO = (isoA, isoB) => {
  if (isoA < isoB) return -1
  if (isoA > isoB) return 1
  return 0
}

/**
 * Check if a date is within a range
 * @param {string} isoDate - Date to check (YYYY-MM-DD)
 * @param {string} isoStart - Range start (YYYY-MM-DD)
 * @param {string} isoEnd - Range end (YYYY-MM-DD)
 * @returns {boolean} True if date is within range (inclusive)
 */
export const isDateInRange = (isoDate, isoStart, isoEnd) => {
  return isoDate >= isoStart && isoDate <= isoEnd
}

/**
 * Get the year from an ISO date string
 * @param {string} isoString - Date in YYYY-MM-DD format
 * @returns {number} Year
 */
export const getYearFromISO = (isoString) => {
  return parseInt(isoString.substring(0, 4), 10)
}

/**
 * Get the month from an ISO date string (1-12)
 * @param {string} isoString - Date in YYYY-MM-DD format
 * @returns {number} Month (1-12)
 */
export const getMonthFromISO = (isoString) => {
  return parseInt(isoString.substring(5, 7), 10)
}

/**
 * Format month and year for display
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {string} Formatted month/year (e.g., "Mar 2026")
 */
export const formatMonthYear = (year, month) => {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}

/**
 * Get available years from a list of ISO date strings
 * @param {string[]} isoDates - Array of dates in YYYY-MM-DD format
 * @returns {number[]} Sorted array of unique years (descending)
 */
export const getAvailableYears = (isoDates) => {
  const years = [...new Set(isoDates.map(getYearFromISO))]
  return years.sort((a, b) => b - a)
}

/**
 * Get all months for a given year from a list of ISO dates
 * @param {string[]} isoDates - Array of dates in YYYY-MM-DD format
 * @param {number} year - Year to filter by
 * @returns {number[]} Sorted array of unique months for that year (1-12)
 */
export const getAvailableMonths = (isoDates, year) => {
  const months = [...new Set(
    isoDates
      .filter(date => getYearFromISO(date) === year)
      .map(getMonthFromISO)
  )]
  return months.sort((a, b) => a - b)
}
