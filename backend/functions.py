class Player:
    def init(self, name, chips):
        self.name = name
        self.chips = chips
        self.hand = []
        self.in_round = True

    def bet(self, amount):
        if amount > self.chips:
            print(f"{self.name} doesn't have enough chips to bet {amount}.")
            return False
        self.chips -= amount
        print(f"{self.name} bets {amount} chips.")
        return True

    def fold(self):
        self.in_round = False
        print(f"{self.name} folds.")

    def raise_bet(self, amount):
        if amount > self.chips:
            print(f"{self.name} doesn't have enough chips to raise by {amount}.")
            return False
        self.chips -= amount
        print(f"{self.name} raises by {amount} chips.")
        return True