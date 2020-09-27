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
    } else if (changeButton && !getEndTurnButtonElement().disabled) {
        console.log(getEndTurnButtonElement())
        console.log(getEndTurnButtonElement().disabled)
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

async function transferCard(player_name_dst, card_id) {
    await sendRequest('/transfer_card', {"player_name_dst": player_name_dst, "card_id": card_id}, false)
}

async function moveTokenToPlayer(player_name_dst, tokenName, tokenIndex) {
    await sendRequest('/move_token', {"player_name_dst": player_name_dst, "token_name": tokenName, "token_index": parseInt(tokenIndex)}, false)
}

async function moveTokenToBase(tokenName, tokenIndex) {
    await sendRequest('/move_token', {"token_name": tokenName, "token_index": parseInt(tokenIndex)}, false)
}

async function takeCardFromDeck() {
    await sendRequest('/take_card_from_deck', undefined, false)
}

async function returnCardToDeck(cardId) {
    await sendRequest('/return_card_to_deck', {"cardId": cardId})
}

async function endTurn() {
    await sendRequest('/end_turn', undefined, false)
    getEndTurnButtonElement().className = ""
}