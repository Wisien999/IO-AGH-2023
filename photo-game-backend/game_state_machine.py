from fastapi import HTTPException


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


class GameState:
    def __init__(self, rounds: list[Round]):
        self.rounds: list[Round] = rounds


mock_round = Round()
mock_round_prompts = [
    'pr-PROMPT1',
    'pr-PROMPT2',
    'pr-PROMPT3',
    'pr-PROMPT4'
]
mock_round_images = [
    'im-advjlgjlesa',
    'im-adv1jgjlesa',
    'im-adv4lgllesa',
    'im-advjlgalesa'
]
mock_round.solution = {p: i for p, i in zip(mock_round_prompts, mock_round_images)}
mock_round.all_prompts = mock_round_prompts
mock_round.all_images = mock_round_images

games: dict[str, GameState] = {
    'gm-GAMEID2137': GameState(
        rounds=[mock_round]
    )
}


def get_points(game_id: str, round_id: int) -> int:
    return games[game_id].rounds[round_id].points()
