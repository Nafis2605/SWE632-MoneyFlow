import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/TransactionsPage.css'
import { groupTransactionsByMonth, formatMonthKeyHelper, getSortedTransactions } from '../utils/helpers'
import { formatDate } from '../utils/date'
import { getCategoryLabel } from '../utils/categories'
import { getDefaultFilters, applyFilters } from '../utils/filterModel'
import FiltersPanel from '../components/FiltersPanel'
import ConfirmModal from '../components/ConfirmModal'
import EditTransactionModal from '../components/EditTransactionModal'
import {
  createDeleteClickHandler,
  createConfirmDeleteHandler,
  createCancelDeleteHandler,
  createEditClickHandler,
  createCloseEditModalHandler,
  createSaveEditHandler
} from '../utils/transactionActions'

function TransactionsPage({ budgetState }) {
  const [filters, setFilters] = useState(getDefaultFilters())
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transactionId: null })
  const [editModal, setEditModal] = useState({ isOpen: false, transaction: null })
  const transactions = budgetState.transactions

  // Apply filters and get filtered transactions
  const filteredTransactions = getSortedTransactions(applyFilters(transactions, filters))
  const grouped = groupTransactionsByMonth(filteredTransactions)
  const monthKeys = Object.keys(grouped).sort().reverse()

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  // Use shared handlers from transactionActions utility
  const handleDeleteClick = createDeleteClickHandler(setDeleteModal)
  const handleEditClick = createEditClickHandler(setEditModal)
  
  const handleConfirmDelete = () => {
    const handler = createConfirmDeleteHandler(setDeleteModal, budgetState.deleteTransaction)
    handler(deleteModal.transactionId)
  }

  const handleCancelDelete = createCancelDeleteHandler(setDeleteModal)
  const handleCloseEditModal = createCloseEditModalHandler(setEditModal)
  const handleSaveEdit = (id, description, category, amount, date) => {
    if (budgetState.updateTransaction) {
      return budgetState.updateTransaction(id, description, category, amount, date)
    }
    return { success: false }
  }

  if (transactions.length === 0) {
    return (
      <div className="transactions-page">
        <div className="page-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>All Transactions</h1>
          <p className="page-description">View and manage all your transactions</p>
        </div>
        
        <div className="page-content">
          <div className="empty-state">
            <p>No transactions yet. Start by adding income or expenses on the home page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="transactions-page">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>All Transactions</h1>
        <p className="page-description">
          {transactions.length} total • {filteredTransactions.length} displayed
        </p>
      </div>

      <div className="page-content">
        {/* Filters Section */}
        <FiltersPanel 
          transactions={transactions}
          onFilterChange={handleFilterChange}
        />

        {/* Filtered Results */}
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions match your filters.</p>
          </div>
        ) : (
          <>
            {monthKeys.map((monthKey) => (
              <div key={monthKey} className="month-group">
                <h2 className="month-header">{formatMonthKeyHelper(monthKey)}</h2>
                <div className="transactions-list">
                  {grouped[monthKey].map((transaction) => (
                    <div key={transaction.id} className="transaction-row">
                      <div className="transaction-left">
                        <div className="transaction-meta">
                          <span className="transaction-title">{transaction.description}</span>
                          <span className="transaction-date">{formatDate(transaction.dateISO)}</span>
                        </div>
                      </div>
                      <div className="transaction-category">
                        {getCategoryLabel(transaction.category, transaction.type)}
                      </div>
                      <div className={`transaction-type ${transaction.type}`}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </div>
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
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
    </div>
  )
}

export default TransactionsPage