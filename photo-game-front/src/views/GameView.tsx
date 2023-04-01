import React from 'react';
import {Grid, Paper, useTheme} from '@mui/material';
import ImagesView from "./ImagesView";
import PromptsView from "./PromptsView";
import {useQuery} from "@tanstack/react-query";
import {fetchApi} from "../utils/fetchApi";
import {DragDropContext} from "react-beautiful-dnd";
import LoadingScreen from "../utils/LoadingScreen";

export default function GameView() {
    const theme = useTheme();

    const query = useQuery(['images'], async () => {
        const result = await fetchApi('/game/gm-GAMEID2137/0');
        return {
            images: result.images,
            prompts: result.prompts.reduce((acc, prompt) => {
                return {
                    ...acc,
                    [prompt.prompt_id]: prompt.text,
                }
            }, {}),
        }
    });

    const renderContent = () => {
        if (query.isFetching) {
            return <LoadingScreen/>;
        }
        console.log(query.data)

        const {images, prompts} = query.data || {images: [], prompts: {}};

        return (
            <DragDropContext onDragEnd={
                (result) => {
                    console.log(result)
                }
            }>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={8}>
                        <ImagesView images={images}/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PromptsView prompts={prompts}/>
                    </Grid>
                </Grid>
            </DragDropContext>
        )
    }

    return (
        <Paper elevation={1} sx={{
            padding: theme.spacing(1),
        }}>
            {renderContent()}
        </Paper>

    )
}
