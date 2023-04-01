from fastapi import APIRouter
from pydantic import BaseModel
from game_state_machine import games
from typing import List

router = APIRouter(
    prefix="/game",
    tags=["game"]
)

class ImageContent:
    image_id: str
    prompt_id: str

mock_prompt_dictionary = {
    "pr-PROMPT1": "some description 1",
    "pr-PROMPT2": "some description 2",
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
    rounds=[
        RoundContent(
            prompts=[
                PromptContent.from_prompt_id("pr-PROMPT1"),
                PromptContent.from_prompt_id("pr-PROMPT2"),
            ],
            images=[
                "im-advjlgjlesa",
                "im-ajsofeaokae",
            ],
        )
    ]
)

mock_game_dictionary = {
    "gm-GAMEID2137": mock_game_data 
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

class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id

class MatchResult(BaseModel):
    pass


@router.post("/{game_id}/{round_id}/match")
async def user_action(game_id: str, round_id: str, user_action: UserAction):
    for prompt, image_id in user_action.actions:
        del games[game_id].rounds[round_id].image_to_prompt[image_id]
        games[game_id].rounds[round_id].image_to_prompt = {k: v for k, v in games[game_id].rounds[round_id].image_to_prompt.items() if v != prompt}

    for prompt, image_id in user_action.actions:
        games[game_id].rounds[round_id].image_to_prompt[image_id] = prompt

    return
