let deckOfCards = [
    "AD","AC","AH","AS",
    "2D","2C","2H","2S",
    "3D","3C","3H","3S",
    "4D","4C","4H","4S",
    "5D","5C","5H","5S",
    "6D","6C","6H","6S",
    "7D","7C","7H","7S",
    "8D","8C","8H","8S",
    "9D","9C","9H","9S",
    "10D","10C","10H","10S",
    "JD","JC","JH","JS",
    "QD","QC","QH","QS",
    "KD","KC","KH","KS",
] //52 cards

let playerHandArray = [];
let computerHandArray = [];

let playerHandCount;
let playerHandSecCount;
let finalPlayerCount;

let computerHandCount;
let computerHandSecCount;
let finalComputerCount;

let acePresentPlayer = false;
let acePresentComputer = false;

let gameOver = false;
let tieBreak = false;

let results = '';
let earnings = 0;


let displayPlayerCard = document.querySelector(".js-player-cards");
let displayPlayerCount = document.querySelector(".js-player-count");

let displayComputerCard = document.querySelector(".js-computer-cards");
let displayComputerCount = document.querySelector(".js-computer-count");

//betting
let displayResults = document.querySelector(".js-results");

let slider = document.querySelector(".slider");
let output = document.querySelector(".bet-amount");
output.innerHTML = slider.value; 
slider.oninput = function() {
  output.innerHTML = this.value;
}

let multiplier = 0;
let initialChips = 1000;

document.querySelector(".js-hand-amount").innerHTML = initialChips;

function getCard(){
    const index = [Math.floor(Math.random() * deckOfCards.length)];
    let card = deckOfCards[index];
    deckOfCards.splice(index,1); //remove that card from the deck
    return card;
}

