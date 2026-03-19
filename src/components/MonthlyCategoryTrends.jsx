import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import '../styles/MonthlyCategoryTrends.css'
import {
  getMonthlyCategoryTotals,
  transformToLineChartData,
  getAvailableCategories,
  getAvailableYears,
  getMonthsForYear,
  filterChartDataByDateRange,
  getYearFromMonthString
} from '../utils/monthlyTrends'
import { getCategoryColor } from '../utils/categoryColors'
import { getCategoryLabel } from '../utils/categories'

const MONTH_OPTIONS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
]

function MonthlyCategoryTrends({ expenses }) {
  const [selectedCategories, setSelectedCategories] = useState([])

  // Get available years from expenses
  const availableYears = useMemo(
    () => getAvailableYears(expenses),
    [expenses]
  )

  // Initialize date range to first and last available months
  const defaultStartYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear()
  const defaultEndYear = availableYears.length > 0 ? availableYears[availableYears.length - 1] : new Date().getFullYear()
  const defaultStartMonth = 1
  const defaultEndMonth = 12

  const [startMonth, setStartMonth] = useState(defaultStartMonth)
  const [startYear, setStartYear] = useState(defaultStartYear)
  const [endMonth, setEndMonth] = useState(defaultEndMonth)
  const [endYear, setEndYear] = useState(defaultEndYear)

  // Get available categories from expenses
  const availableCategories = useMemo(
    () => getAvailableCategories(expenses),
    [expenses]
  )

  // Get available months for start year
  const startYearMonths = useMemo(
    () => getMonthsForYear(expenses, startYear),
    [expenses, startYear]
  )

  // Get available months for end year
  const endYearMonths = useMemo(
    () => getMonthsForYear(expenses, endYear),
    [expenses, endYear]
  )

  // Get monthly totals and transform to chart data
  const monthlyData = useMemo(() => {
    const totals = getMonthlyCategoryTotals(expenses, selectedCategories)
    const chartData = transformToLineChartData(totals, getCategoryColor)
    
    // Filter by date range
    const filtered = filterChartDataByDateRange(
      chartData,
      startMonth,
      startYear,
      endMonth,
      endYear
    )
    
    return filtered
  }, [expenses, selectedCategories, startMonth, startYear, endMonth, endYear])

  // Get categories that are actually displayed in the chart
  const displayedCategories = useMemo(() => {
    if (monthlyData.length === 0) return []
    const firstDataPoint = monthlyData[0]
    return Object.keys(firstDataPoint).filter(key => key !== 'month')
  }, [monthlyData])

  /**
   * Handle category selection/deselection
   */
  const handleCategoryToggle = (categoryValue) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryValue)) {
        return prev.filter(cat => cat !== categoryValue)
      } else {
        return [...prev, categoryValue]
      }
    })
  }

  /**
   * Select all available categories
   */
  const handleSelectAll = () => {
    if (selectedCategories.length === availableCategories.length) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(availableCategories.map(cat => cat.value))
    }
  }

  /**
   * Validate and update start month
   */
  const handleStartMonthChange = (e) => {
    const newMonth = parseInt(e.target.value)
    setStartMonth(newMonth)
  }

  /**
   * Validate and update start year
   */
  const handleStartYearChange = (e) => {
    const newYear = parseInt(e.target.value)
    setStartYear(newYear)
  }

  /**
   * Validate and update end month
   */
  const handleEndMonthChange = (e) => {
    const newMonth = parseInt(e.target.value)
    setEndMonth(newMonth)
  }

  /**
   * Validate and update end year
   */
  const handleEndYearChange = (e) => {
    const newYear = parseInt(e.target.value)
    setEndYear(newYear)
  }

  // Check if start date is after end date (invalid)
  const isInvalidRange = startYear > endYear || (startYear === endYear && startMonth > endMonth)

  // Show empty state if no data
  if (expenses.length === 0) {
    return (
      <section className="monthly-category-trends-section">
        <h2>Monthly Spending Trends by Category</h2>
        <div className="empty-state">
          <p>No expense data available. Add expenses to see monthly trends.</p>
        </div>
      </section>
    )
  }

  // Show empty selection message if categories available but none selected
  const hasData = monthlyData.length > 0 && displayedCategories.length > 0

  return (
    <section className="monthly-category-trends-section">
      <div className="trends-header">
        <h2>Monthly Spending Trends by Category</h2>
        <p className="trends-subtitle">
          Track how spending changes month-by-month across categories
        </p>
      </div>

      {/* Date Range Selectors */}
      <div className="date-range-selector-wrapper">
        <div className="date-range-group">
          <div className="date-range-label">
            <span className="range-label-text">Filter by Date Range</span>
          </div>

          <div className="date-inputs">
            {/* Start Date */}
            <div className="date-input-group">
              <label htmlFor="start-month">Start Month</label>
              <select
                id="start-month"
                value={startMonth}
                onChange={handleStartMonthChange}
                className="date-select"
              >
                {MONTH_OPTIONS.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="date-input-group">
              <label htmlFor="start-year">Start Year</label>
              <select
                id="start-year"
                value={startYear}
                onChange={handleStartYearChange}
                className="date-select"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="date-separator">to</div>

            {/* End Date */}
            <div className="date-input-group">
              <label htmlFor="end-month">End Month</label>
              <select
                id="end-month"
                value={endMonth}
                onChange={handleEndMonthChange}
                className="date-select"
              >
                {MONTH_OPTIONS.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="date-input-group">
              <label htmlFor="end-year">End Year</label>
              <select
                id="end-year"
                value={endYear}
                onChange={handleEndYearChange}
                className="date-select"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isInvalidRange && (
            <div className="range-error">
              ⚠️ Start date must be before end date
            </div>
          )}
        </div>
      </div>

      {/* Category Selector */}
      <div className="category-selector-wrapper">
        <div className="category-selector">
          <div className="selector-header">
            <label>Select Categories to Compare</label>
            <button
              className="select-all-btn"
              onClick={handleSelectAll}
            >
              {selectedCategories.length === availableCategories.length
                ? 'Clear All'
                : 'Select All'}
            </button>
          </div>

          <div className="category-filters">
            {availableCategories.map(category => (
              <label key={category.value} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => handleCategoryToggle(category.value)}
                />
                <span
                  className="category-color-dot"
                  style={{ backgroundColor: getCategoryColor(category.value) }}
                />
                <span className="category-label">{category.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      {hasData && !isInvalidRange ? (
        <div className="chart-wrapper monthly-chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#eee"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="#888"
              />
              <YAxis
                label={{
                  value: 'Amount ($)',
                  angle: -90,
                  position: 'insideLeft'
                }}
                stroke="#888"
              />
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => value}
              />

              {/* Render a line for each selected category */}
              {displayedCategories.map((categoryLabel, index) => (
                <Line
                  key={`line-${categoryLabel}`}
                  type="monotone"
                  dataKey={categoryLabel}
                  stroke={getCategoryColor(
                    availableCategories.find(
                      cat => getCategoryLabel(cat.value, 'expense') === categoryLabel
                    )?.value || 'other'
                  )}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : isInvalidRange ? (
        <div className="empty-selection-message">
          <p>
            ⚠️ Invalid date range. Please adjust your start and end dates.
          </p>
        </div>
      ) : (
        <div className="empty-selection-message">
          <p>
            👆 Select one or more categories above to view monthly spending trends
          </p>
        </div>
      )}
    </section>
  )
}

export default MonthlyCategoryTrends
