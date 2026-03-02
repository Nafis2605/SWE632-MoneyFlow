import { Link, useLocation } from 'react-router-dom'
import '../styles/Navigation.css'

function Navigation() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isDashboard = location.pathname === '/dashboard'
  const isTransactions = location.pathname === '/transactions'
  const isReports = location.pathname === '/reports'

  return (
    <nav className="app-navigation" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo" aria-label="MoneyFlow Home">
          <div className="logo-content">
            <span className="logo-icon">💰</span>
            <h1>MoneyFlow</h1>
          </div>
        </Link>
        
        <ul className="nav-links" role="list">
          <li role="listitem">
            <Link 
              to="/" 
              className={`nav-link ${isHome ? 'active' : ''}`}
              aria-current={isHome ? 'page' : undefined}
            >
              Home
            </Link>
          </li>
          <li role="listitem">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isDashboard ? 'active' : ''}`}
              aria-current={isDashboard ? 'page' : undefined}
            >
              Dashboard
            </Link>
          </li>
          <li role="listitem">
            <Link 
              to="/transactions" 
              className={`nav-link ${isTransactions ? 'active' : ''}`}
              aria-current={isTransactions ? 'page' : undefined}
            >
              Transactions
            </Link>
          </li>
          <li role="listitem">
            <Link 
              to="/reports" 
              className={`nav-link ${isReports ? 'active' : ''}`}
              aria-current={isReports ? 'page' : undefined}
            >
              Reports
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
