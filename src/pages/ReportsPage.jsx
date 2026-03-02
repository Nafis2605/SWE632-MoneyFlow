import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/ReportsPage.css'
import { getTodayISO, formatMonthYear } from '../utils/date'
import { filterByDateRange, filterByMonthYear, getSortedTransactions, downloadTransactionCSV, downloadTransactionPDF } from '../utils/helpers'
import TransactionFilters from '../components/TransactionFilters'
import { calculateBudgetSummary } from '../utils/budgetCalculations'

function ReportsPage({ transactions }) {
  const [filters, setFilters] = useState({ type: 'all' })

  // Apply filters based on filter state
  const getFilteredTransactions = () => {
    let filtered = transactions

    if (filters.type === 'dateRange' && filters.startDate && filters.endDate) {
      filtered = filterByDateRange(filtered, filters.startDate, filters.endDate)
    } else if (filters.type === 'monthYear' && filters.year && filters.month) {
      filtered = filterByMonthYear(filtered, filters.year, filters.month)
    }

    return getSortedTransactions(filtered)
  }

  const filteredTransactions = getFilteredTransactions()

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

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export')
      return
    }
    downloadTransactionCSV(filteredTransactions, `${generateFileName()}.csv`)
  }

  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export')
      return
    }
    
    const summaryData = {
      totalIncome,
      totalExpenses,
      netBalance,
      transactionCount: filteredTransactions.length,
      expenseRatio: balancePercentage,
      savingsRate: totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100) : 0
    }
    
    downloadTransactionPDF(filteredTransactions, summaryData, `${generateFileName()}.pdf`, generateFilterInfo())
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
        <TransactionFilters transactions={transactions} onFilterChange={handleFilterChange} />

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
              <div className="export-buttons">
                <button className="export-button" onClick={handleExportCSV} title="Export filtered transactions as CSV">
                  ↓ CSV
                </button>
                <button className="export-button" onClick={handleExportPDF} title="Export filtered transactions as PDF">
                  ↓ PDF
                </button>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
