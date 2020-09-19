from typing import Optional
from backend.card import Card
from backend.coup_exception import CoupException
from backend.player import Player
import random

from backend.player_game_info import PlayerGameInfo

CardInstances = 3


class CoupGame:

    def __init__(self):
        self.players = {}
        self.deck = []

    def Start(self, cardNames):
        self.players = {}
        self.deck = self.createCards(cardNames)
        self.shuffleDeck()

    def GetInfo(self, player):
        playersInfo = []
        for _, gamePlayer in self.players:
            cards = []
            for card in gamePlayer.cards:
                if player == gamePlayer or card.Visible:
                    cards.append(card.GetName())
            playersInfo.append(PlayerGameInfo(gamePlayer.GetName(), cards, gamePlayer.coins))
        return playersInfo

    def createCards(self, cardNames):
        cards = []
        for cardName in cardNames:
            for _ in range(CardInstances):
                cards.append(Card(cardName))
        return cards

    def shuffleDeck(self):
        self.deck = random.shuffle(self.deck)

    def RegisterPlayer(self, name):
        for player in self.players:
            if player.GetName() == name:
                return None

        player = Player(name)
        self.players[player.GetId()] = player
        return player

    def GetPlayer(self, playerId) -> Optional[Player]:
        if playerId in self.players:
            return self.players[playerId]
        return None

    def getPlayerByName(self, playerName) -> Optional[Player]:
        for _, player in self.players:
            if player.GetName() == playerName:
                return player
        return None

    def OpenCard(self, player: Player, cardName):
        card = player.GetCard(cardName)
        if not card:
            raise CoupException(f"Player {player.GetName()} does not have card {cardName}")
        card.Visible = True

    def TakeCardFromDeck(self, player: Player) -> Card:
        if len(self.deck) <= 0:
            raise CoupException("Deck is empty")

        card = self.deck.pop()
        player.AddCard(card)
        return card

    def ReturnCardToDeck(self, player: Player, cardName):
        card = player.PopCard(cardName)
        if not card:
            raise CoupException(f"Player {player.GetName()} does not have card {cardName}")

        self.deck.append(card)
        self.shuffleDeck()

    def TakeFromBank(self, player: Player, coins: int):
        player.coins += coins

    def PayToBank(self, player: Player, coins: int):
        if player.coins < coins:
            raise CoupException(f"Player {player.GetName()} does not have {coins} coins")
        player.coins -= coins

    def Transfer(self, playerNameSrc, playerNameDst, coins: int):
        playerSrc = self.getPlayerByName(playerNameSrc)
        if not playerSrc:
            raise CoupException(f"No player with name {playerNameSrc}")

        playerDst = self.getPlayerByName(playerNameDst)
        if not playerDst:
            raise CoupException(f"No player with name {playerNameDst}")

        if playerSrc.coins < coins:
            raise CoupException(f"Player {playerSrc.GetName()} does not have {coins} coins")

        playerSrc.coins -= coins
        playerDst.coins += coins
