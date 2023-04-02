import React, {useContext, useState} from 'react';
import {Button, Dialog, DialogContent, DialogTitle, FormLabel, Grid, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {settingsContext} from "./Start";

export default function SettingsView() {
    const startContext = useContext(settingsContext);

    const navigate = useNavigate();

     const handleClick = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        navigate("/start");
    };

    return (
        <Dialog open={true} onClose={() => navigate('..')}>
            <DialogTitle>Game params</DialogTitle>
            <DialogContent>
                <Grid container rowGap={4}>
                    <Grid item xs={6}>
                        <FormLabel>Number of rounds:</FormLabel>
                    </Grid>
                    <Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
                        <TextField
                            onChange={(event) => {startContext.setRoundNumber(parseInt(event.target.value))}}
                            value={startContext.roundNumber} type={'number'}></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>Time limit (in seconds):</FormLabel>
                    </Grid>
                    <Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
                        <TextField
                                onChange={(event) => {startContext.setTimeLimit(parseInt(event.target.value))}}
                                value={startContext.timeLimit}
                                type={'number'}></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>Number of images:</FormLabel>
                    </Grid>
                     <Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
                        <TextField
                                onChange={(event) => {startContext.setImageNumber(parseInt(event.target.value))}}
                                value={startContext.imageNumber}
                                type={'number'}></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>Number of prompts:</FormLabel>
                    </Grid>
                     <Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
                        <TextField
                                onChange={(event) => {startContext.setPromptNumber(parseInt(event.target.value))}}
                                value={startContext.promptNumber}
                                type={'number'}></TextField>
                    </Grid>
                    <Grid xs={12}>
                        <Button
                            onClick={(event) => {
                                handleClick(event)
                            }}
                            variant="contained"
                            fullWidth={true}
                        >Save</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
