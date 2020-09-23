from typing import Optional
import random

from backend.card import Card
from backend.coup_exception import CoupException
from backend.player import Player


CARD_INSTANCES = 3
CARDS_FOR_PLAYER = 2


class CoupGame:

    def __init__(self):
        self.started = False
        self.game_over = False
        self.turn = None
        self.card_names = []
        self.players = {}
        self.deck = []
        self.playing_players = []

    def start(self, card_names, player_to_start):
        player = self.get_player_by_name(player_to_start)
        if not player:
            raise CoupException(f"No player with name {player_to_start}")

        self.started = True
        self.game_over = False
        self.turn = player
        self.card_names = card_names
        self.deck = self.create_cards(card_names)
        self.shuffle_deck()

        if len(self.deck) < CARDS_FOR_PLAYER * len(self.players):
            raise CoupException("There are not enough cards for the players")

        self.playing_players = []
        for player in self.players.values():
            self.playing_players.append(player)
            player.reset()

        for _ in range(CARDS_FOR_PLAYER):
            for player in self.playing_players:
                player.add_card(self.deck.pop())

    def player_turn(self):
        if self.turn:
            return self.turn.id
        return None

    def end_turn(self, player: Player):
        if self.game_over:
            return

        if self.turn is not player:
            raise CoupException("It's not your turn!")

        exposed_players_count = 0
        self.switch_turn()
        while self.turn.is_out():
            exposed_players_count += 1
            if exposed_players_count >= len(self.playing_players) - 1:
                self.game_over = True
                break
            self.switch_turn()

    def switch_turn(self):
        player_index = 0
        for player in self.playing_players:
            if player == self.turn:
                break
            player_index += 1

        if player_index + 1 == len(self.playing_players):
            player_index = -1
        self.turn = self.playing_players[player_index + 1]

    def get_info(self, player):
        all_players = {}
        for user in self.players.values():
            all_players[user.name] = ""

        players_info = {}
        for game_player in self.playing_players:
            if player == game_player:
                continue

            cards = []
            for card in game_player.cards.values():
                if card.visible:
                    cards.append(card.name)
                else:
                    cards.append("--HIDDEN--")
            players_info[game_player.name] = {}
            players_info[game_player.name]["cards"] = cards
            players_info[game_player.name]["coins"] = game_player.coins
            players_info[game_player.name]["is_ghost"] = game_player.id not in self.players

        player_cards = {}
        for card in player.cards.values():
            player_cards[card.id] = {
                "cardId": card.id,
                "cardName": card.name,
                "visible": card.visible,
            }

        game_info = {
            "cards_names": self.card_names,
            "deck_size": len(self.deck),
            "my_name": player.name,
            "turn": self.turn.name if self.turn else "",
            "my_cards": player_cards,
            "my_coins": player.coins,
            "players": players_info,
            "all_players": all_players
        }
        return game_info

    @staticmethod
    def create_cards(card_names):
        cards = []
        for card_name in card_names:
            for _ in range(CARD_INSTANCES):
                cards.append(Card(card_name))
        return cards

    def shuffle_deck(self):
        random.shuffle(self.deck)

    def kick_player(self, player_to_kick):
        player = self.get_player_by_name(player_to_kick)
        if player is None:
            raise CoupException(f"No player with name {player_to_kick}")

        self.unregister_player(player)

    def register_player(self, name) -> Player:
        if self.get_player_by_name(name) is not None:
            raise CoupException(f"{name} is already in the game")

        player = Player(name)
        self.players[player.id] = player
        return player

    def unregister_player(self, player: Player):
        self.expose_player(player)
        del self.players[player.id]

    def get_player(self, player_id) -> Optional[Player]:
        if player_id in self.players:
            return self.players[player_id]
        return None

    @staticmethod
    def expose_player(player: Player):
        for _, card in player.cards.items():
            card.visible = True

    def get_player_by_name(self, player_name) -> Optional[Player]:
        for player in self.players.values():
            if player.name.lower() == player_name.lower():
                return player
        return None

    @staticmethod
    def open_card(player: Player, card_id: int):
        card = player.get_card(card_id)
        if not card:
            raise CoupException(f"Player {player.name} does not have card id {card_id}")
        card.visible = True

    def take_card_from_deck(self, player: Player):
        if len(self.deck) <= 0:
            raise CoupException("Deck is empty")

        card = self.deck.pop()
        player.add_card(card)

    def return_card_to_deck(self, player: Player, card_id):
        card = player.pop_card(card_id)
        if not card:
            raise CoupException(f"Player {player.name} does not have card id {card_id}")

        card.visible = False
        self.deck.append(card)
        self.shuffle_deck()

    @staticmethod
    def take_from_bank(player: Player, coins: int):
        if coins < 0:
            raise CoupException(f"Can't take negative amount of coins")

        player.coins += coins

    @staticmethod
    def pay_to_bank(player: Player, coins: int):
        if coins < 0:
            raise CoupException(f"Can't pay negative amount of coins")

        if player.coins < coins:
            raise CoupException(f"Player {player.name} does not have {coins} coins")

        player.coins -= coins

    def transfer(self, player: Player, player_name_dst, coins: int):
        if coins < 0:
            raise CoupException(f"Can't transfer negative amount of coins")

        player_dst = self.get_player_by_name(player_name_dst)
        if not player_dst:
            raise CoupException(f"No player with name {player_name_dst}")

        if player.coins < coins:
            raise CoupException(f"You don't not have {coins} coins")

        player.coins -= coins
        player_dst.coins += coins
