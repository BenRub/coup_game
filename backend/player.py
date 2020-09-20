import uuid
from typing import Optional

from backend.card import Card


class Player:
    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.name = name
        self.cards = {}
        self.coins = 0

    def Reset(self):
        self.coins = 2
        self.cards = {}

    def GetId(self):
        return self.id

    def GetName(self):
        return self.name

    def GetCard(self, cardId) -> Optional[Card]:
        if cardId not in self.cards:
            return None
        return self.cards[cardId]

    def AddCard(self, card):
        self.cards[card.GetId()] = card

    def PopCard(self, cardId) -> Optional[Card]:
        cardToPop = self.GetCard(cardId)
        if not cardToPop:
            return None

        del self.cards[cardId]

        return cardToPop

    def AllCardsAreExposed(self) -> bool:
        for _, card in self.cards.items():
            if not card.Visible:
                return False
        return True
