from fastapi import HTTPException
import random
import string
from pydantic import BaseModel


class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id


class Round:
    def __init__(self, solution: dict[str, str] = None):
        self.solution: dict[str, str] = solution or dict()          # prompt -> image
        self.round_vaidator = None
        self.all_prompts: set[str] = set()
        self.all_images: set[str] = set()
        self.prompt_to_image: dict[str, str] = dict()
        self.time = None

    def correction_map(self) -> dict[str, str]:
        return {prompt_id: self.solution[prompt_id] == self.prompt_to_image.get(prompt_id, '') for prompt_id in self.all_prompts}

    def set_validator(self, validator):
        self.round_vaidator = validator

    def points(self) -> float:
        if len(self.all_images) != len(self.all_prompts):
            raise HTTPException(404)

        return sum([x for x in self.correction_map().values()]) / len(self.all_prompts)

    def is_round_over(self, action: UserAction) -> bool:
        if self.round_vaidator is None:
            return False
        return self.round_vaidator.validate(action)


class DeafulatRoundValidator:
    def __init__(self, round: Round):
        self.round = round
        self.images = {image_id: False for image_id in self.round.all_images}
        
    def validate(self, action: UserAction) -> bool:
        for prompt_id, image_id in action.actions.items():
            self.images[image_id] = True
        return all(self.images.values())
        

class GameState:
    def __init__(self, rounds: list[Round]):
        self.rounds: list[Round] = rounds


mock_round = Round()
mock_round_prompts = [
    'pr-01aa',
    'pr-02aa',
    'pr-03aa',
    'pr-04aa'
]
mock_round_images = [
    'im-advjlgjlesa',
    'im-ajsofeaokae',
    'im-ajsofesadae',
    'im-ajsofesaade'
]

mock_prompt_dictionary = {
    "pr-01aa": "some description 1",
    "pr-02aa": "some description 2",
    "pr-03aa": "some description 3",
    "pr-04aa": "some description 4",
}


mock_round.solution = {p: i for p, i in zip(mock_round_prompts, mock_round_images)}
mock_round.all_prompts = mock_round_prompts
mock_round.all_images = mock_round_images

mock_game_time_s = 10

games: dict[str, GameState] = {
    'gm-game0': GameState(
        rounds=[mock_round]
    )
}

def create_new_game() -> GameState:
    letters = string.ascii_lowercase
    PREFIX = "gm-"
    game_id = None

    while game_id is None or game_id in games:
        game_id = PREFIX + ''.join(random.choice(letters) for i in range(6))
    
    games[game_id] = GameState(rounds=[mock_round])
    for current_round in games[game_id].rounds:
        current_round.set_validator(DeafulatRoundValidator(current_round))

    return game_id

def get_points(game_id: str, round_id: int) -> int:
    return games[game_id].rounds[round_id].points()
