import '../styles/Header.css'
import Logo from './Logo'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo-section">
          <Logo size={32} />
          <h2 className="logo-text">MoneyFlow</h2>
        </div>
        <nav className="nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#transactions">Transactions</a>
          <a href="#reports">Reports</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
