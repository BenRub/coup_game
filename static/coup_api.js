async function sendRequest(url, data=undefined, changeButton=true) {
    let bodyToSent = data ? JSON.stringify(data) : null
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyToSent,
    })
    if (!response.ok) {
        let message = await response.text()
        alert(message)
    } else if (changeButton && getEndTurnButtonElement().disabled !== "disabled") {
        getEndTurnButtonElement().className = "pressMe"
    }
}

async function startGame() {
    getEndTurnButtonElement().className = ""
    let playerName = getListOfPlayersElement().value
    await sendRequest('/start_game', {"cardNames": getSelectedCards(), "playerToStart": playerName}, false)
}

async function kickPlayer() {
    let playerName = getListOfPlayersElement().value
    await sendRequest('/kick_player', {"playerToKick": playerName}, false)
}

async function openCard(cardId) {
    await sendRequest('/open_card', {"cardId": cardId})
}

async function takeOneFromBank() {
    await takeFromBank(1)
}

async function takeFromBank(coins) {
    await sendRequest('/take_from_bank', {"coins": coins})
}

async function payToBank(coins) {
    await sendRequest('/pay_to_bank', {"coins": coins})
}

async function transfer(player_name_dst, coins) {
    await sendRequest('/transfer', {"player_name_dst": player_name_dst, "coins": coins})
}

async function tax(player_name_dst) {
    await sendRequest('/tax', {"player_name_dst": player_name_dst})
}

async function returnTaxToBase() {
    await sendRequest('/return_tax_to_base')
}

async function takeCardFromDeck() {
    await sendRequest('/take_card_from_deck')
}

async function returnCardToDeck(cardId) {
    await sendRequest('/return_card_to_deck', {"cardId": cardId})
}

async function endTurn() {
    await sendRequest('/end_turn', undefined, false)
    getEndTurnButtonElement().className = ""
}