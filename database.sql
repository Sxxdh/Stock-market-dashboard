-- Stock Market Dashboard Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS stockmarket;
USE stockmarket;

-- Stocks table
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_symbol (symbol),
    INDEX idx_change_percent (change_percent),
    INDEX idx_volume (volume)
);

-- Stock prices history table
CREATE TABLE IF NOT EXISTS stock_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_symbol VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interval_type ENUM('1m', '5m', '15m', '1h', '1d') NOT NULL,
    
    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE CASCADE,
    INDEX idx_stock_timestamp (stock_symbol, timestamp),
    INDEX idx_interval (interval_type)
);

-- Market sessions table
CREATE TABLE IF NOT EXISTS market_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_date DATE NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    status ENUM('open', 'closed', 'pre_market', 'post_market') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_session_date (session_date)
);

-- User watchlist table (for future features)
CREATE TABLE IF NOT EXISTS user_watchlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    stock_symbol VARCHAR(20) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE CASCADE,
    UNIQUE KEY unique_user_stock (user_id, stock_symbol)
);

-- Insert sample data
INSERT IGNORE INTO stocks (symbol, name, current_price, change_amount, change_percent, volume, market_cap, week_high, week_low) VALUES
('NIFTY50', 'NIFTY 50', 19425.35, 125.45, 0.65, 2500000, 2100000000000, 20150.00, 16800.00),
('SENSEX', 'S&P BSE SENSEX', 64200.50, 450.75, 0.71, 1800000, 3200000000000, 66500.00, 58000.00),
('RELIANCE', 'Reliance Industries', 2450.75, -25.50, -1.03, 5200000, 16500000000000, 2650.00, 2100.00),
('TCS', 'Tata Consultancy Services', 3850.25, 45.75, 1.20, 3100000, 14200000000000, 3950.00, 3200.00),
('INFY', 'Infosys Limited', 1450.80, 12.30, 0.86, 4800000, 6100000000000, 1500.00, 1200.00),
('HDFCBANK', 'HDFC Bank Limited', 1650.45, -15.20, -0.91, 6200000, 9800000000000, 1750.00, 1400.00),
('ICICIBANK', 'ICICI Bank Limited', 950.30, 8.75, 0.93, 7500000, 6700000000000, 980.00, 750.00),
('HINDUNILVR', 'Hindustan Unilever', 2850.90, 35.60, 1.26, 2800000, 6300000000000, 2900.00, 2400.00),
('ITC', 'ITC Limited', 450.75, 5.25, 1.18, 8900000, 5600000000000, 460.00, 380.00),
('SBIN', 'State Bank of India', 650.20, -8.90, -1.35, 12300000, 5800000000000, 680.00, 550.00),
('AXISBANK', 'Axis Bank Limited', 950.45, 12.80, 1.36, 5700000, 2900000000000, 980.00, 800.00),
('WIPRO', 'Wipro Limited', 450.30, -3.45, -0.76, 6800000, 2400000000000, 480.00, 380.00),
('TATAMOTORS', 'Tata Motors Limited', 750.80, 18.90, 2.58, 9200000, 2500000000000, 780.00, 600.00),
('MARUTI', 'Maruti Suzuki India', 10500.75, 125.50, 1.21, 1200000, 3100000000000, 10800.00, 9200.00),
('HCLTECH', 'HCL Technologies', 1250.60, 22.40, 1.82, 4100000, 3400000000000, 1280.00, 1050.00);

-- Create views for common queries
CREATE OR REPLACE VIEW market_summary AS
SELECT 
    COUNT(*) as total_stocks,
    AVG(current_price) as avg_price,
    SUM(volume) as total_volume,
    SUM(market_cap) as total_market_cap,
    COUNT(CASE WHEN change_percent > 0 THEN 1 END) as gainers,
    COUNT(CASE WHEN change_percent < 0 THEN 1 END) as losers,
    AVG(change_percent) as avg_change_percent
FROM stocks;

CREATE OR REPLACE VIEW top_gainers AS
SELECT symbol, name, current_price, change_percent, volume
FROM stocks
WHERE change_percent > 0
ORDER BY change_percent DESC
LIMIT 10;

CREATE OR REPLACE VIEW top_losers AS
SELECT symbol, name, current_price, change_percent, volume
FROM stocks
WHERE change_percent < 0
ORDER BY change_percent ASC
LIMIT 10;