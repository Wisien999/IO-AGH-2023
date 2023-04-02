import React from 'react';
import {Box, Grid, Typography, useTheme} from '@mui/material';
import {Draggable, Droppable} from "react-beautiful-dnd";

export default function PromptsView({prompts}: { prompts: Record<string, string> }) {
    const theme = useTheme();
    const color = theme.palette.primary.main;
    return (
        <>
            <Droppable droppableId={'prompts'} direction={'horizontal'}>
                {(provided, snapshot) => (
                    <Grid
                        container
                        spacing={2}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {Object.keys(prompts).map((key, index) => (
                            <Draggable draggableId={`${key}`} index={index} key={key}>
                                {(provided, snapshot) => (
                                    <Grid
                                        ref={provided.innerRef}
                                        item
                                        xs={12}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Box sx={{
                                            padding: theme.spacing(2),
                                            border: `1px solid ${color}`,
                                            borderRadius: theme.spacing(1),
                                        }}>
                                            <Typography
                                                variant="body2"
                                                color={color}
                                                sx={{
                                                    userSelect: 'none',
                                                    msUserSelect: 'none',
                                                }}
                                            >{prompts[key]}</Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Grid>
                )}
            </Droppable>
        </>
    )
}
