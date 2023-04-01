from fastapi import FastAPI
from pydantic import BaseModel


class GameState:
    def __init__(self):
        self.rounds: dict[int, Round] = {0: Round()}


class Round:
    def __init__(self):
        self.all_prompts: set[int] = set()
        self.all_images: set[int] = set()
        self.image_to_prompt: dict[int, int] = dict()

    def points(self):
        if len(self.all_images) ==


games: dict[int, GameState] = dict()


def get_points()