document.querySelector(".js-play-button").addEventListener("click", () => {
    reset();
    let movesHTML = `<div class="next">
        <button class="js-hit"> Hit </button>
        <button class="js-stand"> Stand </button>
    </div>`;
    document.querySelector(".js-actions").innerHTML = movesHTML;
    
    for (let loop = 0; loop < 2; loop += 1){
        
        let playerCard = getCard();
        let computerCard = getCard();

        playerHandArray.push(playerCard);
        computerHandArray.push(computerCard);
    }
    renderCards(playerHandArray, ".js-player-cards");

    //count cards
    playerHandCount = countCard(playerHandArray);
    computerHandCount = countCard(computerHandArray);
    //check for blackjack 
    checkForBlackJack();

    if (gameOver) {
        displayEnd();
        return;
    }
    else {
        if (checkForAce(playerHandArray)) {
            dealWithAce();
            acePresentPlayer = true; //calculate second hand count and display both values, if the main value is more than 21, then only display the second value
        }
        else {
            displayPlayerCount.innerHTML = playerHandCount;
        }
    
        if (checkForAce(computerHandArray)) {
            computerHandSecCount = calcSecondaryCount(computerHandArray);
            acePresentComputer = true;
        }
    }
    document.querySelector(".js-hit").addEventListener("click", () => { 
        let newCard = getCard();
        playerHandArray.push(newCard);
        playerHandCount = countCard(playerHandArray);
    
        if (checkForAce(playerHandArray))
        {
            acePresentPlayer = true;
            dealWithAce(); 
            (playerHandCount > playerHandSecCount && playerHandCount <= 21)?  
            finalPlayerCount = playerHandCount : finalPlayerCount = playerHandSecCount;
        }
        else { // no aces (no second hand count)
            finalPlayerCount = playerHandCount;
            displayPlayerCount.innerHTML = finalPlayerCount;
        }
        if (playerHandArray.length === 3) {
            if (checkForTripleSeven(playerHandArray))
            {
                results = "TRIPLE 7, You win!";
                displayResults.innerHTML = results;
                multiplier = 7;
                displayComputerCount.innerHTML = computerHandCount;
                displayPlayerCount.innerHTML = finalPlayerCount;
                renderCards(playerHandArray, ".js-player-cards");
                renderCards(computerHandArray, ".js-computer-cards");
                document.querySelector(".js-actions").innerHTML = "";

                finishBet();
                displayLog();
                return;
            }
        }
    
        if (playerHandArray.length === 5) {
            if (checkForFive(finalPlayerCount))
            {
                results = "WU LONG, You win!";
                displayResults.innerHTML = results;
                multiplier = 3;
            }
            else 
            {
                results = "WU LONG more than 21, You lose!"
                displayResults.innerHTML = results;
                multiplier = -3;
            }
            displayComputerCount.innerHTML = computerHandCount;
            displayPlayerCount.innerHTML = finalPlayerCount;
            renderCards(playerHandArray, ".js-player-cards");
            renderCards(computerHandArray, ".js-computer-cards");
            document.querySelector(".js-actions").innerHTML = "";
            finishBet();
            displayLog();
            return;
        } 
        checkCard();
        if (gameOver) //player more than 21 
        {
            displayEnd();
            return;
        } 
        renderCards(playerHandArray, ".js-player-cards");
    });
    
    document.querySelector(".js-stand").addEventListener("click", () => {
        //finalise player hand (18 vs 9, will choose 18)
        if (gameOver) {
            displayEnd();
            return;
        }
    
        if (acePresentPlayer)
        {
            (playerHandCount > playerHandSecCount && playerHandCount <= 21) ? finalPlayerCount = playerHandCount : finalPlayerCount = playerHandSecCount;
            displayPlayerCount.innerHTML = finalPlayerCount;
        }
        else
        {
            finalPlayerCount = playerHandCount;
        }
    
        if (computerHandCount > 16 && computerHandCount <= 21)
        {
            finalComputerCount = computerHandCount;
            tieBreak = true;
        }
    
        while (!gameOver && !tieBreak)
        {
            let newCard = getCard();
            computerHandArray.push(newCard);
            computerHandCount = countCard(computerHandArray);
            computerHandSecCount = calcSecondaryCount(computerHandArray);
    
            if (checkForAce(computerHandArray))
            {
                (computerHandCount > computerHandSecCount && computerHandCount <= 21 && computerHandArray.length <= 4)?  finalComputerCount = computerHandCount : finalComputerCount = computerHandSecCount;
            }
            else
            {
                finalComputerCount = computerHandCount;
            }
            if (computerHandArray.length === 3) {
                if (checkForTripleSeven(computerHandArray))
                {
                    results = "Computer TRIPLE 7, You lose!";
                    displayResults.innerHTML = results
                    multiplier = -7;
                    displayComputerCount.innerHTML = computerHandCount;
                    displayPlayerCount.innerHTML = finalPlayerCount;
                    renderCards(playerHandArray, ".js-player-cards");
                    renderCards(computerHandArray, ".js-computer-cards");
                    document.querySelector(".js-actions").innerHTML = "";
                    finishBet();
                    displayLog();
                    return;
                }
            }
            if (computerHandArray.length === 5) {
                if (checkForFive(finalComputerCount)) 
                {
                    results = "Computer WU LONG, You lose!";
                    displayResults.innerHTML = results;
                    displayComputerCount.innerHTML = finalComputerCount;
                    multiplier = -3;
                }
                else 
                {
                    results = "Computer WU LONG more than 21, You win!";
                    displayResults.innerHTML = results;
                    displayComputerCount.innerHTML = finalComputerCount;
                    multiplier = -3;
                }
                renderCards(playerHandArray, ".js-player-cards");
                renderCards(computerHandArray, ".js-computer-cards");
                document.querySelector(".js-actions").innerHTML = "";
                finishBet();
                displayLog();
                return;
            } 
            checkCard(); 
        }
    
        if (gameOver) {
            displayEnd();
            return;
        }
    
        if (tieBreak)
        {
            endgame();
            return;
        }
    })
});

function reset() {

    deckOfCards = [
        "AD","AC","AH","AS",
        "2D","2C","2H","2S",
        "3D","3C","3H","3S",
        "4D","4C","4H","4S",
        "5D","5C","5H","5S",
        "6D","6C","6H","6S",
        "7D","7C","7H","7S",
        "8D","8C","8H","8S",
        "9D","9C","9H","9S",
        "10D","10C","10H","10S",
        "JD","JC","JH","JS",
        "QD","QC","QH","QS",
        "KD","KC","KH","KS",
    ] //52 cards

    playerHandArray = [];
    computerHandArray = [];
    
    playerHandCount = 0;
    playerHandSecCount = 0;
    finalPlayerCount = 0;
    
    computerHandCount = 0;
    computerHandSecCount = 0;
    finalComputerCount = 0;
    
    acePresentComputer = false;
    
    gameOver = false;
    tieBreak = false;

    results = '';
    earnings = 0;

    displayResults.innerHTML = "";
    displayComputerCard.innerHTML = "";
    displayPlayerCard.innerHTML = "";
    displayPlayerCount.innerHTML = "";
    displayComputerCount.innerHTML = "";

    document.querySelector(".js-actions").innerHTML = "";
}

function countCard(cardArray) {
    let value = 0;
    cardArray.forEach((card) => {
        if (card.startsWith("K") || card.startsWith("Q") || card.startsWith("J"))
        {
            value += 10;
        }
        else if (card.startsWith("A"))
        {
            value += 11;
        }
        else
        {
            value += parseFloat(card);
        }
    });
    return value;
}

