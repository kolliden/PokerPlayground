class Player:
    def __init__(self, name, chips):
        self.name = name
        self.chips = chips
        self.hand = []
        self.in_round = True

    def bet(self):
        if amount > self.chips:
            print(f"{self.name} don't have enough chips to bet {amount}.")
            return False
        self.chips -= amount
        print(f"{self.name} bets {amount} chips.")
        return True

    def fold(self):
        self.in_round = False
        print(f"{self.name} folds.")

    def raise_bet(self):
        if amount > self.chips:
            print(f"{self.name} don't have enough chips to raise by {amount}.")
            return False
        self.chips -= amount
        print(f"{self.name} raises by {amount} chips.")
        return True