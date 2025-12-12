import { useState, useEffect, useMemo } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import Summary from './components/Summary';
import ThemeToggle from './components/ThemeToggle';
import FilterBar from './components/FilterBar';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import InstallCTA from './components/InstallCTA';
import { supabase } from './lib/supaClient';
import Swal from 'sweetalert2';
import { LogOut, LayoutDashboard, PlusCircle, History } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import FinanceBackground from './components/FinanceBackground';

const THEME_KEY = 'cashlog_theme';

function App() {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

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
      Swal.fire('Error', 'Gagal mengambil data transaksi', 'error');
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
          user_id: session.user.id
        }])
        .select();

      if (error) throw error;
      if (data) {
        setExpenses(prev => [data[0], ...prev]);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data transaksi berhasil disimpan',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      Swal.fire('Error', 'Gagal menyimpan data.', 'error');
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
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

      setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Data berhasil diperbarui!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      Swal.fire('Error', 'Gagal update data.', 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus transaksi ini?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setExpenses(prev => prev.filter(expense => expense.id !== id));
        Swal.fire('Terhapus!', 'Data transaksi berhasil dihapus.', 'success');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        Swal.fire('Error', 'Gagal menghapus data.', 'error');
      }
    }
  };

  const handleDeleteAll = async () => {
    const idsToDelete = filteredExpenses.map(e => e.id);
    if (idsToDelete.length === 0) return;

    const result = await Swal.fire({
      title: `Hapus ${idsToDelete.length} data?`,
      text: "Semua data yang tampil akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus semua!'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .in('id', idsToDelete);

        if (error) throw error;
        setExpenses(prev => prev.filter(e => !idsToDelete.includes(e.id)));
        Swal.fire('Terhapus!', 'Semua data penelusuran berhasil dihapus.', 'success');
      } catch (error) {
        console.error('Error deleting all:', error);
        Swal.fire('Error', 'Gagal menghapus data.', 'error');
      }
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        </div>
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans pb-20">

      {/* Navbar */}
      <div className="sticky top-0 left-0 right-0 p-4 flex justify-between items-center z-40 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Logo area */}
        </div>
        <div className="flex items-center gap-3 pointer-events-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 pl-3 hidden sm:block">
            {session.user.email}
          </span>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-full transition-colors"
            title="Keluar"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>


      <FinanceBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pt-24 relative">
        {/* Ambient Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 opacity-40 pointer-events-none overflow-visible">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Header */}
        <header className="mb-10 text-center relative z-10">

          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white sm:text-5xl mb-3 drop-shadow-sm">
            CashLog
          </h1>
          <div className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light h-[30px]">
            <TypeAnimation
              sequence={[
                'Simple.', 1000,
                'Elegant.', 1000,
                'Secure.', 1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ display: 'inline-block' }}
              repeat={Infinity}
            />
          </div>
        </header>

        <main className="space-y-8 max-w-3xl mx-auto">
          {/* Section 1: Form Input */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 pointer-events-none">
              <PlusCircle size={120} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 relative z-10 flex items-center gap-2">
              <PlusCircle className="text-blue-500" />
              Input Transaksi
            </h2>
            <ExpenseForm
              onAddExpense={handleAddExpense}
            />
          </section>

          {/* Section 2: Summary Cards */}
          <section>
            <Summary expenses={filteredExpenses} onDeleteAll={handleDeleteAll} />
          </section>

          {/* Section 3: Filter & ToDo Stacked */}
          <section className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Filter Periode
              </h3>
              <FilterBar
                customDateRange={customDateRange}
                onCustomDateChange={setCustomDateRange}
              />
            </div>

          </section>

          {/* Section 4: Transaction History Table */}
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <History className="text-purple-500" />
                Riwayat Transaksi
              </h2>
              {isLoading && <span className="text-sm text-gray-400 animate-pulse">Loading data...</span>}
            </div>
            <ExpenseTable
              expenses={filteredExpenses}
              onDeleteExpense={handleDeleteExpense}
              onUpdate={handleUpdateExpense}
            />
          </section>

          {/* Section 5: ToDo List */}
          <section className="h-[500px]">
            <TodoList session={session} />
          </section>
        </main>

        <footer className="text-center mt-20 py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-400 dark:text-gray-600">
            &copy; {new Date().getFullYear()} CashLog. Manage your wealth.
          </p>
        </footer>
      </div>
      <InstallCTA />
    </div>
  );
}

export default App;
