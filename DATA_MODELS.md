DATA MODELS & STATE MANAGEMENT - MoneyFlow
==========================================

OVERVIEW
--------
This document describes the core data models and global state management for the MoneyFlow budget planner application.

DATA MODELS
-----------

1. Expense Object
   Properties:
   - id (string): Unique identifier generated with timestamp + random string
   - name (string): Description/name of the expense (max 100 characters)
   - amount (number): Cost amount in dollars (must be positive)

   Example:
   {
     id: "1706900000000-abc123def",
     name: "Grocery Shopping",
     amount: 75.50
   }

2. Budget State Object
   Properties:
   - income (number): Monthly income amount (must be >= 0)
   - expenses (Expense[]): Array of expense objects

   Example:
   {
     income: 5000,
     expenses: [
       { id: "1...", name: "Rent", amount: 1500 },
       { id: "2...", name: "Utilities", amount: 200 }
     ]
   }

GLOBAL STATE MANAGEMENT
-----------------------

The App uses the custom hook `useBudgetState` to manage global budget state:

Location: src/hooks/useBudgetState.js
Used in: src/App.jsx (top-level component)

State Variables:
- income (number): Current monthly income
- expenses (Expense[]): List of all expenses

Computed Values:
- totalExpenses: Sum of all expense amounts
- remainingBudget: income - totalExpenses

IMMUTABLE STATE UPDATES
-----------------------

All state updates follow React best practices using immutable patterns:

1. addExpense(name, amount)
   - Creates new expense with unique ID
   - Returns immutable new array: [...prevExpenses, newExpense]
   - Validates input before updating
   - Returns: { success: boolean, expense?: Expense, errors?: string[] }

2. updateExpense(id, name, amount)
   - Creates new array with updated expense
   - Returns: prevExpenses.map(expense => expense.id === id ? {...updated} : expense)
   - Preserves other expenses unchanged
   - Returns: { success: boolean, errors?: string[] }

3. deleteExpense(id)
   - Creates new array without deleted expense
   - Returns: prevExpenses.filter(expense => expense.id !== id)
   - Returns: { success: boolean }

4. setMonthlyIncome(amount)
   - Updates income with validation
   - Returns: { success: boolean, errors?: string[] }

5. clearExpenses()
   - Resets expenses array to empty
   - Returns: { success: boolean }

6. reset()
   - Resets to initial state
   - Returns: { success: boolean }

HELPER FUNCTIONS
----------------

Location: src/models/budgetModels.js

Core Functions:
- createExpense(name, amount): Creates new expense object with ID
- generateId(): Generates unique ID for expenses
- calculateTotalExpenses(expenses): Sums all expense amounts
- calculateRemainingBudget(income, totalExpenses): Calculates budget surplus/deficit
- calculateExpensePercentage(amount, income): Calculates expense as % of income
- validateExpense(name, amount): Validates expense data
- validateIncome(income): Validates income data

USAGE EXAMPLE
-------------

import { useBudgetState } from './hooks/useBudgetState'

function MyComponent() {
  // Initialize with optional initial income
  const budget = useBudgetState(5000)

  // Add expense
  const result = budget.addExpense("Rent", 1500)
  if (result.success) {
    console.log("Expense added:", result.expense)
  } else {
    console.error("Validation errors:", result.errors)
  }

  // Access state
  console.log("Income:", budget.income)
  console.log("Total Expenses:", budget.totalExpenses)
  console.log("Remaining Budget:", budget.remainingBudget)
  console.log("All Expenses:", budget.expenses)

  // Update expense
  budget.updateExpense(expenseId, "New Name", 2000)

  // Delete expense
  budget.deleteExpense(expenseId)

  // Set income
  budget.setMonthlyIncome(6000)

  // Clear/Reset
  budget.clearExpenses()
  budget.reset()
}

VALIDATION RULES
----------------

Expense Name:
- Required (must not be empty)
- Max 100 characters
- Trimmed of whitespace

Expense Amount:
- Required
- Must be a valid number
- Must be >= 0
- Negative values are converted to 0

Monthly Income:
- Must be a valid number
- Must be >= 0

ARCHITECTURAL BENEFITS
----------------------

1. Immutability: All state updates create new objects/arrays
   - Prevents accidental mutations
   - Enables React's efficient re-rendering
   - Makes debugging easier

2. Centralized State: Top-level component manages all state
   - Single source of truth
   - Easy to pass down to child components
   - Preparation for future context/Redux migration

3. Validation: Input validation prevents invalid states
   - Data consistency guaranteed
   - Error feedback to users
   - Type safety (JSDoc)

4. Scalability: Hooks pattern allows easy extraction
   - Can be converted to Context API if needed
   - Can be converted to Redux if needed
   - Reusable across components

NEXT STEPS
----------

To use these models and state in your application:

1. Import useBudgetState in App.jsx (already done)
2. Create expense input component to call addExpense()
3. Create income input component to call setMonthlyIncome()
4. Pass budget state to child components via props
5. Handle validation errors gracefully in UI
6. Display computed values (totalExpenses, remainingBudget)

Future Enhancements:
- Add categories to expenses
- Add budget goals/limits by category
- Add expense history/archiving
- Add recurring expenses
- Add currency support
- Add local storage persistence
