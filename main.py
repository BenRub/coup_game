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
    app_timestamp = str(int(time.time()))
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
        if logged_in():
            try:
                player = get_player()
                return render_template('hello.html', name=player.name, appTimestamp=app_timestamp)
            except InvalidUsage:
                pass
        return redirect(url_for('login'))

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            if logged_in():
                return redirect(url_for('index'))

            try:
                player = game.register_player(request.form['username'])
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
        if not logged_in():
            return redirect(url_for('login'))
        player = get_player()
        game.unregister_player(player)
        session.pop('playerId', None)
        return redirect(url_for('login'))

    def logged_in() -> bool:
        if 'playerId' not in session:
            return False

        player = game.get_player(session['playerId'])
        return bool(player)

    def get_player() -> Optional[Player]:
        if 'playerId' not in session:
            raise InvalidUsage("No player id in session", status_code=401)

        player = game.get_player(session['playerId'])
        if not player:
            raise InvalidUsage("Game doesn't have the player id that was sent", status_code=401)

        return player

    @app.route('/game_info')
    def game_info():
        return jsonify(game.get_info(get_player())), 200

    @app.route('/kick_player', methods=['POST'])
    def kick_player():
        content = request.json
        if 'playerToKick' not in content:
            raise InvalidUsage("Player to kick not given", status_code=400)
        game.kick_player(content['playerToKick'])
        return "", 204

    @app.route('/start_game', methods=['POST'])
    def start_game():
        content = request.json
        if 'cardNames' not in content:
            raise InvalidUsage("Cards names not given", status_code=400)
        if not is_list_of_strings(content['cardNames']):
            raise InvalidUsage("Cards names is not list of strings", status_code=400)
        if 'playerToStart' not in content:
            raise InvalidUsage("Player to start not given", status_code=400)
        game.start(content['cardNames'], content['playerToStart'])
        return "", 204

    @app.route('/end_turn', methods=['POST'])
    def end_turn():
        player = get_player()
        game.end_turn(player)
        return "", 200

    @app.route('/open_card', methods=['POST'])
    def open_card():
        content = request.json
        if 'cardId' not in content:
            raise InvalidUsage("Card id not given", status_code=400)
        game.open_card(get_player(), content['cardId'])
        return "", 200

    @app.route('/take_card_from_deck', methods=['POST'])
    def take_card_from_deck():
        game.take_card_from_deck(get_player())
        return "", 200

    @app.route('/return_card_to_deck', methods=['POST'])
    def return_card_to_deck():
        content = request.json
        if 'cardId' not in content:
            raise InvalidUsage("Card id not given", status_code=400)
        game.return_card_to_deck(get_player(), content['cardId'])
        return "", 200

    @app.route('/take_from_bank', methods=['POST'])
    def take_from_bank():
        content = request.json
        if 'coins' not in content:
            raise InvalidUsage("Coins not given", status_code=400)
        game.take_from_bank(get_player(), int(content['coins']))
        return "", 200

    @app.route('/pay_to_bank', methods=['POST'])
    def pay_to_bank():
        content = request.json
        if 'coins' not in content:
            raise InvalidUsage("Coins not given", status_code=400)
        game.pay_to_bank(get_player(), int(content['coins']))
        return "", 200

    @app.route('/transfer', methods=['POST'])
    def transfer():
        content = request.json
        if 'player_name_dst' not in content:
            raise InvalidUsage("Player source not given", status_code=400)
        if 'coins' not in content:
            raise InvalidUsage("Coins not given", status_code=400)
        game.transfer(get_player(), content['player_name_dst'], int(content['coins']))
        return "", 200

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=8000)
