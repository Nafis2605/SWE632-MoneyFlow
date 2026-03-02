/**
 * Transaction Action Handlers Utility
 * Centralizes common patterns for editing and deleting transactions
 * Reduces code duplication across components
 */

/**
 * Create delete handler with confirmation modal management
 * @param {Function} setDeleteModal - setState for delete modal
 * @returns {Function} Handler for delete button clicks
 */
export const createDeleteClickHandler = (setDeleteModal) => (id) => {
  setDeleteModal({ isOpen: true, transactionId: id })
}

/**
 * Create confirm delete handler
 * @param {Function} setDeleteModal - setState for delete modal
 * @param {Function} onDelete - Callback to actually delete the transaction
 * @returns {Function} Handler for confirming deletion
 */
export const createConfirmDeleteHandler = (setDeleteModal, onDelete) => (transactionId) => {
  if (transactionId && onDelete) {
    onDelete(transactionId)
  }
  setDeleteModal({ isOpen: false, transactionId: null })
}

/**
 * Create cancel delete handler
 * @param {Function} setDeleteModal - setState for delete modal
 * @returns {Function} Handler for canceling deletion
 */
export const createCancelDeleteHandler = (setDeleteModal) => () => {
  setDeleteModal({ isOpen: false, transactionId: null })
}

/**
 * Create edit click handler
 * @param {Function} setEditModal - setState for edit modal
 * @returns {Function} Handler for edit button clicks
 */
export const createEditClickHandler = (setEditModal) => (transaction) => {
  setEditModal({ isOpen: true, transaction })
}

/**
 * Create close edit modal handler
 * @param {Function} setEditModal - setState for edit modal
 * @returns {Function} Handler for closing edit modal
 */
export const createCloseEditModalHandler = (setEditModal) => () => {
  setEditModal({ isOpen: false, transaction: null })
}

/**
 * Create save edit handler
 * @param {Function} setEditModal - setState for edit modal
 * @param {Function} onUpdate - Callback to update the transaction
 * @returns {Function} Handler for saving edits
 */
export const createSaveEditHandler = (setEditModal, onUpdate) => (id, description, category, amount, date) => {
  if (onUpdate) {
    return onUpdate(id, description, category, amount, date)
  }
  return { success: false }
}

/**
 * Initialize modal state for transaction actions
 * @returns {Object} Initial state object with delete and edit modals
 */
export const initializeTransactionModals = () => ({
  deleteModal: { isOpen: false, transactionId: null },
  editModal: { isOpen: false, transaction: null }
})

/**
 * Validate if transaction can be edited (optional custom validation)
 * @param {Object} transaction - Transaction to validate
 * @returns {Object} Object with isValid and errors
 */
export const validateTransactionEdit = (transaction) => {
  if (!transaction) {
    return { isValid: false, errors: ['Transaction not found'] }
  }
  return { isValid: true, errors: [] }
}
