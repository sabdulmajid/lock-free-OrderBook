//! Represents the order book.
use std::collections::{BTreeMap, VecDeque};
use crate::order::{Order, Side};

pub struct PriceLevel {
    pub total_quantity: u64,
    pub orders: VecDeque<Order>,
}

impl PriceLevel {
    pub fn new() -> Self {
        PriceLevel {
            total_quantity: 0,
            orders: VecDeque::new(),
        }
    }
}

pub struct OrderBook {
    bids: BTreeMap<u64, PriceLevel>,
    asks: BTreeMap<u64, PriceLevel>,
}

impl OrderBook {
    pub fn new() -> Self {
        OrderBook {
            bids: BTreeMap::new(),
            asks: BTreeMap::new(),
        }
    }

    pub fn add_order(&mut self, mut order: Order) {
        order.timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos() as u64;

        let (book_side, price) = match order.side {
            Side::Buy => (&mut self.bids, order.price),
            Side::Sell => (&mut self.asks, order.price),
        };

        // ...existing code...
        let price_level = book_side.entry(price).or_insert_with(PriceLevel::new);
        price_level.total_quantity += order.quantity;
        price_level.orders.push_back(order);
    }

    pub fn cancel_order(&mut self, order_id: u64, side: Side, price: u64) -> bool {
        let book_side = match side {
            Side::Buy => &mut self.bids,
            Side::Sell => &mut self.asks,
        };

        if let Some(price_level) = book_side.get_mut(&price) {
            if let Some(index) = price_level.orders.iter().position(|o| o.order_id == order_id) {
                let order = price_level.orders.remove(index).unwrap();
                price_level.total_quantity -= order.quantity;
                if price_level.orders.is_empty() {
                    book_side.remove(&price);
                }
                return true;
            }
        }
        false
    }

    pub fn modify_order(&mut self, order_id: u64, side: Side, price: u64, new_quantity: u64) -> bool {
        let book_side = match side {
            Side::Buy => &mut self.bids,
            Side::Sell => &mut self.asks,
        };

        if let Some(price_level) = book_side.get_mut(&price) {
            for order in &mut price_level.orders {
                if order.order_id == order_id {
                    price_level.total_quantity -= order.quantity;
                    order.quantity = new_quantity;
                    price_level.total_quantity += new_quantity;
                    return true;
                }
            }
        }
        false
    }
}