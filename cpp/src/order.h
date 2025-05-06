#pragma once

#include <cstdint>
#include <iostream>

enum class Side {
    Buy,
    Sell
};

struct Order {
    uint64_t order_id;
    Side side;
    double price;
    uint64_t quantity;
    uint64_t timestamp;

    Order(uint64_t id, Side s, double p, uint64_t qty)
        : order_id(id), side(s), price(p), quantity(qty), timestamp(0) {}
};

std::ostream& operator<<(std::ostream& os, const Order& order);
