cmake_minimum_required(VERSION 3.20)
project(order_book_cpp)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(order_book_cpp src/main.cpp src/order.cpp src/order_book.cpp)

# Enable testing
enable_testing()

# Add Google Test
# You will need to have Google Test installed or add it to the project
# add_subdirectory(googletest)
# target_link_libraries(order_book_cpp GTest::gtest_main)

# Add benchmarks
# add_subdirectory(googlebenchmark)
# target_link_libraries(order_book_cpp benchmark::benchmark_main)
