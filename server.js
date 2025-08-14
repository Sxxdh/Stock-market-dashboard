const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // Change this to your MySQL password
    database: 'stockmarket'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('✅ Connected to MySQL database successfully');

    // Create database and tables
    initializeDatabase();
});

// Initialize database and tables
function initializeDatabase() {
    // Create database if it doesn't exist
    db.query('CREATE DATABASE IF NOT EXISTS stockmarket', (err) => {
        if (err) {
            console.error('❌ Error creating database:', err);
            return;
        }
        console.log('✅ Database created/verified successfully');

        // Use the database
        db.query('USE stockmarket', (err) => {
            if (err) {
                console.error('❌ Error using database:', err);
                return;
            }
            console.log('✅ Using stockmarket database');

            // Create tables
            createTables();
        });
    });
}

// Create necessary tables
function createTables() {
    // Create stocks table
    const createStocksTable = `
        CREATE TABLE IF NOT EXISTS stocks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            symbol VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            current_price DECIMAL(10,2) NOT NULL,
            change_amount DECIMAL(10,2) NOT NULL,
            change_percent DECIMAL(5,2) NOT NULL,
            volume BIGINT NOT NULL,
            market_cap DECIMAL(15,2) NOT NULL,
            week_high DECIMAL(10,2) NOT NULL,
            week_low DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    db.query(createStocksTable, (err) => {
        if (err) {
            console.error('❌ Error creating stocks table:', err);
            return;
        }
        console.log('✅ Stocks table created/verified successfully');

        // Create stock_prices table
        const createPricesTable = `
            CREATE TABLE IF NOT EXISTS stock_prices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                stock_symbol VARCHAR(20) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                interval_type ENUM('1m', '5m', '15m', '1h', '1d') NOT NULL,
                INDEX idx_stock_timestamp (stock_symbol, timestamp),
                INDEX idx_interval (interval_type)
            )
        `;

        db.query(createPricesTable, (err) => {
            if (err) {
                console.error('❌ Error creating stock_prices table:', err);
                return;
            }
            console.log('✅ Stock prices table created/verified successfully');

            // Insert sample data
            insertSampleData();
        });
    });
}

// Insert sample stock data
function insertSampleData() {
    const sampleStocks = [
        ['NIFTY50', 'NIFTY 50', 19425.35, 125.45, 0.65, 2500000, 2100000000000, 20150.00, 16800.00],
        ['SENSEX', 'S&P BSE SENSEX', 64200.50, 450.75, 0.71, 1800000, 3200000000000, 66500.00, 58000.00],
        ['RELIANCE', 'Reliance Industries', 2450.75, -25.50, -1.03, 5200000, 16500000000000, 2650.00, 2100.00],
        ['TCS', 'Tata Consultancy Services', 3850.25, 45.75, 1.20, 3100000, 14200000000000, 3950.00, 3200.00],
        ['INFY', 'Infosys Limited', 1450.80, 12.30, 0.86, 4800000, 6100000000000, 1500.00, 1200.00],
        ['HDFCBANK', 'HDFC Bank Limited', 1650.45, -15.20, -0.91, 6200000, 9800000000000, 1750.00, 1400.00],
        ['ICICIBANK', 'ICICI Bank Limited', 950.30, 8.75, 0.93, 7500000, 6700000000000, 980.00, 750.00],
        ['HINDUNILVR', 'Hindustan Unilever', 2850.90, 35.60, 1.26, 2800000, 6300000000000, 2900.00, 2400.00],
        ['ITC', 'ITC Limited', 450.75, 5.25, 1.18, 8900000, 5600000000000, 460.00, 380.00],
        ['SBIN', 'State Bank of India', 650.20, -8.90, -1.35, 12300000, 5800000000000, 680.00, 550.00],
        ['AXISBANK', 'Axis Bank Limited', 950.45, 12.80, 1.36, 5700000, 2900000000000, 980.00, 800.00],
        ['WIPRO', 'Wipro Limited', 450.30, -3.45, -0.76, 6800000, 2400000000000, 480.00, 380.00],
        ['TATAMOTORS', 'Tata Motors Limited', 750.80, 18.90, 2.58, 9200000, 2500000000000, 780.00, 600.00],
        ['MARUTI', 'Maruti Suzuki India', 10500.75, 125.50, 1.21, 1200000, 3100000000000, 10800.00, 9200.00],
        ['HCLTECH', 'HCL Technologies', 1250.60, 22.40, 1.82, 4100000, 3400000000000, 1280.00, 1050.00]
    ];

    const insertQuery = `
        INSERT IGNORE INTO stocks 
        (symbol, name, current_price, change_amount, change_percent, volume, market_cap, week_high, week_low) 
        VALUES ?
    `;

    db.query(insertQuery, [sampleStocks], (err, result) => {
        if (err) {
            console.error('❌ Error inserting sample data:', err);
            return;
        }
        console.log('✅ Sample stock data inserted successfully');

        // Insert some sample price history
        insertSamplePriceHistory();
    });
}

// Insert sample price history
function insertSamplePriceHistory() {
    const symbols = ['NIFTY50', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];
    const intervals = ['1m', '5m', '15m', '1h', '1d'];

    symbols.forEach(symbol => {
        intervals.forEach(interval => {
            const prices = generateSamplePrices(100);
            const values = prices.map(price => [symbol, price, interval]);

            const insertQuery = `
                INSERT IGNORE INTO stock_prices (stock_symbol, price, interval_type) 
                VALUES ?
            `;

            db.query(insertQuery, [values], (err) => {
                if (err) {
                    console.error(`❌ Error inserting price history for ${symbol}:`, err);
                }
            });
        });
    });

    console.log('✅ Sample price history inserted successfully');
}

// Generate sample price data
function generateSamplePrices(count) {
    const prices = [];
    let basePrice = 1000 + Math.random() * 9000;

    for (let i = 0; i < count; i++) {
        const change = (Math.random() - 0.5) * 0.02; // ±1% change
        basePrice *= (1 + change);
        prices.push(parseFloat(basePrice.toFixed(2)));
    }

    return prices;
}

// API Routes

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all stocks
app.get('/api/stocks', (req, res) => {
    const query = 'SELECT * FROM stocks ORDER BY symbol';

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching stocks:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }
        res.json(results);
    });
});

// Get stock by symbol
app.get('/api/stocks/:symbol', (req, res) => {
    const { symbol } = req.params;
    const query = 'SELECT * FROM stocks WHERE symbol = ?';

    db.query(query, [symbol], (err, results) => {
        if (err) {
            console.error('❌ Error fetching stock:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }

        res.json(results[0]);
    });
});

// Get stock prices for chart
app.get('/api/stocks/:symbol/prices', (req, res) => {
    const { symbol } = req.params;
    const { interval = '1m' } = req.query;

    let timeFilter;
    switch (interval) {
        case '1m':
            timeFilter = 'AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)';
            break;
        case '5m':
            timeFilter = 'AND timestamp >= DATE_SUB(NOW(), INTERVAL 4 HOURS)';
            break;
        case '15m':
            timeFilter = 'AND timestamp >= DATE_SUB(NOW(), INTERVAL 12 HOURS)';
            break;
        case '1h':
            timeFilter = 'AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
            break;
        case '1d':
            timeFilter = 'AND timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAYS)';
            break;
        default:
            timeFilter = 'AND timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)';
    }

    const query = `
        SELECT price, timestamp 
        FROM stock_prices 
        WHERE stock_symbol = ? AND interval_type = ? ${timeFilter}
        ORDER BY timestamp ASC
    `;

    db.query(query, [symbol, interval], (err, results) => {
        if (err) {
            console.error('❌ Error fetching stock prices:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        res.json(results);
    });
});

// Update stock price
app.put('/api/stocks/:symbol/price', (req, res) => {
    const { symbol } = req.params;
    const { price, change_amount, change_percent, volume } = req.body;

    if (!price) {
        res.status(400).json({ error: 'Price is required' });
        return;
    }

    const updateQuery = `
        UPDATE stocks 
        SET current_price = ?, change_amount = ?, change_percent = ?, volume = ?, updated_at = CURRENT_TIMESTAMP
        WHERE symbol = ?
    `;

    db.query(updateQuery, [price, change_amount || 0, change_percent || 0, volume || 0, symbol], (err, result) => {
        if (err) {
            console.error('❌ Error updating stock price:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        // Insert price history
        const insertPriceQuery = `
            INSERT INTO stock_prices (stock_symbol, price, interval_type) 
            VALUES (?, ?, '1m')
        `;

        db.query(insertPriceQuery, [symbol, price], (err) => {
            if (err) {
                console.error('❌ Error inserting price history:', err);
            }
        });

        res.json({ message: 'Stock price updated successfully', symbol, price });
    });
});

// Search stocks
app.get('/api/stocks/search/:query', (req, res) => {
    const { query } = req.params;
    const searchQuery = `
        SELECT * FROM stocks 
        WHERE symbol LIKE ? OR name LIKE ?
        ORDER BY symbol
    `;

    const searchTerm = `%${query}%`;

    db.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.error('❌ Error searching stocks:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        res.json(results);
    });
});

// Get market summary
app.get('/api/market/summary', (req, res) => {
    const summaryQuery = `
        SELECT 
            COUNT(*) as total_stocks,
            ROUND(AVG(current_price), 2) as avg_price,
            SUM(volume) as total_volume,
            SUM(market_cap) as total_market_cap,
            COUNT(CASE WHEN change_percent > 0 THEN 1 END) as gainers,
            COUNT(CASE WHEN change_percent < 0 THEN 1 END) as losers
        FROM stocks
    `;

    db.query(summaryQuery, (err, results) => {
        if (err) {
            console.error('❌ Error fetching market summary:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        res.json(results[0]);
    });
});

// Get top gainers and losers
app.get('/api/market/top-movers', (req, res) => {
    const topMoversQuery = `
        SELECT symbol, name, current_price, change_percent, volume
        FROM stocks
        ORDER BY ABS(change_percent) DESC
        LIMIT 10
    `;

    db.query(topMoversQuery, (err, results) => {
        if (err) {
            console.error('❌ Error fetching top movers:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }

        res.json(results);
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: db.state === 'authenticated' ? 'connected' : 'disconnected'
    });
});

// Simulate real-time price updates
function simulatePriceUpdates() {
    const updateQuery = `
        UPDATE stocks 
        SET 
            current_price = current_price + (RAND() - 0.5) * current_price * 0.01,
            change_amount = (RAND() - 0.5) * current_price * 0.01,
            change_percent = (RAND() - 0.5) * 1,
            volume = volume + FLOOR(RAND() * 50000),
            updated_at = CURRENT_TIMESTAMP
    `;

    db.query(updateQuery, (err) => {
        if (err) {
            console.error('❌ Error simulating price updates:', err);
        }
    });
}

// Start price simulation after 10 seconds
setTimeout(() => {
    console.log('🔄 Starting price simulation...');
    setInterval(simulatePriceUpdates, 10000); // Update every 10 seconds
}, 10000);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found', path: req.path });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Stock Market Dashboard server started successfully!');
    console.log(`�� Server running on: http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at: http://localhost:${PORT}/api`);
    console.log(`🌐 Open your browser and navigate to: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.end((err) => {
        if (err) {
            console.error('❌ Error closing database connection:', err);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    db.end((err) => {
        if (err) {
            console.error('❌ Error closing database connection:', err);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = app;