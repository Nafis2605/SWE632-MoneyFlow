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

  // Custom label renderer for pie chart - shows percentages
  const renderCustomLabel = (entry) => {
    // Only show label if percentage >= 4% for readability
    const percentage = parseFloat(entry.percentage)
    if (percentage >= 4) {
      return `${entry.percentage}%`
    }
    return null
  }

  // Custom tooltip for pie chart with smart "Other" breakdown
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      
      // If this is the "Other" category, show breakdown
      if (data.isOther && data.breakdown) {
        return (
          <div className="pie-chart-tooltip other-breakdown">
            <p className="tooltip-title">Other Categories</p>
            <div className="breakdown-list">
              {data.breakdown.map((item, idx) => (
                <div key={idx} className="breakdown-item">
                  <span className="breakdown-label">{item.label}</span>
                  <span className="breakdown-amount">${item.amount.toFixed(2)}</span>
                  <span className="breakdown-percentage">({item.percentage}%)</span>
                </div>
              ))}
            </div>
            <div className="breakdown-total">
              <span className="total-label">Total Other:</span>
              <span className="total-amount">${data.value.toFixed(2)}</span>
              <span className="total-percentage">({data.percentage}%)</span>
            </div>
          </div>
        )
      }
      
      // Regular tooltip for standard categories
      return (
        <div className="pie-chart-tooltip">
          <p className="tooltip-category">{data.name}</p>
          <p className="tooltip-amount">Amount: ${data.value.toFixed(2)}</p>
          <p className="tooltip-percentage">Percentage: {data.percentage}%</p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for bar chart
  const BarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bar-chart-tooltip">
          <p className="tooltip-category">{data.fullName}</p>
          <p className="tooltip-amount">Amount: ${data.amount.toFixed(2)}</p>
          <p className="tooltip-count">Transactions: {data.count}</p>
        </div>
      )
    }
    return null
  }

  return (
    <section className="expense-visualization-section">
      <h2>Expense Distribution</h2>

      {/* Charts Container */}
      <div className="charts-container">
        {/* Pie Chart - Refined */}
        <div className="chart-wrapper pie-chart-wrapper">
          <h3>Expense Breakdown</h3>
          <p className="chart-description">
            Categories shown if ≥2% of total. Hover for detailed information.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Clean legend showing only category names */}
          <div className="pie-chart-legend">
            {pieData.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                <span className="legend-label">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-wrapper bar-chart-wrapper">
          <h3>Top Expenses</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="name" 
                height={50}
                tick={{ fontSize: 11 }}
                interval={0}
                tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
              />
              <YAxis 
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<BarTooltip />} />
              <Bar 
                dataKey="amount" 
                radius={[8, 8, 0, 0]}
                animationDuration={300}
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
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
