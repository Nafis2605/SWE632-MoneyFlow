# MoneyFlow - Personal Budget Planner

A modern, responsive budget planning application built with **React 18** and **Vite**. MoneyFlow helps users manage their monthly income, track expenses, visualize spending patterns, and edit/delete transactions with an intuitive interface.

## 🚀 Live Demo
https://moneyflow-swe632.netlify.app/

## ⚠️ Important Note

**This is a frontend-only prototype with NO backend or data persistence.** All data exists only in the browser's memory and will be lost on page refresh. This is ideal for prototyping and learning purposes. For production use, a backend API and database would need to be implemented.

---

## ✨ Features

### Core Functionality
- 💰 **Set Monthly Income** - Input and manage monthly income with validation
- 📝 **Add Transactions** - Create both income and expense transactions with categories
- ✏️ **Edit Transactions** - Modify existing transactions with a modal dialog
- 🗑️ **Delete Transactions** - Remove transactions instantly with confirmation
- 📊 **Budget Summary** - Real-time overview of income, expenses, and remaining budget
- 📈 **Expense Visualization** - Pie chart and bar chart showing expense distribution by category
- 🚨 **Over-Budget Alerts** - Warning when spending exceeds income
- ♿ **Accessible UI** - Full keyboard navigation and screen reader support
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 📄 **PDF Export** - Export transactions and reports as PDF with embedded charts
- 🔍 **Advanced Filtering** - Filter transactions by type, date range, month, and year
- 📋 **Transaction History** - View all transactions with categories and dates
- 📊 **Analytics Dashboard** - Financial reports with visualization

### Pages & Navigation
- **Home Page** - Add transactions, view budget summary, and recent activity
- **Dashboard** - Filter transactions and view financial overview with charts
- **Transactions** - Browse all transactions grouped by month with edit/delete options
- **Reports** - Detailed financial reports with analytics, filters, and PDF export

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library with functional components and hooks
- **React Router 6.30** - Client-side routing between pages
- **Vite 5.0.8** - Ultra-fast build tool with HMR (Hot Module Replacement)
- **Recharts 3.7** - Lightweight yet powerful charting library
- **jsPDF 4.2 + html2canvas 1.4.1** - PDF generation with embedded charts
- **JavaScript (ES6+)** - Modern JavaScript with destructuring and async/await
- **CSS3** - Custom properties, Flexbox, Grid, and media queries

### Development
- **npm** - Package management
- **ESLint** - Code quality assurance
- **Mobile-first** - Responsive design approach with breakpoints at 768px and 1024px

---

## 📁 Project Structure

