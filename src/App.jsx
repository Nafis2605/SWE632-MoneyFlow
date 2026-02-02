import { useBudgetState } from './hooks/useBudgetState'
import Header from './components/Header'
import './styles/App.css'

function App() {
  // Initialize budget state with custom hook
  // Manages income and expenses with immutable state updates
  const budgetState = useBudgetState(0)

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <h1>Welcome to MoneyFlow</h1>
          <p>Your personal finance manager</p>
          
          {/* Budget Overview */}
          <section className="budget-overview">
            <div className="budget-card">
              <h2>Monthly Income</h2>
              <p className="amount">${budgetState.income.toFixed(2)}</p>
            </div>
            
            <div className="budget-card">
              <h2>Total Expenses</h2>
              <p className="amount">${budgetState.totalExpenses.toFixed(2)}</p>
            </div>
            
            <div className="budget-card">
              <h2>Remaining Budget</h2>
              <p className={`amount ${budgetState.remainingBudget >= 0 ? 'positive' : 'negative'}`}>
                ${budgetState.remainingBudget.toFixed(2)}
              </p>
            </div>
          </section>

          {/* Expenses List */}
          <section className="expenses-section">
            <h2>Expenses ({budgetState.expenses.length})</h2>
            {budgetState.expenses.length === 0 ? (
              <p className="empty-state">No expenses yet. Start by adding an expense!</p>
            ) : (
              <ul className="expenses-list">
                {budgetState.expenses.map(expense => (
                  <li key={expense.id} className="expense-item">
                    <div className="expense-info">
                      <span className="expense-name">{expense.name}</span>
                      <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
