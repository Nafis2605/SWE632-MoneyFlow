import { useBudgetState } from './hooks/useBudgetState'
import Header from './components/Header'
import IncomeInput from './components/IncomeInput'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import BudgetSummary from './components/BudgetSummary'
import './styles/App.css'

function App() {
  const budgetState = useBudgetState(0)

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
              <IncomeInput 
                income={budgetState.income} 
                onIncomeChange={budgetState.setMonthlyIncome}
              />
            </div>

            <div className="section-wrapper">
              <ExpenseForm 
                onAddExpense={budgetState.addExpense}
              />
            </div>
          </section>

          {/* Right Column: Summary & Expenses Management */}
          <section className="section-column content-column">
            <div className="section-wrapper">
              <BudgetSummary
                income={budgetState.income}
                totalExpenses={budgetState.totalExpenses}
                remainingBudget={budgetState.remainingBudget}
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
      </main>
    </div>
  )
}

export default App
