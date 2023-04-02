import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {fetchApi} from "../utils/fetchApi";
import {differenceInSeconds, parseISO} from 'date-fns';
import {Box, CircularProgress, Typography} from "@mui/material";

export default function TimerView({ startDate, endDate, onTimeout}: { startDate: Date; endDate: Date; onTimeout: () => void }) {
    const totalTime = differenceInSeconds(endDate, startDate);
    const [secondsLeft, setSecondsLeft] = React.useState<number>(0);
    const {gameId} = useParams<{ gameId: string }>();
    const currentTimeQuery = useQuery(['current-time'], async () => {
        const result = await fetchApi(`/game/${gameId}/0/time`);
        return parseISO(result);
    }, {
        onSuccess: (data) => {
            const left = differenceInSeconds(endDate, data)
            setSecondsLeft(Math.max(left, 0));

            if (left <= 0) {
                onTimeout();
            }

        },
        refetchInterval: 1000,
    });

    const value = Math.round(100 / (totalTime || 1) * secondsLeft);

    // make clock ticking down
    return (
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress variant="determinate" size={100} value={
                currentTimeQuery.isInitialLoading
                    ? 100
                    : value
            } />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                >
                    {currentTimeQuery.isInitialLoading ? 'Load...' : `${secondsLeft} s` }
                </Typography>
            </Box>
        </Box>
    );

}
