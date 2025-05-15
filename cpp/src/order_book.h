#pragma once

#include "order.h"
#include <map>
#include <deque>
#include <functional>
#include <optional>

struct PriceLevel {
    uint64_t total_quantity;
    std::deque<Order> orders;
};

class OrderBook {
public:
    OrderBook();

    void add_order(Order& order);
    bool cancel_order(uint64_t order_id, Side side, double price);
    bool modify_order(uint64_t order_id, Side side, double price, uint64_t new_quantity);

    std::optional<double> get_best_bid() const;
    std::optional<double> get_best_ask() const;


private:
    std::map<double, PriceLevel, std::greater<double>> bids;
    std::map<double, PriceLevel> asks;
};
