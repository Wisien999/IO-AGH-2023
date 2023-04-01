from fastapi import APIRouter

router = APIRouter(
    prefix="/image/"
)


@router.get("/{imageid}")
def get_image(imageid: int):
    return {"sth": "std"}
