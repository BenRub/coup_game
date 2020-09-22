let cardsToSelect = {
    "capitalist": true,
    "communist": true,
    "guerrilla": true,
    "protester": true,
    "director": true
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
    let items = 0
    let trElem = undefined
    for (let cardName in cardsToSelect) {
        if (items % 3 === 0) {
            if (trElem) {
                getCardsTableElement().appendChild(trElem)
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
    getCardsTableElement().appendChild(trElem)
}

function openCardsPopup() {
  getAllCardsElement().className = "allCardsOpen";
  if (!cardsCreated) {
      createAllCards()
      cardsCreated = true
  }
}

function closeCardsPopup() {
    getAllCardsElement().className = "allCardsClosed"
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

async function dropToCard(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("fromDeck") !== "yes") {
        return
    }
    await takeCardFromDeck()
}

async function dropToCoins(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("fromBank") !== "yes") {
        return
    }

    let coins = prompt("How many coins you want to take from the bank?", "0");
    if (coins != null) {
        await takeFromBank(coins)
    }
}

async function dropToDeck(ev) {
    ev.preventDefault();
    let cardId = ev.dataTransfer.getData("cardId");
    await returnCardToDeck(cardId)
}

async function dropToBank(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("coinsFromMyself") !== "yes") {
        return
    }

    let coins = prompt("How many coins you want to pay the bank?", "0");
    if (coins != null) {
        await payToBank(coins)
    }
}

async function dropToPlayer(playerToPay, ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("coinsFromMyself") !== "yes") {
        return
    }

    let coins = prompt("How many coins you want to transfer to " + playerToPay + "?", "0");
    if (coins != null) {
        await transfer(playerToPay, coins)
    }
}