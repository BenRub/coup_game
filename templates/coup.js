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
  let data = JSON.stringify({"cardNames": ["capitalist", "writer", "sexier"]});
  xhttp.setRequestHeader("content-type", "application/json")
  xhttp.send(data);
}