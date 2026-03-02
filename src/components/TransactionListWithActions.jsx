import { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import EditTransactionModal from './EditTransactionModal'
import { formatDate } from '../utils/date'
import { getCategoryLabel } from '../utils/categories'
import '../styles/TransactionListWithActions.css'
import {
  createDeleteClickHandler,
  createConfirmDeleteHandler,
  createCancelDeleteHandler,
  createEditClickHandler,
  createCloseEditModalHandler,
  createSaveEditHandler
} from '../utils/transactionActions'

/**
 * TransactionListWithActions Component
 * Displays a list of transactions with editable/deletable actions
 * Can be used on any page (Dashboard, Reports, Transactions, etc.)
 * 
 * Props:
 * - transactions: Array of transaction objects
 * - onDelete: Callback function(id) to delete a transaction
 * - onUpdate: Callback function(id, description, category, amount, date) to update a transaction
 * - showOnlyExpenses: Boolean - if true, only shows expenses (default: false)
 * - maxItems: Number - limit displayed items (default: no limit)
 * - emptyMessage: String - message when no transactions (default: standard message)
 */
function TransactionListWithActions({
  transactions = [],
  onDelete,
  onUpdate,
  showOnlyExpenses = false,
  maxItems = null,
  emptyMessage = 'No transactions to display'
}) {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transactionId: null })
  const [editModal, setEditModal] = useState({ isOpen: false, transaction: null })

  // Filter transactions if needed
  let displayTransactions = [...transactions]
  if (showOnlyExpenses) {
    displayTransactions = displayTransactions.filter(t => t.type === 'expense')
  }

  // Limit items if specified
  if (maxItems && maxItems > 0) {
    displayTransactions = displayTransactions.slice(0, maxItems)
  }

  // Use shared handlers from transactionActions utility
  const handleDeleteClick = createDeleteClickHandler(setDeleteModal)
  const handleEditClick = createEditClickHandler(setEditModal)
  
  const handleConfirmDelete = () => {
    const handler = createConfirmDeleteHandler(setDeleteModal, onDelete)
    handler(deleteModal.transactionId)
  }

  const handleCancelDelete = createCancelDeleteHandler(setDeleteModal)
  const handleCloseEditModal = createCloseEditModalHandler(setEditModal)
  const handleSaveEdit = (id, description, category, amount, date) => {
    if (onUpdate) {
      return onUpdate(id, description, category, amount, date)
    }
    return { success: false }
  }

  if (displayTransactions.length === 0) {
    return (
      <div className="transaction-list-empty">
        <p className="empty-message">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="transaction-list-with-actions">
        <ul className="transactions-list">
          {displayTransactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <div className="transaction-main">
                <div className="transaction-header">
                  <span className="transaction-title">{transaction.description}</span>
                  <span className={`transaction-badge transaction-badge-${transaction.type}`}>
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                  <span className="transaction-category">
                    {getCategoryLabel(transaction.category, transaction.type)}
                  </span>
                </div>
                <span className="transaction-date">{formatDate(transaction.dateISO)}</span>
              </div>
              <div className={`transaction-amount transaction-amount-${transaction.type}`}>
                <span className="amount-sign">{transaction.type === 'income' ? '+' : '−'}</span>
                <span className="amount-value">${transaction.amount.toFixed(2)}</span>
              </div>
              <div className="transaction-actions">
                {onUpdate && (
                  <button
                    className="transaction-edit-btn"
                    onClick={() => handleEditClick(transaction)}
                    title="Edit transaction"
                    type="button"
                    aria-label="Edit transaction"
                  >
                    <svg className="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    className="transaction-delete-btn"
                    onClick={() => handleDeleteClick(transaction.id)}
                    title="Delete transaction"
                    type="button"
                    aria-label="Delete transaction"
                  >
                    <svg className="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"
        isDangerous={true}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={editModal.isOpen}
        transaction={editModal.transaction}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
    </>
  )
}

export default TransactionListWithActions
