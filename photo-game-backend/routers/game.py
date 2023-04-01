from fastapi import APIRouter
from pydantic import BaseModel
from game_state_machine import games
from typing import List
from game_time import GameTime

router = APIRouter(
    prefix="/api/game",
    tags=["game"]
)

class ImageContent:
    image_id: str
    prompt_id: str

mock_prompt_dictionary = {
    "pr-01aa": "some description 1",
    "pr-02aa": "some description 2",
    "pr-03aa": "some description 3",
    "pr-04aa": "some description 4",
}

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
    rounnds: List[RoundContent]



mock_game_data = GameContent(
    rounnds=[
        RoundContent(
            prompts=[
                PromptContent.from_prompt_id("pr-01aa"),
                PromptContent.from_prompt_id("pr-02aa"),
                PromptContent.from_prompt_id("pr-03aa"),
                PromptContent.from_prompt_id("pr-04aa"),
            ],
            images=[
                "im-advjlgjlesa",
                "im-ajsofeaokae",
                "im-ajsofesaade",
                "im-ajsofesadae",
            ],
        )
    ]
)

mock_game_dictionary = {
    "gm-game0": mock_game_data
}

@router.post("/")
def create_game():
    return list(mock_game_dictionary.keys())[0]

@router.get("/{game_id}")
def get_all_game_data(game_id: str):
    return mock_game_dictionary[game_id]

@router.get("/{game_id}/{round_id}")
def get_round_all_data(game_id: str, round_id: int):
    return mock_game_dictionary[game_id].rounnds[round_id]

@router.get("/{game_id}/{round_id}/prompts")
def get_rounds_prompts(game_id: str, round_id: int):
    return mock_game_dictionary[game_id].rounnds[round_id].prompts

@router.get("/{game_id}/{round_id}/images")
def get_rounds_images(game_id: str, round_id: int):
    return mock_game_dictionary[game_id].rounnds[round_id].images

mock_game_time_s = 10
mock_game_timer = GameTime.from_current_time(mock_game_time_s)

@router.post("/{game_id}/{round_id}/ready")
def start_game_timer(game_id: str, round_id: int):
    mock_game_timer = GameTime.from_current_time(mock_game_time_s)
    return mock_game_timer

@router.get("/{game_id}/{round_id}/time")
def get_current_time(game_id: str, round_id: int):
    mock_game_timer.update()
    return mock_game_timer.current

class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id


class MatchResult(BaseModel):
    is_correct: dict[str, bool]
    current_points: float


@router.post("/{game_id}/{round_id}/match")
async def match(game_id: str, round_id: int, user_action: UserAction):
    game_round = games[game_id].rounds[round_id]
    for prompt, image_id in user_action.actions.items():
        del games[game_id].rounds[round_id].image_to_prompt[image_id]
        game_round.image_to_prompt = {k: v for k, v in games[game_id].rounds[round_id].image_to_prompt.items() if v != prompt}

    for prompt, image_id in user_action.actions:
        game_round.image_to_prompt[image_id] = prompt

    return MatchResult(
        is_correct=game_round.correction_map(),
        current_points=game_round.points()
    )
