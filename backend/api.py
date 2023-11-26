# websocket connection python
import socket
import json


port = 8080
ip = "localhost"

# Create a socket object
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# start listining server
s.bind((ip, port))
s.listen(5)

# accept connection
c, addr = s.accept()
print("Connection from: " + str(addr))

# send message
c.send("Hello from the server!".encode())

# receive message
data = c.recv(1024).decode()
print("Message from client: " + data)

# close connection
c.close()
s.close()