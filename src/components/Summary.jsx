function Summary({ expenses, onDeleteAll }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalIncome = expenses
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalExpense = expenses
        .filter(t => t.type === 'expense' || !t.type) // Handle legacy/default as expense
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const balance = totalIncome - totalExpense;

    const handleDeleteAll = () => {
        const confirmed = window.confirm('Yakin ingin menghapus semua data pengeluaran?');
        if (confirmed) {
            onDeleteAll();
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Income Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">💰</span>
                    </div>
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 uppercase tracking-wide">
                        Pemasukkan
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400">
                        {formatCurrency(totalIncome)}
                    </div>
                </div>

                {/* Expense Card */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">💸</span>
                    </div>
                    <div className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wide">
                        Pengeluaran
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-red-700 dark:text-red-400">
                        {formatCurrency(totalExpense)}
                    </div>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">⚖️</span>
                    </div>
                    <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">
                        Sisa Saldo
                    </div>
                    <div className={`text-2xl sm:text-3xl font-bold ${balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(balance)}
                    </div>
                </div>
            </div>

            {/* Delete All & Count Information */}
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 px-2">
                <div>
                    Total Transaksi: <span className="font-semibold">{expenses.length}</span>
                </div>
                {expenses.length > 0 && (
                    <button
                        onClick={handleDeleteAll}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors flex items-center gap-1"
                    >
                        🗑️ Hapus Semua
                    </button>
                )}
            </div>
        </div>
    );
}

export default Summary;
