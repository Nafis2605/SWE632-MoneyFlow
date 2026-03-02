import { useState, useEffect } from 'react'
import { getTodayISO } from '../utils/date'
import { getCategoryOptions } from '../utils/categories'
import ConfirmModal from './ConfirmModal'
import '../styles/EditTransactionModal.css'

function EditTransactionModal({ isOpen, transaction, onClose, onSave }) {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getTodayISO())
  const [error, setError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (isOpen && transaction) {
      // Defensive checks for all transaction properties
      const validDescription = typeof transaction.description === 'string' ? transaction.description : ''
      const validCategory = typeof transaction.category === 'string' ? transaction.category : ''
      const validAmount = typeof transaction.amount === 'number' && transaction.amount > 0 ? transaction.amount : ''
      const validDate = typeof transaction.dateISO === 'string' && transaction.dateISO.length > 0 ? transaction.dateISO : getTodayISO()
      
      setDescription(validDescription)
      setCategory(validCategory)
      setAmount(validAmount)
      setDate(validDate)
      setError(null)
    }
  }, [transaction, isOpen])

  // Early return with null check - prevents rendering if modal not open OR transaction missing
  if (!isOpen || !transaction) {
    return null
  }

  // Validate transaction object has required properties
  if (typeof transaction.id !== 'string' || transaction.id.length === 0) {
    return null
  }

  const type = (transaction.type === 'income' || transaction.type === 'expense') ? transaction.type : 'expense'
  const categoryOptions = Array.isArray(getCategoryOptions(type)) ? getCategoryOptions(type) : []

  const isDisabled =
    !description.trim() ||
    !category ||
    !amount.trim() ||
    isNaN(parseFloat(amount)) ||
    parseFloat(amount) <= 0 ||
    !date

  // Check if any fields have changed - with defensive comparisons
  const transactionAmount = typeof transaction.amount === 'number' ? transaction.amount : 0
  const parsedCurrentAmount = amount ? parseFloat(amount) : 0
  
  const hasChanges =
    (description || '') !== (transaction.description || '') ||
    (category || '') !== (transaction.category || '') ||
    parsedCurrentAmount !== transactionAmount ||
    (date || '') !== (transaction.dateISO || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    // Validate description
    if (typeof description !== 'string' || !description.trim()) {
      setError(`${type === 'income' ? 'Income' : 'Expense'} description is required`)
      return
    }
    
    // Validate category
    if (typeof category !== 'string' || !category) {
      setError('Category is required')
      return
    }
    
    // Validate amount
    const parsedAmount = parseFloat(amount)
    if (typeof amount !== 'string' || !amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    
    // Validate date
    if (typeof date !== 'string' || !date) {
      setError('Date is required')
      return
    }

    setShowConfirm(true)
  }

  const handleConfirmUpdate = () => {
    try {
      // Validate callback exists and is callable
      if (typeof onSave !== 'function') {
        setShowConfirm(false)
        setError('Save handler not available')
        return
      }

      // Validate transaction ID is valid
      if (typeof transaction.id !== 'string' || transaction.id.length === 0) {
        setShowConfirm(false)
        setError('Invalid transaction ID')
        return
      }

      // Parse and validate amount
      const parsedAmount = parseFloat(amount)
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Invalid amount value')
        return
      }

      // Call save handler
      const result = onSave(transaction.id, description.trim(), category, parsedAmount, date)
      
      // Handle result
      if (result && typeof result === 'object') {
        if (result.success === true) {
          handleClose()
        } else if (Array.isArray(result.errors) && result.errors.length > 0) {
          setError(String(result.errors[0]))
        } else {
          setError('Failed to update transaction')
        }
      } else {
        // No result or falsy result means success
        handleClose()
      }
    } catch (err) {
      setShowConfirm(false)
      setError(`Error updating transaction: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setShowConfirm(false)
    }
  }

  const handleClose = () => {
    // Reset form to original transaction values with defensive checks
    const validDescription = typeof transaction.description === 'string' ? transaction.description : ''
    const validCategory = typeof transaction.category === 'string' ? transaction.category : ''
    const validAmount = typeof transaction.amount === 'number' ? transaction.amount : ''
    const validDate = typeof transaction.dateISO === 'string' ? transaction.dateISO : getTodayISO()
    
    setDescription(validDescription)
    setCategory(validCategory)
    setAmount(validAmount)
    setDate(validDate)
    setError(null)
    setShowConfirm(false)
    
    // Call callback if available
    if (typeof onClose === 'function') {
      try {
        onClose()
      } catch (err) {
        console.error('Error in onClose callback:', err)
      }
    }
  }

  return (
    <>
      <div className="edit-modal-overlay" onClick={handleClose}>
        <div className="edit-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="edit-modal-header">
            <h2>Edit {type === 'income' ? 'Income' : 'Expense'}</h2>
            <button
              className="edit-modal-close"
              onClick={handleClose}
              type="button"
              title="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="edit-modal-form">
            <div className="edit-modal-body">
              {error && (
                <div className="edit-modal-error">
                  <p>{error}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <input
                  id="edit-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`e.g., ${type === 'income' ? 'Salary, Freelance work' : 'Grocery shopping, Rent payment'}`}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Select Category --</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-amount">Amount</label>
                <input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-date">Date</label>
                <input
                  id="edit-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="edit-modal-footer">
              <button
                type="button"
                className="edit-modal-btn edit-modal-btn-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="edit-modal-btn edit-modal-btn-save"
                disabled={isDisabled || !hasChanges}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Update"
        message="Are you sure you want to update this transaction?"
        cancelText="Cancel"
        confirmText="Confirm Update"
        isDangerous={false}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmUpdate}
      />
    </>
  )
}

export default EditTransactionModal
