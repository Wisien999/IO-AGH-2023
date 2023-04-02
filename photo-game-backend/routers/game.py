from fastapi import APIRouter, Depends, BackgroundTasks
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
    if user is None:
        return None
    return user.split(",")[0]

class ImageContent:
    image_id: str
    prompt_id: str


class PromptContent(BaseModel):
    prompt_id: str
    text: str

    @staticmethod
    def from_prompt_id(prompt_id: str):
        return PromptContent(prompt_id=prompt_id, text=prompt_dictionary[prompt_id])

class RoundContent(BaseModel):
    prompts: List[PromptContent]
    images: List[str]

    @staticmethod
    def from_round(round: Round):
        if not round.are_images_ready:
            raise HTTPException(418, "Images are not ready yet")
        
        return RoundContent(
            prompts=[PromptContent.from_prompt_id(p) for p in round.all_prompts],
            images=list(round.all_images)
        )

class GameContent(BaseModel):
    rounds: List[RoundContent]

    @staticmethod
    def from_db(game_id: str):
        game = games[game_id]

        return GameContent(
            rounds=[
                RoundContent.from_round(round) for round in game.rounds
            ]
        )

@router.post("")
@router.post("/")
def create_game(game_params: CreateGameParams, background_tasks: BackgroundTasks):
    return create_new_game(game_params, background_tasks)

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
    if games[game_id].rounds[round_id].time is None:
        games[game_id].rounds[round_id].start_timer()
    return games[game_id].rounds[round_id].time

@router.get("/{game_id}/{round_id}/time")
def get_current_time(game_id: str, round_id: int):
    if game_id not in games:
        raise HTTPException(404, "Game not found")
    if games[game_id].rounds[round_id].time is None:
        games[game_id].rounds[round_id].start_timer()
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

    # update state machine
    for prompt_id, image_id in user_action.actions.items():
        if prompt_id in game_round.prompt_to_image:
            del game_round.prompt_to_image[prompt_id]
        game_round.prompt_to_image = {k: v for k, v in game_round.prompt_to_image.items() if v != image_id}

    for prompt, prompt_id in user_action.actions.items():
        game_round.prompt_to_image[prompt] = prompt_id

    is_round_over = game_round.is_round_over(user_action) or game_round.is_timeout()
    has_next_round = round_id + 1 < len(games[game_id].rounds)

    summary_points = sum(ro.points() for ro in games[game_id].rounds[:round_id + 1])

    return MatchResult(
        is_correct=game_round.correction_map(),
        current_points=summary_points,
        is_round_over=is_round_over,
        has_next_round=has_next_round
    )
