from typing import List, Set
from fastapi import HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi import APIRouter
from pydantic import BaseModel
import uuid

from common_model import User, CreateGameParams
from game_state_machine import create_new_game
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

game_for_room: dict[str, str] = dict()

@router.post("")
@router.post("/")
async def create_room(params: CreateGameParams, background_tasks: BackgroundTasks) -> CreateRoomResponse:
    room_id = f"ri-{uuid.uuid4()}"
    rooms[room_id] = Room(users=set())
    gameid = create_new_game(params, background_tasks)
    game_for_room[room_id] = gameid
    return CreateRoomResponse(roomid=room_id)


@router.post("/{roomid}/users")
async def join_room(roomid: str, current_user: str = Depends(get_current_user)):
    if roomid not in rooms:
        raise HTTPException(status_code=404, detail="room not found")
    room = rooms[roomid]
    if current_user is None:
        raise HTTPException(status_code=400, detail="invalid user")
    if current_user in room.users:
        raise HTTPException(status_code=409, detail="user already exists")
    room.users.add(current_user)


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
    return game_for_room[roomid]

@router.get("/{roomid}/game_ready")
async def is_game_ready(roomid: str):
    if roomid not in game_for_room:
        raise HTTPException(status_code=404, detail="room not found or game not ready")
    return game_for_room[roomid]