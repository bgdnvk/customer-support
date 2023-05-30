export interface Agent {
    id: number;
    user_id: number;
    name?: string;
    title?: string;
    description?: string;
}

export interface AvailableAgent {
    agent_id: number;
    added_at: Date;
}

export interface Case {
    case_id: number;
    title?: string;
    description?: string;
    customer_id?: number;
    agent_id?: number;
    added_at: Date;
}

export interface ResolvedCase {
    case_id: number;
    title?: string;
    description?: string;
    customer_id?: number;
    agent_id?: number;
    added_at: Date;
}
