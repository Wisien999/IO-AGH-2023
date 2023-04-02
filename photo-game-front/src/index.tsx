import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Start from './views/Start'
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, Navigate, RouterProvider,} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import GameView from "./views/GameView";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import SettingsView from "./views/SettingsView";
import GameOverScreen from "./views/GameOverScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "",
        element: <Navigate to="/start" replace />,
      },
      {
        path: "start",
        element: <Start/>,
        children: [
          {
            path: 'settings',
            element: <SettingsView />
          }
        ]
      },
      {
        path: 'game/:gameId',
        element: <Navigate to="0" />,
      },
      {
        path: 'game/:gameId/:round',
        element: <GameView />,
      },
      {
        path: 'gameover',
        element: <GameOverScreen />
      }
    ],
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: '#C57B57',
      dark: '#9A5B3A',
      light: '#E8A97F',
      contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#9CAFB7',
      dark: '#7B8F96',
      light: '#BFD1D8',
      contrastText: '#202526',
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
