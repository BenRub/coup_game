let cbListOfPlayers = undefined
let myPlayersOptions = {}

function updateAllPlayersNames(allPlayersJson) {
    if (cbListOfPlayers === undefined) {
        cbListOfPlayers = document.getElementById("listOfPlayers")
    }

    for (let playerNameLocal in myPlayersOptions) {
        if (!(playerNameLocal in allPlayersJson)) {
            myPlayersOptions[playerNameLocal].remove()
            delete myPlayersOptions[playerNameLocal]
        }
    }

    for (let parsedPlayerName in allPlayersJson) {
        if (parsedPlayerName in myPlayersOptions) {
            continue
        }

        let option = document.createElement("option");
        option.innerText = parsedPlayerName
        myPlayersOptions[parsedPlayerName] = option
        cbListOfPlayers.appendChild(option)
    }
}

let deckSizeElement = undefined

function updateDeckSize(deck_size) {
    if (deckSizeElement === undefined) {
        deckSizeElement = document.getElementById("deckSize")
    }

    deckSizeElement.innerText = deck_size + " cards"
}

let cardsNamesThatAreBeingPlayedElement = undefined

function updateCardsNamesThatAreBeingPlayed(cards_names) {
    if (cardsNamesThatAreBeingPlayedElement === undefined) {
        cardsNamesThatAreBeingPlayedElement = document.getElementById("cardsNamesThatAreBeingPlayed")
    }

    cardsNamesThatAreBeingPlayedElement.innerText = cards_names
}

let endTurnButtonElement = undefined

function updateEndTurnAccess(turn, myName) {
    if (endTurnButtonElement === undefined) {
        endTurnButtonElement = document.getElementById("endTurn")
    }

    if (turn === myName) {
        endTurnButtonElement.disabled = ""
    } else {
        endTurnButtonElement.disabled = "disabled"
    }

}

let myCardsElem = undefined
let myCardsElements = {}

function updateMyCards(turn, myName, myCardsJson) {
    if (myCardsElem === undefined) {
        myCardsElem = document.getElementById("my_cards")
    }

    if (turn === myName) {
        myCardsElem.className = "my_cards myTurn"
    } else {
        myCardsElem.className = "my_cards"
    }

    for (let cardIdLocal in myCardsElements) {
        if (!(cardIdLocal in myCardsJson)) {
            myCardsElements[cardIdLocal].remove()
            delete myCardsElements[cardIdLocal]
        }
    }

    for (let cardId in myCardsJson) {
        let myCard = myCardsJson[cardId]
        let cardElement = undefined
        if (cardId in myCardsElements) {
            cardElement = myCardsElements[cardId]
        } else {
            cardElement = document.createElement("div")
            cardElement.title = cardId
            cardElement.draggable = true
            cardElement.ondragstart = dragCardToDeck
            myCardsElements[cardId] = cardElement
            myCardsElem.appendChild(cardElement)
        }

        cardElement.className = "card " + myCard["cardName"].toLowerCase()
        if (myCard["visible"]) {
            cardElement.className += " exposed"
        } else {
            cardElement.onclick = async function () {
                if (confirm("Are you sure you want to expose your " + myCard["cardName"] + "?")) {
                    await openCard(myCard["cardId"])
                }
            }
        }
    }
}

function updateMyCoins(myCoins) {
    let threeCoinsAmount = Math.floor(myCoins / 3)
    let oneCoinAmount = myCoins - 3 * threeCoinsAmount

    document.getElementById("oneCoinAmount").innerText = ''
    document.getElementById("threeCoinsAmount").innerText = ''

    for (let i = 0; i < oneCoinAmount; i++) {
        let imgElem = document.createElement("img")
        imgElem.src = "/static/one_coin.png"
        document.getElementById("oneCoinAmount").appendChild(imgElem)
    }

    for (let i = 0; i < threeCoinsAmount; i++) {
        let imgElem = document.createElement("img")
        imgElem.src = "/static/three_coins.png"
        document.getElementById("threeCoinsAmount").appendChild(imgElem)
    }
}

let playingPlayersElem = undefined

function updatePlayingPlayers(turn, playersJson) {
    if (playingPlayersElem === undefined) {
        playingPlayersElem = document.getElementById("playing_players")
    }
    playingPlayersElem.innerHTML = ''

    for (let playerName in playersJson) {
        let player = playersJson[playerName]
        let playingPlayerDiv = document.createElement("div")
        playingPlayerDiv.className = "playing_player"
        if (playerName === turn) {
            playingPlayerDiv.className += " turn"
        }
        playingPlayerDiv.ondragover = allowDrop
        playingPlayerDiv.ondrop = function (ev) {
            dropToPlayer(playerName, ev)
        }

        let playerNameDiv = document.createElement("div")
        playerNameDiv.className = "player_name"
        playerNameDiv.innerText = playerName
        playingPlayerDiv.appendChild(playerNameDiv)

        let playerCardsDiv = document.createElement("div")
        playerCardsDiv.className = "player_cards"
        for (let cardIndex in player['cards']) {
            let cardName = player['cards'][cardIndex].toLowerCase()
            let playerCardDiv = document.createElement("div")
            playerCardDiv.className = "player_card " + cardName
            playerCardsDiv.appendChild(playerCardDiv)
        }
        playingPlayerDiv.appendChild(playerCardsDiv)

        let playerCoinsDiv = document.createElement("div")
        playerCoinsDiv.className = "player_coins"
        playerCoinsDiv.title = playerName
        let threeCoinsAmount = Math.floor(player['coins'] / 3)
        let oneCoinAmount = player['coins'] - 3 * threeCoinsAmount

        let oneCoinDiv = document.createElement("div")
        for (let i = 0; i < oneCoinAmount; i++) {
            let oneCoinImg = document.createElement("img")
            oneCoinImg.src = "/static/one_coin.png"
            oneCoinDiv.appendChild(oneCoinImg)
        }
        playerCoinsDiv.appendChild(oneCoinDiv)

        let threeCoinsDiv = document.createElement("div")
        for (let i = 0; i < threeCoinsAmount; i++) {
            let threeCoinsImg = document.createElement("img")
            threeCoinsImg.src = "/static/three_coins.png"
            threeCoinsDiv.appendChild(threeCoinsImg)
        }
        playerCoinsDiv.appendChild(threeCoinsDiv)

        playingPlayerDiv.appendChild(playerCoinsDiv)

        playingPlayersElem.appendChild(playingPlayerDiv)
    }
}

function getGameInfo() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let content = JSON.parse(this.response);
            updateAllPlayersNames(content['all_players'])
            updateDeckSize(content['deck_size'])
            updateCardsNamesThatAreBeingPlayed(content['cards_names'])
            updateEndTurnAccess(content['turn'], content['my_name'])
            updateMyCards(content['turn'], content['my_name'], content['my_cards'])
            updateMyCoins(content['my_coins'])
            updatePlayingPlayers(content['turn'], content['players'])
        }
    };
    xhttp.open("GET", "/game_info", true);
    xhttp.send();
}

window.setInterval(getGameInfo, 1000);