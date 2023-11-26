# views.py

from rest_framework import viewsets
from .models import Game, Player
from .serializers import GameSerializer, PlayerSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    # Add custom actions for player-related functionalities
