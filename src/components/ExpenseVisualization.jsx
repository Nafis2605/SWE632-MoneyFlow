import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import '../styles/ExpenseVisualization.css'
import { preparePieChartData, prepareBarChartData, calculateExpenseStats } from '../utils/chartUtils'

function ExpenseVisualization({ expenses }) {
  // Prepare data for charts
  const pieData = preparePieChartData(expenses)
  const barData = prepareBarChartData(expenses)
  const stats = calculateExpenseStats(expenses)

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
                fill="#dc2626"
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
          <span className="stat-value">${stats.total.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Number of Expenses:</span>
          <span className="stat-value">{stats.count}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Expense:</span>
          <span className="stat-value">${stats.average.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Highest Expense:</span>
          <span className="stat-value">${stats.highest.toFixed(2)}</span>
        </div>
      </div>
    </section>
  )
}

export default ExpenseVisualization
