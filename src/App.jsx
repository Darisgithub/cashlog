import { useState, useEffect, useMemo } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import Summary from './components/Summary';
import ThemeToggle from './components/ThemeToggle';
import FilterBar from './components/FilterBar';

const STORAGE_KEY = 'cashlog_expenses';
const THEME_KEY = 'cashlog_theme';

function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme || 'light';
  });

  // Expenses state with localStorage persistence
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY);
    if (savedExpenses) {
      try {
        return JSON.parse(savedExpenses);
      } catch (error) {
        console.error('Error loading expenses:', error);
        return [];
      }
    }
    return [];
  });

  // Filter state
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Filter expenses by period
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.tanggal);

      switch (filterPeriod) {
        case 'day':
          return expenseDate >= today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return expenseDate >= weekAgo;
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return expenseDate >= monthStart;
        case 'year':
          const yearStart = new Date(now.getFullYear(), 0, 1);
          return expenseDate >= yearStart;
        case 'custom':
          if (!customDateRange.start && !customDateRange.end) return true;
          const start = customDateRange.start ? new Date(customDateRange.start) : new Date(0);
          const end = customDateRange.end ? new Date(customDateRange.end) : new Date();
          end.setHours(23, 59, 59, 999); // Include the entire end date
          return expenseDate >= start && expenseDate <= end;
        default:
          return true; // 'all'
      }
    });
  }, [expenses, filterPeriod, customDateRange]);

  const handleAddExpense = (expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    const confirmed = window.confirm('Hapus pengeluaran ini?');
    if (confirmed) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    }
  };

  const handleDeleteAll = () => {
    setExpenses([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      <ThemeToggle theme={theme} onToggle={handleToggleTheme} />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="text-center mb-12 animate-fade-in-up">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent flex flex-col items-center justify-center gap-4">
              <span className="text-5xl sm:text-6xl drop-shadow-lg">💰</span>
              CashLog
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Catat dan kelola pengeluaran Anda dengan mudah.
              Semua data tersimpan otomatis di browser Anda.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Input Form Section */}
          <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              📝 Tambah Pengeluaran Baru
            </h2>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </section>

          {/* Filter Section */}
          <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              🔍 Filter Periode
            </h2>
            <FilterBar
              currentFilter={filterPeriod}
              onFilterChange={setFilterPeriod}
              customDateRange={customDateRange}
              onCustomDateChange={setCustomDateRange}
            />
          </section>

          {/* Summary Section */}
          <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              📊 Ringkasan
            </h2>
            <Summary expenses={filteredExpenses} onDeleteAll={handleDeleteAll} />
          </section>

          {/* Table Section */}
          <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              📋 Daftar Pengeluaran
            </h2>
            <ExpenseTable
              expenses={filteredExpenses}
              onDeleteExpense={handleDeleteExpense}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 py-8 text-gray-500 dark:text-gray-400">
          <p>Made with ❤️</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
