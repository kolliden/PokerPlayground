//no limit holdem

const cardNumbers = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
const cardSuits = ['spades','clubs','hearts','diamonds'];
const cards = ["2_of_spades","2_of_clubs","2_of_hearts","2_of_diamonds","3_of_spades","3_of_clubs","3_of_hearts","3_of_diamonds","4_of_spades","4_of_clubs","4_of_hearts","4_of_diamonds","5_of_spades","5_of_clubs","5_of_hearts","5_of_diamonds","6_of_spades","6_of_clubs","6_of_hearts","6_of_diamonds","7_of_spades","7_of_clubs","7_of_hearts","7_of_diamonds","8_of_spades","8_of_clubs","8_of_hearts","8_of_diamonds","9_of_spades","9_of_clubs","9_of_hearts","9_of_diamonds","10_of_spades","10_of_clubs","10_of_hearts","10_of_diamonds","J_of_spades","J_of_clubs","J_of_hearts","J_of_diamonds","Q_of_spades","Q_of_clubs","Q_of_hearts","Q_of_diamonds","K_of_spades","K_of_clubs","K_of_hearts","K_of_diamonds","A_of_spades","A_of_clubs","A_of_hearts","A_of_diamonds"]


let players = [{
  chips: 2000,
  cards: [],
},
{
  chips: 2000,
  cards: [],
},
{
  chips: 2000,
  cards: [],
},{
  chips: 2000,
  cards: [],
},{
  chips: 2000,
  cards: [],
},{
  chips: 2000,
  cards: [],
}
];

// assignCardsToPlayers(cardSuits, cardNumbers, players){
//     // Assign cards to players
//     tempPossibleCards = cardSuits.length * cardNumbers.length;

//     for (let i = 0; i < 2; i++) {
//       for (let j = 0; j < players.length; j++) {
//         let card = this.getRandomCard(cardSuits, cardNumbers);
//         players[j].cards.push(card);
//       }
//     }
// }

