function loadDoc() {
  var xhttp = new XMLHttpRequest();
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
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/start_game", true);
  xhttp.send();
}