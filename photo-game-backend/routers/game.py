from fastapi import APIRouter
from pydantic import BaseModel
from game_state_machine import *
from typing import List
from game_time import GameTime

router = APIRouter(
    prefix="/api/game",
    tags=["game"]
)

class ImageContent:
    image_id: str
    prompt_id: str


class PromptContent(BaseModel):
    prompt_id: str
    text: str

    @staticmethod
    def from_prompt_id(prompt_id: str):
        return PromptContent(prompt_id=prompt_id, text=mock_prompt_dictionary[prompt_id])

class RoundContent(BaseModel):
    prompts: List[PromptContent]
    images: List[str]

class GameContent(BaseModel):
    rounds: List[RoundContent]

    @staticmethod
    def from_db(game_id: str):
        game = games[game_id]
        return GameContent(
            rounds=[
                RoundContent(
                    prompts=[PromptContent.from_prompt_id(p) for p in round.all_prompts],
                    images=list(round.all_images)
                ) for round in game.rounds
            ]
        )

@router.post("/")
def create_game():
    
    return create_new_game()

@router.get("/{game_id}")
def get_all_game_data(game_id: str):
    return GameContent.from_db(game_id)

@router.get("/{game_id}/{round_id}")
def get_round_all_data(game_id: str, round_id: int):
    return GameContent.from_db(game_id).rounds[round_id]

@router.get("/{game_id}/{round_id}/prompts")
def get_rounds_prompts(game_id: str, round_id: int):
    return GameContent.from_db(game_id).rounds[round_id].prompts

@router.get("/{game_id}/{round_id}/images")
def get_rounds_images(game_id: str, round_id: int):
    return GameContent.from_db(game_id).rounds[round_id].images

@router.post("/{game_id}/{round_id}/ready")
def start_game_timer(game_id: str, round_id: int):
    games[game_id].rounds[round_id].time = GameTime.from_current_time(mock_game_time_s)
    return games[game_id].rounds[round_id].time

@router.get("/{game_id}/{round_id}/time")
def get_current_time(game_id: str, round_id: int):
    if games[game_id].rounds[round_id].time is None:
        games[game_id].rounds[round_id].time = GameTime.from_current_time(mock_game_time_s)
    games[game_id].rounds[round_id].time.update()
    return games[game_id].rounds[round_id].time.current

class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id


class MatchResult(BaseModel):
    is_correct: dict[str, bool]
    current_points: float


@router.post("/{game_id}/{round_id}/match")
async def match(game_id: str, round_id: int, user_action: UserAction):
    game_round = games[game_id].rounds[round_id]
    for prompt_id, image_id in user_action.actions.items():
        if prompt_id in game_round.prompt_to_image:
            del game_round.prompt_to_image[prompt_id]
        game_round.prompt_to_image = {k: v for k, v in game_round.prompt_to_image.items() if v != image_id}

    for prompt, prompt_id in user_action.actions.items():
        game_round.prompt_to_image[prompt] = prompt_id

    return MatchResult(
        is_correct=game_round.correction_map(),
        current_points=game_round.points()
    )
