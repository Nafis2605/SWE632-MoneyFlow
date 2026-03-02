/**
 * State management hooks and utilities for Budget Planner
 * Handles immutable state updates following React best practices
 * Uses transaction-based system for both income and expenses
 */

import { useState, useCallback } from 'react'
import {
  createTransaction,
  validateTransaction,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBudget,
  filterTransactionsByType
} from '../models/budgetModels'

/**
 * Custom hook for managing budget state with transactions
 * Ensures immutable state updates and provides actions for state management
 * @returns {Object} Budget state and action methods
 */
export const useBudgetState = () => {
  const [transactions, setTransactions] = useState([])

  /**
   * Add a new income transaction
   * Creates immutable copy of transactions array
   */
  const addIncome = useCallback((title, amount, date = new Date()) => {
    const validation = validateTransaction(title, amount)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const newIncome = createTransaction('income', title, amount, date)
    setTransactions(prevTransactions => [...prevTransactions, newIncome])
    return { success: true, transaction: newIncome }
  }, [])

  /**
   * Add a new expense transaction
   * Creates immutable copy of transactions array
   */
  const addExpense = useCallback((title, amount, date = new Date()) => {
    const validation = validateTransaction(title, amount)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    const newExpense = createTransaction('expense', title, amount, date)
    setTransactions(prevTransactions => [...prevTransactions, newExpense])
    return { success: true, transaction: newExpense }
  }, [])

  /**
   * Update an existing transaction
   * Creates immutable copy of transactions array with updated item
   */
  const updateTransaction = useCallback((id, title, amount) => {
    const validation = validateTransaction(title, amount)
    if (!validation.isValid) {
      return { success: false, errors: validation.errors }
    }

    setTransactions(prevTransactions =>
      prevTransactions.map(transaction =>
        transaction.id === id
          ? { ...transaction, title: title.trim(), amount: Math.max(0, parseFloat(amount)) }
          : transaction
      )
    )
    return { success: true }
  }, [])

  /**
   * Delete a transaction by id
   * Creates immutable copy of transactions array without the deleted item
   */
  const deleteTransaction = useCallback((id) => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(transaction => transaction.id !== id)
    )
    return { success: true }
  }, [])

  /**
   * Delete an expense (convenience method)
   */
  const deleteExpense = useCallback((id) => {
    return deleteTransaction(id)
  }, [deleteTransaction])

  /**
   * Delete an income (convenience method)
   */
  const deleteIncome = useCallback((id) => {
    return deleteTransaction(id)
  }, [deleteTransaction])

  /**
   * Clear all transactions
   * Useful for starting fresh
   */
  const clearTransactions = useCallback(() => {
    setTransactions([])
    return { success: true }
  }, [])

  /**
   * Clear all expenses only
   */
  const clearExpenses = useCallback(() => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(transaction => transaction.type !== 'expense')
    )
    return { success: true }
  }, [])

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setTransactions([])
    return { success: true }
  }, [])

  // Computed values derived from transactions
  const income = calculateTotalIncome(transactions)
  const expenses = filterTransactionsByType(transactions, 'expense')
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpenses = calculateTotalExpenses(transactions)
  const remainingBudget = calculateNetBudget(transactions)
  const incomeTransactions = filterTransactionsByType(transactions, 'income')

  return {
    // State
    transactions,
    income,
    expenses,
    incomeTransactions,
    totalIncome,
    totalExpenses,
    remainingBudget,
    
    // Income actions
    addIncome,
    deleteIncome,
    
    // Expense actions
    addExpense,
    deleteExpense,
    
    // General transaction actions
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    clearExpenses,
    reset
  }
}
