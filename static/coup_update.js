let myPlayersOptions = {}
function updateAllPlayersNames(allPlayersJson) {
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
        getCbListOfPlayers().appendChild(option)
    }
}

function updateDeckSize(deck_size) {
    getDeckSizeElement().innerText = deck_size + " cards"
}

function updateCardsNamesThatAreBeingPlayed(cards_names) {
    getCardsNamesThatAreBeingPlayedElement().innerText = cards_names
}

function updateEndTurnAccess(turn, myName) {
    if (turn === myName) {
        getEndTurnButtonElement().disabled = ""
    } else {
        getEndTurnButtonElement().className = ""
        getEndTurnButtonElement().disabled = "disabled"
    }
}

function updateMyCards(turn, myName, myCardsJson) {
    if (turn === myName) {
        getMyCardsElem().className = "my_cards myTurn"
    } else {
        getMyCardsElem().className = "my_cards"
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
            getMyCardsElem().appendChild(cardElement)
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

    getOneCoinAmountElement().innerText = ''
    getThreeCoinsAmountElement().innerText = ''

    for (let i = 0; i < oneCoinAmount; i++) {
        let imgElem = document.createElement("img")
        imgElem.src = "/static/one_coin.png"
        getOneCoinAmountElement().appendChild(imgElem)
    }

    for (let i = 0; i < threeCoinsAmount; i++) {
        let imgElem = document.createElement("img")
        imgElem.src = "/static/three_coins.png"
        getThreeCoinsAmountElement().appendChild(imgElem)
    }
}

function updatePlayingPlayers(turn, playersJson) {
    getPlayingPlayersElem().innerHTML = ''

    for (let playerName in playersJson) {
        let player = playersJson[playerName]
        let playingPlayerDiv = document.createElement("div")
        playingPlayerDiv.className = "playing_player"
        if (playerName === turn) {
            playingPlayerDiv.className += " turn"
        }
        playingPlayerDiv.ondragover = allowDrop
        playingPlayerDiv.ondrop = async function (ev) {
            await dropToPlayer(playerName, ev)
        }

        let playerNameDiv = document.createElement("div")
        playerNameDiv.className = "player_name"
        let nameSpanElem = document.createElement("span")
        nameSpanElem.innerText = playerName
        playerNameDiv.appendChild(nameSpanElem)
        if (player['is_ghost']) {
            let ghostImg = document.createElement("img")
            ghostImg.src = "/static/ghost-icon.png"
            playerNameDiv.appendChild(ghostImg)
        }
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

        getPlayingPlayersElem().appendChild(playingPlayerDiv)
    }
}

async function getGameInfo() {
    const response = await fetch("/game_info", {method: 'GET'})
    if (!response.ok) {
        if (response.status === 401) {
            window.location = "/"
        }
    }
    let content = await response.json()
    updateAllPlayersNames(content['all_players'])
    updateDeckSize(content['deck_size'])
    updateCardsNamesThatAreBeingPlayed(content['cards_names'])
    updateEndTurnAccess(content['turn'], content['my_name'])
    updateMyCards(content['turn'], content['my_name'], content['my_cards'])
    updateMyCoins(content['my_coins'])
    updatePlayingPlayers(content['turn'], content['players'])
}

window.setInterval(getGameInfo, 1000);