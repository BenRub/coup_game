from typing import Optional
from backend.card import Card
from backend.coup_exception import CoupException
from backend.player import Player
import random

CardInstances = 3
CardsForPlayer = 2


class CoupGame:

    def __init__(self):
        self.started = False
        self.gameOver = False
        self.turn = None
        self.tax = None
        self.cardsNames = []
        self.players = {}
        self.deck = []
        self.playingPlayers = []

    def Start(self, cardNames, playerToStart):
        player = self.getPlayerByName(playerToStart)
        if not player:
            raise CoupException(f"No player with name {playerToStart}")

        self.started = True
        self.gameOver = False
        self.turn = player
        self.tax = None
        self.cardsNames = cardNames
        self.deck = self.createCards(cardNames)
        self.shuffleDeck()

        if len(self.deck) < CardsForPlayer * len(self.players):
            raise CoupException("There are not enough cards for the players")

        self.playingPlayers = []
        for _, player in self.players.items():
            self.playingPlayers.append(player)
            player.Reset()

        for _ in range(CardsForPlayer):
            for _, player in self.players.items():
                player.AddCard(self.deck.pop())

    def PlayerTurn(self):
        if self.turn:
            return self.turn.GetId()
        return None

    def EndTurn(self, player: Player):
        if self.gameOver:
            return

        if self.turn is not player:
            raise CoupException("It's not your turn!")

        exposedPlayersCount = 0
        self.switchTurn()
        while self.turn.AllCardsAreExposed():
            exposedPlayersCount += 1
            if exposedPlayersCount >= len(self.playingPlayers) - 1:
                self.gameOver = True
                break
            self.switchTurn()

    def switchTurn(self):
        playerIndex = 0
        for player in self.playingPlayers:
            if player == self.turn:
                break
            playerIndex += 1

        if playerIndex + 1 == len(self.playingPlayers):
            playerIndex = -1
        self.turn = self.playingPlayers[playerIndex + 1]

    def GetInfo(self, player):
        allPlayers = {}
        for _, user in self.players.items():
            allPlayers[user.GetName()] = ""

        playersInfo = {}
        for gamePlayer in self.playingPlayers:
            if player == gamePlayer:
                continue

            cards = []
            for _, card in gamePlayer.cards.items():
                if card.Visible:
                    cards.append(card.GetName())
                else:
                    cards.append("--HIDDEN--")
            playersInfo[gamePlayer.GetName()] = {}
            playersInfo[gamePlayer.GetName()]["cards"] = cards
            playersInfo[gamePlayer.GetName()]["coins"] = gamePlayer.coins
            playersInfo[gamePlayer.GetName()]["is_ghost"] = gamePlayer.GetId() not in self.players

        playerCards = {}
        for _, card in player.cards.items():
            playerCards[card.GetId()] = {
                "cardId": card.GetId(),
                "cardName": card.GetName(),
                "visible": card.Visible,
            }

        gameInfo = {
            "cards_names": self.cardsNames,
            "deck_size": len(self.deck),
            "my_name": player.GetName(),
            "turn": self.turn.GetName() if self.turn else "",
            "tax": self.tax,
            "my_cards": playerCards,
            "my_coins": player.coins,
            "players": playersInfo,
            "all_players": allPlayers
        }
        return gameInfo

    def createCards(self, cardNames):
        cards = []
        for cardName in cardNames:
            for _ in range(CardInstances):
                cards.append(Card(cardName))
        return cards

    def shuffleDeck(self):
        for _ in range(3):
            random.shuffle(self.deck)

    def KickPlayer(self, playerToKick):
        player = self.getPlayerByName(playerToKick)
        if player is None:
            raise CoupException(f"No player with name {playerToKick}")

        self.UnregisterPlayer(player)

    def RegisterPlayer(self, name) -> Player:
        if self.getPlayerByName(name) is not None:
            raise CoupException(f"{name} is already in the game")

        player = Player(name)
        self.players[player.GetId()] = player
        return player

    def UnregisterPlayer(self, player: Player):
        self.ExposePlayer(player)
        del self.players[player.GetId()]

    def GetPlayer(self, playerId) -> Optional[Player]:
        if playerId in self.players:
            return self.players[playerId]
        return None

    def ExposePlayer(self, player: Player):
        for _, card in player.cards.items():
            card.Visible = True

    def getPlayerByName(self, playerName) -> Optional[Player]:
        for _, player in self.players.items():
            if player.GetName().lower() == playerName.lower():
                return player
        return None

    def OpenCard(self, player: Player, cardId):
        card = player.GetCard(cardId)
        if not card:
            raise CoupException(f"Player {player.GetName()} does not have card id {cardId}")
        card.Visible = True

    def TakeCardFromDeck(self, player: Player):
        if len(self.deck) <= 0:
            raise CoupException("Deck is empty")

        card = self.deck.pop()
        player.AddCard(card)

    def ReturnCardToDeck(self, player: Player, cardId):
        card = player.PopCard(cardId)
        if not card:
            raise CoupException(f"Player {player.GetName()} does not have card id {cardId}")

        card.Visible = False
        self.deck.append(card)
        self.shuffleDeck()

    def TakeFromBank(self, player: Player, coins: int):
        if coins < 0:
            raise CoupException(f"Can't take negative amount of coins")

        player.coins += coins

    def PayToBank(self, player: Player, coins: int):
        if coins < 0:
            raise CoupException(f"Can't pay negative amount of coins")

        if player.coins < coins:
            raise CoupException(f"Player {player.GetName()} does not have {coins} coins")

        player.coins -= coins

    def Transfer(self, player: Player, playerNameDst, coins: int):
        if coins < 0:
            raise CoupException(f"Can't transfer negative amount of coins")

        playerDst = self.getPlayerByName(playerNameDst)
        if not playerDst:
            raise CoupException(f"No player with name {playerNameDst}")

        if player.coins < coins:
            raise CoupException(f"You don't not have {coins} coins")

        player.coins -= coins
        playerDst.coins += coins

    def Tax(self, playerNameDst):
        playerDst = self.getPlayerByName(playerNameDst)
        if not playerDst:
            raise CoupException(f"No player with name {playerNameDst}")

        self.tax = playerNameDst

    def ReturnTaxToBase(self):
        self.tax = None
