from fastapi import FastAPI
from routers.images import router as images_router
from routers.game import router as game_router
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
