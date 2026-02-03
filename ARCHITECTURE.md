# Code Architecture

## Single Responsibility Principle
Each component handles one specific responsibility:
- **IncomeInput** - Only handles income input
- **ExpenseForm** - Only handles adding new expenses
- **ExpenseList** - Only displays and deletes expenses
- **BudgetSummary** - Only shows budget overview
- **ExpenseVisualization** - Only displays charts

## Data Flow
```
App (State Management via useBudgetState)
├── IncomeInput (set income)
├── ExpenseForm (add expenses)
├── ExpenseList (delete expenses)
├── BudgetSummary (display summary)
└── ExpenseVisualization (show charts)
```

## State Management
- **useBudgetState hook** - Centralized state management for all budget data
- **Immutable updates** - All state changes create new arrays/objects
- **Computed values** - totalExpenses and remainingBudget calculated automatically

## Validation
- **Model layer** - `budgetModels.js` handles all validation logic
- **Component layer** - Components disable buttons for invalid inputs
- **User feedback** - Clear error messages with visual styling

## Utility Functions

### Budget Calculations (budgetCalculations.js)
- `calculateBudgetPercentage(totalExpenses, income)` - Returns percentage of budget used
- `isOverBudget(remainingBudget)` - Checks if spending exceeds income
- `getOverBudgetAmount(remainingBudget)` - Returns amount over budget

### Chart Data Transformations (chartUtils.js)
- `preparePieChartData(expenses)` - Formats expenses for pie chart
- `prepareBarChartData(expenses)` - Formats and sorts expenses for bar chart (top 10)
- `calculateExpenseStats(expenses)` - Calculates total, average, highest, and count

## Component Descriptions

### App.jsx
Main application component that manages the layout and integrates all child components. Uses the `useBudgetState` hook to manage budget data and passes necessary props to children.

### Header.jsx
Displays the application header with logo and branding.

### Logo.jsx
Wallet icon component representing the application brand.

### IncomeInput.jsx
Form component for setting monthly income. Includes validation and disabled state management.

### ExpenseForm.jsx
Form component for adding new expenses with name and amount fields. Includes validation and error messages.

### ExpenseList.jsx
Displays a list of all added expenses with delete buttons for each expense.

### BudgetSummary.jsx
Shows income, total expenses, remaining budget, and a progress bar indicating budget usage percentage. Displays warnings when budget is exceeded.

### ExpenseVisualization.jsx
Displays both pie and bar charts for expense visualization along with statistics (total, count, average, highest).

## Project Structure

```
src/
├── components/              # React components
│   ├── App.jsx             # Main application component
│   ├── Header.jsx          # Application header
│   ├── Logo.jsx            # Logo component
│   ├── IncomeInput.jsx     # Income input form
│   ├── ExpenseForm.jsx     # Expense form
│   ├── ExpenseList.jsx     # Expense list display
│   ├── BudgetSummary.jsx   # Budget overview
│   └── ExpenseVisualization.jsx # Charts and stats
│
├── hooks/                   # Custom React hooks
│   └── useBudgetState.js   # Budget state management
│
├── models/                  # Data models
│   └── budgetModels.js     # Validation functions
│
├── utils/                   # Utility functions
│   ├── constants.js        # App constants
│   ├── helpers.js          # Helper utilities
│   ├── budgetCalculations.js # Budget math
│   └── chartUtils.js       # Chart transformations
│
└── styles/                  # CSS stylesheets
    ├── index.css           # Global styles
    ├── App.css             # App layout
    ├── Header.css          # Header styles
    ├── IncomeInput.css     # Income form styles
    ├── ExpenseForm.css     # Expense form styles
    ├── ExpenseList.css     # List styles
    ├── BudgetSummary.css   # Summary styles
    └── ExpenseVisualization.css # Chart styles
```

## Design Patterns

### Hooks Pattern
- Uses React Hooks exclusively (useState, useCallback)
- No class components
- Custom hooks for state management

### Immutable State Updates
- Spread operator for object/array updates
- Array methods like map() and filter() for transformations
- No direct state mutations

### Separation of Concerns
- Utility functions for business logic
- Components for UI rendering
- Models for data validation
- Hooks for state management

## Development Guidelines

### Adding a New Component
1. Create component in `src/components/`
2. Create corresponding CSS file in `src/styles/`
3. Follow naming conventions (PascalCase for components)
4. Use functional components with hooks only
5. Pass data via props, don't access global state directly
6. Include error handling and validation

### Naming Conventions
- **Components**: PascalCase (e.g., `IncomeInput.jsx`)
- **Utilities**: camelCase (e.g., `budgetCalculations.js`)
- **Hooks**: camelCase starting with `use` (e.g., `useBudgetState`)
- **Functions**: camelCase (e.g., `calculateBudgetPercentage()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CHART_COLORS`)
- **CSS files**: kebab-case (e.g., `expense-form.css`)
- **CSS classes**: kebab-case (e.g., `.expense-form-container`)

### Code Quality
- Keep components under 150 lines
- Extract complex logic to utility functions
- Use descriptive variable and function names
- Add comments for non-obvious logic
- Follow the single-responsibility principle
