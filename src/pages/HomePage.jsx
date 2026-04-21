import { useState, useMemo } from 'react'
import TransactionForm from '../components/TransactionForm'
import BudgetSummary from '../components/BudgetSummary'
import RecentTransactions from '../components/RecentTransactions'
import IncomeVsExpenseChart from '../components/IncomeVsExpenseChart'
import ImportTransactions from '../components/ImportTransactions'
import { calculateTotalIncome, calculateTotalExpenses } from '../models/budgetModels'
import { filterByMonthYear } from '../utils/helpers'
import '../styles/HomePage.css'

function HomePage({ budgetState }) {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()
  
  // State for month filter
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [importModal, setImportModal] = useState(false)
  
  const hasTransactions = budgetState.transactions && budgetState.transactions.length > 0

  // Filter transactions for the selected month
  const filteredTransactions = useMemo(() => {
    if (!hasTransactions) return []
    return filterByMonthYear(budgetState.transactions, selectedYear, selectedMonth)
  }, [budgetState.transactions, selectedYear, selectedMonth, hasTransactions])

  // Calculate totals for filtered transactions
  const monthlyIncome = useMemo(() => {
    return calculateTotalIncome(filteredTransactions)
  }, [filteredTransactions])

  const monthlyExpenses = useMemo(() => {
    return calculateTotalExpenses(filteredTransactions)
  }, [filteredTransactions])

  const monthlyRemaining = monthlyIncome - monthlyExpenses

  // Get all available months/years from transactions
  const getAvailableMonths = () => {
    const months = new Set()
    if (budgetState.transactions) {
      budgetState.transactions.forEach(tx => {
        const date = new Date(tx.dateISO)
        months.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
      })
    }
    return Array.from(months).sort().reverse()
  }

  // Quick filter handlers
  const handleThisMonth = () => {
    setSelectedMonth(currentMonth)
    setSelectedYear(currentYear)
  }

  const handleLastMonth = () => {
    let month = currentMonth - 1
    let year = currentYear
    if (month < 1) {
      month = 12
      year -= 1
    }
    setSelectedMonth(month)
    setSelectedYear(year)
  }

  const handleImport = (transactions) => {
    if (budgetState.bulkImport) {
      const result = budgetState.bulkImport(transactions)
      if (result.success) {
        setImportModal(false)
      }
    }
  }

  // Month/Year display
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const displayMonth = monthNames[selectedMonth - 1]
  const displayDate = `${displayMonth} ${selectedYear}`

  // Check if viewing current month
  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear
  
  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Budget Planner</h1>
        <p className="page-description">
          Manage your income and expenses to track your budget
        </p>
        <div className="page-actions">
          <button 
            className="import-button-home import-button-secondary"
            onClick={() => setImportModal(true)}
            title="Import transactions from CSV file"
          >
            📥 Import Transactions
          </button>
        </div>
      </div>

      {/* Time Filter Controls */}
      {hasTransactions && (
        <div className="time-filter-section time-filter-section-page-level">
          <div className="time-filter-container">
            <div className="time-filter-left">
              <label htmlFor="month-year-select" className="time-filter-label">Select Month:</label>
              <select
                id="month-year-select"
                className="month-year-select"
                value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split('-')
                  setSelectedYear(parseInt(year))
                  setSelectedMonth(parseInt(month))
                }}
              >
                {getAvailableMonths().map((monthYear) => {
                  const [year, month] = monthYear.split('-')
                  const m = parseInt(month)
                  return (
                    <option key={monthYear} value={monthYear}>
                      {monthNames[m - 1]} {year}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="time-filter-right">
              <button
                className={`quick-filter-btn ${isCurrentMonth ? 'active' : ''}`}
                onClick={handleThisMonth}
                type="button"
              >
                This Month
              </button>
              <button
                className="quick-filter-btn"
                onClick={handleLastMonth}
                type="button"
              >
                Last Month
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Instruction */}
      {!hasTransactions && (
        <div className="empty-state-hint">
          <p>💡 Start by adding your first income or expense</p>
        </div>
      )}

      <div className="layout-container">
        {/* Left Column: Transaction Input */}
        <section className={`section-column input-column ${!hasTransactions ? 'emphasized' : ''}`}>
          <div className={`section-wrapper ${!hasTransactions ? 'form-emphasized' : ''}`}>
            <TransactionForm 
              onAddIncome={budgetState.addIncome}
              onAddExpense={budgetState.addExpense}
              isEmpty={!hasTransactions}
            />
          </div>
        </section>

        {/* Right Column: Budget Summary */}
        <section className="section-column content-column">
          {/* Time Filter Controls - Grouped with Budget Summary */}
          {hasTransactions && (
            <div className="time-filter-section time-filter-section-inline">
              <div className="time-filter-container">
                <div className="time-filter-left">
                  <label htmlFor="month-year-select" className="time-filter-label">Select Month:</label>
                  <select
                    id="month-year-select"
                    className="month-year-select"
                    value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-')
                      setSelectedYear(parseInt(year))
                      setSelectedMonth(parseInt(month))
                    }}
                  >
                    {getAvailableMonths().map((monthYear) => {
                      const [year, month] = monthYear.split('-')
                      const m = parseInt(month)
                      return (
                        <option key={monthYear} value={monthYear}>
                          {monthNames[m - 1]} {year}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="time-filter-right">
                  <button
                    className={`quick-filter-btn ${isCurrentMonth ? 'active' : ''}`}
                    onClick={handleThisMonth}
                    type="button"
                  >
                    This Month
                  </button>
                  <button
                    className="quick-filter-btn"
                    onClick={handleLastMonth}
                    type="button"
                  >
                    Last Month
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="section-wrapper">
            <BudgetSummary
              income={monthlyIncome}
              totalExpenses={monthlyExpenses}
              remainingBudget={monthlyRemaining}
              isEmpty={!hasTransactions}
            />
          </div>
        </section>
      </div>

      {/* Income vs Expense Comparison - Full Width */}
      {hasTransactions && (
        <div className="income-comparison-container">
          <div className="section-wrapper">
            <IncomeVsExpenseChart
              transactions={budgetState.transactions}
              showNetSavings={true}
            />
          </div>
        </div>
      )}

      {/* Full Width: Recent Activity */}
      {hasTransactions && filteredTransactions.length > 0 && (
        <div className="recent-activity-container">
          <div className="section-wrapper">
            <RecentTransactions
              transactions={filteredTransactions}
              onDeleteTransaction={budgetState.deleteTransaction}
              onUpdateTransaction={budgetState.updateTransaction}
            />
          </div>
        </div>
      )}

      {/* Empty Month Message */}
      {hasTransactions && filteredTransactions.length === 0 && (
        <div className="empty-month-message">
          <p>No transactions for {displayDate}</p>
        </div>
      )}

      {/* Import Modal */}
      {importModal && (
        <ImportTransactions
          onImport={handleImport}
          onClose={() => setImportModal(false)}
        />
      )}
    </main>
  )
}

export default HomePage
