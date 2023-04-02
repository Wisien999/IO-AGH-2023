import random
import random
import string
from typing import List, Dict

from fastapi import HTTPException
from pydantic import BaseModel

from common_model import CreateGameParams
from image_generator import generate_image
from text_prompt_generator import get_prompts


class UserAction(BaseModel):
    actions: dict[str, str]  # prompt id -> image id


class Round:
    def __init__(self, game_id: str, round_idx: int, game_params: CreateGameParams):
        start_prom = round_idx * game_params.no_of_prompts
        start_img = round_idx * game_params.no_of_images
        proms = list(prompts[game_id].keys())[start_prom]
        imgs = images[game_id][start_img]

        self.solution: dict[str, str] = {
            prom_id: img_id for prom_id, img_id in zip(proms, imgs)
        }
        self.round_vaidator = None
        self.time = None
        self.images_per_round = game_params.no_of_images
        self.prompts_per_round = game_params.no_of_prompts


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
    def __init__(self, game_params: CreateGameParams):
        self.rounds: list[Round] = [Round(dict()) for _ in range(game_params.no_of_rounds)]






mock_game_time_s = 10

games: dict[str, GameState] = dict()

images: Dict[str, List[str]] = {}  # game_id: [image1, image2, ...]
prompts: Dict[str, Dict[str, str]] = {}  # game_id: [id:prompt1, id:prompt2, ...]

def generate_unique_id(prefix: str, dict: Dict[str, str]) -> str:
    letters = string.ascii_lowercase
    new_id = None

    while new_id is None or new_id in dict:
        new_id = prefix + ''.join(random.choice(letters) for _ in range(6))

    return new_id

def create_new_game(game_params: CreateGameParams) -> str:

    game_id = generate_unique_id('gm-', games)

    games[game_id] = GameState(game_params)

    images[game_id] = []
    for current_round in games[game_id].rounds:
        current_round.set_validator(DeafulatRoundValidator(current_round))
    #mp.Process(target=generate_images_prompts, args=(game_id, images[game_id], 4, 4, "nature")).start()  # TODO change params

    summary_no_of_images = game_params.no_of_images * game_params.no_of_rounds
    summary_no_of_prompts = game_params.no_of_prompts * game_params.no_of_rounds

    generate_images_prompts(game_id, images[game_id], summary_no_of_images, summary_no_of_prompts, game_params.theme)

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
