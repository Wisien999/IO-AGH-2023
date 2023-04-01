import {useNavigate} from "react-router-dom";
import {Button, FormControl, FormLabel, Grid, TextField} from "@mui/material";
import {useState} from "react";

function Start() {
    const navigate = useNavigate();

    const [nick, setNick] = useState('')
    const handleClick = (event: { preventDefault: () => void; })  => {
        event.preventDefault();

        navigate('/game');
      };

    return (
        <Grid container>
            <FormControl>
                <Grid item>
                    <FormLabel>Enter your nickname:</FormLabel>
                </Grid>
                <TextField onChange={(e) => {setNick(e.target.value)}} value={nick} variant={"outlined"}></TextField>
                <Button onClick={(event) => {handleClick(event)}} variant={"contained"}>Start the game</Button>
            </FormControl>
        </Grid>
    )
}

export default Start;
