import { useState } from 'react'
import '../styles/RecentTransactions.css'
import { formatDate } from '../utils/date'
import { getRecentTransactions } from '../utils/helpers'
import { getCategoryLabel } from '../utils/categories'
import ConfirmModal from './ConfirmModal'
import EditTransactionModal from './EditTransactionModal'
import {
  createDeleteClickHandler,
  createConfirmDeleteHandler,
  createCancelDeleteHandler,
  createEditClickHandler,
  createCloseEditModalHandler,
  createSaveEditHandler
} from '../utils/transactionActions'

function RecentTransactions({ transactions, onDeleteTransaction, onUpdateTransaction }) {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transactionId: null })
  const [editModal, setEditModal] = useState({ isOpen: false, transaction: null })
  const recentTxns = getRecentTransactions(transactions, 5)

  // Use shared handlers from transactionActions utility
  const handleDeleteClick = createDeleteClickHandler(setDeleteModal)
  const handleEditClick = createEditClickHandler(setEditModal)
  
  const handleConfirmDelete = () => {
    const handler = createConfirmDeleteHandler(setDeleteModal, onDeleteTransaction)
    handler(deleteModal.transactionId)
  }

  const handleCancelDelete = createCancelDeleteHandler(setDeleteModal)
  const handleCloseEditModal = createCloseEditModalHandler(setEditModal)
  const handleSaveEdit = (id, description, category, amount, date) => {
    if (onUpdateTransaction) {
      return onUpdateTransaction(id, description, category, amount, date)
    }
    return { success: false }
  }

  if (recentTxns.length === 0) {
    return (
      <section className="recent-transactions-section">
        <h2>Recent Activity</h2>
        <div className="empty-state">
          <p>No transactions yet. Add income or expenses to get started!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="recent-transactions-section">
      <h2>Recent Activity</h2>
      <div className="transactions-container">
        <ul className="transactions-list">
          {recentTxns.map((transaction) => (
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
              {onUpdateTransaction && (
                <button
                  className="transaction-edit-btn"
                  onClick={() => handleEditClick(transaction)}
                  title="Edit transaction"
                  type="button"
                >
                  <svg className="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </button>
              )}
              {onDeleteTransaction && (
                <button
                  className="transaction-delete-btn"
                  onClick={() => handleDeleteClick(transaction.id)}
                  title="Delete transaction"
                  type="button"
                >
                  <svg className="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              )}
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
    </section>
  )
}

export default RecentTransactions