```
src/
├── components/                      # React Components (17 files)
│   ├── App.jsx                     # Main application shell
│   ├── Navigation.jsx              # Multi-page navigation
│   ├── Header.jsx                  
│   ├── Logo.jsx
│   ├── TransactionForm.jsx         # Add income/expense form
│   ├── BudgetSummary.jsx           # Budget overview cards
│   ├── RecentTransactions.jsx      # Recent activity with edit/delete
│   ├── IncomeInput.jsx
│   ├── ExpenseForm.jsx
│   ├── ExpenseList.jsx
│   ├── ExpenseVisualization.jsx    # Pie & bar charts
│   ├── EditTransactionModal.jsx    # Edit modal dialog
│   ├── ConfirmModal.jsx            # Confirmation dialogs
│   ├── FiltersPanel.jsx            # Transaction filters
│   ├── TransactionListWithActions.jsx # Reusable transaction list
│   └── LAYOUT_DOCS.js              # Layout documentation
│
├── pages/                           # Page Components (4 pages)
│   ├── HomePage.jsx                # Home/Landing page
│   ├── DashboardPage.jsx           # Analytics dashboard
│   ├── TransactionsPage.jsx        # All transactions view
│   └── ReportsPage.jsx             # Reports & analytics
│
├── hooks/                           # Custom React Hooks
│   └── useBudgetState.js           # Global state management
│
├── models/                          # Data Models & Validation
│   └── budgetModels.js             # Transaction models, validation
│
├── utils/                           # Utility Functions
│   ├── constants.js                # App constants, colors, categories
│   ├── helpers.js                  # General utilities
│   ├── date.js                     # Date utilities
│   ├── categories.js               # Category management
│   ├── filterModel.js              # Transaction filtering logic
│   ├── budgetCalculations.js       # Budget calculations
│   ├── chartUtils.js               # Chart data transformations
│   ├── categoryColors.js           # Deterministic color mapping
│   ├── chartExport.js              # Chart to image conversion
│   └── transactionActions.js       # Edit/delete handler factories
│
├── styles/                          # CSS Stylesheets (14 files)
│   ├── index.css                   # Global styles & CSS variables
│   ├── App.css
│   ├── Header.css
│   ├── HomePage.css
│   ├── DashboardPage.css
│   ├── TransactionsPage.css
│   ├── ReportsPage.css
│   ├── BudgetSummary.css
│   ├── ExpenseForm.css
│   ├── ExpenseList.css
│   ├── ExpenseVisualization.css
│   ├── EditTransactionModal.css
│   ├── ConfirmModal.css
│   └── RecentTransactions.css
│
├── main.jsx                         # React entry point
└── App.jsx                          # Root App component

vite.config.js                       # Vite configuration
package.json                         # Dependencies and scripts
index.html                           # HTML entry point
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** and npm installed on your machine

### Installation & Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/fahim_arsad/Desktop/SWE632-MoneyFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will open automatically at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, optimized and minified for production.

### Preview Production Build Locally

```bash
npm run preview
```

---

## 🏗️ Architecture & State Management

### Data Flow Architecture
```
App (State Root via useBudgetState)
├── HomePage
│   ├── TransactionForm (Add income/expense)
│   ├── BudgetSummary (Display totals)
│   └── RecentTransactions (Show recent + edit/delete)
│
├── DashboardPage
│   ├── FiltersPanel (Filter by type, date)
│   ├── BudgetSummary (Display filtered totals)
│   ├── ExpenseVisualization (Charts)
│   └── TransactionListWithActions (Edit/delete)
│
├── TransactionsPage
│   ├── FiltersPanel
│   └── Transaction list grouped by month (Edit/delete)
│
└── ReportsPage
    ├── FiltersPanel
    ├── ExpenseVisualization
    ├── Transaction details
    └── PDF Export button
```

### State Management - useBudgetState Hook
The `useBudgetState` hook centralizes all budget state management:

**State:**
- `transactions[]` - Array of all transaction objects
- `totalIncome` - Sum of all income transactions
- `totalExpenses` - Sum of all expense transactions
- `remainingBudget` - Income minus expenses

**Actions:**
- `addIncome(description, category, amount, date)` - Add income
- `addExpense(description, category, amount, date)` - Add expense
- `updateTransaction(id, description, category, amount, dateISO)` - Update transaction
- `deleteTransaction(id)` - Delete transaction
- `deleteIncome(id)` / `deleteExpense(id)` - Convenience methods

**Features:**
- Immutable state updates (creates new arrays)
- Validation before changes
- Computed properties automatically calculated
- All changes cascade across all pages instantly

### Transaction Object Structure
```javascript
{
  id: "unique-id",
  type: "income" | "expense",
  description: "Transaction name",
  category: "salary" | "groceries" | etc,
  amount: 250.50,
  dateISO: "2026-03-02"  // ISO format to avoid timezone issues
}
```

---

## 🎨 Color Palette & Theming

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary | Blue | `#5367AB` | Buttons, links, headings, borders |
| Secondary | Light Blue | `#E8F0F8` | Backgrounds, hover states |
| Warning/Alert | Gold | `#f9c74f` | Expenses, alerts, warnings |
| Success | Green | `#008000` | Income, positive values |
| Danger | Red | `#dc3545` | Delete, error states |
| Text Primary | Dark Gray | `#333333` | Main text, headings |
| Text Secondary | Gray | `#666666` | Secondary text |
| Background | White | `#ffffff` | Card backgrounds |
| Border | Light Gray | `#e5e7eb` | Dividers, borders |

