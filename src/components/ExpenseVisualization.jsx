import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import '../styles/ExpenseVisualization.css'

function ExpenseVisualization({ expenses }) {
  // Color palette for charts
  const COLORS = ['#5367AB', '#f9c74f', '#008000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd']

  // Prepare data for pie chart
  const pieData = expenses.map((expense, index) => ({
    name: expense.name,
    value: expense.amount,
    color: COLORS[index % COLORS.length]
  }))

  // Prepare data for bar chart (top expenses)
  const barData = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((expense, index) => ({
      name: expense.name.length > 12 ? expense.name.substring(0, 12) + '...' : expense.name,
      amount: expense.amount,
      fullName: expense.name
    }))

  // Calculate total for percentage display
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (expenses.length === 0) {
    return (
      <section className="expense-visualization-section">
        <h2>Expense Distribution</h2>
        <div className="empty-state">
          <p>No expenses yet. Add expenses to see the distribution chart.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="expense-visualization-section">
      <h2>Expense Distribution</h2>

      {/* Charts Container */}
      <div className="charts-container">
        {/* Pie Chart */}
        <div className="chart-wrapper pie-chart-wrapper">
          <h3>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry) => `${entry.payload.name}: $${entry.payload.value.toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-wrapper bar-chart-wrapper">
          <h3>Top Expenses</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => `$${value.toFixed(2)}`}
                labelFormatter={(label) => `Expense: ${label}`}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <Bar 
                dataKey="amount" 
                fill="#5367AB"
                radius={[8, 8, 0, 0]}
                animationDuration={300}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics */}
      <div className="visualization-stats">
        <div className="stat-item">
          <span className="stat-label">Total Expenses:</span>
          <span className="stat-value">${totalExpenses.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Number of Expenses:</span>
          <span className="stat-value">{expenses.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Expense:</span>
          <span className="stat-value">${(totalExpenses / expenses.length).toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Highest Expense:</span>
          <span className="stat-value">${Math.max(...expenses.map(e => e.amount)).toFixed(2)}</span>
        </div>
      </div>
    </section>
  )
}

export default ExpenseVisualization
