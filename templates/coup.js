function loadDoc() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("game_info").innerHTML =
      this.responseText;
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
  xhttp.onreadystatechange = function() {
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