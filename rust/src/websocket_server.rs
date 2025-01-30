use futures_util::{SinkExt, StreamExt};
use serde_json;
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::net::{TcpListener, TcpStream};
use tokio::time::interval;
use tokio_tungstenite::{accept_async, tungstenite::Message, WebSocketStream};

mod order;
mod order_book;
mod trade;
mod concurrent_queue;
mod market_simulator;

use market_simulator::MarketSimulator;

type Clients = Arc<Mutex<HashMap<SocketAddr, tokio_tungstenite::WebSocketStream<TcpStream>>>>;

#[tokio::main]
async fn main() {
    println!("🚀 Starting Lock-Free Order Book WebSocket Server...");
    
    let addr = "127.0.0.1:8080";
    let listener = TcpListener::bind(&addr).await.expect("Failed to bind");
    println!("📡 WebSocket server listening on: ws://{}", addr);
    
    let clients: Clients = Arc::new(Mutex::new(HashMap::new()));
    let simulator = Arc::new(Mutex::new(MarketSimulator::new()));
    
    // Start market simulation task
    let clients_clone = clients.clone();
    let simulator_clone = simulator.clone();
    tokio::spawn(async move {
        market_simulation_task(clients_clone, simulator_clone).await;
    });
    
    // Accept connections
    while let Ok((stream, addr)) = listener.accept().await {
        println!("🔗 New client connected: {}", addr);
        let clients_clone = clients.clone();
        let simulator_clone = simulator.clone();
        
        tokio::spawn(async move {
            handle_connection(stream, addr, clients_clone, simulator_clone).await;
        });
    }
}

async fn handle_connection(
    stream: TcpStream,
    addr: SocketAddr,
    clients: Clients,
    simulator: Arc<Mutex<MarketSimulator>>,
) {
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            println!("❌ WebSocket connection error: {}", e);
            return;
        }
    };
    
    println!("✅ WebSocket connection established with {}", addr);
    
    // Send initial snapshot
    if let Ok(sim) = simulator.lock() {
        let snapshot = sim.get_snapshot();
        if let Ok(message) = serde_json::to_string(&snapshot) {
            let ws_message = Message::Text(format!(r#"{{"type":"orderbook-snapshot","data":{}}}"#, message));
            if let Ok(mut clients_map) = clients.lock() {
                if let Some(client) = clients_map.get_mut(&addr) {
                    let _ = client.send(ws_message).await;
                }
            }
        }
    }
    
    // Add client to the map
    {
        let mut clients_map = clients.lock().unwrap();
        clients_map.insert(addr, ws_stream);
    }
    
    // Keep connection alive and handle messages
    loop {
        tokio::time::sleep(Duration::from_secs(1)).await;
        
        // Check if client is still connected
        let mut should_remove = false;
        {
            let mut clients_map = clients.lock().unwrap();
            if let Some(client) = clients_map.get_mut(&addr) {
                if client.send(Message::Ping(vec![])).await.is_err() {
                    should_remove = true;
                }
            }
        }
        
        if should_remove {
            let mut clients_map = clients.lock().unwrap();
            clients_map.remove(&addr);
            println!("🔌 Client {} disconnected", addr);
            break;
        }
    }
}

async fn market_simulation_task(clients: Clients, simulator: Arc<Mutex<MarketSimulator>>) {
    let mut interval = interval(Duration::from_millis(100)); // Update every 100ms
    
    loop {
        interval.tick().await;
        
        let snapshot = {
            let mut sim = simulator.lock().unwrap();
            sim.simulate_market_activity()
        };
        
        if let Ok(message) = serde_json::to_string(&snapshot) {
            let ws_message = Message::Text(format!(r#"{{"type":"orderbook-update","data":{}}}"#, message));
            
            let mut clients_to_remove = Vec::new();
            {
                let mut clients_map = clients.lock().unwrap();
                for (addr, client) in clients_map.iter_mut() {
                    if client.send(ws_message.clone()).await.is_err() {
                        clients_to_remove.push(*addr);
                    }
                }
                
                // Remove disconnected clients
                for addr in clients_to_remove {
                    clients_map.remove(&addr);
                    println!("🔌 Removed disconnected client: {}", addr);
                }
            }
        }
    }
}