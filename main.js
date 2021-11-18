/* War

Setup: Deck of 52 cards -> 26 cards to player, 26 cards to computer.

Render: 
- player clicks "play card" button: 
    -> player plays card on pile then computer plays card on pile-> 
    -> side with larger card adds all the cards from pile into their deck 
    -> If same card rank, each side places 3 cards face down and 4th card face up
    -> side with larger card adds all the cards from pile into their deck 

- Each turn, player may click "shuffle" button or "play card" button
-> repeat until player wins all the cards or side with larger deck at round 50 wins

max turns = 50 (larger deck wins)
*/



//////////////////////////////    Constants    ////////////////////////////
const deck = {

};
const playerOne = {};
const computer = {};
const pile = {};


//////////////////////////////    App's state (variables)    ////////////////////////////

let turn, board, winner;



//////////////////////////////    Cached element references    ////////////////////////////


// rules



//////////////////////////////    Event Listeners    ////////////////////////////


// Rules button

// Play card button

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



//////////////////////////////    Functions    ////////////////////////////

function initialize () {
    // Set initial stage of game
    // 26 cards each deck
    // Field is empty
    // Shuffle button (1 attempt)



}

function render () {

}

function handleMove (e) {

}

function getWinner() {

}






