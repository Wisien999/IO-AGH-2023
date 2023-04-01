import {Outlet, useNavigate} from "react-router-dom";
import {Button, FormControl, FormLabel, Grid, IconButton, TextField} from "@mui/material";
import {useState, useContext} from "react";
import {fetchApi} from "../utils/fetchApi";
import {useNickname} from '../contexts/NicknameContext'
import SettingsIcon from '@mui/icons-material/Settings';

function Start() {
    const navigate = useNavigate();

    const [nick, setNick] = useState('');
    const { setNickname } = useNickname();

    const handleClick = async (event: { preventDefault: () => void; })  => {
        event.preventDefault();

        // nickname
        setNickname(nick);

        // get game id
        const r = await fetchApi('/');

        navigate("/game/");
      };

    return (
        <Grid container justifyContent={"center"}>
            <FormControl>
                <Grid container>
                    <Grid item xs={6}>
                        <FormLabel>Enter your nickname:</FormLabel>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton>
                            <SettingsIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField onChange={(e) => {setNick(e.target.value)}} value={nick} variant={"outlined"}></TextField>
                </Grid>
                <Grid item xs={12} alignSelf={"stretch"}>
                    <Button onClick={(event) => {handleClick(event)}} variant={"contained"}
                    fullWidth={true}>Start the game</Button>
                </Grid>
            </FormControl>
            <Outlet/>
        </Grid>
    )
}

export default Start;
