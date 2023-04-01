import React from 'react';
import {Grid, Paper, useTheme} from '@mui/material';
import ImagesView from "./ImagesView";
import PromptsView from "./PromptsView";
import {useQuery} from "@tanstack/react-query";
import {fetchApi} from "../utils/fetchApi";
import {DragDropContext} from "react-beautiful-dnd";
import LoadingScreen from "../utils/LoadingScreen";
import {useNavigate, useParams} from "react-router-dom";
import {parseISO} from 'date-fns';
import eventEmitters from "../eventEmitters";
import {ImageMatchEvent, ImageMatchEventParams} from "../eventEmitters/events/ImageMatchEvent";
import TimerView from "./TimerView";

export default function GameView() {
    const {gameId} = useParams<{ gameId: string }>();
    const theme = useTheme();
    const [images, setImages] = React.useState<string[]>([]);
    const [prompts, setPrompts] = React.useState<Record<string, string>>({});
    const [endTime, setEndTime] = React.useState<Date | undefined>();
    const [startTime, setStartTime] = React.useState<Date | undefined>();
    const [currentPoints, setCurrentPoints] = React.useState<number>(0);
    const navigate = useNavigate();


    const sendPromptMatch = async (image: string, prompt: string) => {
        const result: {
            current_points: 0;
            is_correct: Record<string, boolean>;
        } = await fetchApi(`/game/${gameId}/0/match`, {
            method: 'POST',
            body: JSON.stringify({
                actions: {
                    [prompt]: image
                }
            })
        });

        setCurrentPoints(result.current_points);

        if (Object.keys(prompts).length === 0) {
            navigate('/gameover', {
                state: {
                    points: currentPoints,
                }
            });
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

            const {start, end} = result;

            setStartTime(parseISO(start));
            setEndTime(parseISO(end));
        }
    });

    const renderContent = () => {
        if (query.isFetching) {
            return <LoadingScreen/>;
        }

        return (
            <DragDropContext onDragEnd={
                (result) => {
                    const {destination, draggableId} = result;
                    const prompt = draggableId;
                    const image = destination?.droppableId;
                    console.log(prompt, image)

                    if (image) {
                        eventEmitters.emit(ImageMatchEvent, {
                            title: prompt,
                            imageId: image,
                            state: 'info',
                        } as ImageMatchEventParams);
                        setPrompts((prev) => {
                            delete prev[prompt];
                            return {
                                ...prev,
                            }
                        })
                        sendPromptMatch(image, prompt);
                    }
                }
            }>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        {startTime && endTime && (
                            <TimerView
                                startDate={startTime}
                                endDate={endTime}
                                onTimeout={() => {
                                    console.log('Timeout')
                                }}
                            />
                        )}
                    </Grid>
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
