async function sendRequest(url, data=undefined) {
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
    }
}

let listOfPlayersElement = undefined

async function startGame() {
    if (listOfPlayersElement === undefined) {
        listOfPlayersElement = document.getElementById("listOfPlayers")
    }

    let playerName = listOfPlayersElement.value
    await sendRequest('/start_game', {"cardNames": getSelectedCards(), "playerToStart": playerName})
}

async function kickPlayer() {
    if (listOfPlayersElement === undefined) {
        listOfPlayersElement = document.getElementById("listOfPlayers")
    }

    let playerName = listOfPlayersElement.value
    await sendRequest('/kick_player', {"playerToKick": playerName})
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

async function takeCardFromDeck() {
    await sendRequest('/take_card_from_deck')
}

async function returnCardToDeck(cardId) {
    await sendRequest('/return_card_to_deck', {"cardId": cardId})
}

async function endTurn() {
    await sendRequest('/end_turn')
}