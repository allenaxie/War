/* War

Setup: Deck of 52 cards -> 26 cards to player, 26 cards to computer.

Render: 
- player clicks "deck" to play button: 
    -> player plays card on pile then computer plays card on pile-> 
    -> side with larger card adds all the cards from pile into their deck 
    -> If same card rank, each side places 3 cards face down and 4th card face up
    -> side with larger card adds all the cards from pile into their deck 

- Each turn, player may click "shuffle" button or "play card" button
-> repeat until player wins all the cards or at round 50, 
-> sudden death: winner of next round wins

max turns = 50 (larger deck wins)

Tasks:

- change background when its time for "War"
- Click 4 times "play card" for War

- hand array - display only last card in array

*/



//////////////////////////////    Constants    ////////////////////////////

// Constants
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const cardLookUp = {
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14,
};
const masterDeck = buildMasterDeck();
let shuffledDeck = getNewShuffledDeck();

function buildMasterDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function (suit) {
        ranks.forEach(function (rank) {
            deck.push({
                // The 'face' property maps to the library's CSS classes for cards
                face: `${suit}${rank}`,
                // Setting the 'value' property 
                value: Number(rank) || cardLookUp[rank]
            });
        });
    });
    return deck;
}


function getNewShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
        // Get a random index for a card still in the tempDeck
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}


//////////////////////////////    App's state (variables)    ////////////////////////////

let round, winner, pPile, cPile, pHand, cHand, pDeck, cDeck;


//////////////////////////////    Cached element references    ////////////////////////////
let pHandEl = document.querySelector(".pHand");
let cHandEl = document.querySelector(".cHand");
let pPileEl = document.querySelector(".pPile");
let cPileEl = document.querySelector(".cPile");

let pCardBtnEl = document.querySelector(".pCardBtn");

let roundEl = document.querySelector(".round");


// rules



//////////////////////////////    Functions    ////////////////////////////

init();

// Set initial variables
function init() {
    // new shuffled deck
    shuffledDeck = getNewShuffledDeck();
    // Assign values to decks
    pDeck = [];
    cDeck = [];
    // Assign value to player pile and computer pile 
    pPile = [];
    cPile = [];
    // Add rest of cards to respective players' decks
    while (shuffledDeck.length) {
        cDeck.push(shuffledDeck.pop());
        pDeck.push(shuffledDeck.pop());
    }
    // 1 card to player hand
    pHand = [pDeck.pop()];
    // 1 card to computer hand
    cHand = [cDeck.pop()];
    round = 1;
    winner = null;
    render();
}



function render() {
    // Display first card of player's hand 
    let cardTemplate = `<div class="card ${pHand[0].face}"></div>`;
    pHandEl.innerHTML = cardTemplate;
    // display first card of computer's hand
    let cardTemplate2 = `<div class="card ${cHand[0].face}"></div>`;
    cHandEl.innerHTML = cardTemplate2;
    // Update round number onto DOM
    roundEl.innerHTML = `Round: ${round}`;
    if (cPile.length) {
        cPileEl.style.display = "inline-block";
        pPileEl.style.display = "inline-block";
    }
}


function handleMove() {
    // if first turn, show card 
    if (round === 1) {
        pHandEl.style.display = "block";
        cHandEl.style.display = "block";
    }
    else {
        // Play the next card from the player’s deck and computer’s deck
        pHand.unshift(pDeck.pop());
        cHand.unshift(cDeck.pop());
    }
    // Increment round number
    round++;
    // show card on DOM
    render();
    // Check for winner
    getWinner();
}


function getWinner() {
    // Check for winner of each round
    // If player has higher card
    if (pHand[0].value > cHand[0].value) {
        // Add cards from both hands to player's deck (LiFo)
        while (pHand.length) {
            pDeck.unshift(pHand.shift(),cHand.shift());
        }
        // both pile to player's deck
        while (pPile.length) {
            pDeck.unshift(pPile.pop())
            pDeck.unshift(cPile.pop())
        }

    }
    // If computer has higher card
    else if (cHand[0].value > pHand[0].value) {
        // Add both hands to computer's deck (LiFo)
        while (cHand.length) {
            cDeck.unshift(cHand.shift(),pHand.shift());
        }
        // add both pile to computer's deck
        while (cPile.length > 0) {
            cDeck.unshift(pPile.pop())
            cDeck.unshift(cPile.pop())
        }
    }
    // if equal value
    else {
        // War
        // Change background

        // Sound

        // 3 cards from each player's deck to pile
        for (let i = 0 ; i < 3; i++) {
            cPile.push(cDeck.pop());
            pPile.push(pDeck.pop());
        }
        // 1 card from end of deck to front of hand
        pHand.unshift(pDeck.pop());
        cHand.unshift(cDeck.pop());
        getWinner();
        
    }
    console.log(pDeck)
    console.log(cDeck)
    console.log(pHand)
    console.log(cHand)
    // Check for winner of game


    
    // Else if player card is of lower value than computer’s card
    // Add both cards to bottom of computer’s deck
    // Else player and computer goes to war
    // Both sides add 3 more cards face down to pile, flip 4th card face up
    // handleMove()
    // If player’s deck or computer’s deck is empty, display winner
    
    // Else if round is greater than 50
    // If player’s deck count is greater than computer’s deck count
    // Player wins
    // Else if player’s deck count is less than computer’s deck count
    // Computer wins
    // Else 
    // Play one more round and winner of next round wins the game

}



//////////////////////////////    Event Listeners    ////////////////////////////


// Rules button

// Play card button
pCardBtnEl.addEventListener("click", handleMove);


// Shuffle deck button


// Player has the option to shuffle their deck only once per turn

// Settings button
// Able to change background color theme
// Able to set number of rounds before a winner is declared (30, 50, unlimited)

//Play again button
// pops up after game is over

// Computer trash talk
// Speech bubble sometimes comes out 
// if computer wins a round
// When player down to 20/15/10/5/1 cards

// Choose player icon vs computer icon
// Icon profile pic for player & computer 







