// Function to determine the winner
function determineWinner(hand1, hand2, board) {
    const allCards = [...hand1, ...hand2, ...board];
    const allSuits = allCards.map(card => card[1]);
    const allRanks = allCards.map(card => card[0]).sort((a, b) => '23456789TJQKA'.indexOf(a) - '23456789TJQKA'.indexOf(b));

    // Check for flushes
    const flush1 = allSuits.filter(suit => allSuits.filter(s => s === suit).length >= 5 && hand1.map(card => card[1]).includes(suit)).length;
    const flush2 = allSuits.filter(suit => allSuits.filter(s => s === suit).length >= 5 && hand2.map(card => card[1]).includes(suit)).length;

    // Count ranks occurrences
    const rankCount = allRanks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
    }, {});

    // Check for pairs, three-of-a-kind, and four-of-a-kind
    const pairs1 = Object.keys(rankCount).filter(rank => rankCount[rank] === 2 && hand1.map(card => card[0]).includes(rank));
    const pairs2 = Object.keys(rankCount).filter(rank => rankCount[rank] === 2 && hand2.map(card => card[0]).includes(rank));
    const threeOfAKind1 = Object.keys(rankCount).filter(rank => rankCount[rank] === 3 && hand1.map(card => card[0]).includes(rank));
    const threeOfAKind2 = Object.keys(rankCount).filter(rank => rankCount[rank] === 3 && hand2.map(card => card[0]).includes(rank));
    const fourOfAKind1 = Object.keys(rankCount).filter(rank => rankCount[rank] === 4 && hand1.map(card => card[0]).includes(rank));
    const fourOfAKind2 = Object.keys(rankCount).filter(rank => rankCount[rank] === 4 && hand2.map(card => card[0]).includes(rank));

    // Check for straight
    const straight1 = allRanks.some((_, index) => {
        return allRanks.slice(index, index + 5).join('') === 'A2345' || 'A23456789TJQKA'.includes(allRanks.slice(index, index + 5).join(''));
    });
    const straight2 = allRanks.some((_, index) => {
        return allRanks.slice(index, index + 5).join('') === 'A2345' || 'A23456789TJQKA'.includes(allRanks.slice(index, index + 5).join(''));
    });

    // Evaluate hands
    if (flush1) {
        return "Player 1 wins with a flush!";
    } else if (flush2) {
        return "Player 2 wins with a flush!";
    } else if (fourOfAKind1.length) {
        return "Player 1 wins with four of a kind!";
    } else if (fourOfAKind2.length) {
        return "Player 2 wins with four of a kind!";
    } else if (straight1) {
        return "Player 1 wins with a straight!";
    } else if (straight2) {
        return "Player 2 wins with a straight!";
    } else if (threeOfAKind1.length) {
        return "Player 1 wins with three of a kind!";
    } else if (threeOfAKind2.length) {
        return "Player 2 wins with three of a kind!";
    } else if (pairs1.length === 2) {
        return "Player 1 wins with two pairs!";
    } else if (pairs2.length === 2) {
        return "Player 2 wins with two pairs!";
    } else if (pairs1.length === 1) {
        return "Player 1 wins with a pair!";
    } else if (pairs2.length === 1) {
        return "Player 2 wins with a pair!";
    } else {
        return "It's a tie!";
    }
}

// Cards
const hand1 = [['T', 'S'], ['T', 'H']];
const hand2 = [['A', 'S'], ['T', 'D']];
const board = [['A', 'H'], ['J', 'H'], ['4', 'H'], ['3', 'S'], ['2', 'H']];

// Determine the winner
const result = determineWinner(hand1, hand2, board);
console.log(result);