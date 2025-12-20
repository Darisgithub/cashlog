import { useState } from 'react';
import { TrendingDown, TrendingUp, HandCoins, Wallet } from 'lucide-react';

function ExpenseForm({ onAddExpense }) {
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split('T')[0],
        jenis: '',
        total: '',
        type: 'expense',
        paymentMethod: 'cash'
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.tanggal || !formData.jenis || !formData.total) {
            return;
        }

        const expense = {
            date: formData.tanggal,
            description: formData.jenis,
            amount: parseFloat(formData.total),
            type: formData.type,
            payment_method: formData.paymentMethod
        };

        onAddExpense(expense);

        setFormData({
            tanggal: new Date().toISOString().split('T')[0],
            jenis: '',
            total: '',
            type: 'expense',
            paymentMethod: 'cash'
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${formData.type === 'expense'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <TrendingDown size={18} />
                    Pengeluaran
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${formData.type === 'income'
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <TrendingUp size={18} />
                    Pemasukkan
                </button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                    className={`py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${formData.paymentMethod === 'cash'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <Wallet size={18} />
                    Tunai
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'digital' })}
                    className={`py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${formData.paymentMethod === 'digital'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <HandCoins size={18} />
                    Digital
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

            <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-sm transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                Tambah
            </button>
        </form>
    );
}

export default ExpenseForm;
