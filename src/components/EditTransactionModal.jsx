import { useState, useEffect, useRef } from 'react'
import { getTodayISO } from '../utils/date'
import { getCategoryOptions } from '../utils/categories'
import ConfirmModal from './ConfirmModal'
import '../styles/EditTransactionModal.css'

function EditTransactionModal({ isOpen, transaction, onClose, onSave }) {
  // Form state is kept separate from the transaction prop to prevent mutation
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')   // always stored as a string
  const [date, setDate] = useState(getTodayISO())
  const [error, setError] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  // Ref tracks which transaction ID the form was last initialized for,
  // preventing re-initialization (and the render loop) for the same transaction
  const initializedForIdRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !transaction) return

    // Skip if this transaction is already loaded in the form
    if (initializedForIdRef.current === transaction.id) return

    console.log('[EditModal] Initializing form for transaction:', transaction.id)
    initializedForIdRef.current = transaction.id

    setDescription(typeof transaction.description === 'string' ? transaction.description : '')
    setCategory(typeof transaction.category === 'string' ? transaction.category : '')
    // Convert amount to string — calling .trim() on a number crashes the render
    setAmount(
      typeof transaction.amount === 'number' && transaction.amount > 0
        ? String(transaction.amount)
        : ''
    )
    setDate(
      typeof transaction.dateISO === 'string' && transaction.dateISO
        ? transaction.dateISO
        : getTodayISO()
    )
    setError(null)
    setShowConfirm(false)
  }, [isOpen, transaction?.id]) // depend on ID only, not the full object reference

  // Guard: render nothing when modal is closed or no transaction is selected
  if (!isOpen || !transaction) return null
  if (typeof transaction.id !== 'string' || !transaction.id) return null

  const type = transaction.type === 'income' ? 'income' : 'expense'
  const categoryOptions = getCategoryOptions(type) ?? []

  // amount is always a string here, so .trim() is safe
  const parsedAmount = parseFloat(amount)
  const isFormValid =
    description.trim().length > 0 &&
    category.length > 0 &&
    amount.trim().length > 0 &&
    !isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    date.length > 0

  const hasChanges =
    description !== (transaction.description ?? '') ||
    category !== (transaction.category ?? '') ||
    parsedAmount !== (transaction.amount ?? 0) ||
    date !== (transaction.dateISO ?? '')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (!description.trim()) {
      setError('Description is required')
      return
    }
    if (!category) {
      setError('Category is required')
      return
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!date) {
      setError('Date is required')
      return
    }

    setShowConfirm(true)
  }

  const handleConfirmUpdate = () => {
    setShowConfirm(false)

    if (typeof onSave !== 'function') {
      setError('Save handler not available')
      return
    }

    const result = onSave(transaction.id, description.trim(), category, parsedAmount, date)

    if (result && typeof result === 'object' && !result.success) {
      const msg =
        Array.isArray(result.errors) && result.errors.length > 0
          ? String(result.errors[0])
          : 'Failed to update transaction'
      setError(msg)
      return
    }

    console.log('[EditModal] Transaction updated successfully:', transaction.id)
    handleClose()
  }

  const handleClose = () => {
    // Clear the init-guard so the form re-initializes next time this transaction is opened
    initializedForIdRef.current = null
    setDescription('')
    setCategory('')
    setAmount('')
    setDate(getTodayISO())
    setError(null)
    setShowConfirm(false)
    if (typeof onClose === 'function') onClose()
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
                  placeholder={type === 'income' ? 'e.g., Salary, Freelance work' : 'e.g., Grocery shopping, Rent'}
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
                  min="0.01"
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
                disabled={!isFormValid || !hasChanges}
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
