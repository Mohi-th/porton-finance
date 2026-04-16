<div align="center">

# 💰 Finance Dashboard

**A premium, interactive finance dashboard for tracking income, expenses, and spending insights.**

Built with **React 19 · Vite 8 · Redux Toolkit · Recharts**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

---

</div>

## 📸 Preview

> A sleek **"Midnight Analytics"** dark theme with glassmorphic cards, animated counters, and rich data visualizations — designed to feel professional and polished out of the box.

---

## 🚀 Quick Start

```bash
# 1 — Clone the repository
git clone https://github.com/Mohi-th/Finance_tracker.git
cd Finance_tracker

# 2 — Install dependencies
npm install

# 3 — Start the development server
npm run dev
```

Open **http://localhost:5173/** in your browser — you're good to go!

### Other Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start Vite dev server with HMR       |
| `npm run build`    | Build optimized production bundle    |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Run ESLint across the project        |

---

## ✨ Features

### 📊 Dashboard Overview

- **Summary Cards** — Total Balance, Income, Expenses & Transaction count with smooth animated counters and trend indicators (₹ INR currency).
- **Recent Activity** — Feed of latest transactions with status indicators (CLEARED/PENDING).
- **AI Strategy Insights** — Personalized financial advice based on spending patterns.
- **Active Alerts** — Critical notifications regarding budget or suspicious activity.
- **Spending Composition** — Categorized view of current month spending.
- **Charts** — Balance trends and monthly comparisons using Recharts.

### 💳 Transaction Management

- Full **CRUD operations** via `createAsyncThunk` — Add, Edit, Delete (admin-only)
- **Debounced search** — 350ms delay to reduce unnecessary Redux dispatches while typing
- **Collapsible filter panel** — toggle with a Filters button to reveal Type, Category, Date Range
- **Sorting** — via dropdown menu (date or amount, ascending/descending)
- **Pagination** — with intuitive page controls
- **CSV Export** — download all filtered transactions as `.csv`
- **Responsive views** — table layout on desktop, card layout on mobile
- **Category Icons** — each category (Food, Shopping, Travel, etc.) has its own Lucide icon with unique color

### 📈 Insights & Analytics

- **Top Spending Category** with amount this month
- **Savings Rate** displayed as a percentage of total income
- **Average Daily Spending** calculation
- **Monthly Trends** — expense & income change vs. previous month
- **Spending Breakdown Bars** — visual side-by-side comparison of categories
- **Income vs Expenses** — monthly bar chart comparison

### 🔐 Role-Based Access Control (RBAC)

| Role      | Permissions                              |
| --------- | ---------------------------------------- |
| **Admin** | Full CRUD access to all transactions     |
| **Viewer**| Read-only — add/edit/delete are hidden   |

Toggle between roles via the **header segmented control**. The current role is displayed as a color-coded badge in the sidebar.

### 🌗 Theming

- **Dark Mode** — "Midnight Analytics" theme (default)
- **Light Mode** — clean, bright alternative
- Theme toggle with **tilt animation** in the header
- Theme preference is **persisted in localStorage**

---

## 🏗️ Architecture Decisions

### 1. State Management (Redux vs. Context)
- **Redux Toolkit**: Used for global data-driven state (Transactions, Filters, Analytics). It provides a structured way to handle complex state transitions and side effects (via `createAsyncThunk`).
- **Context API**: Used for UI-specific state like **Theming**. Since theme updates are infrequent and don't require complex logic, Context API is more lightweight and avoids polluting the Redux store with UI-only data.

### 2. Service-Oriented Architecture
- **Service Layer**: A dedicated `src/services` layer abstracts API calls. This allows the application logic to be decoupled from the data source, making it easy to swap the current **Mock API** with a real backend later.
- **Async Thunks**: Redux actions are managed via `createAsyncThunk`, ensuring that loading, success, and error states are handled consistently across the app.

### 3. Component Design
- **Atomic-ish UI**: Components are split into `common` (reusable primitives), `layout` (app shell), and feature-specific folders (dashboard, transactions).
- **Glassmorphism & CSS Variables**: Styles are managed through pure CSS with a robust system of custom variables (CSS variables) for consistent design tokens across light and dark modes.

---

## 🧩 Custom Hooks

### `useAnalytics()`
- **Purpose**: Integrates Google Analytics 4 (GA4).
- **Functionality**: Automatically tracks page views on route changes and provides a `trackEvent` function for custom interaction tracking (e.g., search queries, CTA clicks). Falls back to console logs in development.

### `useDebounce(value, delay)`
- **Purpose**: Prevents expensive operations (like filtering a large list) from running on every keystroke.
- **Functionality**: Delays the update of a value until the user has stopped typing for a specified time (default 300ms). Used in the search bar to optimize Redux dispatches.

### `useLocalStorage(key, initialValue)`
- **Purpose**: Syncs React state with browser `localStorage`.
- **Functionality**: Persists data across sessions. Used for theme preference and mock transaction data.

---

## ⚡ Performance Optimizations

