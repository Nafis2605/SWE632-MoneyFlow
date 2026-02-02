import '../styles/ExpenseList.css'

function ExpenseList({ expenses, onDeleteExpense }) {
  if (expenses.length === 0) {
    return (
      <section className="expense-list-section">
        <h2>Expenses</h2>
        <div className="empty-state">
          <p>No expenses yet. Add one above to get started!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="expense-list-section">
      <h2>Expenses ({expenses.length})</h2>
      <div className="expenses-container">
        <ul className="expenses-list">
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <div className="expense-content">
                <span className="expense-name">{expense.name}</span>
                <span className="expense-amount">${expense.amount.toFixed(2)}</span>
              </div>
              <button
                className="btn-delete"
                onClick={() => onDeleteExpense(expense.id)}
                title="Delete expense"
                aria-label={`Delete ${expense.name}`}
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

export default ExpenseList
