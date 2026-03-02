import { useBudgetState } from './hooks/useBudgetState'
import Header from './components/Header'
import IncomeForm from './components/IncomeInput'
import IncomeList from './components/IncomeList'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import BudgetSummary from './components/BudgetSummary'
import RecentTransactions from './components/RecentTransactions'
import ExpenseVisualization from './components/ExpenseVisualization'
import './styles/App.css'

function App() {
  const budgetState = useBudgetState()

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="page-header">
          <h1>Budget Planner</h1>
          <p className="page-description">
            Manage your income and expenses to track your budget at a glance
          </p>
        </div>

        <div className="layout-container">
          {/* Left Column: Income & Expense Input */}
          <section className="section-column input-column">
            <div className="section-wrapper">
              <IncomeForm 
                onAddIncome={budgetState.addIncome}
              />
            </div>

            <div className="section-wrapper">
              <ExpenseForm 
                onAddExpense={budgetState.addExpense}
              />
            </div>
          </section>

          {/* Right Column: Summary & Transactions */}
          <section className="section-column content-column">
            <div className="section-wrapper">
              <BudgetSummary
                income={budgetState.totalIncome}
                totalExpenses={budgetState.totalExpenses}
                remainingBudget={budgetState.remainingBudget}
              />
            </div>

            <div className="section-wrapper">
              <IncomeList
                incomes={budgetState.incomeTransactions}
                onDeleteIncome={budgetState.deleteIncome}
              />
            </div>

            <div className="section-wrapper">
              <ExpenseList
                expenses={budgetState.expenses}
                onDeleteExpense={budgetState.deleteExpense}
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

        {/* Full Width: Expense Visualization */}
        <div className="visualization-container">
          <div className="section-wrapper">
            <ExpenseVisualization
              expenses={budgetState.expenses}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
