from random import randrange

suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'Ja', 'Qu', 'Ki', 'Ac']

# Generate a list of all poker cards
poker_deck = [str(rank)+str(suit) for suit in suits for rank in ranks]
used_cards = []

def get():
	i = randrange(0, len(poker_deck))
	used_cards.append(poker_deck[i])
	del poker_deck[i]
	return used_cards[-1]
	
class Player:
    def __init__(self, name):
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
