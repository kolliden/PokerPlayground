class Game():
    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        self.connected_players = set()
        self.game_started = False
        self.game_ended = False
        
    