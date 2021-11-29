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

let player, round, winner, pPile, cPile, pHand,
    cHand, pDeck, cDeck, warStatus, warCards, roundsRemain
    , shuffled, soundStatus;

//////////////////////////////    Cached element references    ////////////////////////////
let bodyEl = document.querySelector("body");
// Field
let pHandEl = document.querySelector(".pHand");
let cHandEl = document.querySelector(".cHand");
let pPileEl = document.querySelector(".pPile");
let cPileEl = document.querySelector(".cPile");
let pDeckEl = document.querySelector(".pDeck");
let cDeckEl = document.querySelector(".cDeck");
// Buttons/Images
let playBtnEl = document.querySelector(".playBtn");
let pCardBtnEl = document.querySelector(".pCardBtn");
let infoBtnEl = document.querySelector(".infoBtn");
let homeRulesBtnEl = document.querySelector(".homeRulesBtn")
let gameRulesBtnEl = document.querySelector(".gameRulesBtn")
let homeSettingsBtnEl = document.querySelector(".homeSettingsBtn");
let gameSettingsBtnEl = document.querySelector(".gameSettingsBtn");
let rulesOKBtnEl = document.getElementById("rulesOk");
let settingsOkBtnEl = document.getElementById("settingsOk");
let pNameInputEl = document.querySelector(".pNameInput");
let playAgainBtnEl = document.querySelector(".playAgainBtn");
let btnsEl = document.querySelectorAll(".btns");
let soundOnEl = document.querySelector(".soundOn");
let soundOffEl = document.querySelector(".soundOff");
let warMusicOnEl = document.querySelector(".warMusicOn");
let warMusicOffEl = document.querySelector(".warMusicOff");
let gameScreenTitleEl = document.querySelector(".gameScreenTitle");
// Messages
let roundEl = document.querySelector(".round");
let warMsgEl = document.querySelector(".warMsg");
let winMsgEl = document.querySelector(".winMsg");
let winMsgContainer = document.querySelector(".winMsgContainer");
let settingsContainerEl = document.querySelector(".settingsContainer");
let rulesMsgEl = document.querySelector(".rulesMsg");
let shuffleBtnEl = document.querySelector(".shuffleBtn");
let cDeckCountEl = document.querySelector(".cDeckCount");
let pDeckCountEl = document.querySelector(".pDeckCount");
let roundsRemainEl = document.querySelector(".roundsRemain");
// Audio
const audioLookUp = {
    childYayAudioEl: document.getElementById("childYayAudio"),
    dealCardAudioEl: document.getElementById("dealCardAudio"),
    shuffleCardAudioEl: document.getElementById("shuffleCardAudio"),
    laughAudioEl: document.getElementById("laughAudio"),
    startWarEl: document.getElementById("startWar"),
    warMusicEl: document.getElementById("warMusic"),
}
// Background themes
const bgThemes = {
    fieryOcean: {
        bgFO1: document.getElementById("bgFO1"),
        bgFO2: document.getElementById("bgFO2"),
    },
    blackYellow: {
        bgBY1: document.getElementById("bgBY1"),
        bgBY2: document.getElementById("bgBY2"),
    }
}

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
    roundsRemain = null;
    winMsgContainer.style.display = "none";
    roundsRemainEl.style.display = "none";
    warCards = 0;
    player = {};
    shuffled = 0;
    soundStatus = true;
    Object.values(audioLookUp).forEach(function (audio) {
        audio.volume = 0.35;
    })
    audioLookUp.startWarEl.volume = 0;
    audioLookUp.warMusicEl.volume = 0;
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
        pHandEl.style.opacity = 1;
        cHandEl.style.opacity = 1;
    }
    else {
        // Play the next card from the player’s deck and computer’s deck
        pHand.unshift(pDeck.pop());
        cHand.unshift(cDeck.pop());
    }
    // Hide war message after battle
    if (warStatus === false) {
        warMsgEl.style.display = "none";
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
        // Sound
        if (warCards === 0) {
            audioLookUp.startWarEl.play();
            btnsEl.forEach(function (e) {
                e.style.pointerEvents = "none";
            })
            setTimeout(function () {
                audioLookUp.warMusicEl.play();
                btnsEl.forEach(function (e) {
                    e.style.pointerEvents = "auto";
                })
            }, 1500);
        }
        // display War time message: Play 4 more cards
        warMsgEl.innerHTML = `Time for WAR! Play ${4 - warCards} more cards.`;
        warMsgEl.style.display = "inline-block";
    }

    // Check for winner of game
    // If player’s deck or computer’s deck is empty, display winner
    if (pDeck.length === 0) {
        // computer wins!
        winMsgEl.innerHTML = `DEFEAT! <br> Computer wins!`;
        winMsgContainer.style.display = "inline-block";
        winMsgContainer.style.background = "linear-gradient(rgb(236, 49, 49) 0%,rgb(250, 115, 25) 150%)";
        audioLookUp.laughAudioEl.play();
    }
    else if (cDeck.length === 0) {
        // player wins!
        winMsgEl.innerHTML = `VICTORY! <br> You win! `;
        winMsgContainer.style.display = "inline-block";
        winMsgContainer.style.background = "linear-gradient(rgb(3, 206, 131) 0%,rgb(4, 158, 4) 150%)";
        audioLookUp.childYayAudioEl.play();
    }
    else if (round > 110) {
        // winner of next round wins the game!
        roundsRemainEl.style.display = "inline-block"
        roundsRemainEl.innerHTML = `<span>Rounds remaining: </span> <br><br> ${120 - round}`
        if (round === 120) {
            btnsEl.forEach(function (e) {
                e.style.pointerEvents = "none";
            })
            // player with most cards in deck wins
            if (cDeck.length > pDeck.length) {
                winMsgEl.innerHTML = `DEFEAT! <br> Computer has more cards in their deck!`;
                winMsgContainer.style.display = "inline-block";
                winMsgContainer.style.background = "linear-gradient(rgb(236, 49, 49) 0%,rgb(250, 115, 25) 150%)";
                audioLookUp.laughAudioEl.play();
            }
            else if (pDeck.length > cDeck.length) {
                winMsgEl.innerHTML = `VICTORY! <br> You have more cards in your deck!`;
                winMsgContainer.style.display = "inline-block";
                winMsgContainer.style.background = "linear-gradient(rgb(3, 206, 131) 0%,rgb(4, 158, 4) 150%)";
                audioLookUp.childYayAudioEl.play();
            }
            else {
                winMsginnerHTML = `TIE GAME! You're not a winner nor a loser.`;
                winMsgContainer.style.display = "inline-block";
                winMsgContainer.style.background = "linear-gradient(90deg,#0162c8,#55e7fc);";
                audioLookUp.laughAudioEl.play();
            }
        }
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
        document.getElementById("warMusic").pause();
        if (pHand[0].value > cHand[0].value) {
            warMsgEl.innerHTML = "You've WON this battle!"
        }
        else if (cHand[0].value > pHand[0].value) {
            warMsgEl.innerHTML = "You've LOST this battle!"
        }
    }
    render();
    getWinner();
}

