import '../styles/RecentTransactions.css'
import { formatDate } from '../utils/date'
import { getRecentTransactions } from '../utils/helpers'
import { getCategoryLabel } from '../utils/categories'

function RecentTransactions({ transactions }) {
  const recentTxns = getRecentTransactions(transactions, 5)

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
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default RecentTransactions
