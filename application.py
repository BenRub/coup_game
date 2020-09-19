from typing import Optional

from flask import Flask
from flask import render_template
from flask import session
from flask import request

from backend.coup_exception import CoupException
from backend.coup_game import CoupGame
from backend.player import Player
from invalid_usage import InvalidUsage
from flask import jsonify

from utils import is_list_of_strings

app = Flask(__name__)
game = CoupGame()


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error: InvalidUsage):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.errorhandler(CoupException)
def handle_invalid_usage(error: CoupException):
    response = jsonify(error.to_dict())
    response.status_code = 400
    return response


@app.route('/start_game', methods=['POST'])
def startGame():
    content = request.json
    if 'cardNames' not in content:
        raise InvalidUsage("Cards names not given", status_code=400)
    if not is_list_of_strings(content['cardNames']):
        raise InvalidUsage("Cards names is not list of strings", status_code=400)
    game.Start(content['cardNames'])


@app.route('/login')
def login():
    return 'Please Login'


@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name=None):
    return render_template('hello.html', name=name)


def getPlayer() -> Optional[Player]:
    if 'playerId' not in session:
        raise InvalidUsage("No player id in session", status_code=401)

    player = game.GetPlayer(session['playerId'])
    if not player:
        raise InvalidUsage("Game doesn't have the player id that was sent", status_code=401)

    return player


@app.route('/open_card/<name>')
def openCard(name=None):
    game.OpenCard(getPlayer(), name)


@app.route('/open_card/<cardName>')
def openCard(cardName=None):
    game.OpenCard(getPlayer(), cardName)


@app.route('/take_card_from_deck')
def takeCardFromDeck():
    game.TakeCardFromDeck(getPlayer())


@app.route('/return_card_to_deck/<cardName>')
def returnCardToDeck(cardName=None):
    game.ReturnCardToDeck(getPlayer(), cardName)


@app.route('/take_from_bank/<coins>')
def takeFromBank(coins: int = None):
    game.TakeFromBank(getPlayer(), coins)


@app.route('/pay_to_bank/<coins>')
def payToBank(coins: int = None):
    game.PayToBank(getPlayer(), coins)


@app.route('/transfer/<playerNameSrc>/<playerNameDst>/<coins>')
def transfer(playerNameSrc, playerNameDst, coins: int = None):
    game.Transfer(playerNameSrc, playerNameDst, coins)


@app.route('/game_info')
def transfer():
    game.GetInfo(getPlayer())
