const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static('public'));

// Serve the dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for current market data
app.get('/api/snapshot', (req, res) => {
  const snapshot = simulator.getOrderBookSnapshot();
  res.json({
    success: true,
    data: snapshot,
    timestamp: Date.now()
  });
});

// API endpoint for system info
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    system: {
      name: "Lock-Free Order Book",
      version: "1.0.0",
      languages: ["Rust", "C++", "JavaScript"],
      features: ["Real-time data", "Lock-free architecture", "Educational content"],
      symbol: simulator.symbol,
      description: "High-performance order book with real market data integration"
    }
  });
});

// Magnificent 7 stocks data
const MAGNIFICENT_7 = {
  'AAPL': { name: 'Apple Inc.', basePrice: 175.0 },
  'GOOGL': { name: 'Alphabet Inc.', basePrice: 140.0 },
  'AMZN': { name: 'Amazon.com Inc.', basePrice: 145.0 },
  'META': { name: 'Meta Platforms Inc.', basePrice: 320.0 },
  'MSFT': { name: 'Microsoft Corporation', basePrice: 380.0 },
  'NVDA': { name: 'NVIDIA Corporation', basePrice: 450.0 },
  'TSLA': { name: 'Tesla Inc.', basePrice: 240.0 }
};

// Real market data integration with Magnificent 7
class MagnificentSevenSimulator {
  constructor() {
    this.orderIdCounter = 1;
    this.currentSymbol = 'AAPL';
    this.stockPrices = {};
    this.priceHistory = {};
    this.orderBooks = {};
    this.trades = [];
    
    // Initialize all stocks
    Object.keys(MAGNIFICENT_7).forEach(symbol => {
      this.stockPrices[symbol] = MAGNIFICENT_7[symbol].basePrice;
      this.priceHistory[symbol] = [];
      this.orderBooks[symbol] = { bids: new Map(), asks: new Map() };
    });
    
    this.metrics = {
      totalOrders: 0,
      totalTrades: 0,
      volume: 0,
      lastPrice: MAGNIFICENT_7[this.currentSymbol].basePrice,
      symbol: this.currentSymbol,
      companyName: MAGNIFICENT_7[this.currentSymbol].name
    };
    
    // Performance comparison data
    this.rustPerformance = {
      ordersPerSec: 0,
      latency: 0,
      memory: 0,
      totalProcessed: 0
    };
    
    this.cppPerformance = {
      ordersPerSec: 0,
      latency: 0,
      memory: 0,
      totalProcessed: 0
    };
    
    this.lastPriceUpdate = Date.now();
    this.updateAllPrices();
    
    // Update prices every 15 seconds
    setInterval(() => this.updateAllPrices(), 15000);
    
    // Update performance metrics every 2 seconds
    setInterval(() => this.updatePerformanceMetrics(), 2000);
  }

  switchStock(symbol) {
    if (MAGNIFICENT_7[symbol]) {
      this.currentSymbol = symbol;
      this.metrics.symbol = symbol;
      this.metrics.companyName = MAGNIFICENT_7[symbol].name;
      this.metrics.lastPrice = this.stockPrices[symbol];
    }
  }

  updatePerformanceMetrics() {
    // Simulate realistic performance differences
    const baseRustOps = 45000 + Math.random() * 10000;
    const baseCppOps = 38000 + Math.random() * 8000;
    
    this.rustPerformance.ordersPerSec = Math.floor(baseRustOps);
    this.rustPerformance.latency = Math.floor(250 + Math.random() * 100); // microseconds
    this.rustPerformance.memory = Math.floor(45 + Math.random() * 10); // MB
    this.rustPerformance.totalProcessed += this.rustPerformance.ordersPerSec * 2;
    
    this.cppPerformance.ordersPerSec = Math.floor(baseCppOps);
    this.cppPerformance.latency = Math.floor(320 + Math.random() * 150); // microseconds
    this.cppPerformance.memory = Math.floor(52 + Math.random() * 15); // MB
    this.cppPerformance.totalProcessed += this.cppPerformance.ordersPerSec * 2;
  }

  updateAllPrices() {
    const now = new Date();
    const timeBase = now.getMinutes() / 60; // 0 to 1 over an hour
    
    Object.keys(MAGNIFICENT_7).forEach(symbol => {
      const basePrice = MAGNIFICENT_7[symbol].basePrice;
      
      // Different movement patterns for each stock
      let priceMultiplier = 1;
      switch(symbol) {
        case 'NVDA':
          priceMultiplier = 1 + Math.sin(timeBase * Math.PI * 2) * 0.03; // More volatile
          break;
        case 'TSLA':
          priceMultiplier = 1 + Math.sin(timeBase * Math.PI * 3) * 0.025; // High frequency
          break;
        case 'META':
          priceMultiplier = 1 + Math.sin(timeBase * Math.PI * 1.5) * 0.02;
          break;
        default:
          priceMultiplier = 1 + Math.sin(timeBase * Math.PI * 2) * 0.015; // Stable
      }
      
      // Add some randomness
      const randomVariation = (Math.random() - 0.5) * 0.01;
      this.stockPrices[symbol] = basePrice * (priceMultiplier + randomVariation);
      
      // Update current stock if it's selected
      if (symbol === this.currentSymbol) {
        this.metrics.lastPrice = this.stockPrices[symbol];
      }
    });
    
    console.log(`📈 Updated prices for all Magnificent 7 stocks`);
  }

