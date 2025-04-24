# Copilot Project Instructions – Lock-Free Order Book (Rust & C++)

**Purpose:** Help me build a dual-implementation (Rust & C++) lock-free limit order book and benchmark them. Prefer correctness first, then lock-free optimizations. Always keep code readable and self-documenting (so no excessive comments).

---

## High-Level Requirements

1. **Common Spec**
   - Support order types: NEW (limit), CANCEL, MODIFY (qty/price), and MARKET (match immediately).
   - Maintain top-of-book (best bid/ask), full depth optional.
   - Preserve FIFO at each price level.

2. **Concurrency Targets**
   - Phase 1: Single-threaded matching engine; concurrent producers via lock-free queue.
   - Phase 2: Lock-free price map + per-level FIFO using atomics.
   - Use minimal allocations during hot path (arena/Slab allocators).

3. **Performance/Benchmarks**
   - Provide micro-benchmarks for:
     - Insert 1M orders.
     - Cancel/modify random subset.
     - Match against sweeping market orders.
   - Report ops/sec and latency percentiles (p50/p99/p999).
   - Generate machine-readable benchmark output (JSON/CSV).

4. **Testing/Validation**
   - Golden test: replay same CSV into Rust & C++ → identical final book snapshot & trade log.
   - Property/fuzz tests for invariants (e.g., no negative qty, prices sorted).
   - Deterministic seeds; CI must run tests on every PR.

5. **Code Quality**
   - Idiomatic Rust (no `unsafe` unless justified; if used, explain why).
   - Modern C++23, careful with memory_order (document choices).
   - Clear comments on lock-free sections: what is guaranteed, what’s not.

---

## Style & Structure Preferences

- **File/Module organization:** Small, focused files per component (order, price level, book, queues).
- **Documentation:** Rust doc comments + Doxygen-style for C++.
- **Error handling:** Prefer Result/enum errors (Rust) and status enums/expected (C++).
- **No magic numbers:** Constants in one place.

---

## Copilot Prompts to Follow

When I open a new file or function, prefer starting with:

> “Implement a lock-free (SPSC/MPSC) ring buffer queue for order events with these fields: … Provide tests and benchmarks.”

For tests:

> “Generate property tests that randomly interleave NEW/CANCEL/MODIFY and assert that total quantity per price never goes negative.”

For benchmarks:

> “Add a Criterion benchmark that inserts N=1_000_000 random orders and reports ops/sec. Output JSON to `target/criterion`.”

For C++ atomics:

> “Document the chosen memory_order for each atomic op and why it’s correct (acquire/release/relaxed).”

For cross-language parity:

> “Create a script to diff Rust and C++ final book states (JSON).”

---

## CI Expectations
- Upload benchmark artifacts; regenerate a markdown/HTML report.

---

## Nice-to-Haves (If Time Allows)

- WORKING WASM viewer showing book depth over time.
- CSV → Parquet converter for faster load.
- Flamegraphs (cargo-flamegraph, perf) added to docs.

---

## ALWAYS DO

- Ask for missing specs before guessing.
- Write minimal failing test before implementation when unsure.
- Provide comments, but use them sparingly; prefer self-documenting code.
- Use idiomatic constructs (e.g., iterators, combinators in Rust).
- Use RAII patterns in C++ (smart pointers, etc.).
- Prefer deterministic, reproducible outputs.
- Make it so that I can host this on a website.

