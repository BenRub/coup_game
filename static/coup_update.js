let cbListOfPlayers = undefined
let myPlayersOptions = {}

function updateAllPlayersNames(allPlayersJson) {
    if (cbListOfPlayers === undefined) {
        cbListOfPlayers = document.getElementById("listOfPlayers")
    }

    for (let playerNameLocal in myPlayersOptions) {
        if (!(playerNameLocal in allPlayersJson)) {
            console.log("why1")
            myPlayersOptions[playerNameLocal].remove()
            delete myPlayersOptions[playerNameLocal]
        }
    }

    for (let parsedPlayerName in allPlayersJson) {
        if (parsedPlayerName in myPlayersOptions) {
            continue
        }
        console.log("why2")
        let option = document.createElement("option");
        option.innerText = parsedPlayerName
        myPlayersOptions[parsedPlayerName] = option
        cbListOfPlayers.appendChild(option)
    }
}

function updateDeckData(content) {
    document.getElementById("deckSize").innerText = content['deck_size'] + " cards"

    let gameInfo = ''
    gameInfo += '<div>Cards Names: ' + content['cards_names'] + '</div>'
    gameInfo += '<div>Turn: ' + content['turn'] + '</div>'
    gameInfo += '<div class="emptyLine"></div>'

    document.getElementById("game_info").innerHTML = gameInfo;
}

let myCardsElem = undefined
let myCardsElements = {}

function updateMyCards(myCardsJson) {
    if (myCardsElem === undefined) {
        myCardsElem = document.getElementById("my_cards")
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
            cardElement.onclick = function () {
                if (confirm("Are you sure you want to expose your " + myCard["cardName"] + "?")) {
                    openCard(myCard["cardId"])
                }
            }
        }
    }
}

function updateMyCoins(myCoins) {
    let threeCoinsAmount = Math.floor(myCoins / 3)
    let oneCoinAmount = myCoins - 3 * threeCoinsAmount

    document.getElementById("oneCoinAmount").innerText = oneCoinAmount + ""
    document.getElementById("threeCoinsAmount").innerText = threeCoinsAmount + ""
}

let playingPlayersElem = undefined

function updatePlayingPlayers(playersJson) {
    if (playingPlayersElem === undefined) {
        playingPlayersElem = document.getElementById("playing_players")
    }
    playingPlayersElem.innerHTML = ''

    for (let playerName in playersJson) {
        let player = playersJson[playerName]
        let playingPlayerDiv = document.createElement("div")
        playingPlayerDiv.className = "playing_player"

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
        let threeCoinsAmount = Math.floor(player['coins'] / 3)
        let oneCoinAmount = player['coins'] - 3 * threeCoinsAmount

        let oneCoinDiv = document.createElement("div")
        let oneCoinSpan = document.createElement("span")
        oneCoinSpan.innerText = oneCoinAmount + " X "
        oneCoinDiv.appendChild(oneCoinSpan)
        let oneCoinImg = document.createElement("img")
        oneCoinImg.src = "/static/one_coin.png"
        oneCoinDiv.appendChild(oneCoinImg)
        playerCoinsDiv.appendChild(oneCoinDiv)

        let threeCoinsDiv = document.createElement("div")
        let threeCoinsSpan = document.createElement("span")
        threeCoinsSpan.innerText = threeCoinsAmount + " X "
        threeCoinsDiv.appendChild(threeCoinsSpan)
        let threeCoinsImg = document.createElement("img")
        threeCoinsImg.src = "/static/three_coins.png"
        threeCoinsDiv.appendChild(threeCoinsImg)
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
            updateDeckData(content)
            updateMyCards(content['my_cards'])
            updateMyCoins(content['my_coins'])
            updatePlayingPlayers(content['players'])
        }
    };
    xhttp.open("GET", "/game_info", true);
    xhttp.send();
}

window.setInterval(getGameInfo, 1000);