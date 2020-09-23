import uuid
from typing import Optional, Dict

from backend.card import Card


class Player:
    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.name = name
        self.cards: Dict[int, Card] = {}
        self.coins = 0

    def reset(self):
        self.coins = 2
        self.cards = {}

    def get_card(self, card_id) -> Optional[Card]:
        if card_id not in self.cards:
            return None
        return self.cards[card_id]

    def add_card(self, card):
        self.cards[card.id] = card

    def pop_card(self, card_id) -> Optional[Card]:
        card_to_pop = self.get_card(card_id)
        if not card_to_pop:
            return None

        del self.cards[card_id]

        return card_to_pop

    def is_out(self) -> bool:
        return not any([card.visible for card in self.cards.values()])