**CSS Custom Properties** (defined in `index.css`):
All colors are defined as `--color-*` variables for easy theming.

---

## 📊 Categories & Classification

### Income Categories
- Salary
- Freelance
- Investment
- Bonus
- Gift
- Other

### Expense Categories
- Groceries
- Transportation
- Utilities
- Entertainment
- Healthcare
- Dining
- Shopping
- Rent/Mortgage
- Insurance
- Education
- Other

Each category has a **deterministic color** mapping for consistent visualization across all charts.

---

## 🔧 Edit & Delete Functionality

### Edit Transaction Flow
1. Click the **Edit icon (pencil)** button on any transaction
2. `EditTransactionModal` opens with pre-filled values from current transaction
3. Modify any field: description, category, amount, date
4. Click **Update** button
5. Confirmation modal appears asking to confirm changes
6. Click **Confirm Update** to save
7. Modal closes and all pages update instantly with new data

### Delete Transaction Flow
1. Click the **Delete icon (trash)** button on any transaction
2. `ConfirmModal` appears asking to confirm deletion
3. Click **Delete** to remove transaction
4. Transaction deleted instantly
5. All pages update with new totals and visualizations

### Supported on All Pages
- Home Page - Recent Transactions section
- Dashboard Page - Transaction List
- Transactions Page - All transactions grouped by month
- Reports Page - Transaction Details section

---

## 📄 PDF Export Feature

### What Gets Exported
- Transaction summary (income, expenses, net balance)
- Transaction list with all details (date, description, category, amount)
- Pie chart (expense breakdown by category)
- Export date and filter criteria used

### How to Use
1. Navigate to **Reports** page
2. Use **Filters** to select date range or month/year
3. Click **Export as PDF** button
4. PDF downloads with filename like `transactions_2026-03-02.pdf`

### PDF Contents
- Header with transaction count and filter info
- Budget summary cards (income, expenses, balance)
- Embedded pie chart visualization
- Detailed transaction table
- Professional styling and formatting

---

## 🎯 Use Cases

### Personal Budget Management
Set monthly income and track expenses throughout the month with real-time budget updates.

### Expense Analysis
View pie and bar charts to identify spending patterns by category.

### Quick Edits
Quickly modify transaction details without losing data.

### Safe Deletions
Delete transactions with confirmation to prevent accidental removals.

### Financial Reporting
Export detailed reports to PDF for record-keeping or sharing.

### Multi-period Analysis
Compare spending across different months and date ranges.

---

## 🧪 Testing the Application

### Basic Workflow
1. Add an income transaction (e.g., "$2000 Salary")
2. Add several expense transactions across different categories
3. Verify budget summary updates correctly
4. Check pie chart shows correct category breakdown
5. Test edit functionality:
   - Click edit on a transaction
   - Change description/amount
   - Confirm update works
6. Test delete functionality:
   - Click delete on a transaction
   - Confirm it removes the transaction
7. Verify all pages reflect changes

### Responsive Design Testing
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at breakpoints: 375px (mobile), 768px (tablet), 1024px+ (desktop)
4. Verify layout adjusts properly and all buttons are clickable

### Filter Testing
1. On Dashboard or Reports page, use the FiltersPanel
2. Filter by date range, month/year, or transaction type
3. Verify charts and totals update to match filters

### PDF Export Testing
1. Go to Reports page
2. Apply some filters (optional)
3. Click "Export as PDF"
4. Verify PDF opens with correct data and embedded chart

---

## 🔗 Key Files Reference

