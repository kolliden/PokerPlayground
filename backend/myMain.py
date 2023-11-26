import asyncio
import websockets
from random import randrange

suits = ['H', 'D', 'C', 'S']
ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

# Generate a list of all poker cards
poker_deck = [str(rank)+str(suit) for suit in suits for rank in ranks]
used_cards = []

def get():
	i = randrange(0, len(poker_deck))
	used_cards.append(poker_deck[i])
	del poker_deck[i]
	return used_cards[-1]


def giveCardsToPlayers():
    return [[get(), get()], [get(), get()], [get(), get()], [get(), get()], [get(), get()], [get(), get()]]


ip = "localhost"
port = 8080

gameState = {
    "players": [{
        "playerID": 9999,
        "name": "YOU",
        "chips": 2000,
        "cards": ["KH", "AH"],
        "playerTurn": True,
        "playerAction": "Bet 12412",
        "button": True,
    }
    ],
    "pot": 0,
    "board": ["AD", "AC", "TH", "", ""],
    "lastBet": 0,
}
# Maintain a list of connected players
connected_players = set()



async def send_cards_to_players(card_pairs):
    for player , i in connected_players:
        card_pair = card_pairs[i]
        await player.send(card_pair)

async def game(websocket, path):
    global connected_players
    
    # Add the player to the connected players' list
    connected_players.add(websocket)

    print(f"Player connected: {websocket.remote_address}")
    
    try:
        # Wait until there are 6 players connected
        while len(connected_players) < 6:
            await asyncio.sleep(1)
        
        # Start the game
        await websocket.send("Game is starting with 6 players!")

        while True:
            # Your poker game logic goes here
            card_pairs = giveCardsToPlayers()
            send_cards_to_players(card_pairs)

            # For example:
            # Round 1
            # Round 2
            # ...
            # Game ends
            
    finally:
        # Remove the player from the connected players' list when they disconnect
        connected_players.remove(websocket)

start_server = websockets.serve(game, ip, port)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
