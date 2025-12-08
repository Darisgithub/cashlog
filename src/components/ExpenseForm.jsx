import { useState, useEffect } from 'react';

function ExpenseForm({ onAddExpense, editData, onUpdateExpense }) {
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split('T')[0],
        jenis: '',
        total: '',
        type: 'expense' // 'expense' or 'income'
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                tanggal: editData.date || editData.tanggal,
                jenis: editData.description || editData.jenis,
                total: editData.amount || editData.total,
                type: editData.type || 'expense'
            });
        }
    }, [editData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.tanggal || !formData.jenis || !formData.total) {
            alert('Mohon isi semua field!');
            return;
        }

        const expense = {
            date: formData.tanggal,
            description: formData.jenis,
            amount: parseFloat(formData.total),
            type: formData.type
        };

        if (editData) {
            onUpdateExpense({ ...expense, id: editData.id });
        } else {
            onAddExpense(expense);
        }

        if (!editData) {
            setFormData({
                tanggal: new Date().toISOString().split('T')[0],
                jenis: '',
                total: '',
                type: 'expense' // reset to default
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCancelEdit = () => {
        onUpdateExpense(null); // Clear edit state in parent
        setFormData({
            tanggal: new Date().toISOString().split('T')[0],
            jenis: '',
            total: '',
            type: 'expense'
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl relative">
                {editData && (
                    <div className="absolute -top-3 -right-3">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200 shadow-sm animate-pulse">
                            Editing Mode
                        </span>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${formData.type === 'expense'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    💸 Pengeluaran
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${formData.type === 'income'
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    💰 Pemasukkan
                </button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tanggal" className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            id="tanggal"
                            name="tanggal"
                            value={formData.tanggal}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-sm placeholder-gray-400"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="total" className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Nominal (Rp)
                        </label>
                        <input
                            type="number"
                            id="total"
                            name="total"
                            value={formData.total}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                            step="1"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-sm placeholder-gray-400"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="jenis" className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Keterangan
                    </label>
                    <input
                        type="text"
                        id="jenis"
                        name="jenis"
                        value={formData.jenis}
                        onChange={handleChange}
                        placeholder={formData.type === 'expense' ? "Contoh: Makan Siang, Bensin, dll" : "Contoh: Gaji, Bonus, dll"}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-sm placeholder-gray-400"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className={`flex-1 py-4 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base ${editData
                        ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/30'
                        : (formData.type === 'expense'
                            ? 'bg-gradient-to-r from-red-600 to-pink-600 shadow-red-500/30'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/30')
                        }`}
                >
                    <span>{editData ? '✏️' : (formData.type === 'expense' ? '💸' : '💰')}</span>
                    {editData ? 'Update Transaksi' : (formData.type === 'expense' ? 'Catat Pengeluaran' : 'Catat Pemasukkan')}
                </button>

                {editData && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all"
                    >
                        Batal
                    </button>
                )}
            </div>
        </form>
    );
}

export default ExpenseForm;
