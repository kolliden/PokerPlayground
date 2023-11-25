from fastapi import FastAPI
from typing import List

app = FastAPI()

# Sample data structure to store game actions
games = {
    "game1": []
    # Add more games as needed...
}

# Endpoint to handle game actions
@app.get('/api/game/{game_id}/actions', response_model=List[str])
def get_game_actions(game_id: str):
    if game_id not in games:
        return {"error": "Game ID not found"}

    return games[game_id]

@app.post('/api/game/{game_id}/actions')
def add_game_action(game_id: str, action: str):
    if game_id not in games:
        return {"error": "Game ID not found"}

    if action not in ['fold', 'raise', 'bet']:
        return {"error": "Invalid action"}

    # Append the action to the respective game's actions list
    games[game_id].append(action)

    return {"message": "Action added successfully"}