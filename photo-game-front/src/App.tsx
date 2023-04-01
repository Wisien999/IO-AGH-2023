import React from 'react';
import {Box, Container, useTheme} from '@mui/material';
import {Outlet} from 'react-router-dom';

function App() {
    const theme = useTheme();
    return (
        <Box sx={{
            height: '100vh',
            overflow: 'hidden',
            width: '100vw'
        }}>
            <Container sx={{
                height: '100%',
                display: 'flex',
                width: '100%',
            }}>
                <Box sx={{
                    padding: theme.spacing(2),
                    flex: '1 1 auto'
                }}>
                    <Outlet/>
                </Box>
            </Container>
        </Box>
    );
}

export default App;
