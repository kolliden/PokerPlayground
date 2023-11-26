from functions import *
import json
import threading
import socket_for_poker

players = []
currBet = 0
dealer = -1
Bets = []
curr = 0

def handle_client_connection(client_socket, player):
	global players

	# Add the player to the list
	players.append(client_socket)

	print(f"New player connected: {client_socket.getpeername()}")

	while True:
		data = client_socket.recv(1024)
		if not data:
			break
		else:
			betting(player, data)
	# Handle data received from the client if needed

	# Close the client socket
	client_socket.close()

    # Remove the player from the list when the connection is closed
	players.remove(client_socket)
	print(f"Player {client_socket.getpeername()} disconnected")

def game_start():
	Bets = []
	currBet = 10
	global dealer
	dealer  += 1
	curr = dealer
	poker_deck = [str(rank)+str(suit) for suit in suits for rank in ranks]
	used_cards = []
	while len(players) < 1:
		client_socket, address = server_socket.accept()
		client_handler = threading.Thread(target=handle_client_connection, args=(client_socket, players[0]))
		client_handler.start()
	
	res = []
	for player in players:
		res.append(player.hand)
	return res

def betting(player, data):
	if(player != players[curr]):
		pass
	players[curr].socket.sendall("playerTurn: true\nBlind: false\nBets: "+Bets+"\n")
	
	curr += 1
	data["playerID"]
	for waiter in players:
		data_to_show = { 'name': {waiter.name},
						'chips': {waiter.chips},
						'cards': waiter.hand,
						'playerTurn': False,
						'playerAction': [
							data["action"],
							int(data["amount"])
							]
						}
		waiter.socket.sendall(json.dumps(data_to_show).encode())

game_start()
