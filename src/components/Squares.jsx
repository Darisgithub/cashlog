import { useRef, useEffect, useState } from 'react';

const Squares = ({
    direction = 'diagonal',
    speed = 0.2,
    borderColor = '#333',
    hoverFillColor = '#222',
    squareSize = 60,
    isIcons = true // New prop to toggle icon mode
}) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const numSquaresX = useRef(0);
    const numSquaresY = useRef(0);
    const gridOffset = useRef({ x: 0, y: 0 });
    const [hoveredSquare, setHoveredSquare] = useState(null);

    // Crypto & Stock Tickers (Mixed Indo & Global)
    const symbols = [
        'BTC', 'ETH', 'SOL', 'XRP', 'ADA', // Crypto
        'BBRI', 'BBCA', 'BMRI', 'BBNI', 'TLKM', // Indo Stocks
        'ASII', 'GOTO', 'UNVR', 'ICBP', 'KLBF', // Indo Stocks
        'AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOG', // US Tech
        'IHSG', 'LQ45', 'S&P', 'NASDAQ', 'USD'  // Indices/Currencies
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
            numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const drawGrid = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
            const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

            // Font settings for icons
            if (isIcons) {
                // Fixed font size for better readability
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
            }

            for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
                for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
                    const squareX = x - (gridOffset.current.x % squareSize);
                    const squareY = y - (gridOffset.current.y % squareSize);

                    const colIndex = Math.floor(x / squareSize);
                    const rowIndex = Math.floor(y / squareSize);

                    if (
                        hoveredSquare &&
                        Math.floor((x - startX) / squareSize) === hoveredSquare.x &&
                        Math.floor((y - startY) / squareSize) === hoveredSquare.y
                    ) {
                        ctx.fillStyle = hoverFillColor;
                        // Draw smooth rounded rect/highlight
                        ctx.fillRect(squareX, squareY, squareSize, squareSize);
                    }

                    if (isIcons) {
                        // Use a pseudo-random seed based on position so symbols stay fixed relative to grid
                        const seed = Math.abs((colIndex * 15485863 + rowIndex * 2038074743) % symbols.length);
                        const symbol = symbols[seed];

                        ctx.fillStyle = borderColor; // Use border color for text
                        // Lower opacity for subtle background
                        ctx.globalAlpha = 0.15;
                        ctx.fillText(symbol, squareX + squareSize / 2, squareY + squareSize / 2);
                        ctx.globalAlpha = 1.0;
                    } else {
                        // Default Squares behavior
                        ctx.strokeStyle = borderColor;
                        ctx.lineWidth = 0.5;
                        ctx.strokeRect(squareX, squareY, squareSize, squareSize);
                    }
                }
            }
        };

        const updateAnimation = () => {
            switch (direction) {
                case 'right':
                    gridOffset.current.x = (gridOffset.current.x - speed) % squareSize;
                    break;
                case 'left':
                    gridOffset.current.x = (gridOffset.current.x + speed) % squareSize;
                    break;
                case 'down':
                    gridOffset.current.y = (gridOffset.current.y + speed) % squareSize;
                    break;
                case 'up':
                    gridOffset.current.y = (gridOffset.current.y - speed) % squareSize;
                    break;
                case 'diagonal':
                    gridOffset.current.x = (gridOffset.current.x - speed) % squareSize;
                    gridOffset.current.y = (gridOffset.current.y - speed) % squareSize;
                    break;
                default:
                    break;
            }

            drawGrid();
            requestRef.current = requestAnimationFrame(updateAnimation);
        };

        requestRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(requestRef.current);
        };
    }, [direction, speed, borderColor, hoverFillColor, hoveredSquare, squareSize, isIcons]);

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
        const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

        const hoveredX = Math.floor((x + (gridOffset.current.x % squareSize) - startX) / squareSize);
        const hoveredY = Math.floor((y + (gridOffset.current.y % squareSize) - startY) / squareSize);

        setHoveredSquare({ x: hoveredX, y: hoveredY });
    };

    const handleMouseLeave = () => {
        setHoveredSquare(null);
    };

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full border-none block"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
    );
};

export default Squares;
