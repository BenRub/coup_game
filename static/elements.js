let cbListOfPlayers = undefined
function getCbListOfPlayers() {
    if (cbListOfPlayers === undefined) {
        cbListOfPlayers = document.getElementById("listOfPlayers")
    }
    return cbListOfPlayers
}

let deckSizeElement = undefined
function getDeckSizeElement() {
    if (deckSizeElement === undefined) {
        deckSizeElement = document.getElementById("deckSize")
    }
    return deckSizeElement
}

let cardsNamesThatAreBeingPlayedElement = undefined
function getCardsNamesThatAreBeingPlayedElement() {
    if (cardsNamesThatAreBeingPlayedElement === undefined) {
        cardsNamesThatAreBeingPlayedElement = document.getElementById("cardsNamesThatAreBeingPlayed")
    }

    return cardsNamesThatAreBeingPlayedElement
}

let endTurnButtonElement = undefined
function getEndTurnButtonElement() {
    if (endTurnButtonElement === undefined) {
        endTurnButtonElement = document.getElementById("endTurn")
    }

    return endTurnButtonElement
}

let baseTokensElement = undefined
function getBaseTokensElement() {
    if (baseTokensElement === undefined) {
        baseTokensElement = document.getElementById("base_tokens")
    }
    return baseTokensElement
}

let myTokensElement = undefined
function getMyTokensElement() {
    if (myTokensElement === undefined) {
        myTokensElement = document.getElementById("my_tokens")
    }
    return myTokensElement
}

let myCardsElem = undefined
let myCardsElements = {}
function getMyCardsElem() {
    if (myCardsElem === undefined) {
        myCardsElem = document.getElementById("my_cards")
    }
    return myCardsElem
}

let oneCoinAmountElement = undefined
function getOneCoinAmountElement() {
    if (oneCoinAmountElement === undefined) {
        oneCoinAmountElement = document.getElementById("oneCoinAmount")
    }
    return oneCoinAmountElement
}

let threeCoinsAmountElement = undefined
function getThreeCoinsAmountElement() {
    if (threeCoinsAmountElement === undefined) {
        threeCoinsAmountElement = document.getElementById("threeCoinsAmount")
    }
    return threeCoinsAmountElement
}

let playingPlayersElem = undefined
function getPlayingPlayersElem() {
    if (playingPlayersElem === undefined) {
        playingPlayersElem = document.getElementById("playing_players")
    }
    return playingPlayersElem
}

let listOfPlayersElement = undefined
function getListOfPlayersElement() {
    if (listOfPlayersElement === undefined) {
        listOfPlayersElement = document.getElementById("listOfPlayers")
    }
    return listOfPlayersElement
}

let cardsTableElement = undefined
function getCardsTableElement() {
    if (cardsTableElement === undefined) {
        cardsTableElement = document.getElementById("cardsTable")
    }
    return cardsTableElement
}

let allCardsElement = undefined
function getAllCardsElement() {
    if (allCardsElement === undefined) {
        allCardsElement = document.getElementById("allCards")
    }
    return allCardsElement
}






