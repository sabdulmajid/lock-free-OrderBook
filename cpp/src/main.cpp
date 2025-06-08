#include <iostream>
#include "order_book.h"

int main() {
    OrderBook book;
    Order order(1, Side::Buy, 100.5, 10);
    book.add_order(order);
    std::cout << "Added order to the book." << std::endl;
    return 0;
}
