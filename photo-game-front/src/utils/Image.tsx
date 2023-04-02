import React from "react";
import {ImageListItem, ImageListItemBar} from "@mui/material";
import {API_URL} from "./fetchApi";
import {Droppable} from "react-beautiful-dnd";
import eventEmitters from "../eventEmitters";
import {ImageMatchEvent, ImageMatchEventParams} from "../eventEmitters/events/ImageMatchEvent";

export default function Image({
                                  item,
                              }: {
    item: string;
}) {

    const [color, setColor] = React.useState<string | undefined>(undefined);
    const [title, setTitle] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        let timeout: any;
        eventEmitters.on(ImageMatchEvent, (params: ImageMatchEventParams) => {
            console.log(params, item, params.imageId === item)
            if (params.imageId && params.imageId !== item) {
                return;
            }
            if (params.title !== undefined) {
                setTitle(params.title || undefined);
            }
            if (params.state === 'success') {
                setColor('green');
            } else if (params.state === 'error') {
                setColor('red');
            } else if (params.state === 'info') {
                setColor('blue');
            }
            timeout = setTimeout(() => {
                setColor(undefined);
            }, 3000);

        })
        return () => {
            eventEmitters.off(ImageMatchEvent);
            clearTimeout(timeout);
        }
    }, [item]);

    return (
        <Droppable droppableId={`${item}`}>
            {(provided, snapshot) => (
                <ImageListItem
                    key={item}
                    sx={{
                        border: color ? `2px solid ${color}` : undefined
                    }}
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
                            title={title ? title : <span>Drop here!</span>}
                            position="below"
                        />
                    )}
                    {provided.placeholder}
                </ImageListItem>
            )}
        </Droppable>
    )
}
