import { Sun, Moon } from 'lucide-react';

function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="p-2 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-all duration-300 group"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
                <Moon className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
            )}
        </button>
    );
}

export default ThemeToggle;
