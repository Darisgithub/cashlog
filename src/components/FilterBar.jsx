import { useState } from 'react';

function FilterBar({ currentFilter, onFilterChange, customDateRange, onCustomDateChange }) {
    const filters = [
        { id: 'all', label: 'Semua' },
        { id: 'day', label: 'Hari Ini' },
        { id: 'week', label: 'Minggu Ini' },
        { id: 'month', label: 'Bulan Ini' },
        { id: 'year', label: 'Tahun Ini' },
        { id: 'custom', label: 'Custom' },
    ];

    const [startDate, setStartDate] = useState(customDateRange?.start || '');
    const [endDate, setEndDate] = useState(customDateRange?.end || '');

    const handleDateChange = (type, value) => {
        if (type === 'start') {
            setStartDate(value);
            onCustomDateChange({ start: value, end: endDate });
        } else {
            setEndDate(value);
            onCustomDateChange({ start: startDate, end: value });
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${currentFilter === filter.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 dark:bg-blue-500 dark:shadow-blue-400/20'
                                : 'bg-white/80 text-gray-700 hover:bg-white dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }
            `}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Custom Date Range Inputs */}
            {currentFilter === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="startDate" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="endDate" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Tanggal Akhir
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none text-sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterBar;
