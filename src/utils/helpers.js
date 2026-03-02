/* eslint-disable-next-line import/no-unresolved */
import { jsPDF } from 'jspdf'
import { formatDate, formatISODate, compareISO, getYearFromISO, getMonthFromISO, formatMonthYear } from './date'

/**
 * Utility function to format currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Utility function to format date
 * @param {string|Date} date - The date to format (ISO string or Date object)
 * @returns {string} Formatted date string
 */
export const formatDateHelper = (date) => {
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
 * Utility function to validate email
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get recent transactions sorted by date (descending)
 * @param {Transaction[]} transactions - Array of all transactions
 * @param {number} limit - Maximum number of transactions to return (default: 5)
 * @returns {Transaction[]} Recent transactions sorted by date descending
 */
export const getRecentTransactions = (transactions, limit = 5) => {
  return [...transactions]
    .sort((a, b) => compareISO(b.dateISO, a.dateISO))
    .slice(0, limit)
}

/**
 * Get all transactions sorted by date (descending)
 * @param {Transaction[]} transactions - Array of all transactions
 * @returns {Transaction[]} Transactions sorted by date descending
 */
export const getSortedTransactions = (transactions) => {
  return [...transactions].sort((a, b) => compareISO(b.dateISO, a.dateISO))
}

/**
 * Group transactions by month/year
 * @param {Transaction[]} transactions - Array of transactions
 * @returns {Object} Object with month keys containing transactions
 */
export const groupTransactionsByMonth = (transactions) => {
  const sorted = getSortedTransactions(transactions)
  const grouped = {}

  sorted.forEach((transaction) => {
    const year = getYearFromISO(transaction.dateISO)
    const month = String(getMonthFromISO(transaction.dateISO)).padStart(2, '0')
    const key = `${year}-${month}`

    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(transaction)
  })

  return grouped
}

/**
 * Format month key to readable format
 * @param {string} monthKey - Key in format "YYYY-MM"
 * @returns {string} Formatted month like "March 2026"
 */
export const formatMonthKeyHelper = (monthKey) => {
  const [year, month] = monthKey.split('-')
  return formatMonthYear(parseInt(year), parseInt(month))
}

/**
 * Filter transactions by date range
 * @param {Transaction[]} transactions - Array of transactions
 * @param {string} startDate - Start date as ISO string (YYYY-MM-DD)
 * @param {string} endDate - End date as ISO string (YYYY-MM-DD)
 * @returns {Transaction[]} Filtered transactions within date range (inclusive)
 */
export const filterByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter(transaction => {
    const txnDate = transaction.dateISO
    return txnDate >= startDate && txnDate <= endDate
  })
}

/**
 * Filter transactions by month and year
 * @param {Transaction[]} transactions - Array of transactions
 * @param {number} year - Year (e.g., 2026)
 * @param {number} month - Month (1-12)
 * @returns {Transaction[]} Filtered transactions for specified month
 */
export const filterByMonthYear = (transactions, year, month) => {
  return transactions.filter(transaction => {
    return getYearFromISO(transaction.dateISO) === year && getMonthFromISO(transaction.dateISO) === month
  })
}

/**
 * Get available months for filtering
 * @param {Transaction[]} transactions - Array of transactions
 * @returns {Array} Array of {year, month, label} objects
 */
export const getAvailableMonths = (transactions) => {
  const months = new Set()
  
  transactions.forEach(transaction => {
    const year = getYearFromISO(transaction.dateISO)
    const month = getMonthFromISO(transaction.dateISO)
    const key = `${year}-${String(month).padStart(2, '0')}`
    months.add(key)
  })
  
  return Array.from(months)
    .sort()
    .reverse()
    .map(key => {
      const [year, month] = key.split('-')
      return {
        key,
        year: parseInt(year),
        month: parseInt(month),
        label: formatMonthKeyHelper(key)
      }
    })
}

/**
 * Generate CSV string from transactions
 * @param {Transaction[]} transactions - Array of transactions to export
 * @returns {string} CSV formatted string
 */
export const generateTransactionCSV = (transactions) => {
  // CSV Headers
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  
  // Escape CSV values to handle commas and quotes
  const escapeCSVValue = (value) => {
    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }
  
  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => [
    formatDate(transaction.dateISO),
    escapeCSVValue(transaction.description),
    escapeCSVValue(transaction.category),
    transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    `$${transaction.amount.toFixed(2)}`
  ])
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  return csvContent
}

