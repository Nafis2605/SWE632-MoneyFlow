import '../styles/IncomeList.css'
import { formatDate } from '../utils/helpers'

function IncomeList({ incomes, onDeleteIncome }) {
  if (incomes.length === 0) {
    return (
      <section className="income-list-section">
        <h2>Income</h2>
        <div className="empty-state">
          <p>No income entries yet. Add one above to get started!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="income-list-section">
      <h2>Income ({incomes.length})</h2>
      <div className="income-container">
        <ul className="income-list">
          {incomes.map((income) => (
            <li key={income.id} className="income-item">
              <div className="income-content">
                <div className="income-details">
                  <span className="income-title">{income.title}</span>
                  <span className="income-date">{formatDate(income.date)}</span>
                </div>
                <span className="income-amount">${income.amount.toFixed(2)}</span>
              </div>
              <button
                className="btn-delete"
                onClick={() => onDeleteIncome(income.id)}
                title="Delete income"
                aria-label={`Delete ${income.title}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default IncomeList
