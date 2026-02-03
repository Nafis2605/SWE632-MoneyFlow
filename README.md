# MoneyFlow - Personal Budget Planner

A modern, responsive budget planning application built with React and Vite. MoneyFlow helps users manage their monthly income, track expenses, and visualize their spending patterns with an intuitive interface.

## ⚠️ Important Note

**This is a frontend-only prototype with NO backend or data persistence.** All data exists only in the browser's memory and will be lost on page refresh. This is ideal for prototyping and learning purposes. For production use, a backend API and database would need to be implemented.

## Features

### Core Functionality
- 💰 **Set Monthly Income** - Input and manage monthly income with validation
- 📝 **Add Expenses** - Create expenses with name and amount
- 🗑️ **Delete Expenses** - Remove individual expenses instantly
- 📊 **Budget Summary** - Real-time overview of income, expenses, and remaining budget
- 📈 **Expense Visualization** - Pie chart and bar chart showing expense distribution
- 🚨 **Over-Budget Alerts** - Warning when spending exceeds income
- ♿ **Accessible UI** - Full keyboard navigation and screen reader support
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### User Experience
- Disabled buttons for invalid inputs
- Clear error messages with visual feedback
- Smooth, non-intrusive transitions
- Consistent spacing and alignment
- Professional color scheme with proper contrast
- Real-time calculations and updates

## Use Cases

### Personal Budget Management
Users can set their monthly income and track all expenses throughout the month, seeing their remaining budget update in real-time.

### Expense Analysis
The visualization component provides pie charts showing expense breakdown by category and bar charts displaying top spending categories, helping users identify spending patterns.

### Budget Monitoring
The budget summary cards display income, total expenses, and remaining budget with visual progress bars and alerts when exceeding the budget.

### Quick Expense Entry
Simplified form interface allows users to quickly log expenses as they occur, with immediate feedback and validation.

## Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library with functional components and hooks
- **Vite 5.0.8** - Fast, modern build tool with instant HMR (Hot Module Replacement)
- **Recharts 2.x** - Lightweight charting library for data visualization
- **JavaScript (ES6+)** - Modern JavaScript with destructuring, arrow functions, and async/await
- **CSS3** - Custom properties, Flexbox, Grid, and media queries for responsive design

### Development
- **npm** - Package management
- **ESLint** - Code quality (via Vite preset)
- **Responsive Design** - Mobile-first approach with breakpoints at 768px and 1024px

## Project Structure

```
src/
├── components/           # React components
│   ├── App.jsx          # Main application component
│   ├── Header.jsx       # Application header with logo and navigation
│   ├── Logo.jsx         # Wallet icon component
│   ├── IncomeInput.jsx  # Monthly income input form
│   ├── ExpenseForm.jsx  # Add expense form
│   ├── ExpenseList.jsx  # Display and manage expenses
│   ├── BudgetSummary.jsx # Budget overview and progress bar
│   └── ExpenseVisualization.jsx # Charts and statistics
│
├── hooks/               # Custom React hooks
│   └── useBudgetState.js # State management for budget data
│
├── models/              # Data models and validations
│   └── budgetModels.js  # Expense data structure and validation functions
│
├── utils/               # Utility functions
│   ├── constants.js     # App constants and color palette
│   ├── helpers.js       # General utility functions
│   ├── budgetCalculations.js # Budget-related calculations
│   └── chartUtils.js    # Chart data transformations
│
├── styles/              # CSS stylesheets
│   ├── index.css        # Global styles and CSS custom properties
│   ├── App.css          # App layout styles
│   ├── Header.css       # Header styling
│   ├── IncomeInput.css  # Income form styling
│   ├── ExpenseForm.css  # Expense form styling
│   ├── ExpenseList.css  # Expense list styling
│   ├── BudgetSummary.css # Budget summary styling
│   └── ExpenseVisualization.css # Chart styling
│
├── main.jsx             # React entry point
└── App.jsx              # Root App component

public/
└── index.html           # HTML entry point

vite.config.js           # Vite configuration
package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will open at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed code architecture documentation.

## Color Palette

| Purpose | Color | Usage |
|---------|-------|-------|
| Primary | `#5367AB` (Blue) | Buttons, links, headings, borders |
| Warning | `#f9c74f` (Gold) | Expense amounts, warnings |
| Success | `#008000` (Green) | Income amounts, positive values |
| Light | `#ffffff` (White) | Backgrounds, cards |
| Dark | `#333333` (Dark Gray) | Text, headings |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Initial load time: ~1 second
- Zero external API calls (frontend only)
- Efficient React re-renders with hooks
- Lightweight chart library (Recharts)
- CSS-in-JS for optimized styling

## Future Enhancement Possibilities

If this were to become a production application, these features could be added:

- Backend API for data persistence
- User authentication and accounts
- Cloud storage integration
- Budget goals and savings targets
- Recurring expense templates
- Multiple currency support
- CSV/PDF export functionality
- Mobile app (React Native)
- Dark mode theme
- Category filtering and search

## Development Notes

### Adding a New Feature
1. Create component in `src/components/`
2. Create corresponding CSS in `src/styles/`
3. Add any utilities needed in `src/utils/`
4. Update `App.jsx` to integrate component
5. Test responsiveness at breakpoints

### Component Naming
- Use PascalCase for components (e.g., `IncomeInput.jsx`)
- Use camelCase for utilities (e.g., `budgetCalculations.js`)
- Use kebab-case for CSS files (e.g., `expense-form.css`)

### Testing the App
1. Set a monthly income
2. Add multiple expenses
3. Verify budget summary updates
4. Check visualizations show correct data
5. Test deleting expenses
6. Verify responsive design on mobile (DevTools)

## License

This is an educational project created for SWE632 coursework.

## Author

Developed as a React learning project (February 2026)
