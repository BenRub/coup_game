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

function dragCardFromMyself(ev, myCard) {
    ev.dataTransfer.setData("cardId", myCard["cardId"]);
    ev.dataTransfer.setData("cardName", myCard["cardName"]);
    ev.dataTransfer.setData("cardVisible", myCard["visible"] ? "yes" : "");
}

function dragCardFromDeck(ev) {
    ev.dataTransfer.setData("fromDeck", "yes");
}

function dragTokenFromBase(ev, token, index) {
    ev.dataTransfer.setData("tokenFromBase", "yes");
    ev.dataTransfer.setData("tokenName", token);
    ev.dataTransfer.setData("tokenIndex", index + "");
}

function dragTokenFromMyself(ev, token, index) {
    ev.dataTransfer.setData("tokenFromMyself", "yes");
    ev.dataTransfer.setData("tokenName", token);
    ev.dataTransfer.setData("tokenIndex", index + "");
}

function dragTokenFromEnemy(ev, token, index) {
    ev.dataTransfer.setData("tokenFromEnemy", "yes");
    ev.dataTransfer.setData("tokenName", token);
    ev.dataTransfer.setData("tokenIndex", index + "");
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
    if (!cardId || cardId === "") {
        return
    }
    await returnCardToDeck(cardId)
}

async function dropTokenToBase(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("tokenFromEnemy") !== "yes" && ev.dataTransfer.getData("tokenFromMyself") !== "yes") {
        return
    }
    let tokenName = ev.dataTransfer.getData("tokenName")
    let tokenIndex = ev.dataTransfer.getData("tokenIndex")
    await moveTokenToBase(tokenName, tokenIndex)
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
    } else if (ev.dataTransfer.getData("tokenFromBase") === "yes" || ev.dataTransfer.getData("tokenFromMyself") === "yes") {
        let tokenName = ev.dataTransfer.getData("tokenName")
        let tokenIndex = ev.dataTransfer.getData("tokenIndex")
        await moveTokenToPlayer(enemyPlayer, tokenName, tokenIndex)
    } else if (ev.dataTransfer.getData("cardId") !== "") {
        let cardName = ev.dataTransfer.getData("cardName")
        let exposedStr = ev.dataTransfer.getData("cardVisible") === "yes" ? "exposed " : ""
        if (confirm("Are you sure you want to transfer your " + exposedStr + cardName + " card?")) {
            await transferCard(enemyPlayer, ev.dataTransfer.getData("cardId"))
        }
    }
}

function onPageLoad() {
    createMyTokens()
    createBaseTokens()
    window.setInterval(getGameInfo, 1200);
}