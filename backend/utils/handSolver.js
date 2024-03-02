const BaseStrength = {
    ROYAL_FLUSH :       10000,
    STRAIGHT_FLUSH :    9000,
    QUADS :             8000,
    FULL_HOUSE :        7000,
    FLUSH :             6000,
    STRAIGHT :          5000,
    SET :               4000,
    TWO_PAIR :          3000,
    PAIR :              2000,
    HIGH_CARD :         1000,
}

class HandTypeEvaluator {
    constructor() {
        this.strength = 0;
    }

    highCard = (values) => {
        this.strength = BaseStrength.HIGH_CARD + 60 * values[0] + 6 * values[1] + .6 * values[2] + .06 * values[3] + .006 * values[4];
        return ("High Card: " + value_names[values[0]]);
    }

    numPairs = (values) => {
        let pairs = values.filter((v) => values.filter((x) => x === v).length === 2);
        if (!pairs.length) return false;
        console.log("pairs: " + pairs);
        if (pairs.length === 2) {
            this.strength = BaseStrength.PAIR + 60 * pairs[0] + 6 * values.filter((v) => v !== pairs[0])[0] + .6 * values.filter((v) => v !== pairs[0])[1];
            return ("Pair of " + value_names_plural[pairs[0]] + "s");
        } else if (pairs.length >= 4) {
            pairs = pairs.sort((a, b) => b - a);
            this.strength = BaseStrength.TWO_PAIR + 60 * pairs[0] + 6 * pairs[1] + .6 * values.filter((v) => v !== pairs[0] && v !== pairs[1])[0];
            return ("Two Pair: " + value_names_plural[pairs[0]] + "s and " + value_names_plural[pairs[2]] + "s");
        }
    }
    trips = (values) => {
        let trips = values.filter((v) => values.filter((x) => x === v).length === 3);
        if (!trips.length) return false;
        this.strength = BaseStrength.SET + 60 * trips[0] + 6 * values.filter((v) => v !== trips[0])[0] + .6 * values.filter((v) => v !== trips[0])[1];
        return ("Three of a Kind: " + value_names_plural[trips[0]] + "s");
    }
    straight = (vset, getVals = false) => {
        if (!getVals) {
            vset = new Set([...vset].sort((a, b) => b - a));
            let straight = false;
            if (vset.has(14) && vset.has(2) && vset.has(3) && vset.has(4) && vset.has(5)) {
                straight = true;
                this.strength = BaseStrength.STRAIGHT + 60 * 5;
            } else {
                for (let i = 14; i >= 5; i--) {
                    if (vset.has(i) && vset.has(i - 1) && vset.has(i - 2) && vset.has(i - 3) && vset.has(i - 4)) {
                        straight = true;
                        this.strength = BaseStrength.STRAIGHT + 60 * i;
                        break;
                    }
                }
            }
            if (straight) {
                return ("Straight: " + value_names[this.strength / 60]);
            } else {
                return false;
            }
        } else if (getVals) {
            vset = new Set([...vset].sort((a, b) => b - a));
            let sset = new Set();
            if (vset.has(14) && vset.has(2) && vset.has(3) && vset.has(4) && vset.has(5)) {
                sset.add(5);
            } else {
                for (let i = 14; i >= 5; i--) {
                    if (vset.has(i) && vset.has(i - 1) && vset.has(i - 2) && vset.has(i - 3) && vset.has(i - 4)) {
                        sset.add(i - 4);
                        break;
                    }
                }
            }
            return sset;
        }
    }
    flush = (suits, allCards) => {
        let flush = false;
        let flushSuit = "";
        for (let i = 0; i < suits.length; i++) {
            if (suits.filter((x) => x === suits[i]).length >= 5) {
                flush = true;
                flushSuit = suits[i];
                break;
            }
        }
        if (flush) {
            let flushCards = allCards.filter((card) => card[1] === flushSuit).sort((a, b) => '23456789TJQKA'.indexOf(a[0]) - '23456789TJQKA'.indexOf(b[0])).reverse().slice(0, 5);
            let flushValues = flushCards.map((card) => card[0]);
            this.strength = BaseStrength.FLUSH + 60 * flushValues[0] + 6 * flushValues[1] + .6 * flushValues[2] + .06 * flushValues[3] + .006 * flushValues[4];
            return ("Flush: " + suit_names[flushSuit]);
        } else {
            return false;
        }

    }
    fullHouse = (values) => {
        let trips = values.filter((v) => values.filter((x) => x === v).length === 3);
        let pairs = values.filter((v) => values.filter((x) => x === v).length === 2);
        if (!trips.length || !pairs.length) return false;
        this.strength = BaseStrength.FULL_HOUSE + 60 * trips[0] + 6 * pairs[0]; //TODO: doesen't account for everything'
        return ("Full House: " + value_names_plural[trips[0]] + "s full of " + value_names_plural[pairs[0]] + "s");
    }
    quads = (values) => {
        let quads = values.filter((v) => values.filter((x) => x === v).length === 4);
        if (!quads.length) return false;
        this.strength = BaseStrength.QUADS + 60 * quads[0] + 6 * values.filter((v) => v !== quads[0])[0];
        return ("Four of a Kind: " + value_names_plural[quads[0]] + "s");
    }
    straightFlush = (vset, suits, allCards) => {
        let flushes = suits.filter((suit) => suits.filter((x) => x === suit).length >= 5);
        if (!flushes.length) return false;
        let flushVals = flushes.map((suit) => this.straight(allCards.filter((card) => card[1] === suit).map((card) => card[0]), true));
        if (this.straight(flushVals)) {
            sflushVals = new Set();
            flushVals.forEach((val) => sflushVals.add(val));
            console.log("sflushVals: " + sflushVals);
            let straightVals = this.straight(sflushVals, true);
            if (straightVals.has(14)) {
                this.strength = BaseStrength.ROYAL_FLUSH;
                return ("Royal Flush: " + suit_names[flushes[0]]);
            }
            this.strength = BaseStrength.STRAIGHT_FLUSH + 60 * straightVals[0];
            return ("Straight Flush: " + value_names[straightVals[0]] + " high");
        }

    }
    evalHand = (values, suits, vset, allCards) => {
        let x = this.straightFlush(vset, suits, allCards);
        if (!x) x = this.quads(values);
        if (!x) x = this.fullHouse(values);
        if (!x) x = this.flush(suits, allCards);
        if (!x) x = this.straight(vset);
        if (!x) x = this.trips(values);
        if (!x) x = this.numPairs(values);
        if (!x) x = this.highCard(values);

        return x;
    }
}