function shufflePDeck() {
    if (shuffled === 3) {
        shuffleBtnEl.disabled = true;
    }
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
    pDeck = tempDeck.map(function (card) {
        return card;
    });
    return pDeck;
}

//////////////////////////////    Event Listeners    ////////////////////////////
//Play button
playBtnEl.addEventListener("click", function () {
    if (pNameInputEl.value) {
        player.name = pNameInputEl.value;
        document.querySelector("footer").style.display = "none";
        document.querySelector(".pName").innerText = player.name
        $("header").fadeOut();
        $(".homeScreen").fadeOut();
        // Delay game screen fade in
        setTimeout(function () {
            $(".gameScreen").fadeIn();
        }, 350);
    }
})

// Home Rules button
homeRulesBtnEl.addEventListener("click", function () {
    rulesMsgEl.style.display = "inline-block";
    homeSettingsBtnEl.style.pointerEvents = "none";
    playAgainBtnEl.style.pointerEvents = "none";
})

// Game Rules button
gameRulesBtnEl.addEventListener("click", function () {
    rulesMsgEl.style.display = "inline-block";
    btnsEl.forEach(function (btn) {
        btn.style.pointerEvents = "none";
    })
})
// Rules OK button
rulesOKBtnEl.addEventListener("click", function () {
    rulesMsgEl.style.display = "none";
    homeSettingsBtnEl.style.pointerEvents = "auto";
    playAgainBtnEl.style.pointerEvents = "auto";
    btnsEl.forEach(function (btn) {
        btn.style.pointerEvents = "auto";
    })
})

// Game screen title
gameScreenTitleEl.addEventListener("click", function (){
    location.reload();
});

// Play card button
pCardBtnEl.addEventListener("click", function (e) {
    // play deal card sound
    audioLookUp.dealCardAudioEl.play();
    // if warStatus = false, normal click
    if (!warStatus) {
        handleMove();
    }
    else {
        warTime();
    }
    // .5 second per click
    pCardBtnEl.disabled = true;
    setTimeout(function () {
        pCardBtnEl.disabled = false;
    }, 500);
});
// Click player deck to also play next card
pDeckEl.addEventListener("click", function () {
    // play deal card sound
    audioLookUp.dealCardAudioEl.play();
    // if warStatus = false, normal click
    return (!warStatus) ? handleMove() : warTime();
});

