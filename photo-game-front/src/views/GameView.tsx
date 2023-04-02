import React from 'react';
import {Grid, Paper, Typography, useTheme} from '@mui/material';
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
import {useSnackbar} from "notistack";

export default function GameView() {
    const {gameId, round} = useParams<{ gameId: string; round: string }>();
    const theme = useTheme();
    const [images, setImages] = React.useState<string[]>([]);
    const [prompts, setPrompts] = React.useState<Record<string, string>>({});
    const [endTime, setEndTime] = React.useState<Date | undefined>();
    const [startTime, setStartTime] = React.useState<Date | undefined>();
    const [currentPoints, setCurrentPoints] = React.useState<number>(0);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();


    const sendPromptMatch = async (image?: string, prompt?: string): Promise<boolean> => {
        const result: {
            current_points: 0;
            is_correct: Record<string, boolean>;
            is_move_valid: boolean;
            is_round_over: boolean;
            has_next_round: boolean;
        } = await fetchApi(`/game/${gameId}/${round}/match`, {
            method: 'POST',
            body: JSON.stringify(prompt && image ? {
                actions: {
                    [prompt]: image
                }
            } : {
                actions: {}
            })
        });

        setCurrentPoints(result.current_points);

        if (result.is_round_over) {
            const nextRound = result.has_next_round ? `/game/${gameId}/${parseInt(round || '0') + 1}` : '/gameover';
            navigate(nextRound, {
                state: {
                    points: currentPoints,
                }
            });
        }

        return result.is_move_valid;
    }

    const query = useQuery(['images'], async () => {
        const result = await fetchApi(`/game/${gameId}/${round}`);
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
        retry: true,
        retryDelay: 1000,
        onSuccess: async (data) => {
            setImages(data.images);
            setPrompts(data.prompts);

            const result = await fetchApi(`/game/${gameId}/${round}/ready`, {
                method: 'POST',
            });

            const {start, end} = result;

            setStartTime(parseISO(start));
            setEndTime(parseISO(end));
        }
    });

    const renderContent = () => {
        if (query.isFetching || query.isError) {
            return <LoadingScreen/>;
        }

        return (
            <DragDropContext onDragEnd={
                (result) => {
                    const {destination, draggableId} = result;
                    const prompt = draggableId;
                    const image = destination?.droppableId;
                    console.log(prompt, image, destination);


                    if (image === 'prompts') {
                        return;
                    }

                    if (image) {

                        sendPromptMatch(image, prompt).then((res) => {
                            if (res) {
                                eventEmitters.emit(ImageMatchEvent, {
                                    title: prompts[prompt],
                                    imageId: image,
                                    state: 'info',
                                } as ImageMatchEventParams);
                                setPrompts((prev) => {
                                    delete prev[prompt];
                                    return {
                                        ...prev,
                                    }
                                })
                            } else {
                                enqueueSnackbar('Invalid move', {
                                    variant: 'error',
                                });
                            }
                        });
                    }
                }
            }>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        {startTime && endTime && (
                            <TimerView
                                startDate={startTime}
                                endDate={endTime}
                                onTimeout={() => sendPromptMatch()}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={8} sx={{
                        border: '1px solid',
                        borderColor: theme.palette.secondary.main,
                        borderRadius: theme.shape.borderRadius,
                        padding: theme.spacing(1),
                        borderRight: 'none',
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" color="primary" align="center">Images</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <ImagesView images={images}/>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={12} sm={4} sx={{
                        border: '1px solid',
                        borderColor: theme.palette.secondary.main,
                        borderRadius: theme.shape.borderRadius,
                        padding: theme.spacing(1),
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" color="primary" align="center">Prompts</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <PromptsView prompts={prompts}/>
                            </Grid>
                        </Grid>
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
