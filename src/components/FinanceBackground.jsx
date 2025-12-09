import Squares from './Squares';
import { useEffect, useState } from 'react';

const FinanceBackground = () => {
    const [theme, setTheme] = useState(document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, []);

    // Use slightly higher contrast for icons vs grid lines
    const borderColor = theme === 'dark' ? '#4b5563' : '#9ca3af';
    const hoverFillColor = theme === 'dark' ? '#222' : '#f3f4f6';

    return (
        <div className="fixed inset-0 -z-50 h-full w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Squares
                direction="diagonal"
                speed={0.1}
                squareSize={80}
                borderColor={borderColor}
                hoverFillColor={hoverFillColor}
            />
        </div>
    );
};

export default FinanceBackground;
