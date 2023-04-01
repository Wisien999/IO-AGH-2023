import React from 'react';
import {Grid, ImageList, ImageListItem, ImageListItemBar} from '@mui/material';
import {Droppable} from "react-beautiful-dnd";


export default function ImagesView({images}: { images: string[] }) {

    return (
        <Grid container>
            <Grid item xs={12}>
                <ImageList>
                    {images.map((item, index) => (
                        <Droppable droppableId={`droppable-image-${item}`}>
                            {(provided, snapshot) => (
                                <ImageListItem
                                    key={item}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <img
                                        src={`https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=248&fit=crop&auto=format`}
                                        srcSet={`https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=248&fit=crop&auto=format`}
                                        alt={item}
                                        loading="lazy"
                                    />
                                    {!snapshot.isDraggingOver && (
                                        <ImageListItemBar
                                            title={item}
                                            subtitle={<span>Drop here</span>}
                                            position="below"
                                        />
                                    )}
                                    {provided.placeholder}
                                </ImageListItem>
                            )}
                        </Droppable>

                    ))}

                </ImageList>
            </Grid>

        </Grid>
    )
}
