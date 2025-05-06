use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Side {
    Buy,
    Sell,
}

#[derive(Debug, Clone, Copy)]
pub struct Order {
    pub order_id: u64,
    pub side: Side,
    pub price: u64,
    pub quantity: u64,
    pub timestamp: u64,
}

impl Order {
    pub fn new(order_id: u64, side: Side, price: u64, quantity: u64) -> Self {
        Order {
            order_id,
            side,
            price,
            quantity,
            timestamp: 0,
        }
    }
}

impl fmt::Display for Order {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Order ID: {}, Side: {:?}, Price: {}, Quantity: {}, Timestamp: {}",
            self.order_id, self.side, self.price, self.quantity, self.timestamp
        )
    }
}
