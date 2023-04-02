import {Outlet, useNavigate} from "react-router-dom";
import {Button, FormLabel, Grid, IconButton, TextField} from "@mui/material";
import {useContext, createContext, useMemo, useState} from "react";
import {fetchApi} from "../utils/fetchApi";
import {useNickname} from '../contexts/NicknameContext'
import SettingsIcon from '@mui/icons-material/Settings';
import {SettingsContext, SettingsProvider} from "../contexts/SettingsContext";

function Start() {
    const settingsContext = useContext(SettingsContext);

    const navigate = useNavigate();

    const [nick, setNick] = useState('');

    const options = {
        'no_of_rounds': settingsContext.roundNumber,
        'no_of_images': settingsContext.imageNumber,
        'no_of_prompts': settingsContext.promptNumber,
        'round_seconds': settingsContext.timeLimit,
        'theme': settingsContext.theme,
        'perma_death': settingsContext.permaDeath
    }
    const {setNickname} = useNickname();

    const handleClick = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        // nickname
        setNickname(nick);

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
        {/*<SettingsProvider>*/}
            <Grid item xs={12} alignSelf={"stretch"}>
                <Button
                    onClick={() => {
                        setNickname(nick);
                        navigate('/multiplayer', {
                            state: {
                                options
                            }
                        })
                    }}
                    variant="contained"
                    fullWidth
                >Multiplayer</Button>
            </Grid>
            <Outlet/>
        {/*</SettingsProvider>*/}
        </Grid>
    )
}

export default Start;
