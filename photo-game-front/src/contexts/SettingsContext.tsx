import React, {createContext, useMemo, useState} from "react";

export const SettingsContext = createContext<{
    roundNumber: number;
    timeLimit: number;
    imageNumber: number;
    promptNumber: number;
    theme: string;
    setRoundNumber: (r: number) => void;
    setTimeLimit: (r: number) => void;
    setImageNumber: (r: number) => void;
    setPromptNumber: (r: number) => void;
    setTheme: (r: string) => void;

}>({
    roundNumber: 1,
    timeLimit: 20,
    imageNumber: 4,
    promptNumber: 4,
    theme: 'Natura',
    setRoundNumber() {},
    setTimeLimit() {},
    setImageNumber() {},
    setPromptNumber() {},
    setTheme() {}
})

export function SettingsProvider({children}: { children: React.ReactNode }) {
    const [roundNumber, setRoundNumber] = useState(1);
    const [timeLimit, setTimeLimit] = useState(20);
    const [imageNumber, setImageNumber] = useState(4);
    const [promptNumber, setPromptNumber] = useState(4);
    const [theme, setTheme] = useState('Natura');

    const state = useMemo(() => ({
        roundNumber,
        timeLimit,
        imageNumber,
        promptNumber,
        theme,
        setRoundNumber,
        setTimeLimit,
        setImageNumber,
        setPromptNumber,
        setTheme
    }), [roundNumber, timeLimit, imageNumber, promptNumber, theme]);

    return (
        <SettingsContext.Provider value={state}>
            {children}
        </SettingsContext.Provider>
    );
}

