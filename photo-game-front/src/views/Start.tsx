import {Outlet, useNavigate} from "react-router-dom";
import {Button, FormControl, FormLabel, Grid, IconButton, TextField} from "@mui/material";
import {createContext, useMemo, useState} from "react";
import {addAuthToken, fetchApi} from "../utils/fetchApi";
import {useNickname} from '../contexts/NicknameContext'
import SettingsIcon from '@mui/icons-material/Settings';

const settingsContext = createContext('')

function Start() {
    const navigate = useNavigate();

    const [nick, setNick] = useState('');
    const [roundNumber, setRoundNumber] = useState('');
    const state = useMemo(() => ({
        roundNumber,
        setRoundNumber: (roundNumber) => {
            setRoundNumber(roundNumber);
            localStorage.setItem('roundNumber', roundNumber);
            addAuthToken(roundNumber);
        }
    }), [roundNumber]);
    const [timeLimit, setTimeLimit] = useState('');
    const {setNickname} = useNickname();

    const handleClick = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        // nickname
        setNickname(nick);

        // get game id
        const r = await fetchApi('/game', {
            method: 'POST',
        });

        navigate("/game/" + r);
    };

    return (
        <Grid container justifyContent={"center"} rowSpacing={1}>
            <Grid container>
                <Grid item xs={6}>
                    <FormLabel>Enter your nickname:</FormLabel>
                </Grid>
                <Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
                    <IconButton>
                        <SettingsIcon/>
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <TextField onChange={(e) => {
                    setNick(e.target.value)
                }} value={nick} variant={"outlined"}
                fullWidth={true}></TextField>
            </Grid>
            <Grid item xs={12} alignSelf={"stretch"}>
                <Button
                    onClick={(event) => {
                        handleClick(event)
                    }}
                    variant="contained"
                    fullWidth={true}
                >Start the game</Button>
            </Grid>
        {/*<settingsContext.Provider value={state}>*/}
        {/*    <Outlet/>*/}
        {/*</settingsContext.Provider>*/}
        </Grid>
    )
}

export default Start;
