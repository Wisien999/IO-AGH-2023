from fastapi import APIRouter
from pydantic import BaseModel
from game_state_machine import games

router = APIRouter(
    prefix="/game/"
)

@router.post("/")
def create_game():
    pass

@router.get("/{game_id}")
def get_all_game_data(game_id: int):
    pass

@router.get("/{game_id}/{round_id}")
def get_round_all_data():
    pass

@router.get("/{game_id}/{round_id}/prompts")
def get_rounds_prompts():
    pass

@router.get("/{game_id}/{round_id}/images")
def get_rounds_images():
    pass


class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id


class MatchResult(BaseModel):
    is_correct: dict[str, dict[str, bool]]
    current_points: float


@router.post("/{game_id}/{round_id}/match")
async def user_action(game_id: str, round_id: str, user_action: UserAction):
    game_round = games[game_id].rounds[round_id]
    for prompt, image_id in user_action.actions:
        del games[game_id].rounds[round_id].image_to_prompt[image_id]
        game_round.image_to_prompt = {k: v for k, v in games[game_id].rounds[round_id].image_to_prompt.items() if v != prompt}

    for prompt, image_id in user_action.actions:
        game_round.image_to_prompt[image_id] = prompt

    return MatchResult(
        is_correct=game_round.correction_map(),
        current_points=game_round.points()
    )
