from typing import List, Optional

from backend.coup_exception import CoupException


class RoleToken:

    def __init__(self, name, quantity: int):
        self._name: str = name
        self._quantity: int = quantity
        self._tokens_positions: List[str] = []
        self.reset()

    def reset(self):
        self._tokens_positions = []
        for _ in range(self._quantity):
            self._tokens_positions.append(None)

    def get_name(self) -> str:
        return self._name

    def get_token_position(self, index: int) -> str:
        try:
            return self._tokens_positions[index]
        except IndexError:
            raise CoupException(f"Index {index} for token {self._name} is not valid")

    def set_token_position(self, index: int, playerName: Optional[str]):
        try:
            self._tokens_positions[index] = playerName
        except IndexError:
            raise CoupException(f"Index {index} for token {self._name} is not valid")

    def get_values(self):
        return self._tokens_positions
