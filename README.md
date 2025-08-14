# StockMarket Pro - Real-time Trading Dashboard

A sophisticated, modern stock market dashboard built with HTML5, CSS3, JavaScript, Node.js, and MySQL. Features a sleek orange and black dark theme with real-time data visualization using Chart.js.

## Features

- 🎨 **Modern Dark Theme**: Sleek orange and black color scheme with glassmorphism effects
- �� **Real-time Charts**: Interactive charts using Chart.js with multiple time intervals
- 📱 **Responsive Design**: Mobile-friendly interface that works on all devices
- 🔍 **Stock Search**: Real-time search functionality for stocks
- �� **Live Data**: Simulated real-time stock price updates
- 🗄️ **MySQL Database**: Robust data storage with sample NSE & BSE data
- ⚡ **Performance**: Optimized animations and smooth transitions
- 🎭 **Animations**: CSS animations and opacity effects for enhanced UX

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Styling**: Custom CSS with CSS Grid & Flexbox

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-market-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL Database**
   - Install MySQL on your system
   - Create a database user and update credentials in `server.js`
   - Run the database schema: `mysql -u root -p < database.sql`

4. **Configure environment**
   - Update database connection details in `server.js`
   - Modify port if needed (default: 3000)

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

6. **Open in browser**
   - Navigate to `http://localhost:3000`


