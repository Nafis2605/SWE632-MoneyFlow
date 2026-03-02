import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useBudgetState } from './hooks/useBudgetState'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import ReportsPage from './pages/ReportsPage'
import './styles/App.css'

function App() {
  const budgetState = useBudgetState()

  return (
    <Router>
      <div className="app">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage budgetState={budgetState} />} />
          <Route 
            path="/dashboard" 
            element={<DashboardPage budgetState={budgetState} />} 
          />
          <Route 
            path="/transactions" 
            element={<TransactionsPage transactions={budgetState.transactions} />} 
          />
          <Route 
            path="/reports" 
            element={<ReportsPage transactions={budgetState.transactions} />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
