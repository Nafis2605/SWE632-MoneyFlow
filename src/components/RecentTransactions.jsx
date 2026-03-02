import '../styles/RecentTransactions.css'
import { formatDate } from '../utils/helpers'
import { getRecentTransactions } from '../utils/helpers'

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
              <div className="transaction-left">
                <div className="transaction-info">
                  <span className="transaction-title">{transaction.title}</span>
                  <span className="transaction-date">{formatDate(transaction.date)}</span>
                </div>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default RecentTransactions
