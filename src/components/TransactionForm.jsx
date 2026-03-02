import { useState } from 'react'
import { getTodayISO } from '../utils/date'
import '../styles/TransactionForm.css'

function TransactionForm({ onAddIncome, onAddExpense }) {
  const [type, setType] = useState('income')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getTodayISO())
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    // Pass date directly as ISO string (no conversion needed)
    const callback = type === 'income' ? onAddIncome : onAddExpense
    const result = callback(title, parseFloat(amount), date)
    
    if (result.success) {
      setTitle('')
      setAmount('')
      setDate(getTodayISO())
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

  // Labels based on transaction type
  const labels = {
    income: {
      title: 'Income Source',
      placeholder: 'e.g., Salary, Freelance, Bonus',
      label: 'Income Source',
      button: 'Add Income'
    },
    expense: {
      title: 'Expense Name',
      placeholder: 'e.g., Groceries, Rent, Utilities',
      label: 'Expense Name',
      button: 'Add Expense'
    }
  }

  const currentLabels = labels[type]

  return (
    <section className="transaction-form-section">
      <div className="transaction-form-header">
        <h2>Add Transaction</h2>
        
        {/* Toggle Buttons */}
        <div className="transaction-toggle">
          <button
            type="button"
            className={`toggle-btn ${type === 'income' ? 'active' : ''}`}
            onClick={() => {
              setType('income')
              setError(null)
            }}
            aria-pressed={type === 'income'}
          >
            Income
          </button>
          <button
            type="button"
            className={`toggle-btn ${type === 'expense' ? 'active' : ''}`}
            onClick={() => {
              setType('expense')
              setError(null)
            }}
            aria-pressed={type === 'expense'}
          >
            Expense
          </button>
        </div>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="transaction-title">{currentLabels.label}:</label>
          <input
            id="transaction-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={currentLabels.placeholder}
            className="form-input"
            maxLength="100"
            aria-label={`${type} ${currentLabels.label.toLowerCase()}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="transaction-amount">Amount:</label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              id="transaction-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="form-input"
              aria-label={`${type} amount`}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-date">Date:</label>
          <input
            id="transaction-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            aria-label={`${type} date`}
          />
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isDisabled}
          aria-disabled={isDisabled}
        >
          {currentLabels.button}
        </button>
      </form>
    </section>
  )
}

export default TransactionForm
