import React from "react";
import {CircularProgress, Paper} from "@mui/material";

export default function LoadingScreen() {
    return (
        <Paper elevation={2} sx={{
            width: '100%',
            height: '10rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <CircularProgress />
        </Paper>
    )
}
