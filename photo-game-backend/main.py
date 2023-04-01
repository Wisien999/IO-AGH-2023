from fastapi import FastAPI
from routers.images import router as images_router
from routers.game import router as game_router
app = FastAPI()


app.include_router(images_router)
app.include_router(game_router)
