import os

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from routers.images import router as images_router
from routers.game import router as game_router
from routers.room import router as room_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(images_router)
app.include_router(game_router)
app.include_router(room_router)

if os.getenv("PHOTO_GAME_DOCKER") == "true":
    sf = StaticFiles(directory="./website")


    @app.get("/{path:path}", include_in_schema=False)
    async def catch_all(path: str):
        filepath, _ = sf.lookup_path(path)
        if filepath != "":
            if os.path.isfile(filepath):
                print(f"getting file {filepath} for {path}")
                return FileResponse(filepath)
        if path.startswith("/static") or path.startswith("/api"):
            raise HTTPException(404)
        print(f"getting index.html for {path}")
        return FileResponse("./website/index.html")
