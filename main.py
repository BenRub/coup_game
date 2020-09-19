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
from flask import Response


def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
    game = CoupGame()

    @app.errorhandler(InvalidUsage)
    def handle_invalid_usage(error: InvalidUsage):
        return error.message, error.status_code

    @app.errorhandler(CoupException)
    def handle_invalid_usage(error: CoupException):
        return error.message, 400

    @app.route('/static/coup.js', methods=['GET'])
    def coupJs():
        return render_template('coup.js')

    @app.route('/static/styles.css', methods=['GET'])
    def stylesCss():
        css = render_template('styles.css')
        return Response(css, mimetype='text/css')

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

    @app.route('/game_info')
    def gameInfo():
        return jsonify(game.GetInfo(getPlayer())), 200

    @app.route('/start_game', methods=['POST'])
    def startGame():
        content = request.json
        if 'cardNames' not in content:
            raise InvalidUsage("Cards names not given", status_code=400)
        if not is_list_of_strings(content['cardNames']):
            raise InvalidUsage("Cards names is not list of strings", status_code=400)
        game.Start(content['cardNames'])
        return "", 204

    @app.route('/open_card', methods=['POST'])
    def openCard():
        content = request.json
        if 'cardName' not in content:
            raise InvalidUsage("Card name not given", status_code=400)
        game.OpenCard(getPlayer(), content['cardName'])
        return "", 200

    @app.route('/take_card_from_deck')
    def takeCardFromDeck():
        card = game.TakeCardFromDeck(getPlayer())
        return "", 200

    @app.route('/return_card_to_deck/<cardName>')
    def returnCardToDeck(cardName=None):
        game.ReturnCardToDeck(getPlayer(), cardName)
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

    @app.route('/transfer')
    def transfer():
        content = request.json
        if 'player_name_src' not in content:
            raise InvalidUsage("Player source not given", status_code=400)
        if 'player_name_dst' not in content:
            raise InvalidUsage("Player source not given", status_code=400)
        if 'coins' not in content:
            raise InvalidUsage("Coins not given", status_code=400)
        game.Transfer(content['player_name_src'], content['player_name_dst'], int(content['coins']))
        return "", 200

    return app
