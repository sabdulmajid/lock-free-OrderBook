# 🚀 Lock-Free Order Book Dashboard

A real-time visualization dashboard for the lock-free order book implementation, showcasing live market data, order book depth, and performance metrics.

## Features

- **Real-time Order Book Visualization** - Live depth chart with bids/asks
- **Trade Stream** - Recent trades with timestamps and prices  
- **Performance Metrics** - Orders/sec, total volume, trade count
- **Price Chart** - Live price movement visualization
- **WebSocket Integration** - Low-latency real-time updates
- **Responsive Design** - Works on desktop and mobile

## Quick Start

### Option 1: Node.js Dashboard (Recommended for Demo)

```bash
cd web-dashboard
npm install
npm start
```

Visit `http://localhost:3000` to see the dashboard in action!

### Option 2: Rust WebSocket Server + Dashboard

```bash
# Terminal 1: Start Rust WebSocket server
cd rust
cargo run --bin websocket_server

# Terminal 2: Start Node.js dashboard (modify to connect to Rust server)
cd web-dashboard
npm start
```

## Architecture

```
┌─────────────────┐    WebSocket    ┌──────────────────┐
│   Web Dashboard │ ◄──────────────► │  Market Simulator │
│   (JavaScript)  │                 │   (Node.js/Rust)  │
└─────────────────┘                 └──────────────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │ Lock-Free Order  │
                                    │      Book        │
                                    │   (Rust/C++)     │
                                    └──────────────────┘
```

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Chart.js
- **Backend**: Node.js + Socket.IO (demo) / Rust + Tokio (production)
- **WebSocket**: Real-time bidirectional communication
- **Order Book**: Lock-free implementation in Rust/C++

## Deployment

### Heroku (Easy)

```bash
# In web-dashboard directory
echo "web: node server.js" > Procfile
git init
git add .
git commit -m "Initial commit"
heroku create your-orderbook-dashboard
git push heroku main
```

### Railway (Recommended)

1. Connect your GitHub repo to Railway
2. Deploy the `web-dashboard` directory
3. Set environment variables if needed
4. Get your public URL!

### Vercel/Netlify

For static hosting, you can deploy just the frontend and connect to a separate WebSocket server.

## Performance

The dashboard handles:
- **100+ updates/second** without lag
- **Real-time order book** with 20 price levels each side
- **Live trade stream** with automatic scrolling
- **Responsive charts** with smooth animations

## Customization

### Market Simulation Parameters

Edit `server.js` to modify:
- Order generation frequency
- Price volatility
- Spread width
- Market depth

### Visual Styling

Edit `public/styles.css` to customize:
- Color scheme
- Layout
- Animations
- Responsive breakpoints

### Chart Configuration

Edit `public/dashboard.js` to modify:
- Chart update frequency
- Data retention period
- Visual indicators

## API Reference

### WebSocket Events

**Client → Server:**
- `connect` - Establish connection

**Server → Client:**
- `orderbook-snapshot` - Initial order book state
- `orderbook-update` - Incremental updates
- `new-trades` - Recent trade executions

### Data Formats

```javascript
// Order Book Snapshot
{
  "bids": [{"price": 99.50, "quantity": 1000, "orderCount": 3}],
  "asks": [{"price": 100.50, "quantity": 800, "orderCount": 2}],
  "trades": [{"price": 100.00, "quantity": 50, "timestamp": 1640995200000}],
  "metrics": {"totalOrders": 1500, "totalTrades": 45, "volume": 12500}
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for high-frequency trading enthusiasts**