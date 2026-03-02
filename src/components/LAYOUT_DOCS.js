/**
 * Layout and Page Structure Documentation
 * 
 * App Layout Visualization:
 * 
 * ┌─────────────────────────────────────────────────────┐
 * │  HEADER (Navigation & Logo)                         │
 * ├─────────────────────────────────────────────────────┤
 * │                                                       │
 * │  Page Title & Description                           │
 * │  "Budget Planner"                                   │
 * │  "Manage your income and expenses..."               │
 * │                                                       │
 * ├─────────────────────────┬───────────────────────────┤
 * │   INPUT COLUMN          │   CONTENT COLUMN          │
 * │   (Left - Narrower)     │   (Right - Wider)         │
 * │                         │                           │
 * │  ┌─────────────────┐    │  ┌─────────────────────┐  │
 * │  │ Income Input    │    │  │ Budget Summary      │  │
 * │  │ • Input field   │    │  │ • 3 Summary Cards   │  │
 * │  │ • Set Button    │    │  │ • Progress Bar      │  │
 * │  └─────────────────┘    │  │ • Budget Warning    │  │
 * │                         │  └─────────────────────┘  │
 * │  ┌─────────────────┐    │                           │
 * │  │ Expense Form    │    │  ┌─────────────────────┐  │
 * │  │ • Name input    │    │  │ Expense List        │  │
 * │  │ • Amount input  │    │  │ • List of expenses  │  │
 * │  │ • Add button    │    │  │ • Delete buttons    │  │
 * │  │ • Error display │    │  │ • Empty state       │  │
 * │  └─────────────────┘    │  └─────────────────────┘  │
 * │                         │                           │
 * └─────────────────────────┴───────────────────────────┘
 * │  FOOTER (if needed)                                 │
 * └─────────────────────────────────────────────────────┘
 * 
 * 
 * RESPONSIVE BEHAVIOR:
 * 
 * Desktop (1024px+):
 *   - 2-column layout
 *   - Left: 1fr (narrower)
 *   - Right: 1.2fr (slightly wider)
 *   - Side-by-side input and content
 * 
 * Tablet (768px - 1023px):
 *   - 1-column layout
 *   - Full width stacked sections
 *   - All sections at equal width
 * 
 * Mobile (< 768px):
 *   - 1-column layout
 *   - Adjusted padding and font sizes
 *   - Touch-friendly button sizes
 * 
 * 
 * COMPONENT HIERARCHY:
 * 
 * App (Main Container)
 * ├── Header
 * ├── MainContent
 * │   ├── PageHeader
 * │   │   ├── h1 (Title)
 * │   │   └── p (Description)
 * │   │
 * │   └── LayoutContainer (Grid Layout)
 * │       ├── InputColumn (Left)
 * │       │   ├── SectionWrapper
 * │       │   │   └── IncomeInput
 * │       │   │       ├── h2
 * │       │   │       └── Form
 * │       │   │           ├── FormGroup (Income Input)
 * │       │   │           └── Button (Set Income)
 * │       │   │
 * │       │   └── SectionWrapper
 * │       │       └── ExpenseForm
 * │       │           ├── h2
 * │       │           └── Form
 * │       │               ├── FormGroup (Name)
 * │       │               ├── FormGroup (Amount)
 * │       │               └── Button (Add Expense)
 * │       │
 * │       └── ContentColumn (Right)
 * │           ├── SectionWrapper
 * │           │   └── BudgetSummary
 * │           │       ├── h2
 * │           │       ├── SummaryGrid
 * │           │       │   ├── SummaryCard (Income)
 * │           │       │   ├── SummaryCard (Expenses)
 * │           │       │   └── SummaryCard (Remaining)
 * │           │       └── BudgetVisualization
 * │           │           ├── ProgressLabel
 * │           │           ├── ProgressBar
 * │           │           └── WarningText
 * │           │
 * │           └── SectionWrapper
 * │               └── ExpenseList
 * │                   ├── h2
 * │                   └── ExpensesList
 * │                       ├── ExpenseItem
 * │                       │   ├── ExpenseContent
 * │                       │   │   ├── ExpenseName
 * │                       │   │   └── ExpenseAmount
 * │                       │   └── DeleteButton
 * │                       └── ... (multiple items)
 * 
 * 
 * CSS LAYOUT SYSTEM:
 * 
 * Main Layout Container:
 *   display: grid
 *   grid-template-columns: 1fr 1.2fr
 *   gap: var(--spacing-lg)
 * 
 * Section Columns:
 *   display: flex
 *   flex-direction: column
 *   gap: var(--spacing-lg)
 * 
 * Section Wrappers:
 *   background: white
 *   padding: var(--spacing-lg)
 *   border-radius: var(--border-radius)
 *   box-shadow: var(--shadow-md)
 * 
 * Form Groups:
 *   display: flex
 *   flex-direction: column
 *   gap: var(--spacing-md)
 * 
 * Summary Grid:
 *   display: grid
 *   grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))
 *   gap: var(--spacing-md)
 * 
 * Progress Bar:
 *   height: 24px
 *   background: linear-gradient(90deg, #dc2626 (red), #16a34a (green))
 *   border-radius: 12px
 * 
 * 
 * COLOR USAGE (SEMANTIC):
 * 
 * Primary (#5367AB):
 *   - Brand/UI elements
 *   - Buttons
 *   - Navigation
 * 
 * Income (#16a34a - Green):
 *   - Income amounts and values
 *   - Income badges and labels
 *   - Positive balance (if budget not exceeded)
 *   - Progress bar (right side - good spending)
 * 
 * Expense (#dc2626 - Red):
 *   - Expense amounts and values
 *   - Expense badges and labels
 *   - Over-budget warnings
 *   - Progress bar (left side - spending)
 * 
 * Error/Negative (#dc2626 - Red):
 *   - Negative balance
 *   - Errors
 *   - Warnings
 * 
 * Light (#f8f9fa):
 *   - Background
 *
 * 
 * SPACING HIERARCHY:
 * 
 * xs: 0.25rem - tiny gaps
 * sm: 0.5rem  - small form gaps
 * md: 1rem    - section padding, input padding
 * lg: 1.5rem  - main gaps, card padding
 * xl: 2rem    - page margins, section separation
 * 
 * 
 * STATE FLOW:
 * 
 * App Component
 * ├── useBudgetState Hook
 * │   ├── State: income, expenses
 * │   ├── Computed: totalExpenses, remainingBudget
 * │   └── Actions: add, update, delete, setIncome, clear, reset
 * │
 * └── Pass Props Down
 *     ├── IncomeInput ← onIncomeChange={setMonthlyIncome}
 *     ├── ExpenseForm ← onAddExpense={addExpense}
 *     ├── BudgetSummary ← income, totalExpenses, remainingBudget
 *     └── ExpenseList ← expenses, onDeleteExpense={deleteExpense}
 * 
 * 
 * INTERACTION FLOW:
 * 
 * 1. User enters income → IncomeInput
 *    └─→ calls onIncomeChange
 *    └─→ useBudgetState validates and updates
 *    └─→ BudgetSummary re-renders with new values
 * 
 * 2. User fills expense form → ExpenseForm
 *    └─→ calls onAddExpense
 *    └─→ useBudgetState validates and adds to list
 *    └─→ ExpenseList and BudgetSummary re-render
 * 
 * 3. User clicks delete button → ExpenseList
 *    └─→ calls onDeleteExpense
 *    └─→ useBudgetState removes from list
 *    └─→ All sections update accordingly
 * 
 */

export const LAYOUT_DOCUMENTATION = {
  description: "App layout uses CSS Grid for 2-column design",
  responsive: {
    desktop: "1024px+ → 2-column grid (1fr, 1.2fr)",
    tablet: "768px - 1023px → 1-column stack",
    mobile: "< 768px → 1-column stack with adjusted spacing"
  },
  sections: {
    inputColumn: "Left column: Income input and expense form",
    contentColumn: "Right column: Budget summary and expenses list"
  },
  styling: {
    approach: "CSS Grid + Flexbox",
    colorPalette: "4 colors from design spec",
    spacing: "CSS custom properties for consistency",
    responsive: "Media queries for breakpoints"
  }
}
