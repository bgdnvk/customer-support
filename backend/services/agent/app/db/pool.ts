import { Pool } from "pg";

export const pool = new Pool({
    user: "admin",
    host: process.env.POSTGRES_AGENT_SERVICE_HOST,
    database: "postgres",
    password: "password",
    port: 5432,
});