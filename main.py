from typing import Optional

from flask import Flask, url_for
from flask import render_template
from flask import session
from flask import request
from flask import redirect

from backend.coup_exception import CoupException
from backend.coup_game import CoupGame
from backend.player import Player
from invalid_usage import InvalidUsage
from flask import jsonify

from utils import is_list_of_strings


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
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

    @app.route('/static/coup.js', methods=['GET'])
    def coupJs():
        return render_template('coup.js')

    @app.route('/')
    def index():
        if loggedIn():
            try:
                player = getPlayer()
                return render_template('hello.html', name=player.name)
            except InvalidUsage:
                pass
        return redirect(url_for('login'))

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            if loggedIn():
                return redirect(url_for('index'))

            try:
                player = game.RegisterPlayer(request.form['username'])
                session['playerId'] = player.id
                return redirect(url_for('index'))
            except CoupException as e:
                return e.message, 401

        return '''
            <form method="post">
                <p><input type=text name=username>
                <p><input type=submit value=Login>
            </form>
        '''

    @app.route('/logout')
    def logout():
        if not loggedIn():
            return redirect(url_for('login'))
        player = getPlayer()
        game.ExposePlayer(player)
        session.pop('playerId', None)
        return redirect(url_for('login'))

    def loggedIn() -> bool:
        if 'playerId' not in session:
            return False

        player = game.GetPlayer(session['playerId'])
        return bool(player)

    def getPlayer() -> Optional[Player]:
        if 'playerId' not in session:
            raise InvalidUsage("No player id in session", status_code=401)

        player = game.GetPlayer(session['playerId'])
        if not player:
            raise InvalidUsage("Game doesn't have the player id that was sent", status_code=401)

        return player

    @app.route('/start_game', methods=['POST'])
    def startGame():
        content = request.json
        if 'cardNames' not in content:
            raise InvalidUsage("Cards names not given", status_code=400)
        if not is_list_of_strings(content['cardNames']):
            raise InvalidUsage("Cards names is not list of strings", status_code=400)
        game.Start(content['cardNames'])
        return "", 204

    @app.route('/open_card/<name>')
    def openCard(name=None):
        game.OpenCard(getPlayer(), name)

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
    def gameInfo():
        return jsonify(game.GetInfo(getPlayer())), 200

    return app
