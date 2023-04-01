from fastapi import HTTPException


class GameState:
    def __init__(self):
        self.rounds: dict[str, Round] = {'0': Round()}


class Round:
    def __init__(self, solution: dict[str, str] = None):
        self.solution: dict[str, str] = solution or dict()
        self.all_prompts: set[int] = set()
        self.all_images: set[int] = set()
        self.image_to_prompt: dict[int, int] = dict()

    def points(self) -> int:
        if len(self.all_images) != len(self.all_prompts):
            raise HTTPException(404)

        return  len(self.all_prompts)



games: dict[str, GameState] = dict()


def get_points(game_id: str, round_id: str) -> int:
    return games[game_id].rounds[round_id].points()