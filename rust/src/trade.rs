//! Represents a trade that has occurred.

#[derive(Debug, Clone, Copy)]
pub struct Trade {
    pub taker_order_id: u64,
    pub maker_order_id: u64,
    pub quantity: u64,
    pub price: u64,
    pub timestamp: u64,
}

impl Trade {
    pub fn new(taker_order_id: u64, maker_order_id: u64, quantity: u64, price: u64) -> Self {
        Trade {
            taker_order_id,
            maker_order_id,
            quantity,
            price,
            timestamp: 0, // Will be set by the matching engine
        }
    }
}
