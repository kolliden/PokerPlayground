# models.py

from django.contrib.auth.models import User
from django.db import models

class Game(models.Model):
    status = models.CharField(max_length=20, default='waiting')
    pot = models.IntegerField(default=0)
    # Add other game-related fields

class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    hand = models.CharField(max_length=50, default='')
    stack_size = models.IntegerField(default=1000)
    # Add other player-related fields
