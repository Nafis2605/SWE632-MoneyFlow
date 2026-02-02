import '../styles/Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h2 className="logo">MoneyFlow</h2>
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
