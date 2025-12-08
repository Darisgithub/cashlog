import { useState, useEffect, useMemo } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import Summary from './components/Summary';
import ThemeToggle from './components/ThemeToggle';
import FilterBar from './components/FilterBar';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import { supabase } from './lib/supaClient';

const THEME_KEY = 'cashlog_theme';

function App() {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Default false, set true on fetch
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [session]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Optional: Handle error UI
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const filteredExpenses = useMemo(() => {
    if (!customDateRange.start && !customDateRange.end) return expenses;

    const start = customDateRange.start ? new Date(customDateRange.start) : new Date(0);
    const end = customDateRange.end ? new Date(customDateRange.end) : new Date();
    end.setHours(23, 59, 59, 999);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date || expense.tanggal);
      return expenseDate >= start && expenseDate <= end;
    });
  }, [expenses, customDateRange]);

  const handleAddExpense = async (expense) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          date: expense.date,
          description: expense.description,
          amount: expense.amount,
          type: expense.type,
          user_id: session.user.id // Explicitly set user_id
        }])
        .select();

      if (error) throw error;
      if (data) {
        setExpenses(prev => [data[0], ...prev]);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Gagal menyimpan data.');
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    if (!updatedExpense) {
      setEditingTransaction(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          date: updatedExpense.date,
          description: updatedExpense.description,
          amount: updatedExpense.amount,
          type: updatedExpense.type
        })
        .eq('id', updatedExpense.id);

      if (error) throw error;

      // Optimistic update
      setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
      setEditingTransaction(null);
      alert('Data berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Gagal update data.');
    }
  };

  const handleDeleteExpense = async (id) => {
    const confirmed = window.confirm('Hapus transaksi ini?');
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setExpenses(prev => prev.filter(expense => expense.id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Gagal menghapus data.');
      }
    }
  };

  const handleDeleteAll = async () => {
    const idsToDelete = filteredExpenses.map(e => e.id);
    if (idsToDelete.length === 0) return;

    if (!window.confirm(`Yakin hapus ${idsToDelete.length} data yang tampil?`)) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', idsToDelete);

      if (error) throw error;
      setExpenses(prev => prev.filter(e => !idsToDelete.includes(e.id)));
    } catch (error) {
      console.error('Error deleting all:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="absolute top-4 right-4">
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        </div>
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">

      {/* Navbar / Header Controls */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Left side empty or logo */}
        </div>
        <div className="flex items-center gap-3 pointer-events-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 pl-2 hidden sm:block">
            {session.user.email}
          </span>
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
          <button
            onClick={handleLogout}
            className="p-2 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-full transition-colors"
            title="Keluar"
          >
            🚪
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-3">
            CashLog
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Simple. Elegant. Financial Tracking.
          </p>
        </header>

        <main className="space-y-8 max-w-3xl mx-auto">
          {/* Section 1: Form Input */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="text-9xl">📝</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 relative z-10">
              {editingTransaction ? '✏️ Edit Transaksi' : '➕ Input Transaksi'}
            </h2>
            <ExpenseForm
              onAddExpense={handleAddExpense}
              editData={editingTransaction}
              onUpdateExpense={handleUpdateExpense}
            />
          </section>

          {/* Section 2: Summary Cards */}
          <section>
            <Summary expenses={filteredExpenses} onDeleteAll={handleDeleteAll} />
          </section>

          {/* Section 3: Filter & ToDo Stacked */}
          <section className="space-y-6">
            {/* Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Filter Periode
              </h3>
              <FilterBar
                customDateRange={customDateRange}
                onCustomDateChange={setCustomDateRange}
              />
            </div>

            {/* ToDo List */}
            <div className="h-[500px]">
              <TodoList session={session} />
            </div>
          </section>

          {/* Section 4: Transaction History Table */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Riwayat Transaksi
              </h2>
              {isLoading && <span className="text-sm text-gray-400 animate-pulse">Loading data...</span>}
            </div>
            <ExpenseTable
              expenses={filteredExpenses}
              onDeleteExpense={handleDeleteExpense}
              onEdit={setEditingTransaction}
            />
          </section>
        </main>

        <footer className="text-center mt-20 py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-400 dark:text-gray-600">
            &copy; {new Date().getFullYear()} CashLog. Manage your wealth.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
