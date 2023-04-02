import {Outlet, useNavigate} from "react-router-dom";
import {Button, FormLabel, Grid, IconButton, TextField} from "@mui/material";
import {createContext, useMemo, useState} from "react";
import {addAuthToken, fetchApi} from "../utils/fetchApi";
import {useNickname} from '../contexts/NicknameContext'
import SettingsIcon from '@mui/icons-material/Settings';

export const settingsContext = createContext<{
    roundNumber: number;
    timeLimit: number;
    imageNumber: number;
    promptNumber: number;
    setRoundNumber: (r: number) => void;
    setTimeLimit: (r: number) => void;
    setImageNumber: (r: number) => void;
    setPromptNumber: (r: number) => void;

}>({
    roundNumber: 1,
    timeLimit: 20,
    imageNumber: 4,
    promptNumber: 4,
    setRoundNumber() {},
    setTimeLimit() {},
    setImageNumber() {},
    setPromptNumber() {}
})

function Start() {
    const navigate = useNavigate();

    const [nick, setNick] = useState('');
    const [roundNumber, setRoundNumber] = useState(1);
    const [timeLimit, setTimeLimit] = useState(20);
    const [imageNumber, setImageNumber] = useState(4);
    const [promptNumber, setPromptNumber] = useState(4);

    const state = useMemo(() => ({
        roundNumber,
        timeLimit,
        imageNumber,
        promptNumber,
        setRoundNumber,
        setTimeLimit,
        setImageNumber,
        setPromptNumber
    }), [roundNumber, timeLimit, imageNumber, promptNumber]);

    const {setNickname} = useNickname();

    const handleClick = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        // nickname
        setNickname(nick);

        const options = {
            'no_of_rounds': roundNumber,
            'no_of_images': imageNumber,
            'no_of_prompts': promptNumber,
            'round_seconds': timeLimit
        }

        // get game id
        const r = await fetchApi('/game', {
            method: 'POST',
            body: JSON.stringify(options)
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
                    <IconButton onClick={() => navigate('settings')}>
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
        <settingsContext.Provider value={state}>
            <Outlet/>
        </settingsContext.Provider>
        </Grid>
    )
}

export default Start;
