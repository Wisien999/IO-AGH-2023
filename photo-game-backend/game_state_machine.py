from fastapi import HTTPException
import random
import string
from pydantic import BaseModel
import asyncio
from text_prompt_generator import get_prompts

def generate_unique_id(prefix: str, dict: Dict[str, str]) -> str:
    letters = string.ascii_lowercase
    new_id = None

    while new_id is None or new_id in dict:
        new_id = prefix + ''.join(random.choice(letters) for _ in range(6))

    return new_id

prompt_dictionary = {}

class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id


async def generate_images_for_round(prompts: list[str]) -> list[str]:
    return []

class Round:
    def __init__(self, solution: dict[str, str] = None):
        self.solution: dict[str, str] = solution or dict()          # prompt -> image
        self.round_vaidator = None
        self.all_prompts: list[str] = list()
        self.all_images: list[str] = list()
        self.prompt_to_image: dict[str, str] = dict()
        self.time = None
        self.are_images_ready = False

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

    def generate_prompts(self, n_prompts: int, theme: str = None):
        new_prompts = get_prompts(n_prompts, theme)
    
        prompts_for_game = []
        for prompt in new_prompts:
            prompt_id = generate_unique_id('pr-', prompts_for_game)
            prompts_for_game.append(prompt_id)
            prompt_dictionary[prompt_id] = prompt

        prompts[game_id] = prompts_for_game

    def generate_solution():
        for i in range(len(self.all_images)):
            self.solution[self.all_prompts[i]] = self.all_images[i]

    async def generate_images(self, n_images: int):
        prompts_values = [prompt_dictionary[prompt_id] for prompt_id in self.all_prompts[0:n_images]]
        images = await generate_images_for_round(prompts_values)
        self.all_images = images
        self.generate_solution()
        self.are_images_ready = True


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

mock_round_images = [
    'im-advjlgjlesa',
    'im-ajsofeaokae',
    'im-ajsofesadae',
    'im-ajsofesaade'
]



mock_round.solution = {p: i for p, i in zip(mock_round_prompts, mock_round_images)}
mock_round.all_prompts = mock_round_prompts
mock_round.all_images = mock_round_images

mock_game_time_s = 10

games: dict[str, GameState] = {
    'gm-game0': GameState(
        rounds=[mock_round]
    )
}

def create_new_game() -> str:
    game_id = generate_unique_id('gm-', games)
    games[game_id] = GameState(rounds=[mock_round])
    for current_round in games[game_id].rounds:
        current_round.generate_prompts()
        current_round.set_validator(DeafulatRoundValidator(current_round))
        asyncio.create_task(current_round.generate_images())

    return game_id


def get_points(game_id: str, round_id: int) -> int:
    return games[game_id].rounds[round_id].points()
