# Lock-Free Order Book (Rust & C++)

A high-performance, lock-free limit order book implementation with dual implementations in Rust and C++, featuring a real-time web dashboard for market data visualization and performance analysis.

## Features

- **Lock-Free Architecture**: Atomic operations and lock-free data structures for maximum throughput
- **Dual Implementation**: Complete system implemented in both Rust and C++ for performance comparison
- **Real-Time Dashboard**: Live order book visualization with WebSocket streaming
- **Market Simulation**: Realistic order flow and price movement simulation
- **Performance Benchmarking**: Comprehensive benchmarks comparing both implementations
- **Educational Platform**: Interactive tooltips and explanations of trading concepts

## Architecture

The system demonstrates advanced concurrent programming concepts through lock-free data structures, comparing the performance characteristics of Rust's memory safety guarantees with C++'s manual memory management approach.

## Project Structure

```
lock-free-order-book/
├── rust/                    # Rust implementation
│   ├── src/
│   │   ├── order_book.rs    # Core order book logic
│   │   ├── market_simulator.rs # Market data simulation
│   │   └── websocket_server.rs # WebSocket API server
│   └── benches/             # Performance benchmarks
├── cpp/                     # C++ implementation
│   ├── src/                 # Core C++ order book
│   └── benches/             # C++ benchmarks
├── web-dashboard/           # Real-time web dashboard
│   ├── public/              # Frontend assets
│   ├── server.js            # Node.js WebSocket server
│   └── package.json         # Dependencies
├── data/                    # Sample trading data
└── scripts/                 # Automation scripts
```

## Quick Start

### Web Dashboard

```bash
cd web-dashboard
npm install
npm start
```

Visit http://localhost:3000 to access the dashboard.

### Deployment

The web dashboard can be deployed to various platforms:

**Railway:**
1. Fork this repository
2. Connect to Railway.app
3. Deploy the web-dashboard directory

**Heroku:**
```bash
cd web-dashboard
git init && git add . && git commit -m "Deploy"
heroku create your-app-name
git push heroku main
```

### Rust Implementation

```bash
cd rust
cargo build --release

# Run basic order book
cargo run --bin order_book_rust

# Run WebSocket server
cargo run --bin websocket_server
```

### C++ Implementation

```bash
mkdir -p cpp/build && cd cpp/build
cmake .. && make
./order_book_cpp
```

### Performance Benchmarks

```bash
# Rust benchmarks
cd rust && cargo bench

# C++ benchmarks  
cd cpp/build && ./order_book_benches
```

## Dashboard Features

The web dashboard provides real-time visualization of:

- **Order Book Depth**: Live bid/ask visualization with multiple price levels
- **Trade Stream**: Real-time trade executions with price and volume data
- **Performance Metrics**: Orders per second, latency, and throughput statistics
- **Price Movement**: Live price charts with smooth animations
- **System Comparison**: Side-by-side Rust vs C++ performance analysis

### Architecture Overview

```
┌─────────────────┐    WebSocket     ┌──────────────────┐
│   Web Dashboard │ ◄──────────────► │  Market Simulator │
│   (JavaScript)  │                  │   (Node.js/Rust) │
└─────────────────┘                  └──────────────────┘
                                               │
                                               ▼
                                     ┌──────────────────┐
                                     │ Lock-Free Order  │
                                     │      Book        │
                                     │   (Rust/C++)     │
                                     └──────────────────┘
```

## Performance Benchmarks

### Single-Threaded Performance

Both implementations were benchmarked on single-threaded operations to establish baseline performance characteristics.

#### Rust Implementation

| Operation            | Time     | Throughput    |
| -------------------- | -------- | ------------- |
| Insert 10K orders    | 271 µs   | ~37M ops/sec  |
| Cancel 1K orders     | 14.3 µs  | ~70M ops/sec  |
| Modify 1K orders     | 135.5 µs | ~7.4M ops/sec |
| Match vs 1K orders   | 392 ns   | ~2.5M ops/sec |
| Match vs 100K orders | 41.36 µs | ~2.4M ops/sec |

#### C++ Implementation

| Operation            | Time     | Throughput    |
| -------------------- | -------- | ------------- |
| Insert 10K orders    | 197.6 µs | ~51M ops/sec  |
| Cancel 1K orders     | 513.7 µs | ~1.9M ops/sec |
| Modify 1K orders     | 319.2 µs | ~3.1M ops/sec |
| Match vs 1K orders   | 7.4 µs   | ~135K ops/sec |
| Match vs 100K orders | 1.1 ms   | ~91K ops/sec  |

### Concurrent Benchmarks

Multi-threaded performance using lock-free queues and concurrent order processing:

#### Rust Concurrent Performance

| Test                              | Time (ms) |
| --------------------------------- | --------- |
| SPSC Queue (100k ops)             | ~1.63     |
| MPSC Queue (4×50k ops)            | ~6.13     |
| Concurrent Order Book (4×10k ops) | ~8.2      |

#### C++ Concurrent Performance

| Test                              | Time (ms) |
| --------------------------------- | --------- |
| SPSC Queue (100k ops)             | ~2.50     |
| MPSC Queue (4×50k ops)            | ~8.20     |
| Concurrent Order Book (4×10k ops) | ~12.3     |

### Analysis

**Rust Advantages:**
- Superior order cancellation performance (36x faster)
- Better matching engine performance (19x faster)
- More efficient concurrent operations

**C++ Advantages:**
- Faster bulk order insertions (27% improvement)
- More predictable memory allocation patterns
- Easier integration with existing trading infrastructure

Both implementations maintain O(log n) complexity for price-time priority operations while demonstrating the trade-offs between memory safety and raw performance.

## Use Cases

- **Trading System Development**: Foundation for high-frequency trading platforms
- **Algorithm Research**: Backtest trading strategies with realistic market simulation  
- **Performance Analysis**: Compare lock-free vs traditional concurrent approaches
- **Educational Platform**: Learn lock-free programming and market microstructure
- **Portfolio Demonstration**: Showcase advanced systems programming skills

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Technical Implementation

Built using modern Rust and C++ best practices, demonstrating advanced concurrent programming techniques including lock-free data structures, atomic operations, and memory ordering constraints. The WebSocket implementation follows industry standards for real-time financial data distribution.
