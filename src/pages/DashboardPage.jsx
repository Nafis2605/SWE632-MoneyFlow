import { useState } from 'react'
import { Link } from 'react-router-dom'
import ExpenseVisualization from '../components/ExpenseVisualization'
import BudgetSummary from '../components/BudgetSummary'
import DashboardFilters from '../components/DashboardFilters'
import { filterByDateRange, filterByMonthYear } from '../utils/helpers'
import '../styles/DashboardPage.css'

function DashboardPage({ budgetState }) {
  const [filters, setFilters] = useState({ type: 'all' })

  // Apply filters based on filter state
  const getFilteredTransactions = () => {
    let filtered = budgetState.transactions

    if (filters.type === 'dateRange' && filters.startDate && filters.endDate) {
      filtered = filterByDateRange(filtered, filters.startDate, filters.endDate)
    } else if (filters.type === 'monthYear' && filters.year && filters.month) {
      filtered = filterByMonthYear(filtered, filters.year, filters.month)
    }

    return filtered
  }

  // Get filtered expenses for visualization
  const filteredTransactions = getFilteredTransactions()
  const filteredExpenses = filteredTransactions.filter(t => t.type === 'expense')

  // Calculate filtered summary
  const filteredIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const filteredTotalExpenses = filteredExpenses.reduce((sum, t) => sum + t.amount, 0)
  const filteredRemainingBudget = filteredIncome - filteredTotalExpenses

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Financial Dashboard</h1>
        <p className="page-description">
          View your financial overview and expense breakdown
        </p>
      </div>

      <div className="dashboard-container">
        {/* Filters Section */}
        <DashboardFilters
          transactions={budgetState.transactions}
          onFilterChange={handleFilterChange}
        />

        {/* Budget Summary Card */}
        <div className="dashboard-section summary-card-section">
          <div className="section-wrapper">
            <BudgetSummary
              income={filteredIncome}
              totalExpenses={filteredTotalExpenses}
              remainingBudget={filteredRemainingBudget}
            />
          </div>
        </div>

        {/* Visualizations */}
        <div className="dashboard-section visualization-section">
          <div className="section-wrapper">
            {filteredExpenses.length === 0 ? (
              <div className="empty-visualization">
                <p>No expenses to visualize for the selected period</p>
              </div>
            ) : (
              <ExpenseVisualization
                expenses={filteredExpenses}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage
