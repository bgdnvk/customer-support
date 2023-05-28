import { Dispatch, SetStateAction } from "react";

export type SetSessionType = {
    setSession: Dispatch<SetStateAction<string>>
}

export type SessionPageProps = {
    [key: string]: () => void;
    // setSession: SetSessionType
}