function checkForBlackJack () {
    if (playerHandCount === 21)
    {
        results = "BlackJack! You win!";
        displayResults.innerHTML = results;
        displayComputerCount.innerHTML = computerHandCount;
        gameOver = true;
        multiplier = 2;
    }
    else if (playerHandCount === 22)
    {
        results = "BlackJack! You win!";
        displayResults.innerHTML = results;
        displayComputerCount.innerHTML = computerHandCount;
        gameOver = true;
        multiplier = 3;
    }
    else if (computerHandCount === 21) {
        results = "Computer BlackJack! You lose!";
        displayResults.innerHTML = results;
        displayPlayerCount.innerHTML = playerHandCount;
        gameOver = true;
        multiplier = -2;
    }
    else if (computerHandCount === 22) {
        results = "Computer BlackJack! You lose!";
        displayResults.innerHTML = results;
        displayPlayerCount.innerHTML = playerHandCount;
        gameOver = true;
        multiplier = -3;
    }
}

function checkForAce(hand) {
    return hand.some((card) => {
        if (card.startsWith("A")) {
            return true; 
        }
        return false;
    });
}

function dealWithAce(){
    playerHandSecCount = calcSecondaryCount(playerHandArray);
    if (playerHandCount <= 21) {
        displayPlayerCount.innerHTML = `${playerHandCount} or ${playerHandSecCount}`;
    }
    else {
        displayPlayerCount.innerHTML =
        playerHandSecCount;
    }
}

function checkForFive (count) {
    if (count <= 21)
    {
        gameOver = true;
        return true;
    }
    return false;
}

function checkCard() {
    if (finalPlayerCount > 21) {
        results = "More than 21, You lose!";
        displayResults.innerHTML = results;
        gameOver = true;
        multiplier = -1;
        return;
    }

    if (finalComputerCount > 16 && finalComputerCount <= 21)
    {
        tieBreak = true;
        return;
    }
    if (finalComputerCount > 21) {
        results = "Computer More than 21, You win!";
        displayResults.innerHTML = results;
        gameOver = true;
        multiplier = 1;
        return;
    }
}
let displayArray = [];
function displayLog()
{   
    displayArray.push(`${results} ${earnings}.`);
    document.querySelector(".game-log").innerHTML = displayArray.join('<br>');
}

function endgame() {
    renderCards(playerHandArray, ".js-player-cards");
    renderCards(computerHandArray, ".js-computer-cards");

    displayComputerCount.innerHTML = finalComputerCount;
    if (finalComputerCount < finalPlayerCount){
        results = "You win!";
        displayResults.innerHTML = results;
        multiplier = 1;
    }
    else if (finalComputerCount > finalPlayerCount)
    {
        results = "You lose!";
        displayResults.innerHTML = results;
        multiplier = -1;

    }
    else if (finalComputerCount === finalPlayerCount){
        results = "Tie!";
        displayResults.innerHTML = results;
        multiplier = 0;
    }
    document.querySelector(".js-actions").innerHTML = "";

    finishBet();
    displayLog();
}

function calcSecondaryCount(cardArray)
{
    let value = 0;
    cardArray.forEach((card) => {
        if (card.startsWith("K") || card.startsWith("Q") || card.startsWith("J"))
        {
            value += 10;
        }
        else if (card.startsWith("A"))
        {
            value += 1;
        }
        else
        {
            value += parseFloat(card);
        }
    });
    return value;
}

function displayEnd() {
    renderCards(playerHandArray, ".js-player-cards");
    renderCards(computerHandArray, ".js-computer-cards");
    document.querySelector(".js-actions").innerHTML = "";
    if (finalComputerCount > 0 && computerHandCount > 21) {
        displayComputerCount.innerHTML = finalComputerCount;
    }
    else {
        displayComputerCount.innerHTML = computerHandCount;
    }
    finishBet();
    displayLog();
}

function renderCards(handArray, containerSelector) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = ""; 
    handArray.forEach((card) => {
        const img = document.createElement("img");
        img.src = `images/${card}.png`; 
        img.alt = card; 
        img.style.width = "90px"; 
        img.style.height = "130px";
        img.style.margin = "5px";
        container.appendChild(img);
    });
}

function finishBet() {
    earnings = multiplier * parseInt(slider.value, 10);
    initialChips += earnings;
    document.querySelector(".js-hand-amount").innerHTML = initialChips;
    console.log(earnings);
}

function checkForTripleSeven(array) {
    let sevenCount = 0;
    array.forEach((card) => {
        if (card.startsWith("7")) {
            sevenCount += 1;
        }
    })
    if (sevenCount === 3) {
        gameOver = true;
        return true;
    }
    return false;
}
