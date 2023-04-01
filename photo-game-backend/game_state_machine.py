from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class GameState:
    def __init__(self):
        self.rounds: dict[int, Round] = {0: Round()}


class Round:
    def __init__(self):
        self.all_prompts: set[int] = set()
        self.all_images: set[int] = set()
        self.image_to_prompt: dict[int, int] = dict()


games: dict[int, GameState] = dict()

class UserAction(BaseModel):
    actions: dict[str, str]     # prompt id -> image id

@app.post("/game/{game_id}/round/{round_id}/")
async def user_action(game_id: int, round_id: int, userAction: UserAction):
    for prompt, image_id in userAction.actions:
        del games[game_id].rounds[round_id].image_to_prompt[image_id]
        del games[game_id].rounds[round_id].image_to_prompt[prompt]

    for prompt, image_id in userAction.actions:
        games[game_id].rounds[round_id].image_to_prompt[image_id] = prompt
    

@app.post("/game/{game_id}/round/{round_id}/")
async def next_round(game_id: int, round_id: int):
    return {"message": "Hello World"}


@app.get("/game/{game_id}/round/{round_id}/next_round")
async def next_round(game_id: int, round_id: int):
    return {"message": "Hello World"}

def get_points()