function updateAllPlayersNames(allPlayersJson) {
    for (let playerNameIndex in all_players_names) {
        let playerName = all_players_names[playerNameIndex]
        let found = false
        for (let parsedPlayerNameIndex in allPlayersJson) {
            let parsedPlayerName = allPlayersJson[parsedPlayerNameIndex]
            if (parsedPlayerName === playerName) {
                found = true
                break
            }
        }

        if (!found) {
            document.getElementById("player_option_" + playerName).remove()
        }
    }

    let cbListOfPlayers = document.getElementById("listOfPlayers")
    for (let parsedPlayerNameIndex in allPlayersJson) {
        let parsedPlayerName = allPlayersJson[parsedPlayerNameIndex]
        let found = false
        for (let playerNameIndex in all_players_names) {
            let playerName = all_players_names[playerNameIndex]
            if (parsedPlayerName === playerName) {
                found = true
                break
            }
        }

        if (!found) {
            let option = document.createElement("option");
            option.innerText = parsedPlayerName
            option.id = "player_option_" + parsedPlayerName
            cbListOfPlayers.appendChild(option)
        }
    }

    all_players_names = allPlayersJson
}

function updateDeckData(content) {
    document.getElementById("deckSize").innerText = content['deck_size'] + " cards"

    let gameInfo = ''
    gameInfo += '<div>Cards Names: ' + content['cards_names'] + '</div>'
    gameInfo += '<div>Turn: ' + content['turn'] + '</div>'
    gameInfo += '<div class="emptyLine"></div>'

    document.getElementById("game_info").innerHTML = gameInfo;
}

let myCardsElements = {

}

function updateMyCards(myCardsJson) {
    let myCardsElem = document.getElementById("my_cards")

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

function getGameInfo() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let content = JSON.parse(this.response);

            updateAllPlayersNames(content['all_players'])
            updateDeckData(content)
            updateMyCards(content['my_cards'])


            let threeCoinsAmount = Math.floor(content['my_coins'] / 3)
            let oneCoinAmount = content['my_coins'] - 3 * threeCoinsAmount

            document.getElementById("oneCoinAmount").innerText = oneCoinAmount + ""
            document.getElementById("threeCoinsAmount").innerText = threeCoinsAmount + ""

            let playersInfo = '<table border="1">'
            playersInfo += '<tr>'
            playersInfo += '<td class="nameDiv">Name</td>'
            playersInfo += '<td class="cardsDiv">Cards</td>'
            playersInfo += '<td class="coinsDiv">coins</td>'
            playersInfo += '</tr>'
            for (let playerName in content['players']) {
                let player = content['players'][playerName]
                playersInfo += '<tr>'
                playersInfo += '<td class="nameDiv">' + playerName + '</td>'
                playersInfo += '<td class="cardsDiv">' + player['cards'] + '</td>'
                playersInfo += '<td class="coinsDiv">' + player['coins'] + '</td>'
                playersInfo += '</tr>'
            }
            playersInfo += '</table>'

            document.getElementById("players_info").innerHTML = playersInfo;
        }
    };
    xhttp.open("GET", "/game_info", true);
    xhttp.send();
}

window.setInterval(getGameInfo, 1000);