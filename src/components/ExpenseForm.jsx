import { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
    const [formData, setFormData] = useState({
        tanggal: '',
        jenis: '',
        total: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.tanggal || !formData.jenis || !formData.total) {
            alert('Mohon isi semua field!');
            return;
        }

        const expense = {
            id: Date.now(),
            tanggal: formData.tanggal,
            jenis: formData.jenis,
            total: parseFloat(formData.total)
        };

        onAddExpense(expense);

        setFormData({
            tanggal: '',
            jenis: '',
            total: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="tanggal" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tanggal
                    </label>
                    <input
                        type="date"
                        id="tanggal"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleChange}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none text-sm"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="jenis" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Jenis / Barang
                    </label>
                    <input
                        type="text"
                        id="jenis"
                        name="jenis"
                        value={formData.jenis}
                        onChange={handleChange}
                        placeholder="Contoh: Makan, Transport"
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none text-sm"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="total" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total (Rp)
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
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none text-sm"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
                <span>➕</span>
                Tambah Pengeluaran
            </button>
        </form>
    );
}

export default ExpenseForm;
