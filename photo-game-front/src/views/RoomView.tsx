import React from "react";
import {Button, Grid, TextField, Typography} from "@mui/material";
import {fetchApi} from "../utils/fetchApi";
import {useLocation, useNavigate} from "react-router-dom";

const joinRoom = async (roomId) => {
    const result = await fetchApi(`/room/${roomId}/users`, {
        method: 'POST',
        ignoreJSON: true
    });
    return result.ok;
}

const createRoom = async (setRoomId, params) => {
    const response = await fetchApi('/room', {
        method: 'POST',
        body: JSON.stringify({
            ...params
        })
    });

    const joined = await joinRoom(response.roomid);

    if (!joined) {
        console.log('Oj to niedobrze')
    }
    setRoomId(response.roomid);
}

export default function RoomView() {

    const navigate = useNavigate();

    const {state} = useLocation();

    const [roomId, setRoomId] = React.useState<string | undefined>();
    const [joiningRoom, setJoiningRoom] = React.useState<boolean>(false);

    const setRoomIdWithNavigate = (roomId) => {
        navigate(`/room/${roomId}`, {
            state: {
                ...state,
                isHost: true
            }
        });
    }


    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant="h4">Multiplayer</Typography>
            </Grid>

            <Grid item xs={12}>
                <Button variant="text" fullWidth onClick={() => {
                    setJoiningRoom(false);
                    return createRoom(setRoomIdWithNavigate, state.options);
                }}>Create room</Button>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" fullWidth disabled={roomId !== undefined} onClick={() => {
                    setJoiningRoom(true);
                    setRoomId(undefined);
                }}>Join room</Button>
            </Grid>
            <Grid item xs={12}>
                <TextField onChange={(e) => {
                    setRoomId(e.target.value)
                }} value={roomId} disabled={!joiningRoom} variant={"outlined"} placeholder={"Room ID"}
                           fullWidth/>
            </Grid>
            {joiningRoom && (
                <>
                    <Grid item xs={12}>
                        <Button variant="contained" fullWidth disabled={roomId === undefined}
                                onClick={async () => {
                                    const result = await joinRoom(roomId);
                                    if (result) {
                                        navigate(`/room/${roomId}`, {
                                            state: {
                                                ...state,
                                                isHost: false
                                            }
                                        });
                                    }
                                    // TODO if id wrong display error
                                }}>Join</Button>
                    </Grid>
                </>
            )}
        </Grid>
    )
}
