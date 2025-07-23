#pragma once

#include <atomic>
#include <cstddef>
#include <vector>
#include <optional>

template<typename T>
class ConcurrentQueue {
public:
    explicit ConcurrentQueue(size_t capacity)
        : buffer_(capacity),
          capacity_(capacity),
          mask_(capacity - 1),
          sequence_(capacity),
          enqueue_pos_(0),
          dequeue_pos_(0) {
        // capacity check
        if (capacity < 2 || (capacity & (capacity - 1)) != 0) {
            throw std::invalid_argument("capacity must be a power of two and >= 2");
        }
        for (size_t i = 0; i < capacity_; ++i) {
            sequence_[i].store(i, std::memory_order_relaxed);
        }
    }

    bool try_push(const T& data) {
        size_t pos = enqueue_pos_.fetch_add(1, std::memory_order_relaxed);
        size_t idx = pos & mask_;
        size_t seq = sequence_[idx].load(std::memory_order_acquire);
        if (seq == pos) {
            buffer_[idx] = data;
            sequence_[idx].store(pos + 1, std::memory_order_release);
            return true;
        }
        return false;
    }

    std::optional<T> try_pop() { // non-blocking pop
        size_t pos = dequeue_pos_.fetch_add(1, std::memory_order_relaxed);
        size_t idx = pos & mask_;
        size_t seq = sequence_[idx].load(std::memory_order_acquire);
        if (seq == pos + 1) {
            T data = buffer_[idx];
            sequence_[idx].store(pos + capacity_, std::memory_order_release);
            return data;
        }
        return std::nullopt;
    }

private:
    std::vector<T> buffer_;
    size_t capacity_;
    size_t mask_;
    std::vector<std::atomic<size_t>> sequence_;
    std::atomic<size_t> enqueue_pos_;
    std::atomic<size_t> dequeue_pos_;
};
