import TransactionForm from '../components/TransactionForm'
import BudgetSummary from '../components/BudgetSummary'
import RecentTransactions from '../components/RecentTransactions'
import '../styles/HomePage.css'

function HomePage({ budgetState }) {
  const hasTransactions = budgetState.transactions && budgetState.transactions.length > 0
  
  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Budget Planner</h1>
        <p className="page-description">
          Manage your income and expenses to track your budget
        </p>
      </div>

      {/* Empty State Instruction */}
      {!hasTransactions && (
        <div className="empty-state-hint">
          <p>💡 Start by adding your first income or expense</p>
        </div>
      )}

      <div className="layout-container">
        {/* Left Column: Transaction Input */}
        <section className={`section-column input-column ${!hasTransactions ? 'emphasized' : ''}`}>
          <div className={`section-wrapper ${!hasTransactions ? 'form-emphasized' : ''}`}>
            <TransactionForm 
              onAddIncome={budgetState.addIncome}
              onAddExpense={budgetState.addExpense}
              isEmpty={!hasTransactions}
            />
          </div>
        </section>

        {/* Right Column: Budget Summary */}
        <section className="section-column content-column">
          <div className="section-wrapper">
            <BudgetSummary
              income={budgetState.totalIncome}
              totalExpenses={budgetState.totalExpenses}
              remainingBudget={budgetState.remainingBudget}
              isEmpty={!hasTransactions}
            />
          </div>
        </section>
      </div>

      {/* Full Width: Recent Activity */}
      {hasTransactions && (
        <div className="recent-activity-container">
          <div className="section-wrapper">
            <RecentTransactions
              transactions={budgetState.transactions}
              onDeleteTransaction={budgetState.deleteTransaction}
              onUpdateTransaction={budgetState.updateTransaction}
            />
          </div>
        </div>
      )}
    </main>
  )
}

export default HomePage
