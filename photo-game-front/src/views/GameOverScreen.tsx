import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Grid, Typography} from "@mui/material";
import {useNickname} from "../contexts/NicknameContext";

export default function GameOverScreen() {
    const state = useLocation();
    const points = state.state.points;
    const { nickname, clearNickname } = useNickname();
    const navigate = useNavigate();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Game over!</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1">Congratulations {nickname}!!! You scored {points} points!</Typography>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={() => {
                    clearNickname();
                    navigate('/start');
                }} >Play again</Button>
            </Grid>
        </Grid>
    )
}
