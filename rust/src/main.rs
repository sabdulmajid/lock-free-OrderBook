use lock_free_order_book::order::{Order, Side};

fn main() {
    let order = Order::new(1, Side::Buy, 100, 10);
    println!("Created order: {}", order);
}