1. **Memoized Selectors**: Uses `reselect` (via Redux Toolkit) to cache computed data (like category breakdowns or filtered lists). This prevents expensive recalculations on every re-render.
2. **Code Splitting (Lazy Loading)**: Main pages (Dashboard, Transactions, etc.) are loaded lazily using `React.lazy` and `Suspense`, reducing the initial bundle size and improving "Time to Interactive".
3. **Debounced Filtering**: Input-driven filters use `useDebounce` to ensure the list only re-filters after the user finishes typing.
4. **SVG Icon System**: Uses `Lucide React` which is tree-shakable, ensuring only the icons actually used in the app are included in the final bundle.

---

## 🔍 SEO Techniques Used

1. **Meta Descriptions & Title**: Custom descriptive titles and meta descriptions in `index.html` to improve search engine visibility and click-through rate.
2. **Open Graph (OG) Tags**: Includes `og:title`, `og:description`, and `og:type` to ensure the application looks professional when shared on social platforms like LinkedIn or Twitter.
3. **Semantic HTML**: Uses proper HTML5 tags (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`) to help search engines understand the structure and hierarchy of the content.
4. **ARIA Roles**: Basic accessibility markers ensure that the application is readable by screen readers, indirectly boosting SEO rankings.

---

## ⚖️ Trade-offs

### Mock API vs. Real Backend
- **Decision**: Used a `localStorage`-backed mock service instead of a real Node.js/Express backend.
- **Pro**: Zero setup for the user; the app works instantly without needing a database or API key.
- **Con**: Data is local to the browser; clearing cache resets the data (unless seeded), and multi-user sync is impossible.

### LocalStorage for Persistence
- **Decision**: Persisting transactions directly in `localStorage`.
- **Pro**: Extremely fast read/write operations for a client-only demo.
- **Con**: Limited storage capacity (~5MB) compared to a real database, and no data integrity checks.

### Single-Page Application (SPA)
- **Decision**: Built as an SPA using `React Router`.
- **Pro**: Smooth, app-like transitions between pages without full reloads.
- **Con**: Requires client-side JavaScript to render, which can be slightly slower for initial SEO indexing compared to SSR (Server-Side Rendering).

---

## 🏗️ Project Architecture

```
finance-dashboard/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images & SVG icons
│   ├── components/
│   │   ├── common/             # Reusable UI primitives
│   │   │   └── ConfirmDialog.jsx
│   │   ├── dashboard/          # Dashboard-specific widgets
│   │   │   ├── ActiveAlerts.jsx
│   │   │   ├── AIInsightCard.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── SpendingComposition.jsx
│   │   │   └── SummaryCards.jsx
│   │   ├── layout/             # App shell — Sidebar, Header
│   │   │   ├── Header.jsx      # Theme toggle + notifications
│   │   │   ├── MobileDock.jsx  # Mobile navigation dock
│   │   │   └── Sidebar.jsx     # Desktop navigation
│   │   └── transactions/       # Transaction CRUD UI
│   │       ├── TransactionModal.jsx
│   │       └── TransactionTable.jsx # Responsive transaction list
│   ├── context/
│   │   └── ThemeContext.jsx    # Theme management via Context API
│   ├── hooks/
│   │   ├── useAnalytics.js     # GA4 tracking hook
│   │   ├── useDebounce.js      # Value debouncing hook
│   │   └── useLocalStorage.js  # Persistence hook
│   ├── pages/
│   │   ├── BudgetPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── InsightsPage.jsx
│   │   └── TransactionsPage.jsx
│   ├── services/
│   │   └── api.js              # Mock API implementation (localStorage)
│   ├── store/
│   │   ├── index.js            # Redux store configuration
│   │   └── slices/
│   │       └── transactionSlice.js # Async thunks + filters + selectors
│   ├── utils/
│   │   ├── constants.js        # App-wide constants & category maps
│   │   └── formatters.js       # Currency (₹ INR) & date formatters
│   ├── App.jsx                 # Root component with routing
│   ├── index.css               # Tailwind CSS + @theme design tokens
│   └── main.jsx                # App entry point
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🧩 State Management (Redux Toolkit)

The Redux store is organized into two slices with a focus on **async-ready architecture** and **performance optimization**.

### `transactionSlice` — Async Thunks & Selectors

All CRUD operations use **`createAsyncThunk`** to simulate API interactions, making the codebase ready for backend integration:

```js
// Async thunks with simulated API delays
addTransactionAsync     // POST   /api/transactions     (600ms delay)
updateTransactionAsync  // PUT    /api/transactions/:id (600ms delay)
deleteTransactionAsync  // DELETE /api/transactions/:id (400ms delay)
```

Each thunk manages its lifecycle through `extraReducers`:

| State       | What it does                                         |
| ----------- | ---------------------------------------------------- |
| `pending`   | Sets `loading: true`, tracks `operationType`         |
| `fulfilled` | Updates the transactions array, clears loading       |
| `rejected`  | Sets `error` message, clears loading                 |

**Memoized Selectors** — computed data is cached to avoid recalculation:

```js
selectFilteredTransactions  // Search + type + category + date range filtering
selectPaginatedTransactions // Paginated subset of filtered results
selectSummary               // Totals, balances, savings rate
selectInsights              // Top category, trends, average daily spend
selectMonthlyData           // Aggregated monthly income/expense/balance
selectCategoryBreakdown     // Spending by category with percentages
selectRecentTransactions    // Latest 5 transactions
```

---

## 🎨 Theme Management (Context API)

The application uses **React Context API** for theme management instead of Redux to keep UI-only state separate from data state.

- **`ThemeContext.jsx`**: Provides `theme` and `toggleTheme` to the entire app.
- **Persistence**: Theme preference (`light`/`dark`) is automatically persisted to `localStorage`.
- **Implementation**: The `data-theme` attribute is toggled on the `document.documentElement`, which triggers Tailwind's dark mode.

---

## ⚡ Debounced Search

The transaction search input uses the **`useDebounce`** hook to optimize performance:

### How it works:

1. **User types** in the search box → local React state updates **immediately** (no input lag).
2. **Redux dispatch is delayed** by 300ms after the last keystroke.
3. If the user keeps typing, the timer resets — only the final value is dispatched.
4. This prevents **unnecessary re-filtering** of transactions on every keypress.

```
Keystroke timeline:
  "s" → "sa" → "sal" → "sala" → "salary"
                                    ↓
                            300ms debounce
                                    ↓
                        dispatch(setFilter({ search: "salary" }))
```

---

## 🎨 Design System

The UI is powered by **Tailwind CSS v4** with custom design tokens defined via the `@theme` directive in `index.css`.

| Token          | Dark Mode Value                  | Purpose                  |
| -------------- | -------------------------------- | ------------------------ |
| `bg-primary`   | `#0F1629` (Deep Navy)            | Page background          |
| `bg-secondary` | `#1A2332`                        | Card / panel backgrounds |
| `primary`      | `#3B82F6` (Electric Blue)        | Buttons, links, accents  |
| `income`       | `#10B981` (Emerald)              | Income indicators        |
| `expense`      | `#F43F5E` (Rose)                 | Expense indicators       |
| Font           | [Inter](https://fonts.google.com/specimen/Inter) | Typography               |
| Border Radius  | `6px – 16px` system              | Consistent rounding      |

### Category Color System

Each transaction category has a unique icon and color for instant visual recognition:

| Category        | Icon            | Color     |
| --------------- | --------------- | --------- |
| Food & Dining   | UtensilsCrossed | `#F97316` |
| Shopping        | ShoppingBag     | `#A855F7` |
| Transport       | Car             | `#06B6D4` |
| Entertainment   | Gamepad2        | `#F43F5E` |
| Bills & Utilities| Zap            | `#F59E0B` |
| Salary          | Briefcase       | `#3B82F6` |
| Freelance       | Laptop          | `#8B5CF6` |
| Travel          | Plane           | `#0EA5E9` |
| Education       | GraduationCap   | `#3B82F6` |
| Groceries       | ShoppingCart     | `#84CC16` |

---

## 🛠️ Tech Stack

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| **React 19**         | UI framework (functional components + hooks) |
| **Vite 8**           | Lightning-fast dev server & bundler |
| **Tailwind CSS v4**  | Utility-first styling with `@theme` tokens |
| **Redux Toolkit**    | Centralized state with `createAsyncThunk` |
| **React Router v7**  | Client-side routing              |
| **Recharts**         | Charts & data visualizations     |
| **Lucide React**     | Category icons & UI iconography  |
| **Lottie (dotlottie)**| Loading & empty state animations |

---

## 📱 Responsive Design

| Breakpoint         | Layout                                           |
| ------------------ | ------------------------------------------------ |
| **Desktop** 1024px+| Full sidebar + multi-column dashboard grid        |
| **Tablet** 640–1024px | Collapsible sidebar drawer, adapted grid       |
| **Mobile** < 640px | Bottom-sheet modals, card-based transaction list  |

---

## 📊 Mock Data

The app ships with **hardcoded realistic transactions** spanning the current and previous months:

- 💼 Bi-monthly salary deposits (₹85,000)
- 💻 Random freelance & investment income
- 🍕 Daily expenses across **10+ categories** (food, transport, shopping, bills, etc.)
- ✈️ Occasional large travel expenses
- 📈 Seasonal spending variations for realistic trends

All data is **persisted in localStorage** using the `api.js` service.

---

## 🔮 Future Enhancements

- **Backend Integration** — Replace `simulateApiDelay` in async thunks with real `fetch`/`axios` API calls
- **Authentication** — JWT-based login/signup with role assignment
- **Budget Goals** — Set monthly spending limits per category
- **Recurring Transactions** — Auto-generate subscriptions and salary entries
- **Data Export** — PDF report generation with charts

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository
2. Create a feature branch — `git checkout -b feature/awesome-feature`
3. Commit your changes — `git commit -m "Add awesome feature"`
4. Push to the branch — `git push origin feature/awesome-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">

**Built with ❤️ using React + Vite + Tailwind CSS**

⭐ Star this repo if you found it useful!

</div>
