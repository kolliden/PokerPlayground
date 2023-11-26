import socket
import threading

# Constants
HOST = '0.0.0.0'  # Localhost
PORT = 8080

# Socket setup
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))
server_socket.listen()

# List to store connected clients
clients = []

# Function to handle each client's connection
def handle_client(client_socket, addr):
    print(f"Connection from {addr} established.")

    # Add the new client to the list
    clients.append(client_socket)

    # Example: Send a welcome message to the client
    client_socket.send("Welcome to the poker server!".encode())

    while True:
        # Receive data from the client
        request = client_socket.recv(4096).decode()
        if request:
            print("This is the request \n", request)
        else:
            pass

        # Example: Broadcast the received data to all clients
        for client in clients:
            pass

    # Remove the disconnected client
    clients.remove(client_socket)
    client_socket.close()
    print(f"Connection from {addr} closed.")

# Main server loop
while True:
    # Wait for a new connection
    client_socket, addr = server_socket.accept()

    # Start a new thread to handle the client
    client_handler = threading.Thread(target=handle_client, args=(client_socket, addr))
    client_handler.start()
