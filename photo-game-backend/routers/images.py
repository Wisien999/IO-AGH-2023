from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter(
    prefix="/api/image",
    tags=["images"]
)

images_path = "images/"

@router.get("/{image_id}", response_class=FileResponse)
async def get_image(image_id: str):
    path = images_path + image_id
    if not os.path.isfile(path):
        raise HTTPException(404)

    return FileResponse(path, media_type="image/png")
