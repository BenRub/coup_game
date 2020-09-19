import uuid
from typing import Optional

from backend.card import Card


class Player:
    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.name = name
        self.cards = {}
        self.coins = 2

    def GetId(self):
        return self.id

    def GetName(self):
        return self.name

    def GetCard(self, cardName) -> Optional[Card]:
        if cardName in self.cards:
            return self.cards[cardName]
        return None

    def AddCard(self, card):
        self.cards[card.GetName()] = card

    def PopCard(self, cardName):
        card = self.GetCard(cardName)
        if not card:
            return None
        del self.cards[cardName]
        return card
