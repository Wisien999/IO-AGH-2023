import React from 'react';
import {Grid, ImageList, ImageListItem, ImageListItemBar} from '@mui/material';
import {Droppable} from "react-beautiful-dnd";
import {API_URL} from "../utils/fetchApi";


export default function ImagesView({images}: { images: string[] }) {

    return (
        <Grid container>
            <Grid item xs={12}>
                <ImageList>
                    {images.map((item) => (
                        <Droppable droppableId={`image-${item}`}>
                            {(provided, snapshot) => (
                                <ImageListItem
                                    key={item}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <img
                                        src={`${API_URL}/image/${item}`}
                                        srcSet={`${API_URL}/image/${item}`}
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