// Shuffle deck button
shuffleBtnEl.addEventListener("click", function () {
    if (shuffled < 3) {
        // sound effect
        audioLookUp.shuffleCardAudioEl.play();
        shuffled ++;
        shuffleBtnEl.innerHTML = `Shuffle Deck (${3 - shuffled})`;
        shufflePDeck;
        // wait .8 sec before click again
        shuffleBtnEl.disabled = true;
        setTimeout(function () {
            shuffleBtnEl.disabled = false;
        },1200);
        console.log(shuffled);
    }
});

// Settings button
homeSettingsBtnEl.addEventListener("click", function () {
    settingsContainerEl.style.display = "inline-block";
    homeRulesBtnEl.style.pointerEvents = "none";
    playBtnEl.style.pointerEvents = "none";
})
gameSettingsBtnEl.addEventListener("click", function () {
    settingsContainerEl.style.display = "inline-block";
    btnsEl.forEach(function (btn) {
        btn.style.pointerEvents = "none";
    })
})
//Sound settings
//Master sound 
soundOnEl.addEventListener("click", function () {
    Object.values(audioLookUp).forEach(function (audio) {
        audio.volume = 0;
    })
    soundStatus = false;
    soundOnEl.style.display = "none";
    soundOffEl.style.display = "inline-block";
})
soundOffEl.addEventListener("click", function () {
    Object.values(audioLookUp).forEach(function (audio) {
        audio.volume = 0.35;
    })
    soundStatus = true;
    soundOffEl.style.display = "none";
    soundOnEl.style.display = "inline-block";
})
// War music
warMusicOnEl.addEventListener("click", function () {
    audioLookUp.startWarEl.volume = 0;
    audioLookUp.warMusicEl.volume = 0;
    warMusicOnEl.style.display = "none";
    warMusicOffEl.style.display = "inline-block";
})
warMusicOffEl.addEventListener("click", function () {
    if (soundStatus === true) {
        audioLookUp.startWarEl.volume = 0.35;
        audioLookUp.warMusicEl.volume = 0.35;
    }
    warMusicOnEl.style.display = "inline-block";
    warMusicOffEl.style.display = "none";
})
// Settings ok button 
settingsOkBtnEl.addEventListener("click", function () {
    settingsContainerEl.style.display = "none";
    btnsEl.forEach(function (btn) {
        btn.style.pointerEvents = "auto";
    })
    homeRulesBtnEl.style.pointerEvents = "auto";
    playBtnEl.style.pointerEvents = "auto";
})

//Play again button
playAgainBtnEl.addEventListener("click", init);

//////// Background themes ////////
// Fiery Ocean (default)
bgThemes["fieryOcean"]["bgFO1"].addEventListener("click", function () {
    // Remove existing theme
    if (bodyEl.className !== "") {
        bodyEl.className = "";
        playBtnEl.className = "playBtn";
        homeRulesBtnEl.className = "homeRulesBtn";
        homeSettingsBtnEl.className = "homeSettingsBtn";
    }
    // Add new theme
    // add class to body
    bodyEl.className = "fieryOceanBody";
    // add class to buttons
    playBtnEl.classList.add("fieryOceanBtns");
    homeRulesBtnEl.classList.add("fieryOceanBtns");
    homeSettingsBtnEl.classList.add("fieryOceanBtns");
});
// show preview when hover
bgThemes["fieryOcean"]["bgFO1"].addEventListener("mouseenter", function () {
    bgThemes["fieryOcean"]["bgFO2"].style.display = "inline-block";
});
bgThemes["fieryOcean"]["bgFO1"].addEventListener("mouseleave", function () {
    bgThemes["fieryOcean"]["bgFO2"].style.display = "none";
});

// Black and yellow
bgThemes["blackYellow"]["bgBY1"].addEventListener("click", function () {
    // Remove old theme
    if (bodyEl.className !== "") {
        bodyEl.className = "";
        playBtnEl.className = "playBtn";
        homeRulesBtnEl.className = "homeRulesBtn";
        homeSettingsBtnEl.className = "homeSettingsBtn";
    }
    // Add new theme
    // add class to body
    bodyEl.className = "blackYellowBody";;
    // add class to buttons
    playBtnEl.classList.add("blackYellowBtns");
    homeRulesBtnEl.classList.add("blackYellowBtns");
    homeSettingsBtnEl.classList.add("blackYellowBtns");
})
// show preview on hover
bgThemes["blackYellow"]["bgBY1"].addEventListener("mouseenter", function () {
    bgThemes["blackYellow"]["bgBY2"].style.display = "inline-block";
})
bgThemes["blackYellow"]["bgBY1"].addEventListener("mouseleave", function () {
    bgThemes["blackYellow"]["bgBY2"].style.display = "none";
})
