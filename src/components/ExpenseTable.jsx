function ExpenseTable({ expenses, onDeleteExpense }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
    };

    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <div className="text-5xl mb-3 opacity-40">📊</div>
                <h3 className="text-lg font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                    Belum ada pengeluaran
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mulai catat pengeluaran Anda dengan mengisi form di atas
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/30">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                            Tanggal
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                            Jenis / Barang
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                            Total
                        </th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr
                            key={expense.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-150"
                        >
                            <td data-label="Tanggal" className="px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/50">
                                {formatDate(expense.tanggal)}
                            </td>
                            <td data-label="Jenis / Barang" className="px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/50">
                                {expense.jenis}
                            </td>
                            <td data-label="Total" className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700/50">
                                {formatCurrency(expense.total)}
                            </td>
                            <td data-label="Aksi" className="px-4 py-3 text-center border-b border-gray-100 dark:border-gray-700/50">
                                <button
                                    onClick={() => onDeleteExpense(expense.id)}
                                    title="Hapus pengeluaran ini"
                                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:scale-110 transition-all duration-200"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ExpenseTable;
