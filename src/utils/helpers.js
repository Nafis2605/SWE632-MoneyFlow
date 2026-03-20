/* eslint-disable-next-line import/no-unresolved */
import { jsPDF } from 'jspdf'
import { formatDate, formatISODate, compareISO, getYearFromISO, getMonthFromISO, formatMonthYear } from './date'
import { groupTransactionsByCategory } from './aggregate'

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

/**
 * Generate enhanced PDF with charts and visualizations
 * @param {Transaction[]} transactions - Array of transactions to export
 * @param {Object} summary - Summary object with report data
 * @param {string} filterInfo - Filter information string
 * @param {Object} chartImages - Object containing base64 chart images {pieChart, barChart}
 * @returns {jsPDF} PDF document object
 */
export const generateEnhancedTransactionPDF = (transactions, summary, filterInfo = '', chartImages = {}) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const lineHeight = 7
  const sectionSpacing = 8
  let yPosition = margin

  // COLOR SCHEME - Using basic colors that jsPDF handles well
  const primaryColor = [83, 103, 171] // #5367AB
  const textDarkColor = [51, 51, 51]
  const textLightColor = [102, 102, 102]
  const incomeColor = [22, 163, 74] // Green for income
  const expenseColor = [220, 38, 38] // Red for expense
  const headerBgColor = [240, 242, 248]

  // Helper function to add section header (without emoji to avoid encoding issues)
  const addSectionHeader = (title) => {
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 4

    doc.setFontSize(13)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...primaryColor)
    // Use plain text without emoji to avoid PDF encoding corruption
    doc.text(title, margin, yPosition)
    yPosition += 8
  }

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace = 50) => {
    if (yPosition + requiredSpace > pageHeight - 10) {
      doc.addPage()
      yPosition = margin
    }
  }

  // Helper function to calculate aspect-ratio-preserving dimensions
  const scaleImageToFit = (maxWidth, maxHeight, imageRatio) => {
    // imageRatio = image width / image height
    const widthLimited = maxHeight * imageRatio
    const heightLimited = maxWidth / imageRatio

    if (widthLimited <= maxWidth) {
      return { width: widthLimited, height: maxHeight }
    } else {
      return { width: maxWidth, height: heightLimited }
    }
  }

  // ===== PAGE 1: TITLE SECTION =====
  doc.setFontSize(28)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...textDarkColor)
  doc.text('Financial Report', margin, yPosition)
  yPosition += 14

  // Date and Filter Info
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(...textLightColor)
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  doc.text(`Generated: ${reportDate}`, margin, yPosition)
  yPosition += 6

  if (filterInfo) {
    doc.setFont(undefined, 'normal')
    doc.text(`Date Range: ${filterInfo}`, margin, yPosition)
    yPosition += 6
  }

  yPosition += sectionSpacing

  // ===== SUMMARY SECTION =====
  addSectionHeader('Summary')

  // Summary data in two columns
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.setTextColor(...textDarkColor)

  const summaryData = [
    { label: 'Total Income', value: `$${summary.totalIncome.toFixed(2)}` },
    { label: 'Total Expenses', value: `$${summary.totalExpenses.toFixed(2)}` },
    { label: 'Net Balance', value: `$${summary.netBalance.toFixed(2)}` }
  ]

  const advancedData = [
    { label: 'Transactions', value: `${summary.transactionCount}` },
    { label: 'Expense Ratio', value: `${summary.expenseRatio.toFixed(1)}%` },
    { label: 'Savings Rate', value: `${summary.savingsRate.toFixed(1)}%` }
  ]

  const leftColX = margin
  const rightColX = pageWidth / 2 + 5

  summaryData.forEach((item, index) => {
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...primaryColor)
    doc.text(item.label + ':', leftColX, yPosition)
    
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...textDarkColor)
    doc.text(item.value, leftColX + 45, yPosition)

    doc.setFont(undefined, 'bold')
    doc.setTextColor(...primaryColor)
    doc.text(advancedData[index].label + ':', rightColX, yPosition)
    
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...textDarkColor)
    doc.text(advancedData[index].value, rightColX + 45, yPosition)

    yPosition += lineHeight + 2
  })

  yPosition += sectionSpacing

  // ===== CHARTS SECTION =====
  const hasCharts = chartImages.chartsVisualization || chartImages.pieChart || chartImages.barChart
  if (hasCharts) {
    // Start charts on a new page for better visibility and layout
    doc.addPage()
    yPosition = margin
    
    addSectionHeader('Visualizations')

    try {
      const chartImage = chartImages.chartsVisualization || chartImages.pieChart
      if (chartImage) {
        // Create a new Image object to get actual dimensions
        const img = new Image()
        img.src = chartImage
        
        // Calculate optimal dimensions for full-page chart display
        // Charts from PDFExportVisualization are ~1000px wide
        // We want to use most of the page width (minus margins)
        const maxChartWidth = pageWidth - margin * 2
        
        // For the combined visualization, estimate the aspect ratio
        // The PDFExportVisualization container has pie + bar + stats cards vertically stacked
        // Typical captured height would be around 1200-1400px for 1000px width
        // So aspect ratio is roughly 1000/1300 = 0.77
        const estimatedAspectRatio = 1000 / 1300 // width / height
        
        // Calculate height based on aspect ratio and available space
        let chartWidth = maxChartWidth
        let chartHeight = chartWidth / estimatedAspectRatio
        
        // Ensure we don't exceed page height too much (leave room for next section)
        const maxAvailableHeight = pageHeight - margin - 40
        if (chartHeight > maxAvailableHeight) {
          chartHeight = maxAvailableHeight
          chartWidth = chartHeight * estimatedAspectRatio
        }
        
        // Center horizontally
        const chartX = margin + (maxChartWidth - chartWidth) / 2
        
        doc.addImage(chartImage, 'PNG', chartX, yPosition, chartWidth, chartHeight)
        yPosition += chartHeight + 15
        
      } else if (chartImages.barChart) {
        // Fallback to bar chart if pie chart not available
        const maxChartWidth = pageWidth - margin * 2
        const chartHeight = 120  // Reasonable height for single chart
        const chartWidth = maxChartWidth
        const chartX = margin
        
        doc.addImage(chartImages.barChart, 'PNG', chartX, yPosition, chartWidth, chartHeight)
        yPosition += chartHeight + 15
      }
    } catch (error) {
      console.error('Error adding charts to PDF:', error)
      // Add fallback message instead of chart
      doc.setFontSize(10)
      doc.setFont(undefined, 'italic')
      doc.setTextColor(...textLightColor)
      doc.text('Charts are available in the digital report but could not be embedded in PDF format.', margin, yPosition)
      yPosition += 12
    }

    yPosition += sectionSpacing
  }

  // ===== CATEGORY SUMMARY SECTION =====
  // Group transactions by category and type
  const incomeByCategory = groupTransactionsByCategory(
    transactions.filter(t => t.type === 'income'),
    'income'
  )
  const expenseByCategory = groupTransactionsByCategory(
    transactions.filter(t => t.type === 'expense'),
    'expense'
  )

  if (incomeByCategory.length > 0 || expenseByCategory.length > 0) {
    checkPageBreak(60)
    addSectionHeader('Category Summary')

    // Expense Summary
    if (expenseByCategory.length > 0) {
      doc.setFontSize(11)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(...expenseColor)
      doc.text('Expenses by Category', margin, yPosition)
      yPosition += 6

      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')
      doc.setTextColor(...textDarkColor)

      expenseByCategory.forEach(category => {
        const categoryLine = `  ${category.label}: $${category.amount.toFixed(2)} (${category.count} transaction${category.count !== 1 ? 's' : ''})`
        doc.text(categoryLine, margin, yPosition)
        yPosition += lineHeight
      })

      yPosition += 4
    }

    // Income Summary
    if (incomeByCategory.length > 0) {
      doc.setFontSize(11)
      doc.setFont(undefined, 'bold')
      doc.setTextColor(...incomeColor)
      doc.text('Income by Category', margin, yPosition)
      yPosition += 6

      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')
      doc.setTextColor(...textDarkColor)

      incomeByCategory.forEach(category => {
        const categoryLine = `  ${category.label}: $${category.amount.toFixed(2)} (${category.count} transaction${category.count !== 1 ? 's' : ''})`
        doc.text(categoryLine, margin, yPosition)
        yPosition += lineHeight
      })

      yPosition += 4
    }

    yPosition += sectionSpacing
  }

  // ===== TRANSACTIONS SECTION =====
  checkPageBreak(50)
  addSectionHeader('Transaction Details')

  // Table headers with background
  doc.setFillColor(...headerBgColor)
  doc.setDrawColor(...primaryColor)
  doc.rect(margin, yPosition - 5, pageWidth - margin * 2, lineHeight + 2, 'F')

  doc.setFontSize(9)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(...primaryColor)

  const colDate = margin + 2
  const colTitle = margin + 28
  const colType = margin + 75
  const colAmount = pageWidth - margin - 28

  doc.text('Date', colDate, yPosition)
  doc.text('Description', colTitle, yPosition)
  doc.text('Type', colType, yPosition)
  doc.text('Amount', colAmount, yPosition)
  yPosition += lineHeight + 4

  // Table data
  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)

  transactions.forEach((transaction, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 15) {
      doc.addPage()
      yPosition = margin

      // Repeat headers on new page
      doc.setFillColor(...headerBgColor)
      doc.setDrawColor(...primaryColor)
      doc.rect(margin, yPosition - 5, pageWidth - margin * 2, lineHeight + 2, 'F')
      doc.setFont(undefined, 'bold')
      doc.setTextColor(...primaryColor)
      doc.text('Date', colDate, yPosition)
      doc.text('Description', colTitle, yPosition)
      doc.text('Type', colType, yPosition)
      doc.text('Amount', colAmount, yPosition)
      yPosition += lineHeight + 4
      doc.setFont(undefined, 'normal')
    }

    const date = formatDate(transaction.dateISO)
    const type = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
    
    // Format amount with sign and color based on type
    let amount
    let amountColor
    if (transaction.type === 'income') {
      amount = `+$${transaction.amount.toFixed(2)}`
      amountColor = incomeColor
    } else {
      amount = `-$${transaction.amount.toFixed(2)}`
      amountColor = expenseColor
    }

    // Alternate row color for readability
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250)
      doc.rect(margin, yPosition - 5, pageWidth - margin * 2, lineHeight + 1, 'F')
    }

    // Set text color - dark for most, colored for amount
    doc.setTextColor(...textDarkColor)

    // Wrap description to fit column
    const maxDescWidth = 45
    const wrappedTitle = doc.splitTextToSize(transaction.description, maxDescWidth)
    const rowHeight = lineHeight * Math.max(wrappedTitle.length, 1) + 1

    doc.text(date, colDate, yPosition)
    doc.text(wrappedTitle, colTitle, yPosition)
    doc.text(type, colType, yPosition)
    
    // Amount in appropriate color
    doc.setTextColor(...amountColor)
    doc.setFont(undefined, 'bold')
    doc.text(amount, colAmount, yPosition)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...textDarkColor)

    yPosition += rowHeight
  })

  // ===== FOOTER =====
  // Add footer to every page
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    const footerY = pageHeight - 10
    
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(`Page ${i} of ${totalPages}`, margin, footerY)
    
    const footerText = 'MoneyFlow Financial Report'
    const footerX = pageWidth - margin - doc.getTextWidth(footerText)
    doc.text(footerText, footerX, footerY)
  }

  return doc
}

/**
 * Download enhanced PDF with charts
 * @param {Transaction[]} transactions - Array of transactions
 * @param {Object} summary - Summary data
 * @param {string} filename - Filename for download

/**
 * Download enhanced PDF with charts
 * @param {Transaction[]} transactions - Array of transactions
 * @param {Object} summary - Summary data
 * @param {string} filename - Filename for download
 * @param {string} filterInfo - Filter information
 * @param {Object} chartImages - Chart images
 */
export const downloadEnhancedTransactionPDF = (transactions, summary, filename = 'transactions.pdf', filterInfo = '', chartImages = {}) => {
  try {
    const pdf = generateEnhancedTransactionPDF(transactions, summary, filterInfo, chartImages)
    pdf.save(filename)
  } catch (error) {
    console.error('Error generating enhanced PDF:', error)
    alert('An error occurred while generating the PDF. Please try again.')
  }
}
