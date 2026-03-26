import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles/ReportsPage.css'
import { getTodayISO, formatMonthYear } from '../utils/date'
import { getSortedTransactions, downloadTransactionCSV, downloadTransactionPDF, downloadEnhancedTransactionPDF } from '../utils/helpers'
import FiltersPanel from '../components/FiltersPanel'
import TransactionListWithActions from '../components/TransactionListWithActions'
import ExpenseVisualization from '../components/ExpenseVisualization'
import PDFExportVisualization from '../components/PDFExportVisualization'
import { getDefaultFilters, applyFilters } from '../utils/filterModel'
import { calculateBudgetSummary } from '../utils/budgetCalculations'
import { captureChartsAsImages } from '../utils/chartExport'

function ReportsPage({ budgetState }) {
  const [filters, setFilters] = useState(getDefaultFilters())
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState(null) // 'csv', 'pdf', or null
  const [exportMessage, setExportMessage] = useState('')
  const chartsContainerRef = useRef(null)
  const pdfExportContainerRef = useRef(null)
  const transactions = budgetState.transactions
  const exportTimeoutRef = useRef(null)

  // Apply filters and get filtered transactions
  const filteredTransactions = getSortedTransactions(applyFilters(transactions, filters))

  // Calculate report data
  const incomeTransactions = filteredTransactions.filter((t) => t.type === 'income')
  const expenseTransactions = filteredTransactions.filter((t) => t.type === 'expense')

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  const netBalance = totalIncome - totalExpenses
  const transactionCount = filteredTransactions.length

  // Determine summary card status
  const isBalancePositive = netBalance >= 0
  const balancePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Generate filename based on filter type and current date
  const generateFileName = () => {
    const today = getTodayISO()
    
    if (filters.type === 'dateRange' && filters.startDate && filters.endDate) {
      return `transactions_${filters.startDate}_to_${filters.endDate}`
    } else if (filters.type === 'monthYear' && filters.year && filters.month) {
      return `transactions_${filters.year}-${String(filters.month).padStart(2, '0')}`
    } else {
      return `transactions_${today}`
    }
  }

  const generateFilterInfo = () => {
    if (filters.type === 'dateRange' && filters.startDate && filters.endDate) {
      return `${filters.startDate} to ${filters.endDate}`
    } else if (filters.type === 'monthYear' && filters.year && filters.month) {
      return formatMonthYear(filters.year, filters.month)
    }
    return 'All Transactions'
  }

  // Generate export message with filter context
  const getExportMessage = () => {
    const filterLabel = generateFilterInfo()
    return `Exported ${transactionCount} transaction${transactionCount !== 1 ? 's' : ''} for: ${filterLabel}`
  }

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      setExportMessage('No transactions to export')
      setExportStatus('error')
      if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
      exportTimeoutRef.current = setTimeout(() => {
        setExportStatus(null)
        setExportMessage('')
      }, 3000)
      return
    }
    
    setIsExporting(true)
    setExportStatus('csv')
    setExportMessage('Preparing CSV download…')

    // Simulate processing time for better UX feedback
    setTimeout(() => {
      try {
        downloadTransactionCSV(filteredTransactions, `${generateFileName()}.csv`)
        setExportMessage(getExportMessage())
        
        // Auto-clear success message after 3 seconds
        if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
        exportTimeoutRef.current = setTimeout(() => {
          setExportStatus(null)
          setExportMessage('')
          setIsExporting(false)
        }, 3000)
      } catch (error) {
        console.error('Error exporting CSV:', error)
        setExportMessage('Error exporting CSV. Please try again.')
        setExportStatus('error')
        setIsExporting(false)
        
        if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
        exportTimeoutRef.current = setTimeout(() => {
          setExportStatus(null)
          setExportMessage('')
        }, 3000)
      }
    }, 300)
  }

  const handleExportPDF = async () => {
    if (filteredTransactions.length === 0) {
      setExportMessage('No transactions to export')
      setExportStatus('error')
      if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
      exportTimeoutRef.current = setTimeout(() => {
        setExportStatus(null)
        setExportMessage('')
      }, 3000)
      return
    }
    
    setIsExporting(true)
    setExportStatus('pdf')
    setExportMessage('Generating PDF report…')

    try {
      const summaryData = {
        totalIncome,
        totalExpenses,
        netBalance,
        transactionCount: filteredTransactions.length,
        expenseRatio: balancePercentage,
        savingsRate: totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100) : 0
      }

      // Capture charts from PDF export container if it exists and has expenses
      const chartImages = {}
      if (pdfExportContainerRef.current && expenseTransactions.length > 0) {
        try {
          // Make the container temporarily visible for rendering
          const container = pdfExportContainerRef.current
          container.style.position = 'absolute'
          container.style.left = '0'
          container.style.top = '-9999px'
          container.style.visibility = 'visible'
          
          // Wait for charts to fully render before capture
          await new Promise(resolve => setTimeout(resolve, 1200))
          
          // Capture the entire PDF export visualization container
          const capturedImages = await captureChartsAsImages({
            pdfVisualization: pdfExportContainerRef.current
          }, true, { scale: 2, minHeight: 1000, minWidth: 1000 })
          
          // Hide container again after capture
          container.style.position = 'fixed'
          container.style.left = '-9999px'
          container.style.visibility = 'hidden'
          
          if (capturedImages.pdfVisualization) {
            chartImages.chartsVisualization = capturedImages.pdfVisualization
          }
        } catch (error) {
          console.warn('Could not capture PDF visualization:', error)
          // Continue with PDF export even if chart capture fails
        }
      }
      
      downloadEnhancedTransactionPDF(filteredTransactions, summaryData, `${generateFileName()}.pdf`, generateFilterInfo(), chartImages)
      
      setExportMessage(getExportMessage())
      
      // Auto-clear success message after 3 seconds
      if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
      exportTimeoutRef.current = setTimeout(() => {
        setExportStatus(null)
        setExportMessage('')
        setIsExporting(false)
      }, 3000)
    } catch (error) {
      console.error('Error during PDF export:', error)
      setExportMessage('Error generating PDF. Please try again.')
      setExportStatus('error')
      setIsExporting(false)
      
      if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current)
      exportTimeoutRef.current = setTimeout(() => {
        setExportStatus(null)
        setExportMessage('')
      }, 3000)
    }
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Financial Reports</h1>
        <p className="page-description">Analyze your income, expenses, and balance</p>
      </div>

      <div className="page-content">
        {/* Filters Section */}
        <FiltersPanel transactions={transactions} onFilterChange={handleFilterChange} />

        {/* Report Summary Section */}
        <div className="report-container">
          <div className="report-header">
            <div className="report-header-left">
              <h2>Summary Report</h2>
              {filters.type !== 'all' && (
                <p className="filter-applied">
                  {filters.type === 'dateRange'
                    ? `${filters.startDate} to ${filters.endDate}`
                    : formatMonthYear(filters.year, filters.month)}
                </p>
              )}
            </div>
            {filteredTransactions.length > 0 && (
              <div className="export-section">
                <div className="export-buttons">
                  <div className="export-button-group">
                    <button 
                      className="export-button csv-button" 
                      onClick={handleExportCSV}
                      disabled={isExporting}
                      title="Download transaction data in CSV format (spreadsheet compatible)"
                    >
                      <span className="export-icon">⬇</span>
                      <span className="export-label">Download CSV</span>
                    </button>
                    <p className="export-helper">Raw transaction data for spreadsheets</p>
                  </div>

                  <div className="export-button-group">
                    <button 
                      className="export-button pdf-button" 
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      title="Download professional PDF report with summary and charts"
                    >
                      <span className="export-icon">⬇</span>
                      <span className="export-label">Download PDF</span>
                    </button>
                    <p className="export-helper">Professional report with summary & charts</p>
                  </div>
                </div>

                {/* Export Status Message */}
                {exportMessage && (
                  <div className={`export-status export-status-${exportStatus}`}>
                    {exportStatus === 'csv' || exportStatus === 'pdf' ? (
                      <>
                        <span className="status-spinner">⟳</span>
                        <span className="status-text">{exportMessage}</span>
                      </>
                    ) : exportStatus === 'error' ? (
                      <>
                        <span className="status-icon">⚠</span>
                        <span className="status-text">{exportMessage}</span>
                      </>
                    ) : (
                      <>
                        <span className="status-icon">✓</span>
                        <span className="status-text">{exportMessage}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Filter context message */}
                {filters.type !== 'all' && (
                  <p className="export-note">
                    💾 Exports will include the current filters
                  </p>
                )}
              </div>
            )}
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions to report. Start by adding income or expenses.</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions match your filter. Try adjusting the date range or filter type.</p>
            </div>
          ) : (
            <>
              {/* Summary Cards Grid */}
              <div className="summary-cards">
                <div className="summary-card income">
                  <div className="card-label">Total Income</div>
                  <div className="card-value">+${totalIncome.toFixed(2)}</div>
                  <div className="card-meta">{incomeTransactions.length} transactions</div>
                </div>

                <div className="summary-card expense">
                  <div className="card-label">Total Expenses</div>
                  <div className="card-value">-${totalExpenses.toFixed(2)}</div>
                  <div className="card-meta">{expenseTransactions.length} transactions</div>
                </div>

                <div className={`summary-card balance ${isBalancePositive ? 'positive' : 'negative'}`}>
                  <div className="card-label">Net Balance</div>
                  <div className="card-value">{isBalancePositive ? '+' : '-'}${Math.abs(netBalance).toFixed(2)}</div>
                  <div className="card-meta">
                    {isBalancePositive ? 'Surplus' : 'Deficit'} • {transactionCount} total
                  </div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="analytics-section">
                <h3>Financial Overview</h3>
                <div className="analytics-grid">
                  <div className="analytics-item">
                    <div className="analytics-label">Expense Ratio</div>
                    <div className="analytics-bar">
                      <div className="bar-fill" style={{ width: `${Math.min(balancePercentage, 100)}%` }}></div>
                    </div>
                    <div className="analytics-value">{balancePercentage.toFixed(1)}% of income</div>
                  </div>

                  <div className="analytics-item">
                    <div className="analytics-label">Average Transaction</div>
                    <div className="analytics-value">
                      ${(
                        (totalIncome + totalExpenses) /
                        (transactionCount || 1)
                      ).toFixed(2)}
                    </div>
                  </div>

                  <div className="analytics-item">
                    <div className="analytics-label">Transaction Count</div>
                    <div className="analytics-value">{transactionCount}</div>
                    <div className="analytics-detail">
                      {incomeTransactions.length} income • {expenseTransactions.length} expense
                    </div>
                  </div>

                  <div className="analytics-item">
                    <div className="analytics-label">Savings Rate</div>
                    <div className="analytics-value">
                      {totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : '0'}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section - Only show if there are expenses */}
              {expenseTransactions.length > 0 && (
                <div ref={chartsContainerRef} style={{ marginBottom: '2rem' }}>
                  <ExpenseVisualization expenses={expenseTransactions} />
                </div>
              )}

              {/* Summary Table */}
              <div className="summary-table">
                <h3>Detailed Breakdown</h3>
                <table>
                  <tbody>
                    <tr>
                      <td className="label">Total Income</td>
                      <td className="income-value">+${totalIncome.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="label">Total Expenses</td>
                      <td className="expense-value">-${totalExpenses.toFixed(2)}</td>
                    </tr>
                    <tr className="total-row">
                      <td className="label">Net Balance</td>
                      <td className={`balance-value ${isBalancePositive ? 'positive' : 'negative'}`}>
                        {isBalancePositive ? '+' : '-'}${Math.abs(netBalance).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Filtered Transactions List */}
              <div className="transactions-detail-section">
                <h3>Transaction Details</h3>
                <TransactionListWithActions
                  transactions={filteredTransactions}
                  onDelete={budgetState.deleteTransaction}
                  onUpdate={budgetState.updateTransaction}
                  emptyMessage="No transactions to display for the selected filter."
                />
              </div>
            </>
          )}
        </div>

        {/* Hidden PDF Export Container - Optimized layout for PDF capture */}
        {expenseTransactions.length > 0 && (
          <div
            ref={pdfExportContainerRef}
            style={{
              position: 'absolute',
              left: '-9999px',
              top: '-9999px',
              width: '1000px',
              backgroundColor: '#ffffff',
              padding: '0',
              visibility: 'hidden',
              pointerEvents: 'none',
              zIndex: -1,
              minHeight: 'auto'
            }}
          >
            <PDFExportVisualization expenses={expenseTransactions} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsPage
