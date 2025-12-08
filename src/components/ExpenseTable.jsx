import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ExpenseTable({ expenses, onDeleteExpense, onEdit }) {
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

    const handleExportPDF = () => {
        const doc = new jsPDF();

        const tableColumn = ["Tanggal", "Tipe", "Keterangan", "Total"];
        const tableRows = [];

        expenses.forEach(expense => {
            const expenseData = [
                formatDate(expense.date || expense.tanggal),
                expense.type === 'income' ? 'Pemasukkan' : 'Pengeluaran',
                expense.description || expense.jenis,
                formatCurrency(expense.amount || expense.total)
            ];
            tableRows.push(expenseData);
        });

        doc.text("Laporan Keuangan CashLog", 14, 15);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save(`cashlog_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <div className="text-5xl mb-3 opacity-40">📊</div>
                <h3 className="text-lg font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                    Belum ada data
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mulai catat keuangan Anda dengan mengisi form di atas
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleExportPDF}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-lg shadow transition-colors flex items-center gap-2"
                >
                    <span>📄</span> Export PDF
                </button>
            </div>

            <div className="overflow-x-auto scrollbar-thin rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-700/30">
                            <h3 className="sr-only">Daftar Transaksi</h3>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                                Tanggal
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                                Tipe
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                                Keterangan
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
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-150 group"
                            >
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/50">
                                    {formatDate(expense.date || expense.tanggal)}
                                </td>
                                <td className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expense.type === 'income'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {expense.type === 'income' ? 'Pemasukkan' : 'Pengeluaran'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/50">
                                    {expense.description || expense.jenis}
                                </td>
                                <td className={`px-4 py-3 font-semibold border-b border-gray-100 dark:border-gray-700/50 ${expense.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount || expense.total)}
                                </td>
                                <td className="px-4 py-3 text-center border-b border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(expense)}
                                            title="Edit"
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => onDeleteExpense(expense.id)}
                                            title="Hapus"
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ExpenseTable;
