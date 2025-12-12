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
        <div className="fixed inset-0 -z-50 h-full w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pointer-events-none">
            <Squares
                direction="diagonal"
                speed={0.1}
                squareSize={80}
                borderColor={borderColor}
                hoverFillColor={hoverFillColor}
            />

            {/* Floating icons: crypto & stock glyphs */}
            <div className="absolute inset-0 -z-40 pointer-events-none">
                <div className="absolute left-8 bottom-0 w-10 h-10 sm:w-14 sm:h-14 opacity-80 animate-float-up animation-delay-1000">
                    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#f7931a" />
                        <path d="M13.2 8.5c.6-.2 1.1-.4 1.1-1 0-.6-.6-.9-1.3-.7l-.7.2-.6-2.5-1.5.4.6 2.4-1 .3c-.6.2-1 .7-.8 1.2.1.5.6.8 1.2.6l.9-.3.6 2.5-.9.3c-.6.2-1 .7-.8 1.2.1.5.6.8 1.2.6l1-.3.6 2.5 1.5-.4-.6-2.5.8-.3c.6-.2 1-.7.8-1.2-.1-.5-.6-.8-1.2-.6l-.8.3-.6-2.4.8-.2z" fill="#fff" />
                    </svg>
                </div>

                <div className="absolute right-10 bottom-10 w-9 h-9 sm:w-12 sm:h-12 opacity-70 animate-float-up animation-delay-2000">
                    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="6" width="20" height="12" rx="2" fill="#06b6d4" opacity="0.15" />
                        <path d="M4 14l4-4 4 6 4-8 4 4" stroke="#06b6d4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                </div>

                <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 opacity-75 animate-float-up animation-delay-3000">
                    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="6" fill="#10b981" />
                        <path d="M7 13l3-3 2 4 5-7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                </div>

                <div className="absolute right-1/3 top-10 w-8 h-8 sm:w-12 sm:h-12 opacity-60 animate-float-up animation-delay-2000">
                    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#6366f1" opacity="0.12" />
                        <path d="M8 14s2-3 4-3 4 4 6 3" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default FinanceBackground;