function determine(hand) {
    let values = [];
    let vset = new Set();
    let suits = [];
    let allCards = [];
    for (let i = 0; i < hand.length; i++) {
        values.push(hand[i][0]);
        vset.add(hand[i][0]);
        suits.push(hand[i][1]);
        allCards.push(hand[i]);
    }
    return [values, vset, suits, allCards];
}
function showdown(hands, board) {
    let hand_occurrence = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }
    let h_strength = {};
    // console.log("Board: " + board);
    // console.log("Hands: " + hands);
    for (let i = 0; i < hands.length; i++) {
        hte = new HandTypeEvaluator();
        const user_hand = hands[i].concat(board);
        // console.log("User Hand: " + user_hand);
        let [values, vset, suits, all_cards] = determine(user_hand);
        let hand_type = hte.evalHand(values, suits, vset, all_cards);
        // console.log(hte.strength);
        // console.log("Hand: " + hand_type);

        hand_occurrence[Math.floor(hte.strength / 1000 - 1)] += 1;
        h_strength[i] = hte.strength;
    }
    // console.log("Hand Occurrence: " + hand_occurrence);
    // console.log(h_strength);
    //get index of winner

    let winner = 0;
    let max = 0;
    for (let i = 0; i < hands.length; i++) {
        if (h_strength[i] > max) {
            max = h_strength[i];
            winner = i;
        }
    }
    return [winner, h_strength];
}
function getHandTypes(hands, board){
    let playerHandTypes = [];
    for (let i = 0; i < hands.length; i++) {
        hte = new HandTypeEvaluator();
        const user_hand = hands[i].concat(board);
        // console.log("User Hand: " + user_hand);
        let [values, vset, suits, all_cards] = determine(user_hand);
        let hand_type = hte.evalHand(values, suits, vset, all_cards);
        playerHandTypes.push(hand_type);
    }
    return playerHandTypes;
}

const ho_names = ('High Card', 'Pair', 'Two-Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House',
    'Four of a Kind', 'Straight Flush', 'Royal Flush')
const value_names = {
    1: 'Ace', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine',
    10: 'Ten', 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace', 0: 'EMPTY'
}
const value_names_plural = {
    1: 'Ace', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Sixe', 7: 'Seven', 8: 'Eight',
    9: 'Nine', 10: 'Ten', 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace'
}
const suit_names = { "H": '♥', "S": '♠', "C": '♣', "D": '♦', 0: '' }

module.exports = {
    showdown,
    getHandTypes,
}