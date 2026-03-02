import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/TransactionsPage.css'
import { groupTransactionsByMonth, formatMonthKeyHelper, getSortedTransactions } from '../utils/helpers'
import { formatDate } from '../utils/date'
import { getCategoryLabel } from '../utils/categories'
import { getDefaultFilters, applyFilters } from '../utils/filterModel'
import FiltersPanel from '../components/FiltersPanel'

function TransactionsPage({ transactions }) {
  const [filters, setFilters] = useState(getDefaultFilters())

  // Apply filters and get filtered transactions
  const filteredTransactions = getSortedTransactions(applyFilters(transactions, filters))
  const grouped = groupTransactionsByMonth(filteredTransactions)
  const monthKeys = Object.keys(grouped).sort().reverse()

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default TransactionsPage