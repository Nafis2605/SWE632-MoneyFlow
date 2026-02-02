import '../styles/BudgetSummary.css'
import { calculateBudgetPercentage, isOverBudget, getOverBudgetAmount } from '../utils/budgetCalculations'

function BudgetSummary({ income, totalExpenses, remainingBudget }) {
  const percentage = calculateBudgetPercentage(totalExpenses, income)
  const overBudget = isOverBudget(remainingBudget)
  const overAmount = getOverBudgetAmount(remainingBudget)

  return (
    <section className="budget-summary-section">
      <h2>Budget Summary</h2>
      
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Monthly Income</h3>
          <p className="amount income">${income.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount expenses">${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Remaining</h3>
          <p className={`amount ${overBudget ? 'over-budget' : 'remaining'}`}>
            ${remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="budget-visualization">
        <div className="progress-label">
          <span>Budget Usage</span>
          <span className="percentage">{percentage.toFixed(1)}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${percentage > 100 ? 'over' : ''}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {overBudget && (
          <p className="warning-text">
            ⚠️ You've exceeded your budget by ${overAmount.toFixed(2)}
          </p>
        )}
      </div>
    </section>
  )
}

export default BudgetSummary
