import { useState } from 'react'
import '../styles/ExpenseForm.css'

function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    const result = onAddExpense(name, parseFloat(amount))
    if (result.success) {
      setName('')
      setAmount('')
    } else {
      setError(result.errors[0])
    }
  }

  return (
    <section className="expense-form-section">
      <h2>Add Expense</h2>
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="expense-name">Expense Name:</label>
          <input
            id="expense-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Groceries, Rent, Utilities"
            className="form-input"
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expense-amount">Amount:</label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              id="expense-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="form-input"
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn btn-primary">
          Add Expense
        </button>
      </form>
    </section>
  )
}

export default ExpenseForm
