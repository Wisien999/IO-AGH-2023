import React from 'react';
import {Grid, Paper, useTheme} from '@mui/material';
import ImagesView from "./ImagesView";
import PromptsView from "./PromptsView";
import {useQuery} from "@tanstack/react-query";
import {fetchApi} from "../utils/fetchApi";
import {DragDropContext} from "react-beautiful-dnd";
import LoadingScreen from "../utils/LoadingScreen";
import {useParams} from "react-router-dom";
import { parseISO } from 'date-fns';
import eventEmitters from "../eventEmitters";
import {ImageMatchEvent, ImageMatchEventParams} from "../eventEmitters/events/ImageMatchEvent";

export default function GameView() {
    const { gameId } = useParams<{ gameId: string }>();
    const theme = useTheme();
    const [images, setImages] = React.useState<string[]>([]);
    const [prompts, setPrompts] = React.useState<Record<string, string>>({});
    const [endTime, setEndTime] = React.useState<Date>(new Date());
    const [startTime, setStartTime] = React.useState<Date>(new Date());



    const sendPromptMatch = async (image: string, prompt: string) => {
        const result = await fetchApi(`/game/${gameId}/0/match`, {
            method: 'POST',
            body: JSON.stringify({
                actions: {
                    [prompt]: image
                }
            })
        });

        console.log(result)

        if (true) {
            eventEmitters.emit(ImageMatchEvent, {
                title: prompt,
                imageId: image,
                state: 'success',
            } as ImageMatchEventParams)
        } else {
            eventEmitters.emit(ImageMatchEvent, {
                title: prompt,
                imageId: image,
                state: 'error',
            } as ImageMatchEventParams)
        }

        console.log(result);
    }

    const query = useQuery(['images'], async () => {
        const result = await fetchApi(`/game/${gameId}/0`);
        return {
            images: result.images,
            prompts: result.prompts.reduce((acc, prompt) => {
                return {
                    ...acc,
                    [prompt.prompt_id]: prompt.text,
                }
            }, {}),
        }
    }, {
        onSuccess: async (data) => {
            setImages(data.images);
            setPrompts(data.prompts);

            const result = await fetchApi(`/game/${gameId}/0/ready`, {
                method: 'POST',
            });

            const { start, end } = result;

            setStartTime(parseISO(start));
            setEndTime(parseISO(end));
        }
    });

    const renderContent = () => {
        if (query.isFetching) {
            return <LoadingScreen />;
        }

        return (
            <DragDropContext onDragEnd={
                (result) => {
                    const {destination, draggableId} = result;
                    const image = draggableId.replace('image-', '');
                    const prompt = destination?.droppableId.replace('prompt-', '');

                    if (prompt) {
                        // send to backend
                        sendPromptMatch(image, prompt);
                        console.log(image, prompt)
                    }
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
