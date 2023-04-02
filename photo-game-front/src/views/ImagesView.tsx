import React from 'react';
import {Grid, ImageList} from '@mui/material';
import Image from "../utils/Image";


export default function ImagesView({images}: { images: string[] }) {

    return (
        <Grid container>
            <Grid item xs={12}>
                <ImageList>
                    {images.map((item) => (
                        <Image item={item} />
                    ))}

                </ImageList>
            </Grid>

        </Grid>
    )
}
