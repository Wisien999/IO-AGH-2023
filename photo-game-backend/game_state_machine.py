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
from random import shuffle  

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
    address = ('localhost', 6002)
    address2 = ('localhost', 6001)
    print(prompts)
    conn = Client(address, authkey=b'secret password')
    listener = Listener(address2, authkey=b'secret password')
    print("trying to send")
    conn.send((prompts, listener.address))
    conn2 = listener.accept()
    images = conn2.recv()
    print(f"Got images: {images}")
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
        result = {}

        for prompt_id in self.all_prompts:
            if prompt_id not in self.solution:
                continue

            result[prompt_id] = self.solution[prompt_id] == self.prompt_to_image.get(prompt_id, '')

        return result
        
    def set_validator(self, validator):
        self.round_vaidator = validator

    def points(self) -> float:
        return sum([x for x in self.correction_map().values()])

    def is_round_over(self, action: UserAction) -> bool:
        if self.round_vaidator is None:
            return False
        return self.round_vaidator.validate(action)

    def is_timeout(self):
        if self.time is None:
            return False
        return self.time.is_timeout()

    def generate_prompts(self, n_prompts: int, theme: str = None):
        new_prompts = get_prompts(n_prompts, theme)

        prompts_for_game = []
        for prompt in new_prompts:
            prompt_id = generate_unique_id('pr-', prompts_for_game)
            prompts_for_game.append(prompt_id)
            prompt_dictionary[prompt_id] = prompt

        self.all_prompts = prompts_for_game

    def generate_solution(self, random_order: List[int]):
        image_id = 0
        for i in random_order:
            self.solution[self.all_prompts[i]] = self.all_images[image_id]
            image_id += 1

    def generate_images(self, n_images: int):
        random_order = list(range(len(self.all_prompts)))
        shuffle(random_order)
        prompts_values = [prompt_dictionary[self.all_prompts[i]] for i in random_order]
        
        images = generate_images_for_round(prompts_values)
        
        self.all_images = images
        self.generate_solution(random_order)
        self.are_images_ready = True
        self.set_validator(DeafulatRoundValidator(self))

    def start_timer(self):
        self.time = GameTime.from_current_time(self.game_params.round_seconds)

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

games: dict[str, GameState] = dict()

def generate_images_for_round_task(current_round: Round, game_params: CreateGameParams):
    current_round.generate_prompts(game_params.no_of_prompts, game_params.theme)
    current_round.generate_images(game_params.no_of_images)

def create_new_game(game_params: CreateGameParams, background_tasks: BackgroundTasks) -> str:
    game_id = generate_unique_id('gm-', games)

    games[game_id] = GameState(game_params)
    for current_round in games[game_id].rounds:
        background_tasks.add_task(generate_images_for_round_task, current_round, game_params)

    return game_id
