from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/api/image",
    tags=["images"]
)

images_path = "images/"

@router.get("/{imageid}", response_class=FileResponse)
async def get_image(imageid: str):
    path = images_path + image_id
    if not os.path.isfile(path):
        raise HTTPException(404)

    return FileResponse(path, media_type="image/png")
