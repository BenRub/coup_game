class CoupException(Exception):
    def __init__(self, message):
        Exception.__init__(self)
        self.message = message

    def to_dict(self):
        rv = {'message': self.message}
        return rv
