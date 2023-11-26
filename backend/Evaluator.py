import copy

## TODO: check for duplicate cards during raw hand string parse
class Hand:
    
    hand = None
    handTypes = None
    
    def __init__(self, rawHand):
        self.hand = self.buildHand(rawHand)
        self.handTypes = [HandType.HIGH_CARD]
        self.checkFlush()
        self.checkMatches()
        self.checkStraight()
    
    def getBestHandType(self):
        return max(self.handTypes)
    
    def getMessage(self):
        message = None
        handString = self.getHandAsString()
        # Now to parse the handTypes into combos if necessary
        #  i.e. striaghts and flushes into straight flushes
        #  and value checks i.e. royal flushes and "jacks over tens"
        if HandType.FLUSH in self.handTypes and HandType.STRAIGHT in self.handTypes:
            flushIsRoyal = False
            for x in self.hand:
                if x.getRankAsString() == "Ace":
                    flushIsRoyal = True
            if flushIsRoyal:
                message = "ROYAL FLUSH, OMG!!"
            else:
                message = "Straight flush"
        else:
            message = Hand.getStringForHandType(self.getBestHandType())
        return message + ": " + self.__str__()
        
    def getHandAsString(self):
        sortedHand = sorted(self.hand, key=lambda card: card.getRank())
        string = ""
        for x in sortedHand:
            string += x.__str__()
            string += ", "
        return string
        
    def checkFlush(self):
        edibleHand = copy.deepcopy(self.hand)
        leadingCard = edibleHand.pop(0)
        isFlush = True
        for x in edibleHand:
            if x.getSuit() != leadingCard.getSuit():
                isFlush = False
        if isFlush:
            self.handTypes.append(HandType.FLUSH)
            
    def checkMatches(self):
        matches = []
        
        #first, eat our (edible) hand into a collection of matchStacks
        ##UNDONE: refactor this into its own method
        
        edibleHand = copy.deepcopy(self.hand)
        
        while edibleHand.__len__() != 0:
            
            # Take each card, pull all the matching cards for that card out of
            #  the edibleHand, stack them, and put them in the match stack
            card = edibleHand.pop(0)
            matchStack = [card]
            toRemoveFromEdibleHand = []
            
            for x in edibleHand:
                if card.getRank() == x.getRank():
                    matchStack.append(x)
                    toRemoveFromEdibleHand.append(x)

            if matchStack.__len__() > 1:
                matches.append(matchStack)
                matchStackString = ""
                for x in matchStack:
                    matchStackString += x.__str__() + ", "
                    
            for x in toRemoveFromEdibleHand:
                edibleHand.remove(x)
        
        # Now that we have a handle on what matches we have, parse them into
        # an understanding of what kind of hand we have
        # TODO: Refactor this into its own method
        if matches.__len__() != 0:
            # check for multiple matches; FULL_HOUSE or TWO PAIR
            if matches.__len__() == 2:
                for x in matches:
                    if x.__len__() == 3:
                        self.handTypes.append(HandType.FULL_HOUSE)
                else:
                    self.handTypes.append(HandType.TWO_PAIR)
            else:
                # assuming that matches.len = 1; if not, error state, need a test
                #  for that
                # If we do have matches (matches.len > 0), but it's not any of
                # the above, check for three of a kind vs simple pair
                if matches[0].__len__() == 4:
                    self.handTypes.append(HandType.FOUR_OF_A_KIND)
                elif matches[0].__len__() == 3:
                    self.handTypes.append(HandType.THREE_OF_A_KIND)
                else:
                    # assume that the match must be len() = 2, since otherwise
                    #  it wouldn't be a match.  Need a test
                    self.handTypes.append(HandType.PAIR)
    # And that should be it for parsing our hand into knowledge of what sort
    #  of match-based hands we are.  This method is too long.
                    
    def checkStraight(self):
        edibleHand = sorted(self.hand, key=lambda card: card.getRank())
        isStraight = True
        previousCard = edibleHand.pop(0)
        # Note that the sorted function sorts on the value ASCENDING, so the
        #  edible hand will go from low card to high card, so the loop here
        #  checks for the current card to have value equal to the previousCard 
        while edibleHand:
            card = edibleHand.pop(0)
            if card.getRank() != (previousCard.getRank() + 1):
               isStraight = False
            previousCard = card
        if isStraight:
            self.handTypes.append(HandType.STRAIGHT)

    def buildHand(self, rawHand):
        builtHand = []
        rawCards = rawHand.split()
        if rawCards.__len__() != 5:
            raise ValueError("HAND PARSE ERROR: number of cards in hand not 5: '" + rawHand + "'")
        for x in rawCards:
            builtHand.append(Card(x))
        return builtHand
        
    def __str__(self):
        selfString = ""
        for x in self.hand:
            selfString += x.__str__() + ", "
        return selfString
        
    @staticmethod
    def getStringForHandType(handType):
    # Python doesn't have case statements.  There are, I read, ways to use lambdas
    #  and/or dictionaries to do that sort of thing more elegantly.
    #  However, here, I am just going to brute force it.  Please don't hold
    #  it against me.
        if handType == HandType.ROYAL_FLUSH:
            return "Royal flush"
        if handType == HandType.STRAIGHT_FLUSH:
            return "Straight flush"
        if handType == HandType.FOUR_OF_A_KIND:
            return "Four of a kind"
        if handType == HandType.FULL_HOUSE:
            return "Full house"
        if handType == HandType.FLUSH:
            return "Flush"
        if handType == HandType.STRAIGHT:
            return "Straight"
        if handType == HandType.THREE_OF_A_KIND:
            return "Three of a kind"
        if handType == HandType.TWO_PAIR:
            return "Two pair"
        if handType == HandType.PAIR:
            return "Pair"
        if handType == HandType.HIGH_CARD:
            return "High card"
            
