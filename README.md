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
