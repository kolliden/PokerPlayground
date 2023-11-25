from fastapi import FastAPI, HTTPException
from typing import List
from functions import *

app = FastAPI()
players
currBet
startPlayer = -1

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

@app.post("../api/gameInit")
def game_start(message: str):
	currBet = 10
	startPlayer += 1
	poker_deck = [str(rank)+str(suit) for suit in suits for rank in ranks]
	used_cards = []
	players = [Player(message), Player("Bot1"), Player("Bot2")]
	
	res = []
	for player in players:
		res.append(player.hand)
	return res

@app.post("../api/game")
def game(message: str):
	for player in range(startPlayer, startPlayer+len(players)):
		if(player%len(players) == 0):
			return True
		enemies_move(players[player%len(players)])

@app.post("../api/action")
def on_action(message: str):
	int(receive_message)
	if message[0] == 'b':
		players[0].bet(int(message[5:]))
	else:
		players[0].fold()
