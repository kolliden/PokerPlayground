# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Game

class PokerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'poker_game_{self.game_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        action = data_json.get('action')

        if action == 'make_move':
            # Handle the action (e.g., player makes a move)
            game_data = self.process_game_move(data_json)

            # Broadcast game update to room group
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'game_update',
                    'game_data': game_data
                }
            )

    async def game_update(self, event):
        game_data = event['game_data']

        # Send game update to WebSocket
        await self.send(text_data=json.dumps({
            'game_data': game_data
        }))

    def process_game_move(self, data):
        # Implement game move processing logic here
        # Update game state, handle player actions, etc.
        game_id = data.get('game_id')
        # ...

        # For example, retrieve game data after move
        game = Game.objects.get(id=game_id)
        game_data = {
            'status': game.status,
            'pot': game.pot,
            # Add other game data fields
        }

        return game_data
