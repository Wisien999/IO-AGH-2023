from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/image",
    tags=["images"]
)

mock_image_dictionary = {
    "im-advjlgjlesa": "mock-images/512x512-png-images-3-3437135354.png",
    "im-ajsofeaokae": "mock-images/BMP-1816717683.png"
}

@router.get("/{imageid}", response_class=FileResponse)
async def get_image(imageid: str):
    if imageid not in mock_image_dictionary:
        raise HTTPException(status_code=404)

    return FileResponse(mock_image_dictionary[imageid], media_type="image/png")
