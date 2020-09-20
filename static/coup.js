let all_players_names = []

function allowDrop(ev) {
    ev.preventDefault();
}

function dragCardToDeck(ev) {
    ev.dataTransfer.setData("cardId", ev.target.title);
}

function dragCardFromDeck(ev) {
    ev.dataTransfer.setData("fromDeck", "yes");
}

function dropToCard(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("fromDeck") !== "yes") {
        return
    }
    takeCardFromDeck()
}

function dropToDeck(ev) {
    ev.preventDefault();
    let cardId = ev.dataTransfer.getData("cardId");
    returnCardToDeck(cardId)
}

function getGameInfo() {
    let xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let content = JSON.parse(this.response);

            for (let playerNameIndex in all_players_names) {
                let playerName = all_players_names[playerNameIndex]
                let found = false
                for (let parsedPlayerNameIndex in content['all_players']) {
                    let parsedPlayerName = content['all_players'][parsedPlayerNameIndex]
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
            for (let parsedPlayerNameIndex in content['all_players']) {
                let parsedPlayerName = content['all_players'][parsedPlayerNameIndex]
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

            all_players_names = content['all_players']


            document.getElementById("deckSize").innerText = content['deck_size'] + " cards"

            let gameInfo = ''
            gameInfo += '<div>Cards Names: ' + content['cards_names'] + '</div>'
            gameInfo += '<div>Turn: ' + content['turn'] + '</div>'
            gameInfo += '<div class="emptyLine"></div>'

            document.getElementById("game_info").innerHTML = gameInfo;

            let myCardsElem = document.getElementById("my_cards")
            myCardsElem.innerHTML = ''
            for (let cardIndex in content['my_cards']) {
                let myCard = content['my_cards'][cardIndex]
                let cardElement = document.createElement("div")
                cardElement.title = myCard["cardId"]
                cardElement.className = "card " + myCard["cardName"].toLowerCase()
                cardElement.draggable = true
                cardElement.ondragstart = dragCardToDeck
                cardElement.ondragover = allowDrop
                cardElement.ondrop = dropToCard
                if (myCard["visible"]) {
                    cardElement.className += " exposed"
                } else {
                    cardElement.onclick = function () {
                        if (confirm("Are you sure you want to expose your " + myCard["cardName"] + "?")) {
                            openCard(myCard["cardId"])
                        }
                    }
                }
                myCardsElem.appendChild(cardElement)
            }

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

function getSelectValues(select) {
    let result = [];
    let options = select && select.options;
    let opt;

    for (let i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}

function startGame() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 204)
                alert(this.responseText)
        }
    };
    let playerName = document.getElementById("listOfPlayers").value
    let cardNames = getSelectValues(document.getElementById("cardNames"))
    xhttp.open("POST", "/start_game", true);
    let data = JSON.stringify({"cardNames": cardNames, "playerToStart": playerName});
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(data);
}

function openCard(cardId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200)
                alert(this.responseText)
        }
    };
    xhttp.open("POST", "/open_card", true);
    let data = JSON.stringify({"cardId": cardId});
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(data);
}

function takeFromBank() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200)
                alert(this.responseText)
        }
    };
    let coins = document.getElementById("txtTakeFromBank").value
    xhttp.open("POST", "/take_from_bank", true);
    let data = JSON.stringify({"coins": coins});
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(data);
}

function payToBank() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200)
                alert(this.responseText)
        }
    };
    let coins = document.getElementById("txtPayToBank").value
    xhttp.open("POST", "/pay_to_bank", true);
    let data = JSON.stringify({"coins": coins});
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(data);
}

function transfer() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200)
                alert(this.responseText)
        }
    };
    let player_name_src = document.getElementById("txtTransferSource").value;
    let player_name_dst = document.getElementById("txtTransferDst").value;
    let coins = document.getElementById("txtTransferCoins").value;
    xhttp.open("POST", "/transfer", true);
    let data = JSON.stringify({"player_name_src": player_name_src, "player_name_dst": player_name_dst, "coins": coins});
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(data);
}

function takeCardFromDeck() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200)
                alert(this.responseText)
        }
    };
    xhttp.open("POST", "/take_card_from_deck", true);
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send();
}

function returnCardToDeck(cardId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200)
                alert(this.responseText)
        }
    };
    xhttp.open("POST", "/return_card_to_deck", true);
    let data = JSON.stringify({"cardId": cardId});
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(data);
}

function endTurn() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200)
                alert(this.responseText)
        }
    };
    xhttp.open("POST", "/end_turn", true);
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send();
}

