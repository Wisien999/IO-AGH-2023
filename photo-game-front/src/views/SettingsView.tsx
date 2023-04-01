import React, {useState} from 'react';
import {Button, Dialog, DialogContent, DialogTitle, FormLabel, Grid, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function SettingsView() {
    const [roundNumber, setRoundNumber] = useState('');
    const [timeLimit, setTimeLimit] = useState('');

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
                            onChange={(event) => {setRoundNumber(event.target.value)}}
                            value={roundNumber}
                            type={'number'}></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <FormLabel>Time limit:</FormLabel>
                    </Grid>
                    <Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
                        <TextField
                                onChange={(event) => {setTimeLimit(event.target.value)}}
                                value={timeLimit}
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
