import uuid


class Card:
    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.name = name
        self.Visible = False

    def GetId(self):
        return self.id

    def GetName(self):
        return self.name