| File | Purpose |
|------|---------|
| `useBudgetState.js` | Central state management hook |
| `transactionActions.js` | Handler factories for edit/delete operations |
| `EditTransactionModal.jsx` | Transaction editing modal component |
| `ConfirmModal.jsx` | Confirmation dialog for delete/update actions |
| `chartUtils.js` | Chart data preparation and transformation |
| `categoryColors.js` | Deterministic color mapping for categories |
| `filterModel.js` | Transaction filtering logic |
| `chartExport.js` | Chart-to-image conversion for PDF export |

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Latest ✅ |
| Firefox | Latest ✅ |
| Safari | Latest ✅ |
| Edge | Latest ✅ |
| Mobile Chrome | Latest ✅ |
| Mobile Safari | Latest ✅ |

---

## 📈 Performance Metrics

- **Initial Load**: ~1-2 seconds
- **Interaction Response**: < 100ms (instant)
- **Chart Rendering**: < 500ms
- **PDF Generation**: 1-3 seconds
- **Bundle Size**: ~150KB gzipped
- **Zero External API Calls**: All processing client-side

---

## 🚀 Future Enhancement Possibilities

To convert this to a production application, these features could be added:

- Backend API for data persistence (Node.js + Express)
- User authentication (JWT/OAuth)
- Cloud database (MongoDB, PostgreSQL)
- Budget goals and savings targets
- Recurring transactions
- Multiple currency support
- Mobile app (React Native)
- Dark mode theme
- Email notifications
- Multi-user/shared budgets
- Custom categories
- Receipt image uploads
- Voice input for transactions
- Advanced analytics and forecasting

---

## 📝 Development Guidelines

### Adding a New Component
1. Create component in `src/components/ComponentName.jsx`
2. Create corresponding CSS in `src/styles/ComponentName.css`
3. Use PascalCase for component names
4. Use functional components with hooks
5. Add prop validation with JSDoc comments

### Adding a New Utility Function
1. Create or update file in `src/utils/`
2. Use camelCase for function names
3. Add JSDoc documentation
4. Export individual functions
5. Test with sample data

### Styling Best Practices
- Use CSS custom properties for colors
- Follow mobile-first responsive design
- Use Flexbox for layout
- Test at multiple breakpoints
- Ensure sufficient color contrast (WCAG AA)

### State Management
- Keep state in the root `useBudgetState` hook
- Pass data down via props
- Use callback props for child-to-parent communication
- Make all state updates immutable

---

## 📚 npm Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production (creates `dist/` folder) |
| `npm run preview` | Preview production build locally |
| `npm install` | Install dependencies |

---

## 📄 License

This is an educational project created for **SWE632 coursework** at George Mason University.

---

## 👨‍💻 Author & History

**Developed**: February-March 2026 as a React learning project

**Latest Updates**:
- ✅ Added edit/delete transaction functionality to all pages
- ✅ Implemented EditTransactionModal with pre-filled values
- ✅ Added confirmation modals for safety
- ✅ Enhanced filtering capabilities
- ✅ Fixed state synchronization across all pages
- ✅ Added PDF export with embedded charts
- ✅ Responsive design optimized for mobile/tablet/desktop

---

## 🆘 Common Issues & Solutions

### Issue: Data disappears on page refresh
**Solution**: This is expected - the app has no backend. Data exists only during the browser session.

### Issue: Edit button shows blank modal
**Solution**: Ensure transaction object has all required properties (id, type, description, category, amount, dateISO)

### Issue: Charts not showing
**Solution**: Ensure you have expense transactions. Charts only appear when there's data to display.

### Issue: PDF export not working
**Solution**: Charts must be visible on the page. Wait for charts to fully render before exporting.

### Issue: Responsive layout broken on mobile
**Solution**: Check browser DevTools device emulation. Clear cache and hard refresh (Ctrl+Shift+R).

---

## 🤝 Contributing

This is an educational project. For improvements or bug fixes:
1. Make changes to the code
2. Test thoroughly
3. Verify responsive design
4. Build and preview before committing

---

**For implementation details, see the source code files with comprehensive JSDoc documentation in each component and utility.**
