/**
 * IncomeVsExpenseChart Component
 * 
 * Displays a line chart comparing income vs expenses over time
 * Shows monthly trends and calculates net savings
 * Includes optional net savings line
 */

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell
} from 'recharts'
import { getMonthlyIncomeVsExpense } from '../utils/monthlyTrends'
import '../styles/IncomeVsExpenseChart.css'

function IncomeVsExpenseChart({ transactions, showNetSavings = true }) {
  // Aggregate monthly data
  const chartData = getMonthlyIncomeVsExpense(transactions)

  if (!chartData || chartData.length === 0) {
    return (
      <div className="income-vs-expense-section empty-state">
        <h2>Income vs Expense Comparison</h2>
        <p className="empty-message">No transactions to display</p>
      </div>
    )
  }

  // Custom tooltip to show detailed information including net savings
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      
      return (
        <div className="income-expense-tooltip">
          <p className="tooltip-month">{data.month}</p>
          <p className="tooltip-income">
            💰 Income: <span className="amount">${data.income.toFixed(2)}</span>
          </p>
          <p className="tooltip-expense">
            💸 Expense: <span className="amount">${data.expense.toFixed(2)}</span>
          </p>
          <hr className="tooltip-divider" />
          <p className={`tooltip-net ${data.net >= 0 ? 'positive' : 'negative'}`}>
            📊 Net: <span className="amount">{data.net >= 0 ? '+' : ''}${data.net.toFixed(2)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const hasData = chartData.length > 0
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.income, d.expense))
  )

  return (
    <section className="income-vs-expense-section">
      <div className="section-header">
        <h2>Income vs Expense Comparison</h2>
        <p className="section-description">
          Monthly comparison of income and expenses with net savings calculation
        </p>
      </div>

      {hasData && (
        <>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e0e0e0" 
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis
                  label={{
                    value: 'Amount ($)',
                    angle: -90,
                    position: 'insideLeft'
                  }}
                  stroke="#666"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Reference line at 0 for visual reference */}
                <ReferenceLine
                  y={0}
                  stroke="#ccc"
                  strokeDasharray="5 5"
                  opacity={0.5}
                />

                {/* Income Bar - Green */}
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Income"
                />

                {/* Expense Bar - Red */}
                <Bar
                  dataKey="expense"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Expense"
                />

                {/* Net Savings Bar - Blue (optional) */}
                {showNetSavings && (
                  <Bar
                    dataKey="net"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Net Savings"
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Cards */}
          <div className="chart-summary">
            <div className="summary-card income-card">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <p className="card-label">Total Income</p>
                <p className="card-value">
                  ${chartData.reduce((sum, d) => sum + d.income, 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="summary-card expense-card">
              <div className="card-icon">💸</div>
              <div className="card-content">
                <p className="card-label">Total Expense</p>
                <p className="card-value">
                  ${chartData.reduce((sum, d) => sum + d.expense, 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="summary-card net-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <p className="card-label">Net Savings</p>
                <p className={`card-value ${
                  chartData.reduce((sum, d) => sum + d.net, 0) >= 0 ? 'positive' : 'negative'
                }`}>
                  {chartData.reduce((sum, d) => sum + d.net, 0) >= 0 ? '+' : ''}
                  ${chartData.reduce((sum, d) => sum + d.net, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Average Analysis */}
          <div className="chart-analysis">
            <div className="analysis-item">
              <span className="analysis-label">Average Monthly Income:</span>
              <span className="analysis-value">
                ${(chartData.reduce((sum, d) => sum + d.income, 0) / chartData.length).toFixed(2)}
              </span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Average Monthly Expense:</span>
              <span className="analysis-value">
                ${(chartData.reduce((sum, d) => sum + d.expense, 0) / chartData.length).toFixed(2)}
              </span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Months with Positive Net:</span>
              <span className="analysis-value">
                {chartData.filter(d => d.net > 0).length} / {chartData.length}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default IncomeVsExpenseChart
