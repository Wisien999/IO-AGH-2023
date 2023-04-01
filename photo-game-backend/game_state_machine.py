from fastapi import HTTPException


class GameState:
    def __init__(self):
        self.rounds: dict[str, Round] = {'0': Round()}


class Round:
    def __init__(self, solution: dict[str, str] = None):
        self.solution: dict[str, str] = solution or dict()
        self.all_prompts: set[str] = set()
        self.all_images: set[str] = set()
        self.image_to_prompt: dict[str, str] = dict()

    def correction_map(self):
        return {prompt_id: {img_id: self.solution[prompt_id] == img_id for img_id in self.all_images} for prompt_id in self.all_prompts}

    def points(self) -> int:
        if len(self.all_images) != len(self.all_prompts):
            raise HTTPException(404)

        return sum([sum(x) for x in self.correction_map().values()]) / len(self.all_prompts)


games: dict[str, GameState] = dict()


def get_points(game_id: str, round_id: str) -> int:
    return games[game_id].rounds[round_id].points()
