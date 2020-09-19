function loadDoc() {
    let xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let content = JSON.parse(this.response);

            let gameInfo = ''
            gameInfo += '<div>Cards Names: ' + content['cards_names'] + '</div>'
            gameInfo += '<div>Deck Size: ' + content['deck_size'] + '</div>'
            gameInfo += '<div class="emptyLine"></div>'

            document.getElementById("game_info").innerHTML = gameInfo;

            let myInfo = ''
            myInfo += '<div>My Cards: ' + content['my_cards'] + '</div>'
            myInfo += '<div>My Coins: ' + content['my_coins'] + '</div>'
            myInfo += '<div class="emptyLine"></div>'

            document.getElementById("my_info").innerHTML = myInfo;

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

function startGame() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/start_game", true);
    let data = JSON.stringify({"cardNames": ["capitalist", "writer", "communist", "Protestor", "Gurrialla"]});
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(data);
}

function openCard() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status !== 200)
                alert(this.responseText)
        }
    };
    let cardName = document.getElementById("txtCardToOpen").value
    xhttp.open("POST", "/open_card", true);
    let data = JSON.stringify({"cardName": cardName});
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

