from typing import List, Set
from fastapi import HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi import APIRouter
from pydantic import BaseModel
import uuid

from common_model import User
from routers.game import get_current_user

router = APIRouter(
    prefix="/api/room",
    tags=["room"]
)


class Room(BaseModel):
    users: Set[str]


class CreateRoomResponse(BaseModel):
    roomid: str


class GetRoomUsersResponse(BaseModel):
    users: Set[str]


rooms: dict[str, Room] = dict()

@router.post("")
@router.post("/")
async def create_room() -> CreateRoomResponse:
    room_id = f"ri-{uuid.uuid4()}"
    rooms[room_id] = Room(users=set())
    return CreateRoomResponse(roomid=room_id)


@router.post("/{roomid}/users")
async def join_room(roomid: str, current_user: User = Depends(get_current_user)):
    if roomid not in rooms:
        raise HTTPException(status_code=404, detail="room not found")
    room = rooms[roomid]
    if current_user is None:
        raise HTTPException(status_code=400, detail="invalid user")
    if current_user.username in room.users:
        raise HTTPException(status_code=409, detail="user already exists")
    room.users.add(current_user.username)


@router.get("/{roomid}/users")
async def get_room_users(roomid: str) -> GetRoomUsersResponse:
    if roomid not in rooms:
        raise HTTPException(status_code=404, detail="room not found")
    return GetRoomUsersResponse(users=rooms[roomid].users)


@router.delete("/{roomid")
async def delete_room(roomid: str):
    if roomid not in rooms:
        raise HTTPException(status_code=404, detail="room not found")
    del rooms[roomid]


@router.post("/{roomid}")
async def start_game(roomid: str):
    if roomid not in rooms:
        raise HTTPException(status_code=404, detail="room not found")
    room = rooms[roomid]
    del rooms[roomid]
