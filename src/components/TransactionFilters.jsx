import { useState } from 'react'
import '../styles/TransactionFilters.css'
import { getTodayISO, getYearFromISO, getAvailableYears } from '../utils/date'
import { getAvailableMonths } from '../utils/helpers'

function TransactionFilters({ transactions, onFilterChange }) {
  const [filterType, setFilterType] = useState('all') // 'all', 'dateRange', 'monthYear'
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

  const handleFilterChange = () => {
    onFilterChange({
      type: filterType,
      startDate: filterType === 'dateRange' ? startDate : null,
      endDate: filterType === 'dateRange' ? endDate : null,
      year: filterType === 'monthYear' ? selectedYear : null,
      month: filterType === 'monthYear' ? selectedMonth : null
    })
  }

  const handleReset = () => {
    setFilterType('all')
    setStartDate(getDefaultStartDate())
    setEndDate(getTodayISO())
    setSelectedYear(new Date().getFullYear())
    setSelectedMonth(new Date().getMonth() + 1)
    onFilterChange({ type: 'all' })
  }

  // Update filter when any value changes
  const updateFilter = (updates) => {
    const newState = { ...updates }
    if (newState.filterType !== undefined) setFilterType(newState.filterType)
    if (newState.startDate !== undefined) setStartDate(newState.startDate)
    if (newState.endDate !== undefined) setEndDate(newState.endDate)
    if (newState.selectedYear !== undefined) setSelectedYear(newState.selectedYear)
    if (newState.selectedMonth !== undefined) setSelectedMonth(newState.selectedMonth)
    
    // Trigger filter change after state updates
    setTimeout(() => {
      const updatedType = newState.filterType || filterType
      onFilterChange({
        type: updatedType,
        startDate: updatedType === 'dateRange' ? (newState.startDate || startDate) : null,
        endDate: updatedType === 'dateRange' ? (newState.endDate || endDate) : null,
        year: updatedType === 'monthYear' ? (newState.selectedYear || selectedYear) : null,
        month: updatedType === 'monthYear' ? (newState.selectedMonth || selectedMonth) : null
      })
    }, 0)
  }

  return (
    <div className="transaction-filters">
      <h3>Filter Transactions</h3>
      
      <div className="filter-options">
        {/* Filter Type Selection */}
        <div className="filter-control">
          <label htmlFor="filter-type">Filter by:</label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => updateFilter({ filterType: e.target.value })}
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
                onChange={(e) => updateFilter({ startDate: e.target.value })}
                className="filter-input"
              />
            </div>

            <div className="filter-control">
              <label htmlFor="end-date">End Date:</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => updateFilter({ endDate: e.target.value })}
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
                onChange={(e) => updateFilter({ selectedYear: parseInt(e.target.value) })}
                className="filter-select"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-control">
              <label htmlFor="filter-month">Month:</label>
              <select
                id="filter-month"
                value={selectedMonth}
                onChange={(e) => updateFilter({ selectedMonth: parseInt(e.target.value) })}
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
          className="btn-secondary"
          disabled={filterType === 'all'}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default TransactionFilters
