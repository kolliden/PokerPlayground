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

class Player:
    def __init__(self, name, connection):
        self.socket = connection
        self.name = name
        self.chips = 100
        self.hand = [get(), get()]
        self.in_round = True

    def bet(self, amount):
        self.in_round = True
        if amount > self.chips:
            return False
        self.chips -= amount
        return True

    def fold(self):
        self.in_round = False
