function loadDoc() {
    let xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let content = JSON.parse(this.response);
            let div = '<div class="rootDiv">'

            div += '<div>Cards Names: ' + content['cards_names'] + '</div>'
            div += '<div>Deck Size: ' + content['deck_size'] + '</div>'
            div += '<div></div>'
            div += '<div></div>'

            div += '<div>My Cards: ' + content['my_cards'] + '</div>'
            div += '<div>My Coins: ' + content['my_coins'] + '</div>'
            div += '<div></div>'
            div += '<div></div>'

            div += '<div class="playerDiv">'
            div += '<div class="nameDiv">Name</div>'
            div += '<div class="cardsDiv">Cards</div>'
            div += '<div class="coinsDiv">coins</div>'
            div += '</div>'
            for (let playerName in content['players']) {
                let player = content['players'][playerName]
                div += '<div class="playerDiv">'
                div += '<div class="nameDiv">' + playerName + '</div>'
                div += '<div class="cardsDiv">' + player['cards'] + '</div>'
                div += '<div class="coinsDiv">' + player['coins'] + '</div>'
                div += '</div>'
            }

            div += '</div>'

            document.getElementById("game_info").innerHTML = div;
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
        if (this.readyState == 4) {
            if (this.status == 400)
                alert(this.responseText)
        }
    };
    let cardName = document.getElementById("txtCardToOpen").value
    xhttp.open("POST", "/open_card", true);
    let data = JSON.stringify({"cardName": cardName});
    xhttp.setRequestHeader("content-type", "application/json")
    xhttp.send(data);
}

