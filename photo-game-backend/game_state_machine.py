import multiprocessing as mp
import random
import string
from typing import List, Dict

import torch
from fastapi import HTTPException
from min_dalle import MinDalle

from image_generator import generate_image
from text_prompt_generator import get_prompts
from pydantic import BaseModel


from image_generator import generate_image
from text_prompt_generator import get_prompts


from pydantic import BaseModel


class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id


class Round:
    def __init__(self, solution: dict[str, str] = None):
        self.solution: dict[str, str] = solution or dict()          # prompt -> image
        self.round_vaidator = None
        self.time = None
        self.images_per_round = 4
        self.prompts_per_round = 4


    def correction_map(self):
        return {prompt_id: self.solution[prompt_id] == self.image_to_prompt.get(prompt_id, '') for prompt_id in
                self.all_prompts}

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
        #self.round = round
        #self.images = {image_id: False for image_id in self.round.all_images}
        pass

    def validate(self, action: UserAction) -> bool:
        #or prompt_id, image_id in action.actions.items():
        #    self.images[image_id] = True
        #return all(self.images.values())
        return False
        

class GameState:
    def __init__(self, rounds: list[Round]):
        self.rounds: list[Round] = rounds




mock_round = Round()

mock_game_time_s = 10

games: Dict[str, GameState] = {
    'gm-game0': GameState(
        rounds=[mock_round]
    )
}

images: Dict[str, List[str]] = {}  # game_id: [image1, image2, ...]
prompts: Dict[str, Dict[str, str]] = {}  # game_id: [id:prompt1, id:prompt2, ...]

def generate_unique_id(prefix: str, dict: Dict[str, str]) -> str:
    letters = string.ascii_lowercase
    new_id = None

    while new_id is None or new_id in dict:
        new_id = prefix + ''.join(random.choice(letters) for _ in range(6))

    return new_id

def create_new_game() -> GameState:

    game_id = generate_unique_id('gm-', games)

    games[game_id] = GameState(rounds=[mock_round])

    images[game_id] = []
    for current_round in games[game_id].rounds:
        current_round.set_validator(DeafulatRoundValidator(current_round))
    #mp.Process(target=generate_images_prompts, args=(game_id, images[game_id], 4, 4, "nature")).start()  # TODO change params

    generate_images_prompts(game_id, images[game_id], 4, 4, "nature")

    for current_round in games[game_id].rounds:
        current_round.set_validator(DeafulatRoundValidator(current_round))


    return game_id


def generate_images_prompts(game_id: str, image_list: List, n_prompts: int, n_images: int, theme: str = None) -> None:
    new_prompts = get_prompts(n_prompts, theme)
    
    prompts_for_game = {}
    for prompt in new_prompts:
        prompt_id = generate_unique_id('pr-', prompts_for_game)
        prompts_for_game[prompt_id] = prompt

    
    prompts[game_id] = prompts_for_game


    for i in range(n_images):
        image_list.append(generate_image(None, (list(prompts[game_id].values()))[i]))
