import { useState } from 'react'
import { getTodayISO } from '../utils/date'
import { getAvailableMonths } from '../utils/helpers'
import '../styles/DashboardFilters.css'

function DashboardFilters({ transactions, onFilterChange }) {
  const [filterType, setFilterType] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')

  // Get available months for dropdown
  const availableMonths = getAvailableMonths(transactions)
  const years = [...new Set(availableMonths.map(m => m.year))].sort((a, b) => b - a)
  const monthsForYear = selectedYear
    ? availableMonths.filter(m => m.year === parseInt(selectedYear))
    : []

  const handleFilterTypeChange = (type) => {
    setFilterType(type)
    
    if (type === 'all') {
      notifyFilterChange({ type: 'all' })
    }
  }

  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      notifyFilterChange({
        type: 'dateRange',
        startDate,
        endDate
      })
    }
  }

  const handleMonthYearChange = () => {
    if (selectedYear && selectedMonth) {
      notifyFilterChange({
        type: 'monthYear',
        year: parseInt(selectedYear),
        month: parseInt(selectedMonth)
      })
    }
  }

  const notifyFilterChange = (filters) => {
    setFilterType(filters.type)
    onFilterChange(filters)
  }

  const handleReset = () => {
    setFilterType('all')
    setStartDate('')
    setEndDate('')
    setSelectedYear('')
    setSelectedMonth('')
    onFilterChange({ type: 'all' })
  }

  const getToday = () => {
    return getTodayISO()
  }

  return (
    <div className="dashboard-filters">
      <div className="filters-container">
        <div className="filter-group">
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="filter-type"
                value="all"
                checked={filterType === 'all'}
                onChange={() => handleFilterTypeChange('all')}
              />
              <span>All Transactions</span>
            </label>

            <label className="filter-option">
              <input
                type="radio"
                name="filter-type"
                value="dateRange"
                checked={filterType === 'dateRange'}
                onChange={() => setFilterType('dateRange')}
              />
              <span>Date Range</span>
            </label>

            <label className="filter-option">
              <input
                type="radio"
                name="filter-type"
                value="monthYear"
                checked={filterType === 'monthYear'}
                onChange={() => setFilterType('monthYear')}
              />
              <span>Month/Year</span>
            </label>
          </div>
        </div>

        {/* Date Range Inputs */}
        {filterType === 'dateRange' && (
          <div className="filter-group date-range-group">
            <div className="date-inputs">
              <div className="input-wrapper">
                <label htmlFor="start-date">From</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  max={getToday()}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    if (e.target.value && endDate) {
                      handleDateRangeChange()
                    }
                  }}
                />
              </div>

              <div className="input-wrapper">
                <label htmlFor="end-date">To</label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  max={getToday()}
                  min={startDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    if (startDate && e.target.value) {
                      handleDateRangeChange()
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Month/Year Selects */}
        {filterType === 'monthYear' && (
          <div className="filter-group month-year-group">
            <div className="select-inputs">
              <div className="input-wrapper">
                <label htmlFor="year-select">Year</label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value)
                    setSelectedMonth('')
                  }}
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="input-wrapper">
                <label htmlFor="month-select">Month</label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  disabled={!selectedYear}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value)
                    if (selectedYear && e.target.value) {
                      handleMonthYearChange()
                    }
                  }}
                >
                  <option value="">Select Month</option>
                  {monthsForYear.map(m => (
                    <option key={m.key} value={m.month}>
                      {m.label.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <button
          className="reset-button"
          onClick={handleReset}
          title="Reset all filters"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default DashboardFilters
