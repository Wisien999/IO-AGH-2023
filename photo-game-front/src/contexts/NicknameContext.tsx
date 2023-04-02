import React, {useMemo} from "react";
import {addAuthToken, removeAuthToken} from "../utils/fetchApi";

const NicknameContext = React.createContext<{
    nickname: string | undefined;
    setNickname: React.Dispatch<React.SetStateAction<string | undefined>>;
    clearNickname: () => void;
}>({
    nickname: undefined,
    setNickname: () => {

    },
    clearNickname: () => {}
});

export function useNickname() {
    return React.useContext(NicknameContext);
}

const getNicknameFromStorage = () => {
    const nickname = localStorage.getItem('nickname');
    if (nickname) {
        addAuthToken(nickname);
    }
    return nickname || undefined;
}

const clearNickname = () => {
    localStorage.removeItem('nickname');
    removeAuthToken();
}

export default function NicknameProvider({children}: { children: React.ReactNode }) {
    const [nickname, setNickname] = React.useState<string | undefined>(getNicknameFromStorage());

    const state = useMemo(() => ({
        nickname,
        setNickname: (nickname) => {
            setNickname(nickname);
            localStorage.setItem('nickname', nickname);
            addAuthToken(nickname);
        },
        clearNickname: () => {
            clearNickname();
            setNickname(undefined);
        }
    }), [nickname]);

    return (
        <NicknameContext.Provider value={state}>
            {children}
        </NicknameContext.Provider>
    );
}
