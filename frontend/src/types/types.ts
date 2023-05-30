import { Dispatch, SetStateAction } from "react";

export type SetSessionType = {
    setSession: Dispatch<SetStateAction<string>>;
};

export type SessionPageProps = {
    [key: string]: () => void;
    // setSession: SetSessionType
};

export interface Case {
    case_id: number;
    title: string;
    description: string;
    agent_id: number;
    customer_id: number;
}

export interface Agent {
    id: number;
    user_id: number;
    name: string | null;
    title: string | null;
    description: string | null;
}

export interface Edit {
    flag: boolean;
    agent: Agent | null;
}
