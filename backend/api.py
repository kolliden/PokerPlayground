from functions import *
import socket
import json

app = FastAPI()
players
currBet
dealer = -1
Bets = []

def enemies_move(enemie):
	if players[enemie].in_game == False:
		pass
	probability = randrange(0, 20)
	match probability:
		case p if p < 4:
			players[enemie].fold()
		case 20:
			if players[enemie].chips > currBet:
				players[enemie].bet(min(players[enemie].chips, currBet*3))
			return;
		case p2 if p2 > 17:
			if players[enemie].chips > currBet:
				players[enemie].bet(min(players[enemie].chips, currBet*2,5))
			return;
		case p2 if p2 > 13:
			if players[enemie].chips > currBet:
				players[enemie].bet(min(players[enemie].chips, currBet*2))
			return;
		case p2 if p2 > 8:
			if players[enemie].chips > currBet:
				players[enemie].bet(min(players[enemie].chips, currBet*1,5))
			return;
		case _:
			if players[enemie].chips > currBet:
				players[enemie].bet(currBet)

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(("0.0.0.0", 8080))

def game_start(message: str):
	Bets = []
	currBet = 10
	dealer += 1
	poker_deck = [str(rank)+str(suit) for suit in suits for rank in ranks]
	used_cards = []
	players = [Player(message), Player("Bot1"), Player("Bot2")]
	while len(players) < 2:
		pass #listening accepting new guys
	
	amountPlayers = len(players)
	
	res = []
	for player in players:
		res.append(player.hand)
	return res

def betting():
	for player in range(dealer, dealer+len(players)):
		currPlayer = players[player%len(players)]
		
		currPlayer.socket.sendall("playerTurn: true\nBlind: false\nBets: "+Bets+"\n")
		while True:
			data = currPlayer.socket.recv(10240000).decode()
			if not data:
				break
			if data:
				data["playerID"]
				for waiter in players:
					data_to_show = { 'name': {waiter.name},
									 'chips': {waiter.chips},
									 'cards': [Null, Null],
									 'playerTurn': False,
									 'playerAction': [
										 data["action"],
										 int(data["amount"])
										]
								   }
					waiter.socket.sendall(json.dumps(data_to_show).encode())
				
	
	
	for player in players:
		makeBet()
	info = None
	if "get:" in data:
		info = data.split("get:")[1].strip()
		player.data(info)
	elif "fold:" in data:
		info = data.split("fold:")[1].strip()

	if info is not None:
		print(f"Received from {player_socket.getpeername()}: {info}")
	else:
		pass