import { useState } from 'react'
import '../styles/FiltersPanel.css'
import { getTodayISO, getYearFromISO, getAvailableYears } from '../utils/date'
import { getAvailableMonths } from '../utils/helpers'

/**
 * Reusable Filters Panel Component
 * Used consistently across Dashboard, Transactions, and Reports pages
 * Supports: All Transactions, Date Range, and Month/Year filtering
 */
function FiltersPanel({ transactions, onFilterChange }) {
  const [filterType, setFilterType] = useState('all')
  const [startDate, setStartDate] = useState(getDefaultStartDate())
  const [endDate, setEndDate] = useState(getTodayISO())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  // Helper to get default start date (30 days ago)
  function getDefaultStartDate() {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const availableMonths = getAvailableMonths(transactions)
  const availableYears = getAvailableYears(transactions.map(t => t.dateISO))

  // Notify parent component of filter changes
  const notifyFilterChange = (newFilters) => {
    onFilterChange(newFilters)
  }

  // Handle filter type change
  const handleFilterTypeChange = (newType) => {
    setFilterType(newType)
    
    if (newType === 'all') {
      notifyFilterChange({ type: 'all' })
    } else if (newType === 'dateRange') {
      if (startDate && endDate) {
        notifyFilterChange({
          type: 'dateRange',
          startDate,
          endDate
        })
      }
    } else if (newType === 'monthYear') {
      if (selectedYear && selectedMonth) {
        notifyFilterChange({
          type: 'monthYear',
          year: selectedYear,
          month: selectedMonth
        })
      }
    }
  }

  // Handle start date change
  const handleStartDateChange = (value) => {
    setStartDate(value)
    if (filterType === 'dateRange' && value && endDate) {
      notifyFilterChange({
        type: 'dateRange',
        startDate: value,
        endDate
      })
    }
  }

  // Handle end date change
  const handleEndDateChange = (value) => {
    setEndDate(value)
    if (filterType === 'dateRange' && startDate && value) {
      notifyFilterChange({
        type: 'dateRange',
        startDate,
        endDate: value
      })
    }
  }

  // Handle year change
  const handleYearChange = (value) => {
    const yearNum = parseInt(value)
    setSelectedYear(yearNum)
    setSelectedMonth(new Date().getMonth() + 1) // Reset month when year changes
  }

  // Handle month change
  const handleMonthChange = (value) => {
    const monthNum = parseInt(value)
    setSelectedMonth(monthNum)
    if (filterType === 'monthYear' && selectedYear && monthNum) {
      notifyFilterChange({
        type: 'monthYear',
        year: selectedYear,
        month: monthNum
      })
    }
  }

  // Reset all filters
  const handleReset = () => {
    setFilterType('all')
    setStartDate(getDefaultStartDate())
    setEndDate(getTodayISO())
    setSelectedYear(new Date().getFullYear())
    setSelectedMonth(new Date().getMonth() + 1)
    notifyFilterChange({ type: 'all' })
  }

  return (
    <div className="filters-panel">
      <h3>Filter Transactions</h3>
      
      <div className="filter-controls">
        {/* Filter Type Selection */}
        <div className="filter-control">
          <label htmlFor="filter-type">Filter by:</label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => handleFilterTypeChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Transactions</option>
            <option value="dateRange">Date Range</option>
            <option value="monthYear">Month & Year</option>
          </select>
        </div>

        {/* Date Range Filter */}
        {filterType === 'dateRange' && (
          <>
            <div className="filter-control">
              <label htmlFor="start-date">Start Date:</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-control">
              <label htmlFor="end-date">End Date:</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="filter-input"
              />
            </div>
          </>
        )}

        {/* Month & Year Filter */}
        {filterType === 'monthYear' && (
          <>
            <div className="filter-control">
              <label htmlFor="filter-year">Year:</label>
              <select
                id="filter-year"
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="filter-select"
              >
                {availableYears && availableYears.length > 0 ? (
                  availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))
                ) : (
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                )}
              </select>
            </div>

            <div className="filter-control">
              <label htmlFor="filter-month">Month:</label>
              <select
                id="filter-month"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="filter-select"
              >
                <option value="">-- Select Month --</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const monthNum = i + 1
                  const date = new Date(selectedYear, i)
                  const monthName = date.toLocaleDateString('en-US', { month: 'long' })
                  return (
                    <option key={monthNum} value={monthNum}>
                      {monthName}
                    </option>
                  )
                })}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="filter-actions">
        <button 
          onClick={handleReset}
          className="btn-reset"
          disabled={filterType === 'all'}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FiltersPanel