/**
 * Download CSV file with transaction data
 * @param {Transaction[]} transactions - Array of transactions to export
 * @param {string} filename - Name of the file (default: 'transactions.csv')
 */
export const downloadTransactionCSV = (transactions, filename = 'transactions.csv') => {
  const csvContent = generateTransactionCSV(transactions)
  
  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  // Create a temporary URL for the blob
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  // Set the download attributes and trigger download
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL
  URL.revokeObjectURL(url)
}

/**
 * Generate PDF from transaction data and report summary
 * @param {Transaction[]} transactions - Array of transactions to export
 * @param {Object} summary - Summary object with totalIncome, totalExpenses, netBalance, etc.
 * @param {string} filterInfo - Filter information string
 * @returns {PDF} jsPDF document object
 */
export const generateTransactionPDF = (transactions, summary, filterInfo = '') => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const lineHeight = 7
  let yPosition = margin
  
  // Title
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('Financial Report', margin, yPosition)
  yPosition += 10
  
  // Date
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  doc.text(`Generated: ${reportDate}`, margin, yPosition)
  yPosition += 8
  
  // Filter info
  if (filterInfo) {
    doc.setFont(undefined, 'italic')
    doc.setTextColor(100)
    doc.text(`Filter: ${filterInfo}`, margin, yPosition)
    doc.setTextColor(0)
    yPosition += 8
  }
  
  yPosition += 2
  
  // Summary Section
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Summary', margin, yPosition)
  yPosition += 8
  
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  
  // Summary data
  const summaryLines = [
    `Total Income: $${summary.totalIncome.toFixed(2)}`,
    `Total Expenses: $${summary.totalExpenses.toFixed(2)}`,
    `Net Balance: $${summary.netBalance.toFixed(2)}`,
    `Number of Transactions: ${summary.transactionCount}`,
    `Expense Ratio: ${summary.expenseRatio.toFixed(1)}%`,
    `Savings Rate: ${summary.savingsRate.toFixed(1)}%`
  ]
  
  summaryLines.forEach(line => {
    doc.text(line, margin, yPosition)
    yPosition += lineHeight
  })
  
  yPosition += 5
  
  // Check if we need a new page
  if (yPosition > pageHeight - 40) {
    doc.addPage()
    yPosition = margin
  }
  
  // Transactions Section
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Transaction Details', margin, yPosition)
  yPosition += 8
  
  doc.setFontSize(9)
  doc.setFont(undefined, 'bold')
  
  // Table headers
  const colDate = margin
  const colTitle = margin + 35
  const colType = margin + 95
  const colAmount = margin + 135
  
  doc.text('Date', colDate, yPosition)
  doc.text('Description', colTitle, yPosition)
  doc.text('Type', colType, yPosition)
  doc.text('Amount', colAmount, yPosition)
  yPosition += lineHeight
  
  // Draw line under headers
  doc.setDrawColor(200)
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2)
  
  // Table data
  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)
  
  transactions.forEach(transaction => {
    if (yPosition > pageHeight - 15) {
      doc.addPage()
      yPosition = margin
      
      // Repeat headers on new page
      doc.setFont(undefined, 'bold')
      doc.text('Date', colDate, yPosition)
      doc.text('Description', colTitle, yPosition)
      doc.text('Type', colType, yPosition)
      doc.text('Amount', colAmount, yPosition)
      yPosition += lineHeight
      doc.setDrawColor(200)
      doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2)
      doc.setFont(undefined, 'normal')
    }
    
    const date = formatDate(transaction.dateISO)
    const type = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
    const amount = `$${transaction.amount.toFixed(2)}`
    
    // Handle description wrapping
    const wrappedTitle = doc.splitTextToSize(transaction.description, 55)
    
    doc.text(date, colDate, yPosition)
    doc.text(wrappedTitle, colTitle, yPosition)
    doc.text(type, colType, yPosition)
    doc.text(amount, colAmount, yPosition)
    
    yPosition += lineHeight * Math.max(wrappedTitle.length, 1)
  })
  
  return doc
}

/**
 * Download transactions as PDF file
 * @param {Transaction[]} transactions - Array of transactions to export
 * @param {Object} summary - Summary object with report data
 * @param {string} filename - Name of the file
 * @param {string} filterInfo - Filter information string
 */
export const downloadTransactionPDF = (transactions, summary, filename = 'transactions.pdf', filterInfo = '') => {
  try {
    const pdf = generateTransactionPDF(transactions, summary, filterInfo)
    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('An error occurred while generating the PDF. Please try again.')
  }
}