class Card:
    
    ranks = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven",
             "Six", "Five", "Four", "Three", "Two"]
             
    suits = ["Clubs", "Spades", "Diamonds", "Hearts"]
        
    rank = None
    suit = None
    
    def __init__(self, rawCard):
        if rawCard.__len__() != 2:
            raise ValueError("CARD PARSE ERROR: raw card definition in Card init not 2 characters long: " + rawCard)
        self.rank = Card.rawRankTagToRank(rawCard[0])
        self.suit = Card.rawSuitTagToSuit(rawCard[1])
        
    def getRank(self):
        return self.rank
        
    def getRankAsString(self):
        return self.ranks[self.rank]
        
    def getSuit(self):
        return self.suit
        
    def getSuitAsString(self):
        return self.suits[self.suit]
        
    def greaterRank(self, otherCard):
        if self.getRank() > otherCard.getRank():
            return self;
        else:
            return otherCard
    
    def __str__(self):
        return self.getRankAsString() + " of " + self.getSuitAsString()
            
    @staticmethod
    def rawRankTagToRank(rawTag):
        if rawTag == 'A':
            return Card.ranks.index("Ace")
        elif rawTag == 'K':
            return Card.ranks.index("King")
        elif rawTag == 'Q':
            return Card.ranks.index("Queen")
        elif rawTag == 'J':
            return Card.ranks.index("Jack")
        elif rawTag == 'T':
            return Card.ranks.index("Ten")
        elif rawTag == '9':
            return Card.ranks.index("Nine")
        elif rawTag == '8':
            return Card.ranks.index("Eight")
        elif rawTag == '7':
            return Card.ranks.index("Seven")
        elif rawTag == '6':
            return Card.ranks.index("Six")
        elif rawTag == '5':
            return Card.ranks.index("Five")
        elif rawTag == '4':
            return Card.ranks.index("Four")
        elif rawTag == '3':
            return Card.ranks.index("Three")
        elif rawTag == '2':
            return Card.ranks.index("Two")
        else:
            raise ValueError("CARD PARSE ERROR: Unrecognized raw rank tag in rawRankTagToRank: '" + rawTag + "'")

    @staticmethod
    def rawSuitTagToSuit(rawTag):
        if rawTag == 'd':
            return Card.suits.index("Diamonds")
        elif rawTag == 'h':
            return Card.suits.index("Hearts")
        elif rawTag == 'c':
            return Card.suits.index("Clubs")
        elif rawTag == 's':
            return Card.suits.index("Spades")
        else:
            raise ValueError("CARD PARSE ERROR: Unrecognized raw suit tag in rawSuitTagtoSuit: '" + rawTag + "'")

def evaluateHand(rawHand):
    hand = None
    try:
        hand = Hand(rawHand)
        print(hand.getMessage())
    except ValueError as e:
        print(e)
    
def doTest():
    for x in fullTestHands():
        evaluateHand(x)
        print("")
    for x in badRawHandStringsTest():
        print("About to attempt evaluation of illegal raw hand string: " + x)
        evaluateHand(x)
        print("")

def testsForMatchingHands():
    return ["9d 9c 6h 6s Ac", #Two Pair
            "4s Ac Ah 4c 4d", #Full House
            "7d 7c 7h Kc 4d", #Three of a Kind
            "6d 6h 6s 6c Ad", #Four of a kind
            "Qd Qc Th 7c Ad"] #Pair
        
def fullTestHands():
    return ["8d 5d 2d Jd Kd", #Flush
            "9d 9c 6h 6s Ac", #Two Pair
            "Td 9h 8s 7s 6c", #Straight
            "Ad Ac Ah 4c 4d", #Full House
            "4s Ac Ah 4c 4d", #Full House
            "7d 7c 7h Kc 4d", #Three of a Kind
            "Td 8d 6d 7d 9d", #Straight Flush
            "6d 6h 6s 6c Ad", #Four of a kind
            "Kd Jd Td Ad Qd", #Royal flush
            "Qd Qc Th 7c Ad", #Pair
            "Td Jd 5c 4h 2h",]#High Card
    
def badRawHandStringsTest():
    return ["the quick brown fox",
            "jumped over the lazy dog", 
            "biglongsmushedstring", 
            "10d 9c 9d 9s 9h"]

class HandType:
    ROYAL_FLUSH = 9,
    STRAIGHT_FLUSH = 8, 
    FOUR_OF_A_KIND = 7,
    FULL_HOUSE = 6,
    FLUSH = 5,
    STRAIGHT = 4,
    THREE_OF_A_KIND = 3,
    TWO_PAIR = 2,
    PAIR = 1,
    HIGH_CARD = 0

doTest()