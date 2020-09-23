let cardsToSelect = {
    "capitalist": true,
    "communist": true,
    "guerrilla": true,
    "protester": true,
    "director": true,

    "banker": false,
    "crimeboss": false,
    "farmer": false,
    "judge": false,
    "mercenary": false,
    "newscaster": false,
    "peacekeeper": false,
    "politician": false,
    "priest": false,
    "producer": false,
    "reporter": false,
    "speculator": false,
    "spy": false,
    "writer": false,
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
        imgElem.src = "/static/cards_descriptions/" + cardName + ".png"
        if (cardsToSelect[cardName]) {
            imgElem.className = "selected"
        }
        imgElem.onclick = function () {
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

function dragCardFromMyself(ev) {
    ev.dataTransfer.setData("cardId", ev.target.title);
}

function dragCardFromDeck(ev) {
    ev.dataTransfer.setData("fromDeck", "yes");
}

function dragTaxFromBase(ev) {
    ev.dataTransfer.setData("taxFromBase", "yes");
}

function dragTaxFromEnemy(ev) {
    ev.dataTransfer.setData("taxFromEnemy", "yes");
}

function dragCoinsFromBank(ev) {
    ev.dataTransfer.setData("fromBank", "yes");
}

function dragCoinsFromMyself(ev) {
    ev.dataTransfer.setData("coinsFromMyself", "yes");
}

function dragTaxFromMyself(ev) {
    ev.dataTransfer.setData("taxFromMyself", "yes");
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
    if (!cardId || cardId === "") {
        return
    }
    await returnCardToDeck(cardId)
}

async function dropToTaxBase(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("taxFromEnemy") !== "yes" && ev.dataTransfer.getData("taxFromMyself") !== "yes") {
        return
    }
    await returnTaxToBase()
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

async function dropToPlayer(enemyPlayer, ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("coinsFromMyself") === "yes") {
        let coins = prompt("How many coins you want to transfer to " + enemyPlayer + "?", "0");
        if (coins != null) {
            await transfer(enemyPlayer, coins)
        }
    } else if (ev.dataTransfer.getData("taxFromBase") === "yes" || ev.dataTransfer.getData("taxFromMyself") === "yes") {
        await tax(enemyPlayer)
    } else if ( ev.dataTransfer.getData("cardId") !== "" ) {
        if (prompt("Are you sure you want to transfer this card?")) {
            await transferCard(enemyPlayer, ev.dataTransfer.getData("cardId"))
        }
    }

}