from fastapi import Depends
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
class User(BaseModel):
    username: str

