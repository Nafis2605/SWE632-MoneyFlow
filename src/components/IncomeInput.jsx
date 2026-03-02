import { useState } from 'react'
import '../styles/IncomeInput.css'

function IncomeForm({ onAddIncome }) {
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
    const result = onAddIncome(title, parseFloat(amount), dateObj)
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
    <section className="income-input-section">
      <h2>Add Income</h2>
      <form className="income-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="income-title">Income Source:</label>
          <input
            id="income-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Salary, Freelance, Bonus"
            className="form-input"
            maxLength="100"
            aria-label="Income source or title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="income-amount">Amount:</label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              id="income-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="form-input"
              aria-label="Income amount"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="income-date">Date:</label>
          <input
            id="income-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            aria-label="Income date"
          />
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isDisabled}
          aria-disabled={isDisabled}
        >
          Add Income
        </button>
      </form>
    </section>
  )
}

export default IncomeForm
