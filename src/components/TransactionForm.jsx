import { useState } from 'react'
import { getTodayISO } from '../utils/date'
import { getCategoryOptions } from '../utils/categories'
import '../styles/TransactionForm.css'

function TransactionForm({ onAddIncome, onAddExpense, isEmpty = false }) {
  const [type, setType] = useState('income')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getTodayISO())
  const [error, setError] = useState(null)

  // Track which fields have been touched
  const [touched, setTouched] = useState({
    description: false,
    category: false,
    amount: false,
    date: false
  })

  // Track if form was submitted
  const [submitted, setSubmitted] = useState(false)

  // Validation functions
  const validateDescription = (value) => !value.trim()
  const validateCategory = (value) => !value
  const validateAmount = (value) => {
    return !value.trim() || isNaN(parseFloat(value)) || parseFloat(value) <= 0
  }
  const validateDate = (value) => !value

  // Get field errors
  const descriptionError = touched.description && validateDescription(description)
  const categoryError = touched.category && validateCategory(category)
  const amountError = touched.amount && validateAmount(amount)
  const dateError = touched.date && validateDate(date)

  // Check if form is valid
  const isFormValid = !validateDescription(description) && 
                      !validateCategory(category) && 
                      !validateAmount(amount) && 
                      !validateDate(date)

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)

    // Mark all fields as touched to show errors
    setTouched({
      description: true,
      category: true,
      amount: true,
      date: true
    })

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
      setTouched({ description: false, category: false, amount: false, date: false })
      setSubmitted(false)
    } else {
      setError(result.errors[0])
    }
  }

  // Validation check: button is disabled if inputs are empty or invalid
  const isDisabled = !isFormValid

  // Get tooltip message for disabled button
  const getButtonTooltip = () => {
    if (!isDisabled) return ''
    const missingFields = []
    if (validateDescription(description)) missingFields.push('Description')
    if (validateCategory(category)) missingFields.push('Category')
    if (validateAmount(amount)) missingFields.push('Amount')
    if (validateDate(date)) missingFields.push('Date')
    return `Complete: ${missingFields.join(', ')}`
  }

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
    <section className={`transaction-form-section ${isEmpty ? 'empty-state-form' : ''}`}>
      <div className="transaction-form-header">
        <h2>Add Transaction</h2>
        
        {isEmpty && (
          <div className="form-hint">
            <span>Step 1: Choose type</span>
            <span>•</span>
            <span>Step 2: Fill details</span>
            <span>•</span>
            <span>Step 3: Add</span>
          </div>
        )}
        
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
        <div className={`form-group ${descriptionError ? 'has-error' : ''}`}>
          <label htmlFor="transaction-description">
            {currentLabels.description}:
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="transaction-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder={currentLabels.descriptionPlaceholder}
            className={`form-input ${descriptionError ? 'input-invalid' : ''}`}
            maxLength="100"
            aria-label={currentLabels.description}
            aria-invalid={descriptionError}
            required
          />
          {descriptionError && (
            <p className="field-error-message">Description is required</p>
          )}
        </div>

        {/* Category Field */}
        <div className={`form-group ${categoryError ? 'has-error' : ''}`}>
          <label htmlFor="transaction-category">
            Category:
            <span className="required" aria-label="required">*</span>
          </label>
          <select
            id="transaction-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => handleBlur('category')}
            className={`form-input form-select ${categoryError ? 'input-invalid' : ''}`}
            aria-label="Transaction category"
            aria-invalid={categoryError}
            required
          >
            <option value="">Select a category</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {categoryError && (
            <p className="field-error-message">Please select a category</p>
          )}
        </div>

        {/* Amount Field */}
        <div className={`form-group ${amountError ? 'has-error' : ''}`}>
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
              onBlur={() => handleBlur('amount')}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`form-input ${amountError ? 'input-invalid' : ''}`}
              aria-label="Transaction amount"
              aria-invalid={amountError}
              required
            />
          </div>
          {amountError && (
            <p className="field-error-message">Enter a valid amount</p>
          )}
        </div>

        {/* Date Field */}
        <div className={`form-group ${dateError ? 'has-error' : ''}`}>
          <label htmlFor="transaction-date">
            Date:
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="transaction-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => handleBlur('date')}
            className={`form-input ${dateError ? 'input-invalid' : ''}`}
            aria-label="Transaction date"
            aria-invalid={dateError}
            required
          />
          {dateError && (
            <p className="field-error-message">Select a date</p>
          )}
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        {/* Disabled state message */}
        {isDisabled && !error && (
          <p className="form-incomplete-message">
            Complete all required fields above
          </p>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isDisabled}
          aria-disabled={isDisabled}
          title={getButtonTooltip()}
        >
          {currentLabels.button}
        </button>
      </form>
    </section>
  )
}

export default TransactionForm

