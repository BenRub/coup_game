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

