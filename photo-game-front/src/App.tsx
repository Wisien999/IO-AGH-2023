import React from 'react';
import './App.css';
import { Box, Container, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

function App() {
  const theme = useTheme();
  return (
    <Container>
      <Box sx={{ padding: theme.spacing(2) }}>
        <Outlet />
      </Box>
    </Container>
  );
}

export default App;
