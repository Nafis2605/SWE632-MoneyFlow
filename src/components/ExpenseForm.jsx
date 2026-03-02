import { useState } from 'react'
import '../styles/ExpenseForm.css'

function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getToday())
  const [error, setError] = useState(null)

  // Get today's date in YYYY-MM-DD format
  function getToday() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    const dateObj = new Date(date)
    const result = onAddExpense(title, parseFloat(amount), dateObj)
    if (result.success) {
      setTitle('')
      setAmount('')
      setDate(getToday())
    } else {
      setError(result.errors[0])
    }
  }

  // Validation check: button is disabled if inputs are empty or invalid
  const isDisabled = 
    !title.trim() || 
    !amount.trim() || 
    isNaN(parseFloat(amount)) || 
    parseFloat(amount) < 0 ||
    !date

  return (
    <section className="expense-form-section">
      <h2>Add Expense</h2>
      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="expense-title">Expense Name:</label>
          <input
            id="expense-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Groceries, Rent, Utilities"
            className="form-input"
            maxLength="100"
            aria-label="Expense name or description"
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
              aria-label="Expense amount"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expense-date">Date:</label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            aria-label="Expense date"
          />
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isDisabled}
          aria-disabled={isDisabled}
        >
          Add Expense
        </button>
      </form>
    </section>
  )
}

export default ExpenseForm
