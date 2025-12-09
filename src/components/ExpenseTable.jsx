import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { Pencil, Trash2, FileDown, Inbox } from 'lucide-react';

function ExpenseTable({ expenses, onDeleteExpense, onUpdate }) {
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

        let totalIncome = 0;
        let totalExpense = 0;

        expenses.forEach(expense => {
            const amount = parseFloat(expense.amount || expense.total);
            if (expense.type === 'income') {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }

            const expenseData = [
                formatDate(expense.date || expense.tanggal),
                expense.type === 'income' ? 'Pemasukkan' : 'Pengeluaran',
                expense.description || expense.jenis,
                formatCurrency(amount)
            ];
            tableRows.push(expenseData);
        });

        // Add Header
        doc.setFontSize(18);
        doc.text("Laporan Keuangan ", 14, 15);
        doc.setFontSize(10);
        doc.text(`Dicetak pada: ${formatDate(new Date().toISOString())}`, 14, 22);

        // Main Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'striped',
            headStyles: { fillColor: [31, 41, 55] }
        });

        // Summary Table
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(12);
        doc.text("Ringkasan Keuangan", 14, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Keterangan', 'Jumlah']],
            body: [
                ['Total Pemasukkan', formatCurrency(totalIncome)],
                ['Total Pengeluaran', formatCurrency(totalExpense)],
                ['Sisa Saldo', formatCurrency(totalIncome - totalExpense)]
            ],
            theme: 'grid',
            headStyles: { fillColor: [75, 85, 99] },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 80 },
                1: { title: 'right', halign: 'right' }
            },
            tableWidth: 120
        });

        const fileName = `cashlog_report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    const handleEditClick = (expense) => {
        Swal.fire({
            title: '<span class="text-gray-900 dark:text-white">Edit Transaksi</span>',
            html: `
                <div class="flex flex-col gap-4 text-left">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
                        <input id="swal-date" type="date" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" value="${expense.date || expense.tanggal}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe</label>
                        <select id="swal-type" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors">
                            <option value="expense" ${expense.type === 'expense' ? 'selected' : ''}>Pengeluaran</option>
                            <option value="income" ${expense.type === 'income' ? 'selected' : ''}>Pemasukkan</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan</label>
                        <input id="swal-desc" type="text" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" value="${expense.description || expense.jenis}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total (Rp)</label>
                        <input id="swal-amount" type="number" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" value="${expense.amount || expense.total}">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            focusConfirm: false,
            customClass: {
                popup: '!bg-white dark:!bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700',
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg',
                cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-bold py-2 px-4 rounded-lg'
            },
            preConfirm: () => {
                const date = document.getElementById('swal-date').value;
                const type = document.getElementById('swal-type').value;
                const description = document.getElementById('swal-desc').value;
                const amount = document.getElementById('swal-amount').value;

                if (!date || !description || !amount) {
                    Swal.showValidationMessage('Mohon isi semua data');
                    return false;
                }

                return {
                    id: expense.id,
                    date,
                    type,
                    description,
                    amount: parseFloat(amount)
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                onUpdate(result.value);
            }
        });
    };

    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <div className="text-gray-300 dark:text-gray-600 mb-4 flex justify-center">
                    <Inbox size={64} strokeWidth={1} />
                </div>
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
                    <FileDown size={16} /> Export PDF
                </button>
            </div>

            <div className="-mx-6 sm:mx-0 overflow-x-auto scrollbar-hide sm:scrollbar-thin rounded-none sm:rounded-xl border-y sm:border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm table-fixed min-w-[650px]">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-700/30 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                            <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap w-[15%]">
                                Tanggal
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-[15%]">
                                Tipe
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-[25%]">
                                Keterangan
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap w-[20%] pr-12">
                                Total
                            </th>
                            <th className="px-2 sm:px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 w-[25%]">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {expenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-150 group"
                            >
                                <td className="px-2 sm:px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium align-middle">
                                    {formatDate(expense.date || expense.tanggal)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 align-middle">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expense.type === 'income'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {expense.type === 'income' ? 'Masuk' : 'Keluar'}
                                    </span>
                                </td>
                                <td className="px-2 sm:px-4 py-3 text-gray-700 dark:text-gray-300 align-middle">
                                    <div className="line-clamp-1" title={expense.description || expense.jenis}>
                                        {expense.description || expense.jenis}
                                    </div>
                                </td>
                                <td className={`px-2 sm:px-4 py-3 text-right font-semibold whitespace-nowrap align-middle pr-12 ${expense.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {expense.type === 'income' ? '+' : '-'}{formatCurrency(expense.amount || expense.total)}
                                </td>
                                <td className="px-2 sm:px-4 py-3 text-center align-middle">
                                    <div className="flex items-center justify-center gap-2 opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditClick(expense)}
                                            title="Edit"
                                            className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteExpense(expense.id)}
                                            title="Hapus"
                                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        >
                                            <Trash2 size={16} />
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
