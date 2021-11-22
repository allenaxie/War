/* War

Setup: Deck of 52 cards -> 26 cards to player, 26 cards to computer.

Render: 
- player clicks "deck" to play button: 
    -> player plays card on pile then computer plays card on pile-> 
    -> side with larger card adds all the cards from pile into their deck 
    -> If same card rank, each side places 3 cards face down and 4th card face up
    -> side with larger card adds all the cards from pile into their deck 

- Each turn, player may click "shuffle" button or "play card" button
-> repeat until player wins all the cards or at round 300, 
-> sudden death: winner of next round wins

max turns = 300 (sudden death)

Tasks:
- Title screen
- shuffle deck button
- win game logic 
- rules message
- settings 
    - different backgrounds
    - Able to change background color theme
    - Able to set number of rounds before a winner is declared (30, 50, unlimited)
- change background when its time for "War"
    - add sound effect for war
- title screen
    - just title and play button with background image
    - click play to auto scroll lower and play game 


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

let round, winner, pPile, cPile, pHand, cHand, pDeck, cDeck, warStatus, warCards;


//////////////////////////////    Cached element references    ////////////////////////////
// Field
let pHandEl = document.querySelector(".pHand");
let cHandEl = document.querySelector(".cHand");
let pPileEl = document.querySelector(".pPile");
let cPileEl = document.querySelector(".cPile");
let pDeckEl = document.querySelector(".pDeck");
let cDeckEl = document.querySelector(".cDeck");
// Buttons
let pCardBtnEl = document.querySelector(".pCardBtn");
let infoBtnEl = document.querySelector(".infoBtn");
// Messages
let roundEl = document.querySelector(".round");
let warMsgEl = document.querySelector(".warMsg");
let winMsgEl = document.querySelector(".winMsg");
let shuffleBtnEl = document.querySelector(".shuffleBtn");
let cDeckCountEl = document.querySelector(".cDeckCount");
let pDeckCountEl = document.querySelector(".pDeckCount");



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
    warStatus = false;
    warCards = 0;
    render();
};

function render() {
    // Display first card of player's hand 
    let cardTemplate = `<div class="card ${pHand[0].face}"></div>`;
    pHandEl.innerHTML = cardTemplate;
    // display first card of computer's hand
    let cardTemplate2 = `<div class="card ${cHand[0].face}"></div>`;
    cHandEl.innerHTML = cardTemplate2;
    // Update round number onto DOM
    roundEl.innerHTML = `Round: ${round}`;
    // deck count
    cDeckCountEl.innerHTML = `${cDeck.length} cards`
    pDeckCountEl.innerHTML = `${pDeck.length} cards`
    // show pile for War
    if (cPile.length) {
        cPileEl.style.display = "inline-block";
        pPileEl.style.display = "inline-block";
    } else {
        cPileEl.style.display = "none";
        pPileEl.style.display = "none";
        warMsgEl.style.display = "none";
    }
};

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
};


function getWinner() {
    // Check for winner of each round
    // If player has higher card
    if (pHand[0].value > cHand[0].value) {
        // Add cards from both hands to player's deck (LiFo)
        while (pHand.length) {
            pDeck.unshift(pHand.shift(), cHand.shift());
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
            cDeck.unshift(cHand.shift(), pHand.shift());
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
        warStatus = true;
        // Change background

        // Sound

        // display War time message: Play 4 more cards
        warMsgEl.style.display = "inline-block";
    }


    // Check for winner of game
    // If player’s deck or computer’s deck is empty, display winner
    if (!pDeck.length) {
        // computer wins!
        winMsgEl.innerHTML = `Defeat! <br> Computer wins!`
    }
    else if (!cDeck.length) {
        // player wins!
        winMsgEl.innerHTML = `Victory! <br> You win! `
    }
    else if (round === 200) {
        // winner of next round wins the game!
        
    }
};

function warTime() {
    warCards++;
    // if first 3 cards of war
    if (warCards < 4) {
        // add card from player deck to player pile
        pPile.push(pDeck.pop());
        // add card from computer deck to computer pile
        cPile.push(cDeck.pop());
    }
    else if (warCards === 4) {
        // add card from player deck to player hand
        pHand.unshift(pDeck.pop());
        // add card from computer deck to computer hand
        cHand.unshift(cDeck.pop());
        // turn off war status
        warStatus = false;
        // reset warCards
        warCards = 0;
    }
    render();
    getWinner();
}

function shufflePDeck() {
    // sound effect
    // Create temporary deck
    let tempDeck = [];
    // while pDeck.length is true
    while (pDeck.length) {
        // generate random number between 0 and pDeck.length
        let randomNum = Math.floor(Math.random() * pDeck.length);
        // add random index number card from pDeck to temp deck
        tempDeck.push(pDeck.splice(randomNum, 1)[0]);
    };
    // copy new shuffled deck back to player deck
    pDeck = tempDeck.map(function(card) {
        return card;
    });
    return pDeck;
    // disable after one use per round 
}


//////////////////////////////    Event Listeners    ////////////////////////////
// Hover over either deck to show deck count of both players
cDeckEl.addEventListener("mouseenter", function () {
    cDeckCountEl.style.display = "inline";
    pDeckCountEl.style.display = "inline";
});
cDeckEl.addEventListener("mouseleave", function () {
    cDeckCountEl.style.display = "none";
    pDeckCountEl.style.display = "none";
});

pDeckEl.addEventListener("mouseenter", function () {
    cDeckCountEl.style.display = "inline";
    pDeckCountEl.style.display = "inline";
});
pDeckEl.addEventListener("mouseleave", function () {
    cDeckCountEl.style.display = "none";
    pDeckCountEl.style.display = "none";
});


// Rules button

// Play card button
pCardBtnEl.addEventListener("click", function (e) {
    // if warStatus = false, normal click
    return (!warStatus) ? handleMove() : warTime();
});


// Shuffle deck button
shuffleBtnEl.addEventListener("click", shufflePDeck);

// Player has the option to shuffle their deck only once per turn

// Settings button


//Play again button
// pops up after game is over

// Computer trash talk
// Speech bubble sometimes comes out 
// if computer wins a round
// When player down to 20/15/10/5/1 cards

// Choose player icon vs computer icon
// Icon profile pic for player & computer 







