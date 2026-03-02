import { useState } from 'react'
import { getTodayISO } from '../utils/date'
import { getCategoryOptions } from '../utils/categories'
import '../styles/TransactionForm.css'

function TransactionForm({ onAddIncome, onAddExpense }) {
  const [type, setType] = useState('income')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getTodayISO())
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    // Validate all required fields
    if (!description.trim()) {
      setError(`${type === 'income' ? 'Income' : 'Expense'} description is required`)
      return
    }
    if (!category) {
      setError('Category is required')
      return
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!date) {
      setError('Date is required')
      return
    }

    // Pass date directly as ISO string (no conversion needed)
    const callback = type === 'income' ? onAddIncome : onAddExpense
    const result = callback(description, category, parseFloat(amount), date)
    
    if (result.success) {
      setDescription('')
      setCategory('')
      setAmount('')
      setDate(getTodayISO())
    } else {
      setError(result.errors[0])
    }
  }

  // Validation check: button is disabled if inputs are empty or invalid
  const isDisabled = 
    !description.trim() || 
    !category ||
    !amount.trim() || 
    isNaN(parseFloat(amount)) || 
    parseFloat(amount) <= 0 ||
    !date

  // Labels based on transaction type
  const labels = {
    income: {
      description: 'Income Description',
      descriptionPlaceholder: 'e.g., Salary, Freelance work, Bonus',
      button: 'Add Income'
    },
    expense: {
      description: 'Expense Description',
      descriptionPlaceholder: 'e.g., Grocery shopping, Rent payment',
      button: 'Add Expense'
    }
  }

  const currentLabels = labels[type]
  const categoryOptions = getCategoryOptions(type)

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
              setCategory('')
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
              setCategory('')
              setError(null)
            }}
            aria-pressed={type === 'expense'}
          >
            Expense
          </button>
        </div>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit}>
        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="transaction-description">
            {currentLabels.description}:
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="transaction-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={currentLabels.descriptionPlaceholder}
            className="form-input"
            maxLength="100"
            aria-label={currentLabels.description}
            required
          />
        </div>

        {/* Category Field */}
        <div className="form-group">
          <label htmlFor="transaction-category">
            Category:
            <span className="required" aria-label="required">*</span>
          </label>
          <select
            id="transaction-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input form-select"
            aria-label="Transaction category"
            required
          >
            <option value="">Select a category</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Field */}
        <div className="form-group">
          <label htmlFor="transaction-amount">
            Amount:
            <span className="required" aria-label="required">*</span>
          </label>
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
              aria-label="Transaction amount"
              required
            />
          </div>
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="transaction-date">
            Date:
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="transaction-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            aria-label="Transaction date"
            required
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

