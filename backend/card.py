import uuid


class Card:
    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.name = name
        self.visible = False
