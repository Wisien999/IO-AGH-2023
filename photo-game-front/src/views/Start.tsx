import {useNavigate} from "react-router-dom";
import {Button, FormControl, FormLabel, Grid, TextField} from "@mui/material";
import {useState} from "react";
import {fetchApi} from "../utils/fetchApi";

function Start() {
    const navigate = useNavigate();

    const [nick, setNick] = useState('');
    const [gameName, setGameName] = useState('');

    const handleClick = (event: { preventDefault: () => void; })  => {
        event.preventDefault();

        fetchApi('/').then(response => setGameName(response));

        navigate('/game');
      };

    return (
        <Grid container>
            <FormControl>
                <Grid item xs={12}>
                    <FormLabel>Enter your nickname:</FormLabel>
                </Grid>
                <Grid item xs={12}>
                    <TextField onChange={(e) => {setNick(e.target.value)}} value={nick} variant={"outlined"}></TextField>
                </Grid>
                <Grid item xs={12} alignSelf={"stretch"}>
                    <Button onClick={(event) => {handleClick(event)}} variant={"contained"}
                    fullWidth={true}>Start the game</Button>
                </Grid>
            </FormControl>
        </Grid>
    )
}

export default Start;
