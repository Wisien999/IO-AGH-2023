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
        return fetchApi('/game/gm-0/0');
    });

    const renderContent = () => {
        if (query.isFetching) {
            return <LoadingScreen/>;
        }

        // const {images, prompts} = query.data;

        return (
            <DragDropContext onDragEnd={
                (result) => {
                    console.log(result)
                }
            }>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={8}>
                        <ImagesView images={['test1', 'test2', 'test3', 'test4']}/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PromptsView prompts={{
                            'test': 'test',
                            'test2': 'test',
                            'test3': 'test',
                            'test4': 'test',
                        }}/>
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
