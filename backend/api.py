from fastapi import FastAPI, HTTPException
from typing import List
from functions import *

app = FastAPI()

# Sample data structure to store game actions
games = {
    "Game1": []
    # Add more games as needed...
}
players = {
    "player1": Player("You", 100),
    "player2": Player("Bot1", 100),
    "player3": Player("Bot2", 100)
}

@app.post('/api/flag')
def receive_flag(flag: bool):
    print(f"received flag.")
    return{"message": "flag received"}

@app.post("/api/front_message/")
def receive_message(message: str):
    int(receive_message)

@app.post('/api/flag')
def add_game_action(game_id: str, action: str):
    if game_id not in games:
        return {"error": "Game ID not found"}

    match action:
        case "fold":
            Player.fold()

        case "bet":
            Player.bet()

        case "raise_bet":
            Player.raise_bet()

        case _:
            Print("Invalid option")

    # Append the action to the respective game's actions list
    games[game_id].append(action)

    return {"message": "Action added successfully"}