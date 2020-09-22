import time
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


def create_app():
    # create and configure the app
    appTimestamp = str(int(time.time()))
    app = Flask(__name__, instance_relative_config=True)
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
    game = CoupGame()

    @app.errorhandler(InvalidUsage)
    def handle_invalid_usage(error: InvalidUsage):
        return error.message, error.status_code

    @app.errorhandler(CoupException)
    def handle_invalid_usage(error: CoupException):
        return error.message, 400

    @app.route('/')
    def index():
        if loggedIn():
            try:
                player = getPlayer()
                return render_template('hello.html', name=player.name, appTimestamp=appTimestamp)
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
        game.UnregisterPlayer(player)
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

    @app.route('/game_info')
    def gameInfo():
        return jsonify(game.GetInfo(getPlayer())), 200

    @app.route('/kick_player', methods=['POST'])
    def kickPlayer():
        content = request.json
        if 'playerToKick' not in content:
            raise InvalidUsage("Player to kick not given", status_code=400)
        game.KickPlayer(content['playerToKick'])
        return "", 204

    @app.route('/start_game', methods=['POST'])
    def startGame():
        content = request.json
        if 'cardNames' not in content:
            raise InvalidUsage("Cards names not given", status_code=400)
        if not is_list_of_strings(content['cardNames']):
            raise InvalidUsage("Cards names is not list of strings", status_code=400)
        if 'playerToStart' not in content:
            raise InvalidUsage("Player to start not given", status_code=400)
        game.Start(content['cardNames'], content['playerToStart'])
        return "", 204

    @app.route('/end_turn', methods=['POST'])
    def endTurn():
        player = getPlayer()
        game.EndTurn(player)
        return "", 200

    @app.route('/open_card', methods=['POST'])
    def openCard():
        content = request.json
        if 'cardId' not in content:
            raise InvalidUsage("Card id not given", status_code=400)
        game.OpenCard(getPlayer(), content['cardId'])
        return "", 200

    @app.route('/take_card_from_deck', methods=['POST'])
    def takeCardFromDeck():
        game.TakeCardFromDeck(getPlayer())
        return "", 200

    @app.route('/return_card_to_deck', methods=['POST'])
    def returnCardToDeck():
        content = request.json
        if 'cardId' not in content:
            raise InvalidUsage("Card id not given", status_code=400)
        game.ReturnCardToDeck(getPlayer(), content['cardId'])
        return "", 200

    @app.route('/take_from_bank', methods=['POST'])
    def takeFromBank():
        content = request.json
        if 'coins' not in content:
            raise InvalidUsage("Coins not given", status_code=400)
        game.TakeFromBank(getPlayer(), int(content['coins']))
        return "", 200

    @app.route('/pay_to_bank', methods=['POST'])
    def payToBank():
        content = request.json
        if 'coins' not in content:
            raise InvalidUsage("Coins not given", status_code=400)
        game.PayToBank(getPlayer(), int(content['coins']))
        return "", 200

    @app.route('/transfer', methods=['POST'])
    def transfer():
        content = request.json
        if 'player_name_dst' not in content:
            raise InvalidUsage("Player source not given", status_code=400)
        if 'coins' not in content:
            raise InvalidUsage("Coins not given", status_code=400)
        game.Transfer(getPlayer(), content['player_name_dst'], int(content['coins']))
        return "", 200

    @app.route('/tax', methods=['POST'])
    def tax():
        content = request.json
        if 'player_name_dst' not in content:
            raise InvalidUsage("Player source not given", status_code=400)
        game.Tax(content['player_name_dst'])
        return "", 200

    @app.route('/return_tax_to_base', methods=['POST'])
    def returnTaxToBase():
        game.ReturnTaxToBase()
        return "", 200

    return app
