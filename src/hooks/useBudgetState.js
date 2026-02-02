/**
 * State management hooks and utilities for Budget Planner
 * Handles immutable state updates following React best practices
 */

import { useState, useCallback } from 'react'
import {
  createExpense,
  validateExpense,
  validateIncome,
  calculateTotalExpenses,
  calculateRemainingBudget
} from '../models/budgetModels'

/**
 * Custom hook for managing budget state
 * Ensures immutable state updates and provides actions for state management
 * @param {number} initialIncome - Initial income value
 * @returns {Object} Budget state and action methods
 */
export const useBudgetState = (initialIncome = 0) => {
  const [income, setIncome] = useState(initialIncome)
  const [expenses, setExpenses] = useState([])

  /**
   * Add a new expense
   * Creates immutable copy of expenses array
   */
  const addExpense = useCallback((name, amount) => {
    const validation = validateExpense(name, amount)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const newExpense = createExpense(name, amount)
    setExpenses(prevExpenses => [...prevExpenses, newExpense])
    return { success: true, expense: newExpense }
  }, [])

  /**
   * Update an existing expense
   * Creates immutable copy of expenses array with updated item
   */
  const updateExpense = useCallback((id, name, amount) => {
    const validation = validateExpense(name, amount)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === id
          ? { ...expense, name: name.trim(), amount: Math.max(0, parseFloat(amount)) }
          : expense
      )
    )
    return { success: true }
  }, [])

  /**
   * Delete an expense by id
   * Creates immutable copy of expenses array without the deleted item
   */
  const deleteExpense = useCallback((id) => {
    setExpenses(prevExpenses =>
      prevExpenses.filter(expense => expense.id !== id)
    )
    return { success: true }
  }, [])

  /**
   * Update monthly income
   * Validates income before updating
   */
  const setMonthlyIncome = useCallback((amount) => {
    const validation = validateIncome(amount)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    setIncome(Math.max(0, parseFloat(amount)))
    return { success: true }
  }, [])

  /**
   * Clear all expenses
   * Useful for starting fresh
   */
  const clearExpenses = useCallback(() => {
    setExpenses([])
    return { success: true }
  }, [])

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setIncome(initialIncome)
    setExpenses([])
    return { success: true }
  }, [initialIncome])

  // Computed values
  const totalExpenses = calculateTotalExpenses(expenses)
  const remainingBudget = calculateRemainingBudget(income, totalExpenses)

  return {
    // State
    income,
    expenses,
    totalExpenses,
    remainingBudget,
    
    // Actions
    addExpense,
    updateExpense,
    deleteExpense,
    setMonthlyIncome,
    clearExpenses,
    reset
  }
}
