from django.contrib.auth.models import User
from django.db import models

class Game(models.Model):
    # Game fields: status, pot, community cards, etc.
    status = models.CharField(max_length=20, default='waiting')
    pot = models.IntegerField(default=0)
    # ... other fields

class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    hand = models.CharField(max_length=50, default='')
    stack_size = models.IntegerField(default=1000)
    # ... other fields
