# Lock-Free Order Book (Rust & C++)

This project is a dual-implementation of a lock-free limit order book in Rust and C++. The goal is to benchmark and compare the performance of both implementations, while also showcasing a functioning (lock-free!) order book.

## Project Structure

- `cpp/`: C++ implementation
- `data/`: Sample data for testing and benchmarking
- `rust/`: Rust implementation
- `scripts/`: Helper scripts for automation, analysis, etc.

## Compilation

### C++
The C++ project uses CMake. To build:
```bash
mkdir -p cpp/build
cd cpp/build
cmake ..
make
```

### Rust
The Rust project uses Cargo. Ensure you have Rust installed. To build:
```bash
cd rust
cargo build
```

## Benchmarks

To run the benchmarks for the Rust implementation, use:
```bash
cd rust
cargo bench
```

### Initial Benchmark Results (Rust)

These benchmarks were run on a single thread and represent the baseline performance of the non-concurrent implementation.

| Benchmark               | Time          | Notes                               |
| ----------------------- | ------------- | ----------------------------------- |
| `add_10k_orders`        | ~271 µs       | Time to add 10,000 orders.          |
| `cancel_1k_orders`      | ~14 µs        | Time to cancel 1,000 random orders. |
| `modify_1k_orders`      | ~135 µs       | Time to modify 1,000 random orders. |
| `matching_engine/1k`    | ~440 ns       | Match a large order against 1k orders. |
| `matching_engine/10k`   | ~3.3 µs       | Match a large order against 10k orders. |
| `matching_engine/100k`  | ~43.6 µs      | Match a large order against 100k orders.|
