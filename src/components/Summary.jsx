function Summary({ expenses, onDeleteAll }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.total, 0);
    const transactionCount = expenses.length;

    const handleDeleteAll = () => {
        const confirmed = window.confirm('Yakin ingin menghapus semua data pengeluaran?');
        if (confirmed) {
            onDeleteAll();
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5 text-center">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        Total Pengeluaran
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {formatCurrency(totalExpenses)}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-5 text-center">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        Jumlah Transaksi
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        {transactionCount}
                    </div>
                </div>
            </div>

            {expenses.length > 0 && (
                <button
                    onClick={handleDeleteAll}
                    className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                    <span>🗑️</span>
                    Hapus Semua Data
                </button>
            )}
        </div>
    );
}

export default Summary;
