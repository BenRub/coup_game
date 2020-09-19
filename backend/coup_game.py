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
        self.turn = None
        self.cardsNames = []
        self.players = {}
        self.deck = []
        self.playingPlayers = []

    def Start(self, cardNames, playerToStart):
        player = self.getPlayerByName(playerToStart)
        if not player:
            raise CoupException(f"No player with name {playerToStart}")

        self.started = True
        self.turn = player
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

    def EndTurn(self):
        playerIndex = 0
        for player in self.playingPlayers:
            if player == self.turn:
                break
            playerIndex += 1

        if playerIndex + 1 == len(self.playingPlayers):
            playerIndex = -1
        self.turn = self.playingPlayers[playerIndex + 1]

    def GetInfo(self, player):
        playersInfo = {}
        for _, gamePlayer in self.players.items():
            cards = []
            for card in gamePlayer.cards:
                if card.Visible:
                    cards.append(card.GetName())
                else:
                    cards.append("--HIDDEN--")
            playersInfo[gamePlayer.GetName()] = {}
            playersInfo[gamePlayer.GetName()]["cards"] = cards
            playersInfo[gamePlayer.GetName()]["coins"] = gamePlayer.coins

        playerCards = []
        for card in player.cards:
            playerCards.append(card.name)

        gameInfo = {
            "cards_names": self.cardsNames,
            "deck_size": len(self.deck),
            "turn": self.turn.GetName() if self.turn else "",
            "my_cards": playerCards,
            "my_coins": player.coins,
            "players": playersInfo
        }
        return gameInfo

    def createCards(self, cardNames):
        cards = []
        for cardName in cardNames:
            for _ in range(CardInstances):
                cards.append(Card(cardName))
        return cards

    def shuffleDeck(self):
        random.shuffle(self.deck)

    def RegisterPlayer(self, name) -> Player:
        if name in self.players:
            raise CoupException(f"{name} is already in the game")

        player = Player(name)
        self.players[player.GetId()] = player
        return player

    def GetPlayer(self, playerId) -> Optional[Player]:
        if playerId in self.players:
            return self.players[playerId]
        return None

    def ExposePlayer(self, player: Player):
        for _, card in player.cards:
            card.Visible = True

    def getPlayerByName(self, playerName) -> Optional[Player]:
        for _, player in self.players.items():
            if player.GetName().lower() == playerName.lower():
                return player
        return None

    def OpenCard(self, player: Player, cardName):
        card = player.GetVisibleCard(cardName)
        if not card:
            raise CoupException(f"Player {player.GetName()} does not have card {cardName}")
        card.Visible = True

    def TakeCardFromDeck(self, player: Player):
        if len(self.deck) <= 0:
            raise CoupException("Deck is empty")

        card = self.deck.pop()
        player.AddCard(card)

    def ReturnCardToDeck(self, player: Player, cardName):
        card = player.PopCard(cardName)
        if not card:
            raise CoupException(f"Player {player.GetName()} does not have card {cardName}")

        if card.Visible:
            raise CoupException(f"Card {cardName} is visible & can't be returned to deck")

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
