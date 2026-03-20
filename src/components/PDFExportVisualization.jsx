/**
 * PDFExportVisualization Component
 * Optimized layout for PDF export - larger, cleaner charts specifically designed for PDF pages
 * This component is rendered in a hidden container for PDF capture, not displayed to users
 */

import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { preparePieChartData, prepareBarChartData, calculateExpenseStats } from '../utils/chartUtils'

function PDFExportVisualization({ expenses }) {
  // Prepare data for charts
  const pieData = preparePieChartData(expenses)
  const barData = prepareBarChartData(expenses)
  const stats = calculateExpenseStats(expenses)

  if (expenses.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <p>No expenses to visualize</p>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '0',
      display: 'block'
    }}>
      {/* Charts Container - Optimized for PDF export */}
      <div style={{
        display: 'block',
        width: '100%',
        padding: '20px'
      }}>
        {/* Pie Chart - Full Width */}
        <div style={{
          width: '100%',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #eee',
          marginBottom: '40px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            color: '#333',
            margin: '0 0 20px 0',
            fontWeight: 600
          }}>
            Expense Breakdown by Category
          </h3>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart margin={{ top: 10, right: 10, bottom: 50, left: 10 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '30px' }}
                  formatter={(value, entry) => `${entry.payload.name}: $${entry.payload.value.toFixed(2)}`}
                  height={80}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Full Width */}
        <div style={{
          width: '100%',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #eee',
          marginBottom: '40px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            color: '#333',
            margin: '0 0 20px 0',
            fontWeight: 600
          }}>
            Top Expenses
          </h3>
          <div style={{ width: '100%', height: '500px' }}>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="name"
                  height={60}
                  tick={{ fontSize: 14, fontWeight: 500 }}
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
                />
                <YAxis
                  label={{ value: 'Amount ($)', angle: 0, position: 'left', offset: 10, fontSize: 14, fontWeight: 500 }}
                  tick={{ fontSize: 14, fontWeight: 500 }}
                />
                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  labelFormatter={(label) => `Expense: ${label}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
                <Bar
                  dataKey="amount"
                  radius={[8, 8, 0, 0]}
                  animationDuration={0}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistics Cards - KPI Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eee',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Total Expenses
            </div>
            <div style={{
              fontSize: '1.4rem',
              color: '#dc2626',
              fontWeight: 700
            }}>
              ${stats.total.toFixed(2)}
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eee',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Number of Expenses
            </div>
            <div style={{
              fontSize: '1.4rem',
              color: '#5367AB',
              fontWeight: 700
            }}>
              {stats.count}
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eee',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Average Expense
            </div>
            <div style={{
              fontSize: '1.4rem',
              color: '#16a34a',
              fontWeight: 700
            }}>
              ${stats.average.toFixed(2)}
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eee',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              marginBottom: '8px',
              fontWeight: 500
            }}>
              Highest Expense
            </div>
            <div style={{
              fontSize: '1.4rem',
              color: '#f59e0b',
              fontWeight: 700
            }}>
              ${stats.highest.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFExportVisualization
