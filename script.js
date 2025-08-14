// Stock Market Dashboard - Main JavaScript File

class StockMarketDashboard {
    constructor() {
        this.currentStock = 'NIFTY50';
        this.currentInterval = '1m';
        this.chart = null;
        this.stockData = {};
        this.init();
    }

    init() {
        this.initializeData();
        this.setupEventListeners();
        this.updateTime();
        this.renderStockList();
        this.initializeChart();
        this.startRealTimeUpdates();

        // Set initial active stock
        this.selectStock('NIFTY50');
    }

    // Sample stock data (NSE & BSE)
    initializeData() {
        this.stockData = {
            'NIFTY50': {
                name: 'NIFTY 50',
                symbol: 'NIFTY50',
                currentPrice: 19425.35,
                change: 125.45,
                changePercent: 0.65,
                volume: '2.5M',
                marketCap: '₹2.1T',
                weekHigh: 20150.00,
                weekLow: 16800.00,
                data: this.generateChartData(19425.35, 0.65)
            },
            'SENSEX': {
                name: 'S&P BSE SENSEX',
                symbol: 'SENSEX',
                currentPrice: 64200.50,
                change: 450.75,
                changePercent: 0.71,
                volume: '1.8M',
                marketCap: '₹3.2T',
                weekHigh: 66500.00,
                weekLow: 58000.00,
                data: this.generateChartData(64200.50, 0.71)
            },
            'RELIANCE': {
                name: 'Reliance Industries',
                symbol: 'RELIANCE',
                currentPrice: 2450.75,
                change: -25.50,
                changePercent: -1.03,
                volume: '5.2M',
                marketCap: '₹16.5T',
                weekHigh: 2650.00,
                weekLow: 2100.00,
                data: this.generateChartData(2450.75, -1.03)
            },
            'TCS': {
                name: 'Tata Consultancy Services',
                symbol: 'TCS',
                currentPrice: 3850.25,
                change: 45.75,
                changePercent: 1.20,
                volume: '3.1M',
                marketCap: '₹14.2T',
                weekHigh: 3950.00,
                weekLow: 3200.00,
                data: this.generateChartData(3850.25, 1.20)
            },
            'INFY': {
                name: 'Infosys Limited',
                symbol: 'INFY',
                currentPrice: 1450.80,
                change: 12.30,
                changePercent: 0.86,
                volume: '4.8M',
                marketCap: '₹6.1T',
                weekHigh: 1500.00,
                weekLow: 1200.00,
                data: this.generateChartData(1450.80, 0.86)
            },
            'HDFCBANK': {
                name: 'HDFC Bank Limited',
                symbol: 'HDFCBANK',
                currentPrice: 1650.45,
                change: -15.20,
                changePercent: -0.91,
                volume: '6.2M',
                marketCap: '₹9.8T',
                weekHigh: 1750.00,
                weekLow: 1400.00,
                data: this.generateChartData(1650.45, -0.91)
            },
            'ICICIBANK': {
                name: 'ICICI Bank Limited',
                symbol: 'ICICIBANK',
                currentPrice: 950.30,
                change: 8.75,
                changePercent: 0.93,
                volume: '7.5M',
                marketCap: '₹6.7T',
                weekHigh: 980.00,
                weekLow: 750.00,
                data: this.generateChartData(950.30, 0.93)
            },
            'HINDUNILVR': {
                name: 'Hindustan Unilever',
                symbol: 'HINDUNILVR',
                currentPrice: 2850.90,
                change: 35.60,
                changePercent: 1.26,
                volume: '2.8M',
                marketCap: '₹6.3T',
                weekHigh: 2900.00,
                weekLow: 2400.00,
                data: this.generateChartData(2850.90, 1.26)
            },
            'ITC': {
                name: 'ITC Limited',
                symbol: 'ITC',
                currentPrice: 450.75,
                change: 5.25,
                changePercent: 1.18,
                volume: '8.9M',
                marketCap: '₹5.6T',
                weekHigh: 460.00,
                weekLow: 380.00,
                data: this.generateChartData(450.75, 1.18)
            },
            'SBIN': {
                name: 'State Bank of India',
                symbol: 'SBIN',
                currentPrice: 650.20,
                change: -8.90,
                changePercent: -1.35,
                volume: '12.3M',
                marketCap: '₹5.8T',
                weekHigh: 680.00,
                weekLow: 550.00,
                data: this.generateChartData(650.20, -1.35)
            },
            'AXISBANK': {
                name: 'Axis Bank Limited',
                symbol: 'AXISBANK',
                currentPrice: 950.45,
                change: 12.80,
                changePercent: 1.36,
                volume: '5.7M',
                marketCap: '₹2.9T',
                weekHigh: 980.00,
                weekLow: 800.00,
                data: this.generateChartData(950.45, 1.36)
            },
            'WIPRO': {
                name: 'Wipro Limited',
                symbol: 'WIPRO',
                currentPrice: 450.30,
                change: -3.45,
                changePercent: -0.76,
                volume: '6.8M',
                marketCap: '₹2.4T',
                weekHigh: 480.00,
                weekLow: 380.00,
                data: this.generateChartData(450.30, -0.76)
            },
            'TATAMOTORS': {
                name: 'Tata Motors Limited',
                symbol: 'TATAMOTORS',
                currentPrice: 750.80,
                change: 18.90,
                changePercent: 2.58,
                volume: '9.2M',
                marketCap: '₹2.5T',
                weekHigh: 780.00,
                weekLow: 600.00,
                data: this.generateChartData(750.80, 2.58)
            },
            'MARUTI': {
                name: 'Maruti Suzuki India',
                symbol: 'MARUTI',
                currentPrice: 10500.75,
                change: 125.50,
                changePercent: 1.21,
                volume: '1.2M',
                marketCap: '₹3.1T',
                weekHigh: 10800.00,
                weekLow: 9200.00,
                data: this.generateChartData(10500.75, 1.21)
            },
            'HCLTECH': {
                name: 'HCL Technologies',
                symbol: 'HCLTECH',
                currentPrice: 1250.60,
                change: 22.40,
                changePercent: 1.82,
                volume: '4.1M',
                marketCap: '₹3.4T',
                weekHigh: 1280.00,
                weekLow: 1050.00,
                data: this.generateChartData(1250.60, 1.82)
            }
        };
    }

    generateChartData(basePrice, volatility) {
        const data = [];
        const labels = [];
        let currentPrice = basePrice;

        for (let i = 0; i < 100; i++) {
            const change = (Math.random() - 0.5) * volatility * 2;
            currentPrice += change;
            data.push(currentPrice);

            if (i % 20 === 0) {
                labels.push(`${i}m`);
            } else {
                labels.push('');
            }
        }

        return { labels, data };
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-btn').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Time interval buttons
        document.querySelectorAll('.interval-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeInterval(e.target.dataset.interval);
            });
        });

        // Stock search
        document.getElementById('stock-search').addEventListener('input', (e) => {
            this.filterStocks(e.target.value);
        });
    }

    toggleTheme() {
        const body = document.body;
        const themeBtn = document.getElementById('theme-btn');

        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            themeBtn.textContent = '🌙';
        } else {
            body.classList.add('light-theme');
            themeBtn.textContent = '☀️';
        }
    }

    changeInterval(interval) {
        this.currentInterval = interval;

        // Update active button
        document.querySelectorAll('.interval-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-interval="${interval}"]`).classList.add('active');

        // Update chart data based on interval
        this.updateChartData();
    }

    filterStocks(query) {
        const stockItems = document.querySelectorAll('.stock-item');
        const queryLower = query.toLowerCase();

        stockItems.forEach(item => {
            const symbol = item.querySelector('.stock-symbol').textContent.toLowerCase();
            const name = item.querySelector('.stock-name').textContent.toLowerCase();

            if (symbol.includes(queryLower) || name.includes(queryLower)) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    }

    renderStockList() {
        const stockList = document.getElementById('stock-list');
        stockList.innerHTML = '';

        Object.values(this.stockData).forEach(stock => {
            const stockItem = document.createElement('div');
            stockItem.className = 'stock-item';
            stockItem.dataset.symbol = stock.symbol;

            const changeClass = stock.change >= 0 ? 'positive' : 'negative';
            const changeSymbol = stock.change >= 0 ? '+' : '';

            stockItem.innerHTML = `
                <div class="stock-header">
                    <span class="stock-symbol">${stock.symbol}</span>
                    <span class="stock-price">₹${stock.currentPrice.toFixed(2)}</span>
                </div>
                <div class="stock-name">${stock.name}</div>
                <div class="stock-change ${changeClass}">
                    ${changeSymbol}${stock.change.toFixed(2)} (${changeSymbol}${stock.changePercent.toFixed(2)}%)
                </div>
            `;

            stockItem.addEventListener('click', () => {
                this.selectStock(stock.symbol);
            });

            stockList.appendChild(stockItem);
        });
    }

    selectStock(symbol) {
        // Remove active class from all stocks
        document.querySelectorAll('.stock-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to selected stock
        document.querySelector(`[data-symbol="${symbol}"]`).classList.add('active');

        this.currentStock = symbol;
        this.updateStockDisplay();
        this.updateChartData();
    }

    updateStockDisplay() {
        const stock = this.stockData[this.currentStock];
        if (!stock) return;

        document.getElementById('selected-stock-name').textContent = stock.name;
        document.getElementById('current-price').textContent = `₹${stock.currentPrice.toFixed(2)}`;

        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = stock.change >= 0 ? '+' : '';

        document.getElementById('price-change').textContent =
            `${changeSymbol}${stock.change.toFixed(2)} (${changeSymbol}${stock.changePercent.toFixed(2)}%)`;
        document.getElementById('price-change').className = `price-change ${changeClass}`;

        document.getElementById('week-high').textContent = `₹${stock.weekHigh.toFixed(2)}`;
        document.getElementById('week-low').textContent = `₹${stock.weekLow.toFixed(2)}`;
        document.getElementById('volume').textContent = stock.volume;
        document.getElementById('market-cap').textContent = stock.marketCap;
    }

    initializeChart() {
        const ctx = document.getElementById('stock-chart').getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Stock Price',
                    data: [],
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#ff6b35',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ff6b35',
                        bodyColor: '#ffffff',
                        borderColor: '#ff6b35',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#888',
                            font: {
                                size: 10
                            },
                            callback: function (value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    updateChartData() {
        const stock = this.stockData[this.currentStock];
        if (!stock || !this.chart) return;

        // Generate new data based on current interval
        const newData = this.generateChartData(stock.currentPrice, stock.changePercent / 100);

        this.chart.data.labels = newData.labels;
        this.chart.data.datasets[0].data = newData.data;
        this.chart.update('active');
    }

    updateTime() {
        const timeElement = document.getElementById('current-time');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;

        setTimeout(() => this.updateTime(), 1000);
    }

    startRealTimeUpdates() {
        // Simulate real-time price updates
        setInterval(() => {
            Object.keys(this.stockData).forEach(symbol => {
                const stock = this.stockData[symbol];
                const change = (Math.random() - 0.5) * 2;
                stock.currentPrice += change;
                stock.change += change;
                stock.changePercent = (stock.change / (stock.currentPrice - stock.change)) * 100;
            });

            if (this.currentStock) {
                this.updateStockDisplay();
                this.renderStockList();
            }
        }, 5000);
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StockMarketDashboard();
});

// Add some CSS animations for enhanced UX
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .stock-item:hover .stock-symbol {
        animation: pulse 1s infinite;
    }
    
    .chart-container canvas {
        transition: all 0.3s ease;
    }
    
    .stat-card:hover .stat-value {
        color: #ff6b35;
        transition: color 0.3s ease;
    }
`;
document.head.appendChild(style);