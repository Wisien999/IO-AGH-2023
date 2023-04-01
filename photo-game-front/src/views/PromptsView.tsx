import React from 'react';
import {Grid, Typography} from '@mui/material';
import {Draggable, Droppable} from "react-beautiful-dnd";

export default function PromptsView({prompts}: { prompts: Record<string, string> }) {
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
                            <Draggable draggableId={`${key}`} index={index}>
                                {(provided, snapshot) => (
                                    <Grid
                                        ref={provided.innerRef}
                                        item
                                        xs={12}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Typography variant="body2">{prompts[key]}</Typography>
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
