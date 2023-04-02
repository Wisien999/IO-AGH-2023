from typing import Dict

from fastapi import HTTPException
import random
import string
from pydantic import BaseModel
import asyncio
from text_prompt_generator import get_prompts
from typing import List, Dict
from multiprocessing.connection import Listener, Client
from common_model import CreateGameParams
from fastapi import BackgroundTasks
from game_time import GameTime

def generate_unique_id(prefix: str, dict: Dict[str, str]) -> str:
    letters = string.ascii_lowercase
    new_id = None

    while new_id is None or new_id in dict:
        new_id = prefix + ''.join(random.choice(letters) for _ in range(6))

    return new_id

prompt_dictionary = {}

class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id


def generate_images_for_round(prompts: List[str]) -> List[str]:
    address = ('localhost', 6000)
    address2 = ('localhost', 6001)
    print(prompts)
    conn = Client(address, authkey=b'secret password')
    listener = Listener(address2, authkey=b'secret password')
    print("trying to send")
    conn.send((prompts, listener.address))
    conn2 = listener.accept()
    images = conn2.recv()
    conn.close()
    listener.close()
    return images

class Round:
    def __init__(self, game_params: CreateGameParams):
        self.solution: dict[str, str] = dict()          # prompt -> image
        self.round_vaidator = None
        self.all_prompts: list[str] = list()
        self.all_images: list[str] = list()
        self.prompt_to_image: dict[str, str] = dict()
        self.time = None
        self.are_images_ready = False
        self.game_params = game_params

    def correction_map(self) -> dict[str, str]:
        return {prompt_id: self.solution[prompt_id] == self.prompt_to_image.get(prompt_id, '') for prompt_id in self.all_prompts}

    def set_validator(self, validator):
        self.round_vaidator = validator

    def points(self) -> float:
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

        self.all_prompts = prompts_for_game

    def generate_solution(self):
        for i in range(len(self.all_images)):
            self.solution[self.all_prompts[i]] = self.all_images[i]

    def generate_images(self, n_images: int):
        prompts_values = [prompt_dictionary[prompt_id] for prompt_id in self.all_prompts[0:n_images]]
        images = generate_images_for_round(prompts_values)
        self.all_images = images
        self.generate_solution()
        self.are_images_ready = True

    def start_timer(self):
        self.time = GameTime.from_game_params(game_params)

class DeafulatRoundValidator:
    def __init__(self, round: Round):
        self.round = round
        self.images = {image_id: False for image_id in self.round.all_images}
        
    def validate(self, action: UserAction) -> bool:
        for prompt_id, image_id in action.actions.items():
            self.images[image_id] = True
        return all(self.images.values())
        

class GameState:
    def __init__(self, game_params: CreateGameParams):
        self.rounds: list[Round] = [Round(game_params) for _ in range(game_params.no_of_rounds)]



mock_round_images = [
    'im-advjlgjlesa',
    'im-ajsofeaokae',
    'im-ajsofesadae',
    'im-ajsofesaade'
]




mock_game_time_s = 10

games: dict[str, GameState] = dict()

def generate_images_for_round_task(current_round: Round, images_count: int):
    current_round.generate_images(images_count)

def create_new_game(game_params: CreateGameParams, background_tasks: BackgroundTasks) -> str:
    game_id = generate_unique_id('gm-', games)

    games[game_id] = GameState(game_params)
    for current_round in games[game_id].rounds:
        current_round.generate_prompts(game_params.no_of_prompts, game_params.theme)
        current_round.set_validator(DeafulatRoundValidator(current_round))
        #background_tasks.add_task(generate_images_for_round_task, current_round, game_params.no_of_images)
        generate_images_for_round_task(current_round, game_params.no_of_images)

    return game_id
