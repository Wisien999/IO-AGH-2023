from fastapi import APIRouter

router = APIRouter(
    prefix="/game/"
)

@router.post("/")
def create_game():
    pass

@router.get("/{game_id}")
def get_all_game_data(game_id: int):
    pass

@router.get("/{game_id}/{round_id}")
def get_round_all_data():
    pass

@router.get("/{game_id}/{round_id}/prompts")
def get_rounds_prompts():
    pass

@router.get("/{game_id}/{round_id}/images")
def get_rounds_images():
    pass

@router.post("/{game_id}/{round_id}/match")
def post_match():
    pass
