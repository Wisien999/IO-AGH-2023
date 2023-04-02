
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from game_state_machine import *
from typing import List
from game_time import GameTime
from common_model import User

router = APIRouter(
    prefix="/api/game",
    tags=["game"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = token
    return user

class ImageContent:
    image_id: str
    prompt_id: str


class PromptContent(BaseModel):
    prompt_id: str
    text: str

    @staticmethod
    def from_prompt_id(game_id: str, prompt_id: str):
        return PromptContent(prompt_id=prompt_id, text=prompts[game_id][prompt_id])

class RoundContent(BaseModel):
    prompts: List[PromptContent]
    images: List[str]

    @staticmethod
    def from_db(game_id: str, round_id: int):
        current_round = games[game_id].rounds[round_id]
        round_prompt_id_start = round_id * current_round.prompts_per_round
        round_image_id_start = round_id * current_round.images_per_round
        round_prompt_id_end = round_prompt_id_start + current_round.prompts_per_round
        round_image_id_end = round_image_id_start + current_round.images_per_round

        return RoundContent(
            prompts=[PromptContent.from_prompt_id(game_id, prompt_id) for prompt_id in prompts[game_id].keys()][round_prompt_id_start:round_prompt_id_end],
            images=[image_id for image_id in images[game_id].keys()][round_image_id_start:round_image_id_end]
        )

class GameContent(BaseModel):
    rounds: List[RoundContent]

    @staticmethod
    def from_db(game_id: str):
        game = games[game_id]
        return GameContent(
            rounds=[
                RoundContent.from_db(game_id, round_id) for round_id in range(len(game.rounds))
            ]
        )

@router.post("")
@router.post("/")
def create_game():
    return create_new_game()

mock_images_per_round = 4

@router.get("/{game_id}")
def get_all_game_data(game_id: str):
    check_images_ready_for_round(mock_images_per_round, len(games[game_id].rounds) - 1)
    return GameContent.from_db(game_id)

def check_images_ready_for_round(count: int, round_id: int):
    if len(images[game_id]) < images_count*(round_id+1):
        raise HTTPException(418, 'Images are not ready')

@router.get("/{game_id}/{round_id}")
def get_round_all_data(game_id: str, round_id: int):
    check_images_ready_for_round(mock_images_per_round, round_id)
    return GameContent.from_db(game_id).rounds[round_id]

@router.get("/{game_id}/{round_id}/prompts")
def get_rounds_prompts(game_id: str, round_id: int):
    check_images_ready_for_round(4, round_id)
    return GameContent.from_db(game_id).rounds[round_id].prompts

@router.get("/{game_id}/{round_id}/images")
def get_rounds_images(game_id: str, round_id: int):
    check_images_ready_for_round(mock_images_per_round, round_id)
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



class MatchResult(BaseModel):
    is_correct: dict[str, bool]
    current_points: float
    is_round_over: bool = False
    has_next_round: bool = False
    is_move_valid: bool = True


@router.post("/{game_id}/{round_id}/match")
async def match(game_id: str, round_id: int, user_action: UserAction, current_user: User = Depends(get_current_user)):
    game_round = games[game_id].rounds[round_id]

    is_round_over = game_round.is_round_over(user_action)
    has_next_round = round_id + 1 < len(games[game_id].rounds)

    for prompt_id, image_id in user_action.actions.items():
        if prompt_id in game_round.prompt_to_image:
            del game_round.prompt_to_image[prompt_id]
        game_round.prompt_to_image = {k: v for k, v in game_round.prompt_to_image.items() if v != image_id}

    for prompt, prompt_id in user_action.actions.items():
        game_round.prompt_to_image[prompt] = prompt_id

    return MatchResult(
        is_correct=game_round.correction_map(),
        current_points=game_round.points(),
        is_round_over=is_round_over,
        has_next_round=has_next_round
    )
