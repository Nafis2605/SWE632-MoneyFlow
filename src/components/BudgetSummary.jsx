import '../styles/BudgetSummary.css'

function BudgetSummary({ income, totalExpenses, remainingBudget }) {
  const percentage = income > 0 ? (totalExpenses / income) * 100 : 0
  const isOverBudget = remainingBudget < 0

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
          <p className={`amount ${isOverBudget ? 'over-budget' : 'remaining'}`}>
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
        {isOverBudget && (
          <p className="warning-text">
            ⚠️ You've exceeded your budget by ${Math.abs(remainingBudget).toFixed(2)}
          </p>
        )}
      </div>
    </section>
  )
}

export default BudgetSummary
