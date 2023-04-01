import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import GameView from "./views/GameView";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "start",
        element: <div>Start</div>,
      },
      {
        path: 'game',
        element: <GameView />,
      }
    ],
  },
]);

const theme = createTheme({

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
