import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {fetchApi} from "../utils/fetchApi";
import LoadingScreen from "../utils/LoadingScreen";
import {Grid, List, ListItem, ListItemText, Paper, useTheme} from "@mui/material";

export default function RoomUserListView() {
    const theme = useTheme();
    const {roomId} = useParams<{ roomId: string }>()
    const data = useQuery(['users', {roomId}], async ({queryKey}) => {
        const [, {roomId: room}] = queryKey as any;

        const response = await fetchApi(`/room/${room}/users`);
        return response.users;
    }, {
        refetchInterval: 2000,
    });

    if (data.isInitialLoading) {
        return <LoadingScreen/>
    }

    return (
        <Paper elevation={2} sx={{
            padding: theme.spacing(2),
        }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <List>
                        {data.data.map((user) => (
                            <ListItem>
                                <ListItemText primary={user}/>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Paper>
    )
}
