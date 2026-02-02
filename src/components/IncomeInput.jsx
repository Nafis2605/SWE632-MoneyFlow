import { useState } from 'react'
import '../styles/IncomeInput.css'

function IncomeInput({ income, onIncomeChange }) {
  const [inputValue, setInputValue] = useState(income.toString())
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setInputValue(e.target.value)
    setError(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = onIncomeChange(parseFloat(inputValue))
    if (!result.success) {
      setError(result.errors[0])
    }
  }

  return (
    <section className="income-input-section">
      <h2>Monthly Income</h2>
      <form className="income-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="income-input">Enter your monthly income:</label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              id="income-input"
              type="number"
              value={inputValue}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="income-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Set Income
        </button>
      </form>
    </section>
  )
}

export default IncomeInput