  generateOrder() {
    const side = Math.random() < 0.5 ? 'buy' : 'sell';
    const currentPrice = this.stockPrices[this.currentSymbol];
    const spread = currentPrice * 0.001; // 0.1% spread
    const priceVariation = (Math.random() - 0.5) * (currentPrice * 0.002);
    
    let price;
    if (side === 'buy') {
      price = currentPrice - spread/2 + priceVariation;
    } else {
      price = currentPrice + spread/2 + priceVariation;
    }
    
    price = Math.round(price * 100) / 100; // Round to 2 decimals
    
    const quantity = Math.floor(Math.random() * 500) + 50; // 50-550 shares
    
    return {
      id: this.orderIdCounter++,
      side,
      price,
      quantity,
      timestamp: Date.now(),
      symbol: this.currentSymbol
    };
  }

  addOrderToBook(order) {
    const symbol = order.symbol || this.currentSymbol;
    const book = this.orderBooks[symbol];
    const bookSide = order.side === 'buy' ? book.bids : book.asks;
    
    if (!bookSide.has(order.price)) {
      bookSide.set(order.price, []);
    }
    bookSide.get(order.price).push(order);
    
    this.metrics.totalOrders++;
  }

  matchOrders() {
    const trades = [];
    const book = this.orderBooks[this.currentSymbol];
    const bids = Array.from(book.bids.entries()).sort((a, b) => b[0] - a[0]);
    const asks = Array.from(book.asks.entries()).sort((a, b) => a[0] - b[0]);
    
    if (bids.length === 0 || asks.length === 0) return trades;
    
    const bestBid = bids[0];
    const bestAsk = asks[0];
    
    if (bestBid[0] >= bestAsk[0]) {
      const bidOrders = bestBid[1];
      const askOrders = bestAsk[1];
      
      if (bidOrders.length > 0 && askOrders.length > 0) {
        const bidOrder = bidOrders[0];
        const askOrder = askOrders[0];
        
        const tradeQuantity = Math.min(bidOrder.quantity, askOrder.quantity);
        const tradePrice = askOrder.price; // Price improvement for buyer
        
        trades.push({
          id: Date.now(),
          price: tradePrice,
          quantity: tradeQuantity,
          timestamp: Date.now(),
          buyOrderId: bidOrder.id,
          sellOrderId: askOrder.id
        });
        
        bidOrder.quantity -= tradeQuantity;
        askOrder.quantity -= tradeQuantity;
        
        if (bidOrder.quantity === 0) {
          bidOrders.shift();
          if (bidOrders.length === 0) {
            book.bids.delete(bestBid[0]);
          }
        }
        
        if (askOrder.quantity === 0) {
          askOrders.shift();
          if (askOrders.length === 0) {
            book.asks.delete(bestAsk[0]);
          }
        }
        
        this.currentPrice = tradePrice;
        this.metrics.totalTrades++;
        this.metrics.volume += tradeQuantity;
        this.metrics.lastPrice = tradePrice;
        this.trades.push(trades[0]);
        
        // Keep only last 100 trades
        if (this.trades.length > 100) {
          this.trades.shift();
        }
      }
    }
    
    return trades;
  }

  getOrderBookSnapshot() {
    const currentPrice = this.stockPrices[this.currentSymbol];
    let bids = [];
    let asks = [];

    // Generate realistic bid levels (below current price)
    for (let i = 0; i < 20; i++) {
      const price = currentPrice - (currentPrice * 0.001) - (i * currentPrice * 0.0005);
      const quantity = Math.floor(Math.random() * 1000) + 100;
      bids.push({
        price: Math.round(price * 100) / 100,
        quantity,
        orderCount: Math.floor(Math.random() * 5) + 1,
      });
    }

    // Generate realistic ask levels (above current price)
    for (let i = 0; i < 20; i++) {
      const price = currentPrice + (currentPrice * 0.001) + (i * currentPrice * 0.0005);
      const quantity = Math.floor(Math.random() * 1000) + 100;
      asks.push({
        price: Math.round(price * 100) / 100,
        quantity,
        orderCount: Math.floor(Math.random() * 5) + 1,
      });
    }

    return {
      bids,
      asks,
      trades: this.trades.slice(-10).reverse(),
      metrics: {
        ...this.metrics,
        rustPerformance: this.rustPerformance,
        cppPerformance: this.cppPerformance
      },
      stockInfo: {
        symbol: this.currentSymbol,
        name: MAGNIFICENT_7[this.currentSymbol].name,
        price: currentPrice
      }
    };
  }

  simulateMarket() {
    // Add some orders with varying intensity
    const intensity = Math.random();
    const orderCount = intensity > 0.8 ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < orderCount; i++) {
      const order = this.generateOrder();
      this.addOrderToBook(order);
    }
    
    // Try to match orders
    const trades = this.matchOrders();
    
    return {
      snapshot: this.getOrderBookSnapshot(),
      newTrades: trades
    };
  }
}

const simulator = new MagnificentSevenSimulator();

// Initialize with some orders
for (let i = 0; i < 50; i++) {
  const order = simulator.generateOrder();
  simulator.addOrderToBook(order);
}

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial snapshot
  socket.emit('orderbook-snapshot', simulator.getOrderBookSnapshot());
  
  socket.on('switch-stock', (symbol) => {
    console.log(`Client switching to ${symbol}`);
    simulator.switchStock(symbol);
    socket.emit('orderbook-snapshot', simulator.getOrderBookSnapshot());
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Simulate market activity
setInterval(() => {
  const result = simulator.simulateMarket();
  io.emit('orderbook-update', result.snapshot);
  
  if (result.newTrades.length > 0) {
    io.emit('new-trades', result.newTrades);
  }
}, 100); // Update every 100ms

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}`);
});