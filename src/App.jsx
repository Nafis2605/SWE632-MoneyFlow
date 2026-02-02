import { useState } from 'react'
import Header from './components/Header'
import './styles/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <h1>Welcome to MoneyFlow</h1>
          <p>Your personal finance manager</p>
          <p>Count: {count}</p>
          <button className="btn btn-primary" onClick={() => setCount(count + 1)}>
            Click me
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
