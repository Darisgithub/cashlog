import { useState } from 'react';
import { Calendar } from 'lucide-react';

function FilterBar({ customDateRange, onCustomDateChange, paymentMethod, onPaymentMethodChange }) {
    const handleDateChange = (type, value) => {
        if (type === 'start') {
            onCustomDateChange({ ...customDateRange, start: value });
        } else {
            onCustomDateChange({ ...customDateRange, end: value });
        }
    };

    return (
        <div className="p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl backdrop-blur-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="startDate" className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={14} />
                        Dari Tanggal
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={customDateRange.start}
                        onChange={(e) => handleDateChange('start', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-sm shadow-sm"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="endDate" className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={14} />
                        Sampai Tanggal
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={customDateRange.end}
                        onChange={(e) => handleDateChange('end', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-sm shadow-sm"
                    />
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">
                    Metode Pembayaran
                </label>
                <div className="flex gap-2">
                    {['all', 'cash', 'digital'].map((method) => (
                        <button
                            key={method}
                            onClick={() => onPaymentMethodChange(method)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${paymentMethod === method
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {method === 'all' ? 'Semua' : method === 'cash' ? 'Tunai' : 'Digital'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FilterBar;
