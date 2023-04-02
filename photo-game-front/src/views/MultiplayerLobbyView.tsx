import React from "react";
import {Button, Grid, IconButton, Typography} from "@mui/material";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import RoomUserListView from "./RoomUserListView";
import {CopyAll} from "@mui/icons-material";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {fetchApi} from "../utils/fetchApi";
import {useQuery} from "@tanstack/react-query";

const startGame = async (roomId: string) => {
    return fetchApi(`/room/${roomId}`, {
        method: 'POST',
    });
}

const useWaitForJoin = (roomId: string, isHost: boolean) => {
    const navigate = useNavigate();
    useQuery(['users', {roomId}], async ({queryKey}) => {
        const [, {roomId: room}] = queryKey as any;

        return fetchApi(`/room/${room}/game_ready`);
    }, {
        onSuccess: data => {
            if (isHost) return;
            navigate(`/game/${data}/0`)
        }
    });
};

export default function MultiplayerLobbyView() {

    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();

    const {state} = useLocation();

    useWaitForJoin(roomId as string, state?.isHost ?? false);


    return (
        <Grid container spacing={1}  justifyContent="center">
            <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Multiplayer</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{
                        display: 'flex',
                        alignItems: 'center'

                    }}>
                        <Typography variant="body2">Room: {roomId}</Typography>
                        <CopyToClipboard text={roomId as string}>
                            <IconButton><CopyAll /></IconButton>
                        </CopyToClipboard>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <RoomUserListView />
                            </Grid>
                        </Grid>
                    </Grid>
                    {state?.isHost && (
                        <Grid item xs={12}>
                            <Button variant="contained" fullWidth onClick={async () => {
                                const gameId = await startGame(roomId as string);
                                navigate(`/game/${gameId}/0`);
                            }}>Start game</Button>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>

    )
}
