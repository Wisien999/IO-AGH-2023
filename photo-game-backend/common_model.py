from fastapi import Depends
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
class User(BaseModel):
    username: str

class CreateGameParams(BaseModel):
    no_of_rounds: int = 1
    no_of_images: int = 4
    no_of_prompts: int = 4
    round_seconds: int = 30
    theme: str = "nature"
