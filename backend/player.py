import uuid
from typing import Optional

from backend.card import Card


class Player:
    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.name = name
        self.cards = []
        self.coins = 0

    def Reset(self):
        self.coins = 2
        self.cards = []

    def GetId(self):
        return self.id

    def GetName(self):
        return self.name

    def GetCard(self, cardName) -> Optional[Card]:
        for card in self.cards:
            if card.GetName() == cardName:
                return card
        return None

    def AddCard(self, card):
        self.cards.append(card)

    def PopCard(self, cardName):
        cardToPop = self.GetCard(cardName)
        if not cardToPop:
            return None

        newCards = []
        for card in self.cards:
            if card is not cardToPop:
                newCards.append(card)

        self.cards = newCards

        return cardToPop
