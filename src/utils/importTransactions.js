/**
 * CSV Import Utilities for Bulk Transaction Import
 * Handles parsing, validation, and importing of transactions from CSV files
 */

import { createTransaction, generateId } from '../models/budgetModels'
import { getTodayISO, parseISODate } from './date'

/**
 * Parse CSV text content and return array of rows
 * @param {string} csvText - Raw CSV text content
 * @returns {Array} Array of arrays, where each inner array is a row
 */
export const parseCSV = (csvText) => {
  const rows = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i]
    const nextChar = csvText[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      rows.push(current.trim())
      current = ''
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (current.trim()) {
        rows.push(current.trim())
      }
      current = ''
      if (char === '\r' && nextChar === '\n') i++
    } else {
      current += char
    }
  }

  if (current.trim()) {
    rows.push(current.trim())
  }

  // Group cells into rows
  const cellsPerRow = 5
  const result = []
  for (let i = 0; i < rows.length; i += cellsPerRow) {
    result.push(rows.slice(i, i + cellsPerRow))
  }

  return result
}

/**
 * Simple CSV parser that handles basic comma-separated values
 * Works with or without quotes
 * @param {string} csvText - Raw CSV content
 * @returns {Array<Array>} Parsed rows
 */
export const parseCSVSimple = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim())
  return lines.map(line => {
    // Handle both quoted and unquoted values
    const cells = line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
    return cells
  })
}

/**
 * Validate a transaction row from CSV import
 * @param {Array} row - CSV row with [date, description, category, type, amount]
 * @param {number} rowIndex - Row index for error reporting
 * @returns {Object} { isValid: boolean, data: transaction data, errors: string[] }
 */
export const validateTransactionRow = (row, rowIndex) => {
  const errors = []

  if (!row || row.length < 5) {
    return {
      isValid: false,
      data: null,
      errors: ['Row has fewer than 5 required columns (Date, Description, Category, Type, Amount)']
    }
  }

  const [dateStr, description, category, type, amountStr] = row

  // Validate date
  if (!dateStr || !dateStr.trim()) {
    errors.push('Date is required')
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dateStr.trim())) {
      errors.push(`Invalid date format: "${dateStr}". Use YYYY-MM-DD`)
    }
  }

  // Validate description
  if (!description || !description.trim()) {
    errors.push('Description is required')
  }

  // Validate category
  if (!category || !category.trim()) {
    errors.push('Category is required')
  }

  // Validate type
  const validTypes = ['income', 'expense']
  if (!type || !validTypes.includes(type.trim().toLowerCase())) {
    errors.push(
      `Invalid type: "${type}". Must be "income" or "expense"`
    )
  }

  // Validate amount
  if (!amountStr || !amountStr.trim()) {
    errors.push('Amount is required')
  } else {
    const amount = parseFloat(amountStr)
    if (isNaN(amount) || amount < 0) {
      errors.push(`Invalid amount: "${amountStr}". Must be a positive number`)
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      data: null,
      errors
    }
  }

  return {
    isValid: true,
    data: {
      dateISO: dateStr.trim(),
      description: description.trim(),
      category: category.trim().toLowerCase(),
      type: type.trim().toLowerCase(),
      amount: parseFloat(amountStr)
    },
    errors: []
  }
}

/**
 * Parse and validate CSV import data
 * @param {string} csvText - Raw CSV content
 * @returns {Object} { validTransactions, invalidRows, summary }
 */
export const parseAndValidateCSV = (csvText) => {
  const rows = parseCSVSimple(csvText)

  // Skip header row if it exists
  const headerTokens = rows[0]?.map(h => h.toLowerCase()) || []
  const expectedHeaders = ['date', 'description', 'category', 'type', 'amount']
  const isHeaderRow = expectedHeaders.some(expected =>
    headerTokens.some(header => header.includes(expected.slice(0, 3)))
  )

  const dataRows = isHeaderRow ? rows.slice(1) : rows
  const validTransactions = []
  const invalidRows = []

  dataRows.forEach((row, index) => {
    const validation = validateTransactionRow(row, index)
    if (validation.isValid) {
      validTransactions.push({
        ...validation.data,
        id: generateId()
      })
    } else {
      invalidRows.push({
        rowIndex: isHeaderRow ? index + 2 : index + 1,
        row,
        errors: validation.errors
      })
    }
  })

  return {
    validTransactions,
    invalidRows,
    summary: {
      totalRows: dataRows.length,
      validCount: validTransactions.length,
      invalidCount: invalidRows.length
    }
  }
}

/**
 * Generate a CSV template for download
 * @returns {string} CSV template content
 */
export const generateCSVTemplate = () => {
  const header = 'Date,Description,Category,Type,Amount'
  const examples = [
    '2026-03-15,Monthly Salary,salary,income,3500.00',
    '2026-03-10,Grocery Store,groceries,expense,85.50',
    '2026-03-05,Electric Bill,utilities,expense,125.00',
    '2026-02-28,Freelance Project,freelance,income,500.00',
    '2026-02-20,Restaurant,dining,expense,45.75'
  ]
  return [header, ...examples].join('\n')
}

/**
 * Download template as CSV file
 */
export const downloadTemplate = () => {
  const template = generateCSVTemplate()
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', 'transaction-template.csv')
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}
