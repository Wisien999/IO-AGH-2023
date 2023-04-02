import React, {createContext, useMemo, useState} from "react";

export const SettingsContext = createContext<{
    roundNumber: number;
    timeLimit: number;
    imageNumber: number;
    promptNumber: number;
    theme: string;
    permaDeath: boolean;
    setRoundNumber: (r: number) => void;
    setTimeLimit: (r: number) => void;
    setImageNumber: (r: number) => void;
    setPromptNumber: (r: number) => void;
    setTheme: (r: string) => void;
    setPermaDeath: (r: boolean) => void;

}>({
    roundNumber: 3,
    timeLimit: 40,
    imageNumber: 4,
    promptNumber: 6,
    theme: 'Dogs',
    permaDeath: false,
    setRoundNumber() {},
    setTimeLimit() {},
    setImageNumber() {},
    setPromptNumber() {},
    setTheme() {},
    setPermaDeath() {}
})

export function SettingsProvider({children}: { children: React.ReactNode }) {
    const [roundNumber, setRoundNumber] = useState(3);
    const [timeLimit, setTimeLimit] = useState(40);
    const [imageNumber, setImageNumber] = useState(4);
    const [promptNumber, setPromptNumber] = useState(6);
    const [theme, setTheme] = useState('Dogs');
    const [permaDeath, setPermaDeath] = useState(false);

    const state = useMemo(() => ({
        roundNumber,
        timeLimit,
        imageNumber,
        promptNumber,
        theme,
        permaDeath,
        setRoundNumber,
        setTimeLimit,
        setImageNumber,
        setPromptNumber,
        setTheme,
        setPermaDeath
    }), [roundNumber, timeLimit, imageNumber, promptNumber, theme, permaDeath]);

    return (
        <SettingsContext.Provider value={state}>
            {children}
        </SettingsContext.Provider>
    );
}

