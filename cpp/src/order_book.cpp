#include "order_book.h"
#include <chrono>
#include <algorithm>

OrderBook::OrderBook() {}

void OrderBook::add_order(Order& order) {
    order.timestamp = std::chrono::duration_cast<std::chrono::nanoseconds>(
        std::chrono::system_clock::now().time_since_epoch()
    ).count();

    if (order.side == Side::Buy) {
        auto& price_level = bids[order.price];
        price_level.total_quantity += order.quantity;
        price_level.orders.push_back(order);
    } else {
        auto& price_level = asks[order.price];
        price_level.total_quantity += order.quantity;
        price_level.orders.push_back(order);
    }
}

bool OrderBook::cancel_order(uint64_t order_id, Side side, double price) {
    auto* book_side = (side == Side::Buy) ? &bids : (std::map<double, PriceLevel, std::greater<double>>*) &asks;

    if (side == Side::Buy) {
        auto it = bids.find(price);
        if (it == bids.end()) {
            return false;
        }
        auto& price_level = it->second;
        auto& orders = price_level.orders;
        auto order_it = std::find_if(orders.begin(), orders.end(), 
                                     [order_id](const Order& o) { return o.order_id == order_id; });

        if (order_it != orders.end()) {
            price_level.total_quantity -= order_it->quantity;
            orders.erase(order_it);
            if (orders.empty()) {
                bids.erase(it);
            }
            return true;
        }
    } else {
        auto it = asks.find(price);
        if (it == asks.end()) {
            return false;
        }
        auto& price_level = it->second;
        auto& orders = price_level.orders;
        auto order_it = std::find_if(orders.begin(), orders.end(), 
                                     [order_id](const Order& o) { return o.order_id == order_id; });

        if (order_it != orders.end()) {
            price_level.total_quantity -= order_it->quantity;
            orders.erase(order_it);
            if (orders.empty()) {
                asks.erase(it);
            }
            return true;
        }
    }

    return false;
}

bool OrderBook::modify_order(uint64_t order_id, Side side, double price, uint64_t new_quantity) {
    auto* book_side = (side == Side::Buy) ? &bids : (std::map<double, PriceLevel, std::greater<double>>*) &asks;

    if (side == Side::Buy) {
        auto it = bids.find(price);
        if (it != bids.end()) {
            auto& price_level = it->second;
            for (auto& order : price_level.orders) {
                if (order.order_id == order_id) {
                    price_level.total_quantity -= order.quantity;
                    order.quantity = new_quantity;
                    price_level.total_quantity += new_quantity;
                    return true;
                }
            }
        }
    } else {
        auto it = asks.find(price);
        if (it != asks.end()) {
            auto& price_level = it->second;
            for (auto& order : price_level.orders) {
                if (order.order_id == order_id) {
                    price_level.total_quantity -= order.quantity;
                    order.quantity = new_quantity;
                    price_level.total_quantity += new_quantity;
                    return true;
                }
            }
        }
    }
    return false;
}

std::optional<double> OrderBook::get_best_bid() const {
    if (bids.empty()) {
        return std::nullopt;
    }
    return bids.begin()->first;
}

std::optional<double> OrderBook::get_best_ask() const {
    if (asks.empty()) {
        return std::nullopt;
    }
    return asks.begin()->first;
}
