import TransactionForm from '../components/TransactionForm'
import BudgetSummary from '../components/BudgetSummary'
import RecentTransactions from '../components/RecentTransactions'
import '../styles/HomePage.css'

function HomePage({ budgetState }) {
  return (
    <main className="main-content">
      <div className="page-header">
        <h1>Budget Planner</h1>
        <p className="page-description">
          Manage your income and expenses to track your budget
        </p>
      </div>

      <div className="layout-container">
        {/* Left Column: Transaction Input */}
        <section className="section-column input-column">
          <div className="section-wrapper">
            <TransactionForm 
              onAddIncome={budgetState.addIncome}
              onAddExpense={budgetState.addExpense}
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
            />
          </div>
        </section>
      </div>

      {/* Full Width: Recent Activity */}
      <div className="recent-activity-container">
        <div className="section-wrapper">
          <RecentTransactions
            transactions={budgetState.transactions}
          />
        </div>
      </div>
    </main>
  )
}

export default HomePage
