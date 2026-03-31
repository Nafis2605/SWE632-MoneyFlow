import { useState } from 'react'
import { Link } from 'react-router-dom'
import ExpenseVisualization from '../components/ExpenseVisualization'
import MonthlyCategoryTrends from '../components/MonthlyCategoryTrends'
import BudgetSummary from '../components/BudgetSummary'
import IncomeVsExpenseChart from '../components/IncomeVsExpenseChart'
import FiltersPanel from '../components/FiltersPanel'
import TransactionListWithActions from '../components/TransactionListWithActions'
import { getDefaultFilters, applyFilters } from '../utils/filterModel'
import '../styles/DashboardPage.css'

function DashboardPage({ budgetState }) {
  const [filters, setFilters] = useState(getDefaultFilters())

  // Apply filters and get filtered transactions
  const filteredTransactions = applyFilters(budgetState.transactions, filters)
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
        <FiltersPanel
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

        {/* Income vs Expense Comparison */}
        <div className="dashboard-section income-comparison-section">
          <div className="section-wrapper">
            <IncomeVsExpenseChart
              transactions={filteredTransactions}
              showNetSavings={true}
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

        {/* Monthly Category Trends */}
        <div className="dashboard-section trends-section">
          <div className="section-wrapper">
            <MonthlyCategoryTrends
              expenses={filteredExpenses}
            />
          </div>
        </div>

        {/* Transactions List with Edit/Delete */}
        <div className="dashboard-section transactions-section">
          <div className="section-wrapper">
            <h2>Filtered Transactions</h2>
            <TransactionListWithActions
              transactions={filteredTransactions}
              onDelete={budgetState.deleteTransaction}
              onUpdate={budgetState.updateTransaction}
              emptyMessage="No transactions match your filter. Try adjusting the date range or filter type."
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage
