let all_players_names = []

let cardsToSelect = {
    "capitalist": false,
    "communist": true,
    "guerrilla": false,
    "protester": true,
    "writer": false
}

let cardsCreated = false

function getSelectedCards() {
    let selectedCards = []
    for (let cardName in cardsToSelect) {
        if (cardsToSelect[cardName]) {
            selectedCards.push(cardName)
        }
    }
    return selectedCards
}

function createAllCards() {
    let tableElement = document.getElementById("cardsTable")
    let items = 0
    let trElem = undefined
    for (let cardName in cardsToSelect) {
        if (items % 3 === 0) {
            if (trElem) {
                tableElement.appendChild(trElem)
            }
            trElem = document.createElement("tr")
        }
        let tdElem = document.createElement("td")
        let imgElem = document.createElement("img")
        imgElem.title = cardName
        imgElem.src = "/static/cards_descriptions/" + cardName + ".jpeg"
        if (cardsToSelect[cardName]) {
            imgElem.className = "selected"
        }
        imgElem.onclick = function() {
            if (cardsToSelect[cardName]) {
                cardsToSelect[cardName] = false
                imgElem.className = ""
            } else {
                cardsToSelect[cardName] = true
                imgElem.className = "selected"
            }
        }
        tdElem.appendChild(imgElem)
        trElem.appendChild(tdElem)
        items++
    }
    tableElement.appendChild(trElem)
}

function openCardsPopup() {
  document.getElementById("allCards").className = "allCardsOpen";
  if (!cardsCreated) {
      createAllCards()
      cardsCreated = true
  }
}

function closeCardsPopup() {
    document.getElementById("allCards").className = "allCardsClosed"
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragCardToDeck(ev) {
    ev.dataTransfer.setData("cardId", ev.target.title);
}

function dragCardFromDeck(ev) {
    ev.dataTransfer.setData("fromDeck", "yes");
}

function dragCoinsFromBank(ev) {
    ev.dataTransfer.setData("fromBank", "yes");
}

function dragCoinsFromMyself(ev) {
    ev.dataTransfer.setData("coinsFromMyself", "yes");
}

function dropToCard(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("fromDeck") !== "yes") {
        return
    }
    takeCardFromDeck()
}

function dropToCoins(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("fromBank") !== "yes") {
        return
    }

    let coins = prompt("How many coins you want to take from the bank?", "0");
    if (coins != null) {
        takeFromBank(coins)
    }
}

function dropToDeck(ev) {
    ev.preventDefault();
    let cardId = ev.dataTransfer.getData("cardId");
    returnCardToDeck(cardId)
}

function dropToBank(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("coinsFromMyself") !== "yes") {
        return
    }

    let coins = prompt("How many coins you want to pay the bank?", "0");
    if (coins != null) {
        payToBank(coins)
    }
}

function dropToPlayer(playerToPay, ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("coinsFromMyself") !== "yes") {
        return
    }

    let coins = prompt("How many coins you want to transfer to " + playerToPay + "?", "0");
    if (coins != null) {
        transfer(playerToPay, coins)
    }
}